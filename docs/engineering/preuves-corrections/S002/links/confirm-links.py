import json,urllib.request,urllib.error,concurrent.futures,datetime,pathlib
out=pathlib.Path('docs/engineering/preuves-corrections/S002/links');rows=[r for r in json.loads((out/'http-results.json').read_text()) if r['classification']!='accessible_http']
def check(r):
 x={'id':r['id'],'url':r['primaryUrl'],'method':'GET','checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  with urllib.request.urlopen(urllib.request.Request(x['url'],headers={'User-Agent':'ManaTuner-LinkAudit/1.0 (public reference link verification)'}),timeout=8) as res:x.update(status=res.status,finalUrl=res.url)
 except urllib.error.HTTPError as e:x.update(status=e.code,finalUrl=e.url)
 except Exception as e:x.update(status=None,error=str(e))
 return x
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as p:results=list(p.map(check,rows))
(out/'get-confirmation.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
