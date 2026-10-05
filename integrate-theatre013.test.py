#!/usr/bin/env python3
"""Source-only assembly contract tests; never load the game or execute art."""
import hashlib, json, pathlib, re, subprocess, tempfile, unittest
P=pathlib.Path(__file__).resolve().parent
class SourceAssembly013(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp=tempfile.TemporaryDirectory(prefix='theatre013-source-')
        cls.root=pathlib.Path(cls.tmp.name)
        # Always recover the immutable T725 pre-feature input. This also works
        # after the completed product index is committed on the feature branch.
        cls.base=subprocess.check_output(['git','show','248ce802bf4f29333f242447f12b8106af2bdbf1:index.html'],cwd=P).decode()
        cls.input=cls.root/'before.html';cls.input.write_text(cls.base)
        cls.art=cls.root/'sentinel.js'
        cls.art.write_text('// BritishTheatreArchitecture013 source-only sentinel; not executable art\n')
        cls.output=cls.root/'candidate.html'
        cls.result=cls.run_assembly(cls.input,cls.output)
        if cls.result.returncode: raise RuntimeError(cls.result.stderr+cls.result.stdout)
        cls.candidate=cls.output.read_text()
    @classmethod
    def tearDownClass(cls): cls.tmp.cleanup()
    @classmethod
    def run_assembly(cls,src,out):
        return subprocess.run(['python3',str(P/'integrate-theatre013.py'),'--input',str(src),'--output',str(out),'--art',str(cls.art)],capture_output=True,text=True,cwd=P)
    def test_immutable_input_and_bounded_patches(self):
        self.assertEqual(self.input.read_text(),self.base)
        audit=json.loads(self.result.stdout)
        self.assertEqual(audit['sourceSHA256'],hashlib.sha256(self.base.encode()).hexdigest())
        self.assertEqual(len(audit['edits']),60)
        self.assertEqual(self.candidate.count('const THEATRE013='),1)
        self.assertEqual(self.candidate.count('/* GPT-013 LATE NATIVE HOOKS */'),1)
    def test_all_inline_scripts_parse_without_execution(self):
        blocks=re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',self.candidate)
        self.assertEqual(len(blocks),71)
        for n,block in enumerate(blocks):
            path=self.root/f'parse-{n}.js';path.write_text(block)
            r=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
            self.assertEqual(r.returncode,0,r.stderr)
    def test_rejects_duplicate_integration_without_output(self):
        out=self.root/'duplicate.html';r=self.run_assembly(self.output,out)
        self.assertNotEqual(r.returncode,0);self.assertIn('already integrated',r.stderr+r.stdout)
        self.assertFalse(out.exists())
    def test_rejects_occupied_permanent_identity(self):
        for n,marker in enumerate(['const collision={281:1};','const other={k:281};',"SPR.bld['281_1_0']=old;",'MSZ[281]=2;']):
            src=self.root/f'collision-{n}.html';src.write_text(self.base+'\n'+marker)
            out=self.root/f'collision-out-{n}.html';r=self.run_assembly(src,out)
            self.assertNotEqual(r.returncode,0);self.assertIn('already occupied',r.stderr+r.stdout)
            self.assertFalse(out.exists())
    def test_rejects_stale_or_missing_anchor(self):
        src=self.root/'stale.html';src.write_text(self.base.replace('function toolSize458(id){','function toolSize458 (id){'))
        out=self.root/'stale-out.html';r=self.run_assembly(src,out)
        self.assertNotEqual(r.returncode,0);self.assertIn('Anchor 0 != 1',r.stderr+r.stdout)
        self.assertFalse(out.exists())
    def test_never_rewrites_product_or_source_directly(self):
        before=self.input.read_bytes();r=self.run_assembly(self.input,self.input)
        self.assertNotEqual(r.returncode,0);self.assertEqual(before,self.input.read_bytes())
        r=self.run_assembly(self.input,P/'index.html')
        self.assertNotEqual(r.returncode,0);self.assertIn('Separate candidate',r.stderr+r.stdout)
    def test_native_save_coldload_and_old_art_preserved(self):
        old=re.findall(r'<!-- (GPT-\d+ native [^>]+ art) BEGIN:[\s\S]*?<!-- \1 END -->',self.base)
        self.assertTrue(old)
        for label in old:
            block=re.search(r'<!-- '+re.escape(label)+r' BEGIN:[\s\S]*?<!-- '+re.escape(label)+r' END -->',self.base).group(0)
            self.assertIn(block,self.candidate)
        cold='const __load515=load;load=function(slot){const ok=__load515(slot);if(ok){fiscal515.lastDay=-1;fiscalStep515(false,false);try{observatoryStep514(true);}catch(_e){}if(!window.__noColdLoadPower011)markPowerDirty450();}return ok;};'
        self.assertIn(cold,self.candidate)
        for key in ['GAME_VER','GAME_ANCHOR']:
            self.assertEqual(re.findall(r'const '+key+r'=[^;]+;',self.base),re.findall(r'const '+key+r'=[^;]+;',self.candidate))
        self.assertIn('british013:q.theme,turn013:theatreRoadTurn013(x,y)',self.candidate)
    def test_no_new_economy_or_prior_registry_expansion(self):
        product=(P/'gameplay013.js').read_text()
        for key in ['function theatreTax','function theatreTourism','ENTERPRISE_CORE_K489.add','tourists=','money+=','taxC+=']:
            self.assertNotIn(key,product)
        for reg in ['BRITISH004','HIGHSTREET005','PUBLICLIFE007','MUSEUM010','RIVERSIDE012']:
            self.assertNotRegex(product,re.escape(reg)+r'\[281\]\s*=')
        self.assertIn("grid487:1,gx:light.source.x,gy:light.source.y,warm649:1",product)
        self.assertIn('occ(s.img,x,y,s.w*z,s.h*z)',product)
        self.assertIn('if(live?.k!==b.k||!(live.employed>0))return 0;',product)
        self.assertIn("if(t.tree)return '先移除樹木';",product)
        self.assertIn('if(!out.ready||powerLegacy450())return out;',product)
        self.assertIn("const owned=theatrePathConflict013(id,x,y);if(owned)return owned;",product)
        self.assertIn("!theatreTheme013(t)&&hasRoadNear",self.candidate)
        self.assertIn('for(let d=1;d<=4;d++)',product)
        self.assertIn('for(const [dx,dy]of[[0,1],[1,0],[0,-1],[-1,0]])',product)
if __name__=='__main__': unittest.main(verbosity=2)
