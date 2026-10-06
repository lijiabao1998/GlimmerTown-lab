#!/usr/bin/env python3
"""Immutable T726 source/data/syntax contracts; no game, DOM or art execution."""
import hashlib,json,pathlib,re,subprocess,tempfile,unittest
P=pathlib.Path(__file__).resolve().parent
BASE='10bc4115f119498b4cc5836695348982b85fa9d1'
BASE_SHA='d08e96bc49a86f58a6671153c5b58da76022294e3efe1c10af5a6c3b9d9a565e'
class SourceAssembly014(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory(prefix='complexes014-source-');cls.root=pathlib.Path(cls.tmp.name)
  cls.base=subprocess.check_output(['git','show',BASE+':index.html'],cwd=P).decode()
  cls.input=cls.root/'before.html';cls.input.write_text(cls.base);cls.art=cls.root/'sentinel.js'
  cls.art.write_text('// BritishComplexesArchitecture014 source-only nonexecuting sentinel\n')
  cls.output=cls.root/'candidate.html';cls.result=cls.assemble(cls.input,cls.output)
  if cls.result.returncode:raise RuntimeError(cls.result.stdout+cls.result.stderr)
  cls.candidate=cls.output.read_text();cls.product=(P/'gameplay014.js').read_text()
  cls.specs=json.loads((P/'complex-specs014.json').read_text())
 @classmethod
 def tearDownClass(cls):cls.tmp.cleanup()
 @classmethod
 def assemble(cls,src,out):return subprocess.run(['python3',str(P/'integrate-complexes014.py'),'--input',str(src),'--output',str(out),'--art',str(cls.art)],capture_output=True,text=True,cwd=P)
 def test_exact_input_counted_assembly(self):
  self.assertEqual(self.input.read_text(),self.base);audit=json.loads(self.result.stdout)
  self.assertEqual(audit['sourceSHA256'],BASE_SHA);self.assertEqual(len(audit['edits']),79)
  self.assertEqual(self.candidate.count('const COMPLEX014='),1)
  self.assertEqual(self.candidate.count('/* GPT-014 LATE NATIVE HOOKS */'),1)
 def test_all_inline_scripts_parse_without_execution(self):
  blocks=re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',self.candidate);self.assertEqual(len(blocks),72)
  for n,b in enumerate(blocks):
   p=self.root/f'parse-{n}.js';p.write_text(b);r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
   self.assertEqual(r.returncode,0,r.stderr)
 def test_deterministic_second_assembly(self):
  out=self.root/'candidate-again.html';r=self.assemble(self.input,out);self.assertEqual(r.returncode,0,r.stderr)
  self.assertEqual(out.read_bytes(),self.output.read_bytes())
 def test_duplicate_integration_is_rejected(self):
  out=self.root/'duplicate.html';r=self.assemble(self.output,out)
  self.assertNotEqual(r.returncode,0);self.assertIn('already integrated',r.stderr+r.stdout);self.assertFalse(out.exists())
 def test_occupied_building_ids_rejected_in_multiple_spellings(self):
  for i,marker in enumerate(['const collision={282:1};','const other={k:293};',"SPR.bld['290_1_0']=old;",'MSZ[287]=2;',"const sprites={'283_1_3':1};"]):
   src=self.root/f'collision-{i}.html';src.write_text(self.base+'\n'+marker);out=self.root/f'bad-out-{i}.html';r=self.assemble(src,out)
   self.assertNotEqual(r.returncode,0);self.assertIn('already occupied',r.stderr+r.stdout);self.assertFalse(out.exists())
 def test_unseen_baseline_fails_closed(self):
  src=self.root/'stale.html';src.write_text(self.base.replace('function toolSize458(id){','function toolSize458 (id){'))
  out=self.root/'stale-out.html';r=self.assemble(src,out)
  self.assertNotEqual(r.returncode,0);self.assertIn('exact immutable T726',r.stderr+r.stdout);self.assertFalse(out.exists())
 def test_never_overwrites_source_or_product(self):
  before=self.input.read_bytes();r=self.assemble(self.input,self.input)
  self.assertNotEqual(r.returncode,0);self.assertEqual(before,self.input.read_bytes())
  r=self.assemble(self.input,P/'index.html');self.assertNotEqual(r.returncode,0);self.assertIn('Separate candidate',r.stderr+r.stdout)
 def test_prior_art_and_embedded_gameplay_sources_unchanged(self):
  for label in re.findall(r'<!-- (GPT-\d+ native [^>]+ art) BEGIN:',self.base):
   block=re.search(r'<!-- '+re.escape(label)+r' BEGIN:[\s\S]*?<!-- '+re.escape(label)+r' END -->',self.base)
   if block:self.assertIn(block.group(0),self.candidate)
  for f in ['gameplay013.js','residential-gameplay006.js']:
   source=(P/f).read_text()
   for part in source.split('/* GPT-013 LATE NATIVE HOOKS */'):
    self.assertIn(part.strip(),self.candidate,f)
  for key in ['GAME_VER','GAME_ANCHOR']:
   self.assertEqual(re.findall(r'const '+key+r'=[^;]+;',self.base),re.findall(r'const '+key+r'=[^;]+;',self.candidate))
 def test_native_save_coldload_and_old_sources_protected(self):
  cold='const __load515=load;load=function(slot){const ok=__load515(slot);if(ok){fiscal515.lastDay=-1;fiscalStep515(false,false);try{observatoryStep514(true);}catch(_e){}if(!window.__noColdLoadPower011)markPowerDirty450();}return ok;};'
  self.assertIn(cold,self.candidate)
  for name in ['activeMobilitySave502','activeMobilityLoad502','residentialKind006','residentialOperational006','residentialBuilt006']:
   start='function '+name+'(';body=start+self.base.split(start,1)[1].split('\nfunction ',1)[0].rstrip();self.assertIn(body,self.candidate)
  # The assembler cannot write baseline inputs or unrelated release files.
  # Do not freeze coordinator-owned smoke hooks or legitimate later release metadata.
  assembler=(P/'integrate-complexes014.py').read_text()
  self.assertEqual(assembler.count('out.write_text(s)'),1)
  self.assertNotRegex(assembler,r"(?:fp\.json|smoke\.js|AUTORUN-LOG|DECISIONS).*write_(?:text|bytes)")
 def test_exact_native_design_data(self):
  rows=self.specs['buildings'];paths=self.specs['paths']
  self.assertEqual([q['k'] for q in rows],list(range(282,294)));self.assertEqual(len(paths),16)
  self.assertEqual([q['k'] for q in rows if q['sz']==4],[282,285,288,291]);self.assertEqual([q['k'] for q in rows if q['role']=='housing'],[284,293])
  self.assertEqual(sum(q['jobs'] for q in rows),145);self.assertEqual(sum(q['upkeep'] for q in rows),88)
  self.assertEqual(sum(q['capacity'] for q in rows),80);self.assertEqual(sum(q['seats'] for q in rows),460)
  self.assertEqual(sum(q['services'] for q in rows),200);self.assertEqual(sum(q['leisure'] for q in rows),740)
  self.assertEqual({q['cat'] for q in rows},{'zone','culture','svc'})
  self.assertEqual({q['group']:sum(p['group']==q['group'] for p in paths) for q in rows},{'college':4,'manor':4,'baths':4,'fire':4})
  for q in rows:
   self.assertGreater(q['cost'],0);self.assertGreater(q['rank'],0);self.assertGreater(q['power'],0);self.assertGreater(q['water'],0)
   self.assertEqual((q['w'],q['h'],q['ax'],q['ay']),(304,320,152,318) if q['sz']==4 else (160,196,80,194))
   if q['role']=='housing':self.assertEqual((q['band'],q['jobs'],q['upkeep'],q['coverage']),('mid',0,0,None))
 def test_one_public_and_housing_accounting_authority(self):
  self.assertEqual(self.candidate.count('const complexDaily014={publicJobs:complexPublicJobs014(),upkeep:complexUpkeep014()};'),1)
  self.assertEqual(self.candidate.count('+complexDaily014.publicJobs;'),1);self.assertEqual(self.candidate.count('+complexDaily014.upkeep;'),1)
  self.assertEqual(self.candidate.count('const rt014=complexHousingTax014(i,b,pol||{taxR:1},civicMul);income+=rt014;taxR+=rt014;'),1)
  for key in ['ENTERPRISE_CORE_K489.add','money+=','tourists=','taxC+=','localStorage','Math.random','ensureWaterCycle','preparePowerDispatch','buildTickIndex']:
   self.assertNotIn(key,self.product)
  self.assertIn('if(live?.k!==b.k||!(live.employed>0))return 0;',self.product)
  self.assertIn('syntheticRevenue:0',self.product)
 def test_housing_and_emergency_really_join_native_authorities(self):
  for text in ["if(complexHousing014(b.k))return COMPLEX014[b.k].band;","if(complexHousing014(b.k))return COMPLEX014[b.k].capacity;","if(complexHousing014(b.k))return complexOperational014(root,b);","complexHousing014(k)||__complexResidentialKind014(k)","if(q.role==='fire')CIVIC_FIRE_K495.add(q.k)","if(COMPLEX014[k]?.role==='fire')return 'fire';","type==='fire'&&complexEmergencyReady014(i,b)","c.complexStation014&&!complexEmergencyReady014(c.station,tiles[c.station]?.bld)","(COMPLEX014[b.k]&&(!complexHousing014(b.k)||!complexBuilt014(b)))"]:
   self.assertIn(text,self.candidate)
  self.assertIn("publicStaffRoot495.get(root)?.employed>=4",self.product)
 def test_fiscal_receipt_observes_unchanged_native_posting(self):
  self.assertEqual(self.candidate.count('if(diff!==3)money+=income-upkeep;'),1)
  self.assertIn('beforeMoney:money,income,upkeep,complexPublicJobs:complexDaily014.publicJobs,complexUpkeep:complexDaily014.upkeep',self.candidate)
  self.assertIn('afterMoney:money,postedNet:fin.net,rawFin:JSON.parse(JSON.stringify(fin))',self.candidate)
  self.assertIn("function resetEmergency455(){complexEmergencySignature014='';complexFiscalState014=null;",self.candidate)
  self.assertIn('fireDispatch:complexFireDispatch014()',self.product)
 def test_paid_paths_have_separate_persistent_theme_ownership(self):
  for text in ['british014:q.theme,turn014:complexRoadTurn014(x,y)',"!complexTheme014(t)&&hasRoadNear",'const owned=complexPathConflict014(id,x,y);if(owned)return owned;','grid487:1,gx:light.source.x,gy:light.source.y,warm649:1','occ(s.img,x,y,s.w*z,s.h*z)','if(!out.ready||powerLegacy450())return out;','SPR.complexes014']:
   self.assertIn(text,self.candidate)
  self.assertIn("['doze','wpipe','waterMain','sewerMain','udline','ugcable']",self.product)
  self.assertIn('window.__noComplex014',self.product);self.assertIn('window.__noComplexArt014',self.product)
 def test_catalog_search_is_scoped_to_own_group(self):
  self.assertIn('COMPLEX_KEYWORDS014[q.group]',self.product)
  self.assertNotIn('英式 英國 學院 圖書館 住宅 莊園',self.product)
  self.assertIn("college:'大學 學院 圖書館 迴廊 庭園 宿舍'",self.product)
  self.assertIn("fire:'中央 消防 總部 訓練 車庫 水帶 紀念'",self.product)
 def test_evidence_getters_do_not_repair_or_dispatch(self):
  for name in ['complexSpecs014','complexAt014','complexFiscal014','complexFireDispatch014','complexEvidence014']:
   start='function '+name+'(';body=start+self.product.split(start,1)[1].split('\nfunction ',1)[0];body=re.sub(r'//[^\n]*','',body)
   for marker in ['ensure','refresh','recompute','rebuildEmergency','markPowerDirty','prepareCivic','tick()','doPlace(']:self.assertNotIn(marker,body,name+':'+marker)
if __name__=='__main__':unittest.main(verbosity=2)
