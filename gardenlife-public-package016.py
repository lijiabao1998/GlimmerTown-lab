# Source/file packaging only. No browser, game or pixel code.
import pathlib, hashlib, json, os, gzip, subprocess
root=pathlib.Path(__file__).resolve().parent; out=root/'.gardenlife-public-packets'; out.mkdir()
limit=28*1024*1024
pins=json.loads((root/'gardenlife-public-release016.json').read_text()); source_hash=pins['sourceSHA256']; release_sha=pins['releaseSHA']
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
assert head==os.environ['GITHUB_SHA']
files=[]
for name in ('gardenlife-evidence/public',):
 p=root/name
 if p.exists(): files.extend(x for x in p.rglob('*') if x.is_file())
files.extend(root.glob('gardenlife-public-*.json'))
files=sorted(set(files))
assert files, 'No evidence files to package'
packets=[]
for file in files:
 rel=file.relative_to(root).as_posix(); data=file.read_bytes(); encoded=data; target=rel; compression='none'
 if len(encoded)>limit-65536:
  assert file.suffix in ('.json','.txt','.log'), 'Individual lossless screenshot exceeds safe artifact bound'
  encoded=gzip.compress(data,compresslevel=9,mtime=0); target+='.gz'; compression='gzip'
 assert len(encoded)<=limit-65536, 'An individual evidence payload exceeds the bound'
 n=next((n for n,q in enumerate(packets) if q['payloadBytes']+len(encoded)<=limit-65536),len(packets))
 if n==len(packets):
  assert n<8, 'Evidence exceeds eight bounded artifacts; split the job without dropping evidence'
  packets.append({'checkedSHA':release_sha,'observerSHA':head,'sourceSHA256':source_hash,'run':os.environ['GITHUB_RUN_ID'],'part':n,'payloadBytes':0,'files':[]})
 q=packets[n]; dest=out/('part'+str(n))/target;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(encoded)
 png={}
 if file.suffix=='.png':
  assert data[:8]==bytes.fromhex('89504e470d0a1a0a') and len(data)>=24, 'Original native PNG required'
  png={'width':int.from_bytes(data[16:20],'big'),'height':int.from_bytes(data[20:24],'big')}
 q['payloadBytes']+=len(encoded);q['files'].append({**png,'originalPath':rel,'payloadPath':target,'compression':compression,'originalBytes':len(data),'payloadBytes':len(encoded),'sha256':hashlib.sha256(data).hexdigest(),'payloadSHA256':hashlib.sha256(encoded).hexdigest()})
for n,q in enumerate(packets):
 q['packetCount']=len(packets); q['completeFileCount']=len(files)
 dest=out/('part'+str(n));(dest/'packet-index.json').write_text(json.dumps(q,indent=2)+'\n')
 size=sum(f.stat().st_size for f in dest.rglob('*') if f.is_file());assert size<=limit
 print(json.dumps({'part':n,'files':len(q['files']),'rawBytes':size,'maximumRawBytes':limit,'checkedSHA':release_sha,'observerSHA':head,'sourceSHA256':source_hash}))
