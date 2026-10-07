#!/usr/bin/env python3
"""Losslessly package every raw evidence file using bounded streaming memory."""
import pathlib,hashlib,json,os,gzip,subprocess,shutil,tempfile
root=pathlib.Path('.').resolve();out=root/'.waterfront-packets';out.mkdir();limit=28*1024*1024
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip();assert head==os.environ['GITHUB_SHA']
def digest(file):
 h=hashlib.sha256()
 with file.open('rb') as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
 return h.hexdigest()
source_hash=digest(root/'index.html');files=[]
for name in ('waterfront-evidence','quayside-evidence','gardenlife-evidence','streetscape-evidence','complexes-evidence','theatre-evidence','riverside-evidence','museum-evidence','publiclife-evidence','station-evidence','streetlife-evidence','coldload-evidence011'):
 p=root/name
 if p.exists():files.extend(x for x in p.rglob('*')if x.is_file())
for pattern in ('waterfront-*.txt','waterfront-*.log','quayside-*.txt','gardenlife-*.txt','theatre-*.txt','complexes-*.txt','streetscape-*.txt'):files.extend(root.glob(pattern))
if(root/'shots').exists():files.extend((root/'shots').glob('smoke-*.png'))
files=sorted(set(files));assert files,'No evidence files';packets=[]
with tempfile.TemporaryDirectory(prefix='waterfront-evidence-compression-')as tmp:
 for file in files:
  rel=file.relative_to(root).as_posix();target=rel;compression='none';encoded=file;size=file.stat().st_size;original_hash=digest(file)
  if size>limit-65536:
   assert file.suffix in('.json','.txt','.log'),'Individual lossless screenshot exceeds bound'
   encoded=pathlib.Path(tmp)/'payload.gz'
   with file.open('rb')as src,encoded.open('wb')as dest,gzip.GzipFile(filename='',fileobj=dest,mode='wb',compresslevel=9,mtime=0)as zipped:shutil.copyfileobj(src,zipped,1024*1024)
   target+='.gz';compression='gzip'
  payload_size=encoded.stat().st_size;assert payload_size<=limit-65536,'Individual compressed payload exceeds bound'
  n=next((n for n,q in enumerate(packets)if q['payloadBytes']+payload_size<=limit-65536),len(packets))
  if n==len(packets):
   assert n<8,'Evidence exceeds eight packets; split job without dropping files'
   packets.append({'checkedSHA':head,'sourceSHA256':source_hash,'run':os.environ['GITHUB_RUN_ID'],'part':n,'payloadBytes':0,'files':[]})
  q=packets[n];dest=out/('part'+str(n))/target;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(encoded,dest)
  q['payloadBytes']+=payload_size;q['files'].append({'originalPath':rel,'payloadPath':target,'compression':compression,'originalBytes':size,'payloadBytes':payload_size,'sha256':original_hash,'payloadSHA256':digest(dest)})
for n,q in enumerate(packets):
 q['packetCount']=len(packets);q['completeFileCount']=len(files);dest=out/('part'+str(n));(dest/'packet-index.json').write_text(json.dumps(q,indent=2)+'\n');size=sum(f.stat().st_size for f in dest.rglob('*')if f.is_file());assert size<=limit
 print(json.dumps({'part':n,'files':len(q['files']),'rawBytes':size,'maximumRawBytes':limit,'checkedSHA':head,'sourceSHA256':source_hash}))
