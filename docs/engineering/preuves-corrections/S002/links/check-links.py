import json,concurrent.futures,urllib.request,urllib.error,datetime,time,pathlib
out=pathlib.Path('docs/engineering/preuves-corrections/S002/links')
rows=json.loads((out/'inventory.json').read_text())
def check(row):
 start=time.monotonic(); url=row['primaryUrl']; result={**row,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'HEAD','status':None,'finalUrl':url}
 try:
  req=urllib.request.Request(url,method='HEAD',headers={'User-Agent':'ManaTuner-LinkAudit/1.0 (public reference link verification)'})
  with urllib.request.urlopen(req,timeout=8) as response:
   result.update(status=response.status,finalUrl=response.url)
 except urllib.error.HTTPError as e: result.update(status=e.code,finalUrl=e.url,error=str(e))
 except Exception as e: result['error']=str(e)
 code=result['status'];result['classification']='accessible_http' if code and 200<=code<300 else 'broken_http' if code in (404,410) else 'unverified'
 result['elapsedSeconds']=round(time.monotonic()-start,2)
 return result
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(check,rows):
  results.append(result);(out/'http-results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n')
  print(result['id'],result['status'],result['classification'],flush=True)
