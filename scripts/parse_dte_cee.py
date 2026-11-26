#!/usr/bin/env python3
"""Parse locally downloaded DTE Assam CEE cutoff PDFs into reviewable JSON/CSV.
Install: pip install pdfplumber requests
Run: python scripts/parse_dte_cee.py --input-dir ./pdfs --output-dir ./output
The supplied request calls this a 22-column matrix, but its field list has 23
columns: four identity fields plus 19 quota/category columns.
"""
import argparse,csv,hashlib,json,re
from pathlib import Path
try: import pdfplumber
except ImportError: pdfplumber=None
CATS=["UR","FF","RDP","NCC","SPORTS","CGE","PH","EWS","OBC / MOBC","TGLC","EXTGLC","KOCH","TAI AHOM","CHUTIYA","MORAN","MATAK","SC","STP","STH"]
INSTITUTES={"ASSAM ENGINEERING COLLEGE":"AEC","JORHAT ENGINEERING COLLEGE":"JEC","JORHAT INSTITUTE OF SCIENCE AND TECHNOLOGY":"JIST","BINESWAR BRAHMA ENGINEERING COLLEGE":"BBEC","BARAK VALLEY ENGINEERING COLLEGE":"BVEC","DHEMAJI ENGINEERING COLLEGE":"DEC","GOLAGHAT ENGINEERING COLLEGE":"GEC"}
def clean(x):
 s=str(x or "").strip().replace(",","")
 if s in ("","-","—","–","0","0.0"): return None
 m=re.search(r"-?\d+(?:\.\d+)?",s)
 if not m:return None
 v=float(m.group());return int(v) if v.is_integer() else v
def parse(path,total_marks):
 if pdfplumber is None: raise RuntimeError("Install pdfplumber: pip install pdfplumber")
 pairs={}; current_inst=current_branch=current_code=None
 with pdfplumber.open(path) as pdf:
  for page in pdf.pages:
   for table in page.extract_tables() or []:
    for row in table:
     cells=[re.sub(r"\s+"," ",str(x or "")).strip() for x in row]
     joined=" ".join(cells).upper()
     for name,code in INSTITUTES.items():
      if name in joined: current_inst=code
     if len(cells)>1 and cells[1] and cells[1].upper() not in ("BRANCH","PROGRAM"): current_branch=cells[1]
     if len(cells)>2 and cells[2]: current_code=cells[2]
     if len(cells)<4 or cells[3].strip().upper() not in ("RANK","MARKS"): continue
     if not current_inst or not current_branch: continue
     typ=cells[3].strip().upper()
     for cat,val in zip(CATS,cells[4:4+len(CATS)]):
      v=clean(val)
      if v is not None:pairs.setdefault((current_inst,current_branch,current_code,cat),{})[typ]=v
 records=[]
 for (inst,branch,code,cat),pair in pairs.items():
  marks=pair.get("MARKS");rank=pair.get("RANK")
  records.append({"institute_code":inst,"branch":branch,"branch_code":code or None,"quota_category":cat,"closing_rank":rank,"closing_marks":marks,"normalized_score_pct":round(marks/total_marks*100,4) if marks is not None else None,"total_marks":total_marks,"source_file":path.name,"verification_status":"pending"})
 return records
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--input-dir",default="./pdfs");ap.add_argument("--output-dir",default="./output");ap.add_argument("--total-marks",type=float,default=480);a=ap.parse_args()
 src=Path(a.input_dir);out=Path(a.output_dir);out.mkdir(parents=True,exist_ok=True);files=[];records=[]
 for pdf in sorted(src.glob("*.pdf")):
  try:
   rows=parse(pdf,a.total_marks);records+=rows;files.append({"file":pdf.name,"status":"parsed","rows":len(rows),"sha256":hashlib.sha256(pdf.read_bytes()).hexdigest()})
  except Exception as e:files.append({"file":pdf.name,"status":"error","error":str(e)})
 nested={}
 for r in records:nested.setdefault(r["institute_code"],{}).setdefault(r["branch"],{})[r["quota_category"]]={"closing_rank":r["closing_rank"],"closing_marks":r["closing_marks"],"normalized_pct":r["normalized_score_pct"],"verification_status":"pending","source_file":r["source_file"]}
 payload={"metadata":{"years_requested":"2017-2026","total_marks":a.total_marks,"records_extracted":len(records),"files":files,"note":"Parser output is unverified; confirm year, round, category, source and marks scale before importing."},"cutoffs":nested,"records":records}
 (out/"assam_cee_cutoffs_2017_2026.json").write_text(json.dumps(payload,indent=2),encoding="utf-8")
 with (out/"assam_cee_cutoffs_parsed.csv").open("w",newline="",encoding="utf-8") as f:
  fields=list(records[0]) if records else ["institute_code","branch","branch_code","quota_category","closing_rank","closing_marks","normalized_score_pct"]
  w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(records)
 print("PDFs scanned:",len(files),"records extracted:",len(records))
if __name__=="__main__":main()
