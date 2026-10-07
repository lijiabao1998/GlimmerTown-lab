# Source/file packaging only. No browser, game or pixel code.
import pathlib, hashlib, json, os, gzip, subprocess, tempfile

limit=28*1024*1024
CHUNK=1024*1024
TEXT_SUFFIXES=('.json','.txt','.log')

def stream_hash(file):
 digest=hashlib.sha256(); size=0; header=b''
 with file.open('rb') as source:
  while True:
   chunk=source.read(CHUNK)
   if not chunk:break
   if len(header)<24:header=(header+chunk[:24])[:24]
   digest.update(chunk);size+=len(chunk)
 return size,digest.hexdigest(),header

def index_bytes(packet):
 return (json.dumps(packet,indent=2)+'\n').encode('utf-8')

def package_files(root,files,head,source_hash,run):
 """Plan using exact index bytes, then publish only complete bounded packets."""
 root=pathlib.Path(root);out=root/'.waterfront-quarter-packets'
 assert not out.exists(), 'Evidence packet destination already exists'
 files=sorted(set(pathlib.Path(f) for f in files));assert files, 'No evidence files to package'
 def new_packet(n):
  # Final count is 1..8, always one digit: this is the final index byte length.
  assert n<8, 'Evidence exceeds eight bounded artifacts; split the job without dropping evidence'
  return {'checkedSHA':head,'sourceSHA256':source_hash,'run':run,'part':n,'payloadBytes':0,'files':[],'packetCount':8,'completeFileCount':len(files)}
 def with_row(packet,row):
  return {**packet,'payloadBytes':packet['payloadBytes']+row['payloadBytes'],'files':packet['files']+[row]}
 def fits(packet):return packet['payloadBytes']+len(index_bytes(packet))<=limit
 packets=[];rows=[]
 with tempfile.TemporaryDirectory(prefix='.waterfront-quarter-stage-',dir=root) as temporary:
  staging=pathlib.Path(temporary);ready=staging/'packets';ready.mkdir()
  for i,file in enumerate(files):
   rel=file.relative_to(root).as_posix();size,raw_hash,header=stream_hash(file);png={}
   if file.suffix=='.png':
    assert header[:8]==bytes.fromhex('89504e470d0a1a0a') and size>=24, 'Original native PNG required'
    png={'width':int.from_bytes(header[16:20],'big'),'height':int.from_bytes(header[20:24],'big')}
   row={**png,'originalPath':rel,'payloadPath':rel,'compression':'none','originalBytes':size,'payloadBytes':size,'sha256':raw_hash,'payloadSHA256':raw_hash}
   payload=file
   if not fits(with_row(new_packet(0),row)):
    assert file.suffix in TEXT_SUFFIXES, 'Individual lossless screenshot or binary exceeds safe artifact bound'
    payload=staging/('payload-'+str(i)+'.gz');digest=hashlib.sha256();copied=0
    # Deterministic gzip header; raw inputs and output hashes are both streamed.
    with file.open('rb') as source,payload.open('wb') as destination:
     with gzip.GzipFile(filename='',mode='wb',fileobj=destination,compresslevel=9,mtime=0) as compressed:
      while True:
       chunk=source.read(CHUNK)
       if not chunk:break
       digest.update(chunk);copied+=len(chunk);compressed.write(chunk)
    assert copied==size and digest.hexdigest()==raw_hash, 'Evidence changed during gzip encoding'
    encoded_size,encoded_hash,_=stream_hash(payload)
    row={**row,'payloadPath':rel+'.gz','compression':'gzip','payloadBytes':encoded_size,'payloadSHA256':encoded_hash}
   assert fits(with_row(new_packet(0),row)), 'An individual evidence payload plus its exact index exceeds the bound'
   n=next((n for n,packet in enumerate(packets) if fits(with_row(packet,row))),len(packets))
   if n==len(packets):packets.append(new_packet(n))
   packets[n]=with_row(packets[n],row);dest=ready/('part'+str(n))/row['payloadPath'];dest.parent.mkdir(parents=True,exist_ok=True)
   assert not dest.exists(), 'Evidence payload paths collide: '+row['payloadPath']
   digest=hashlib.sha256();copied=0
   with payload.open('rb') as source,dest.open('xb') as destination:
    while True:
     chunk=source.read(CHUNK)
     if not chunk:break
     destination.write(chunk);digest.update(chunk);copied+=len(chunk)
   assert copied==row['payloadBytes'] and digest.hexdigest()==row['payloadSHA256'], 'Evidence changed during packet copy'
  for n,packet in enumerate(packets):
   planned_size=packet['payloadBytes']+len(index_bytes(packet));packet['packetCount']=len(packets)
   metadata=index_bytes(packet);assert packet['payloadBytes']+len(metadata)==planned_size
   dest=ready/('part'+str(n));(dest/'packet-index.json').write_bytes(metadata)
   size=sum(f.stat().st_size for f in dest.rglob('*') if f.is_file());assert size==planned_size;assert size<=limit
   rows.append({'part':n,'files':len(packet['files']),'rawBytes':size,'maximumRawBytes':limit,'checkedSHA':head,'sourceSHA256':source_hash})
  # Failures leave no partial upload tree or incomplete index behind.
  os.rename(ready,out)
 return rows

def main():
 root=pathlib.Path(__file__).resolve().parent
 head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip();assert head==os.environ['GITHUB_SHA']
 source_hash=stream_hash(root/'index.html')[1];files=[]
 for name in ('waterfront-quarter-evidence','waterfront-evidence','quayside-evidence','gardenlife-evidence','streetscape-evidence','complexes-evidence','theatre-evidence','riverside-evidence','museum-evidence','publiclife-evidence','station-evidence','streetlife-evidence','coldload-evidence011'):
  p=root/name
  if p.exists():files.extend(x for x in p.rglob('*')if x.is_file())
 for pattern in ('waterfront-*.txt','waterfront-*.log','quayside-*.txt','gardenlife-*.txt','theatre-*.txt','complexes-*.txt','streetscape-*.txt'):files.extend(root.glob(pattern))
 if(root/'shots').exists():files.extend((root/'shots').glob('smoke-*.png'))
 for row in package_files(root,files,head,source_hash,os.environ['GITHUB_RUN_ID']):print(json.dumps(row))

if __name__=='__main__':main()
