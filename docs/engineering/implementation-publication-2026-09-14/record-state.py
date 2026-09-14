from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).resolve().parent
files=subprocess.check_output(['git','ls-files','-z']).decode().split('\0')
# Clean tracked baseline is recoverable from HEAD; capture hashes without exposing content.
out={}
for f in files:
 if f and (f.startswith('docs/') or f in ['playwright-report/index.html','test-results.json','test-results/.last-run.json']):
  try:out[f]=hashlib.sha256(subprocess.check_output(['git','show','HEAD:'+f],stderr=subprocess.DEVNULL)).hexdigest()
  except subprocess.CalledProcessError:pass
(p/'tracked-historical-head.json').write_text(json.dumps(out,indent=2))
