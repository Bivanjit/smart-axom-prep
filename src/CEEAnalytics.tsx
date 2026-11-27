import {useEffect,useMemo,useState} from "react";
import {Link,useLocation} from "react-router-dom";
import {supabase} from "./lib/supabase";
import {ArrowLeft,ArrowRight,BookOpen,ChartNoAxesCombined,Info,LoaderCircle,TrendingUp,GraduationCap,Calculator,Activity,Search} from "lucide-react";
import AnalysisEngine from "./AnalysisEngine";
import SmartSelect from "./SmartSelect";
import "./cee-analytics.css";

type Row={id:string;dataset_version_id:string;exam_year:number;subject:string;chapter:string;question_count:number;weightage_percent_subject:number|null;weightage_percent_overall:number|null;question_numbers:string|null;difficulty_label:string|null;notes:string|null};
type Aggregate={subject:string;chapter:string;total_questions_9yr:number;avg_questions_per_year:number;avg_subject_weightage_pct:number;avg_overall_weightage_pct:number;min_questions:number;max_questions:number;years_appeared:number;priority_tier:string};
type Dataset={id:string;version:string;label:string;source_description:string|null;created_at:string};
// Keep year options aligned with the nine source-paper years.
const YEAR_OPTIONS=Array.from({length:9},(_,i)=>2018+i);
const fmt=(n:number)=>Number(n||0).toLocaleString("en-IN");
const pct=(n:number)=>n.toFixed(1)+"%";
const hasQuestionText=(x:QuestionRecord)=>!!x.question_excerpt?.trim()&&!x.question_excerpt.trim().startsWith("[IMAGE SOURCE RECORD]");

function useAnalytics(){
 const [rows,setRows]=useState<Row[]>([]),[aggregates,setAggregates]=useState<Aggregate[]>([]),[dataset,setDataset]=useState<Dataset|null>(null),[questionSlots,setQuestionSlots]=useState(0),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let live=true;const load=async()=>{
  if(!supabase){setError("Database connection is unavailable.");setLoading(false);return;}
  setLoading(true);setError("");
  try{
   const {data:versions,error:ve}=await supabase.from("analytics_dataset_versions").select("id,version,label,source_description,created_at,status").eq("dataset_key","cee_paper_analysis").eq("status","published").order("created_at",{ascending:false}).limit(1);
   if(ve)throw ve;const active=versions?.[0];if(!active)throw new Error("No published CEE paper-analysis dataset was found.");
   const [yr,ag,qc]=await Promise.all([
    supabase.from("cee_chapter_year_analytics").select("id,dataset_version_id,exam_year,subject,chapter,question_count,weightage_percent_subject,weightage_percent_overall,question_numbers,difficulty_label,notes").eq("dataset_version_id",active.id).order("exam_year",{ascending:true}).limit(1000),
    supabase.from("cee_chapter_aggregate_analytics").select("subject,chapter,total_questions_9yr,avg_questions_per_year,avg_subject_weightage_pct,avg_overall_weightage_pct,min_questions,max_questions,years_appeared,priority_tier").eq("dataset_version_id",active.id).limit(200),
    supabase.from("cee_question_analysis").select("id",{count:"exact",head:true}).gte("exam_year",2018).lte("exam_year",2026)
   ]);
   if(yr.error)throw yr.error;if(ag.error)throw ag.error;if(qc.error)throw qc.error;
   if(live){setRows((yr.data||[]) as Row[]);setAggregates((ag.data||[]) as Aggregate[]);setDataset(active as Dataset);setQuestionSlots(qc.count||0);}
  }catch(e){if(live)setError(e instanceof Error?e.message:"Could not load the CEE analysis dataset.");}
  finally{if(live)setLoading(false);}
 };void load();return()=>{live=false}},[]);
 const years=useMemo(()=>[...new Set(rows.map(x=>x.exam_year))].sort((a,b)=>a-b),[rows]);
 const subjects=useMemo(()=>[...new Set(rows.map(x=>x.subject))].sort(),[rows]);
 return {rows,aggregates,subjects,dataset,years,questionSlots,loading,error};
}
function Header({title,desc}:{title:string;desc:string}){return <header className="cea-hero"><Link to="/analytics" className="cea-back"><ArrowLeft size={15}/> CEE Intelligence</Link><div className="cea-eyebrow">SMARTPREP AXOM · ASSAM CEE 2027</div><h1>{title}</h1><p>{desc}</p></header>}
function Filters({from,to,setFrom,setTo,children}:{from:string;to:string;setFrom:(x:string)=>void;setTo:(x:string)=>void;children?:React.ReactNode}){return <section className="cea-panel cea-filters"><div className="cea-filter-row"><SmartSelect label="From year" value={from} onChange={setFrom} options={YEAR_OPTIONS.map(y=>({value:String(y),label:String(y)}))}/><SmartSelect label="To year" value={to} onChange={setTo} options={YEAR_OPTIONS.filter(y=>y>=Number(from)).map(y=>({value:String(y),label:String(y)}))}/>{children}</div></section>}
function SubjectSelect({value,onChange,subjects,all=true}:{value:string;onChange:(x:string)=>void;subjects:string[];all?:boolean}){return <SmartSelect label="Subject" value={value} onChange={onChange} options={[...(all?[{value:"all",label:"All subjects"}]:[]),...subjects.map(s=>({value:s,label:s}))]}/>}
function StateView({loading,error,children}:{loading:boolean;error:string;children:React.ReactNode}){if(loading)return <div className="cea-state"><LoaderCircle className="cea-spin"/><span>Loading CEE source analysis…</span></div>;if(error)return <div className="cea-state cea-error"><Info/><span>{error}</span></div>;return <>{children}</>}
function Metric({label,value,note}:{label:string;value:string;note?:string}){return <div className="cea-metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
function Coverage({rows,years}:{rows:Row[];years:number[]}){const per=years.map(year=>({year,total:rows.filter(x=>x.exam_year===year).reduce((a,x)=>a+x.question_count,0)}));return <section className="cea-panel"><div className="cea-section-head"><div><span className="cea-kicker">YEAR COVERAGE</span><h2>Questions represented by year</h2></div><span className="cea-pill">{per.reduce((a,x)=>a+x.total,0)} questions</span></div><div className="cea-coverage-grid">{per.map(x=><article className="cea-coverage-card" key={x.year}><div className="cea-coverage-top"><b>{x.year}</b><strong>{x.total}</strong></div><div className="cea-progress"><i style={{width:(x.total/120*100)+"%"}}/></div><small>Chapter question count</small></article>)}</div></section>}
function Home({data}:{data:ReturnType<typeof useAnalytics>}){const total=data.rows.reduce((a,x)=>a+x.question_count,0);return <main className="cea-page"><div className="cea-home-top"><div className="cea-eyebrow">SMARTPREP AXOM · CEE INTELLIGENCE</div><h1>Assam CEE paper analysis.</h1><p>Explore chapter trends, difficulty patterns and subject-wise revision priorities across the available exam years.</p><span className="cea-partial-tag">CEE ANALYSIS · {fmt(total)} QUESTIONS · {data.years.length} YEARS</span></div><StateView loading={data.loading} error={data.error}><div className="cea-summary-metrics"><Metric label="Questions analysed" value={fmt(total)} note="Year-wise analysis"/><Metric label="Year records" value={fmt(data.rows.length)} note="Subject + chapter + year"/><Metric label="Years represented" value={data.years.length+"/9"}/><Metric label="Chapter aggregates" value={fmt(data.aggregates.length)}/></div><div className="cea-module-grid">{[[BookOpen,"Chapter-wise PYQ trends","/analytics/pyq-analysis","Question counts and weightage by chapter and year.","Analysis"],[ChartNoAxesCombined,"Exam difficulty analysis","/analytics/exam-difficulty","Compare subject difficulty patterns across selected years.","Analysis"],[TrendingUp,"CEE 2027 chapter prediction","/analytics/cee-2027-predictions","Prioritise chapters using recurrence and recency-weighted frequency.","Prediction"],[Calculator,"Marks-to-rank predictor","/predictor/rank","Estimate your Assam CEE merit rank from expected marks.","Prediction"],[GraduationCap,"College predictor","/predictor/college","Compare marks or rank with historical college cutoffs.","Admission"],[Activity,"College cutoff explorer","/analytics/college-cutoff-analysis","Explore closing ranks and marks by college and branch.","Admission"],[GraduationCap,"Assam CEE guide","/exam-guide","Review exam pattern, eligibility and syllabus.","Guide"],[BookOpen,"Previous year papers","/previous-papers","Open the previous year paper archive.","PYQ archive"]].map(([Icon,title,path,desc,tag]:any)=><Link className="cea-module" to={path} key={path}><span className="cea-module-icon"><Icon size={21}/></span><span className="cea-tool-tag">{tag}</span><h2>{title}</h2><p>{desc}</p><span className="cea-open">Open tool <ArrowRight size={15}/></span></Link>)}</div><Coverage rows={data.rows} years={data.years}/></StateView></main>}
type QuestionRecord={exam_year:number;question_number:number;subject:string|null;chapter_slug:string|null;difficulty:string|null;question_excerpt:string|null;analysis_status:string|null;source_pdf:string|null};
function QuestionBank(){
 const [items,setItems]=useState<QuestionRecord[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const [year,setYear]=useState("all"),[subject,setSubject]=useState("all"),[status,setStatus]=useState("all"),[search,setSearch]=useState(""),[page,setPage]=useState(0);
 const pageSize=30;
 useEffect(()=>{let live=true;const load=async()=>{if(!supabase){setError("Database connection is unavailable.");setLoading(false);return;}setLoading(true);setError("");try{
  const cols="exam_year,question_number,subject,chapter_slug,difficulty,question_excerpt,analysis_status,source_pdf";
  // Respect the project's PostgREST max-rows setting. A single 0-999 range can be silently capped,
  // so fetch deterministic, non-overlapping pages until the final short page is reached.
  const batchSize=400;const all:QuestionRecord[]=[];
  for(let offset=0;offset<2000;offset+=batchSize){
   const {data,error}=await supabase.from("cee_question_analysis").select(cols).gte("exam_year",2018).lte("exam_year",2026).order("exam_year",{ascending:true}).order("question_number",{ascending:true}).range(offset,offset+batchSize-1);
   if(error)throw error;
   const batch=(data||[]) as QuestionRecord[];
   all.push(...batch);
   if(batch.length<batchSize)break;
  }
  if(live)setItems(all);
 }catch(e){if(live)setError(e instanceof Error?e.message:"Could not load question records.");}finally{if(live)setLoading(false);}};
 void load();return()=>{live=false};
 },[]);
 const filtered=useMemo(()=>items.filter(x=>(year==="all"||String(x.exam_year)===year)&&(subject==="all"||x.subject===subject)&&(status==="all"||(status==="text"?hasQuestionText(x):!hasQuestionText(x)))&&(!search||[x.question_excerpt,x.chapter_slug,x.source_pdf,String(x.question_number),String(x.exam_year)].join(" ").toLowerCase().includes(search.toLowerCase()))),[items,year,subject,status,search]);
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));const visible=filtered.slice(page*pageSize,(page+1)*pageSize);
 const textCount=items.filter(hasQuestionText).length;
 useEffect(()=>setPage(0),[year,subject,status,search]);
 return <main className="cea-page"><Header title="CEE question bank" desc="Every question number from the 2018-2026 Assam CEE papers, with available OCR text, subject labels and classification status."/><section className="cea-panel">
  <div className="cea-summary-metrics"><Metric label="Question records" value={fmt(items.length)} note="120 slots × 9 years"/><Metric label="OCR text available" value={fmt(textCount)} note="Imported text candidates"/><Metric label="Text pending" value={fmt(items.length-textCount)} note="Source slot retained"/></div>
  <div className="cea-qb-filters"><label className="cea-control">Search questions<div className="cea-qb-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Question, chapter or year"/></div></label><SmartSelect label="Year" value={year} onChange={setYear} options={[{value:"all",label:"All years"},...YEAR_OPTIONS.map(y=>({value:String(y),label:String(y)}))]}/><SmartSelect label="Subject" value={subject} onChange={setSubject} options={[{value:"all",label:"All subjects"},{value:"Mathematics",label:"Mathematics"},{value:"Physics",label:"Physics"},{value:"Chemistry",label:"Chemistry"}]}/><SmartSelect label="Text status" value={status} onChange={setStatus} options={[{value:"all",label:"All records"},{value:"text",label:"OCR text available"},{value:"pending",label:"Text pending"}]}/></div>
  {loading?<div className="cea-state"><LoaderCircle className="cea-spin"/> Loading all nine CEE papers…</div>:error?<div className="cea-state">{error}</div>:<><div className="cea-qb-resultline">Showing {visible.length? page*pageSize+1:0}-{Math.min((page+1)*pageSize,filtered.length)} of {fmt(filtered.length)} questions</div><div className="cea-qb-list">{visible.map(x=><article className="cea-qb-item" key={x.exam_year+"-"+x.question_number}><div className="cea-qb-top"><b>CEE {x.exam_year} · Q{x.question_number}</b><span className={hasQuestionText(x)?"has-text":"no-text"}>{hasQuestionText(x)?"OCR text available":"Image record · text pending"}</span></div><div className="cea-qb-meta"><span>{x.subject||"Subject pending"}</span><span>{x.chapter_slug?.replace(/-/g," ")||"Chapter not mapped"}</span><span>{x.difficulty||"Difficulty pending"}</span></div><p>{hasQuestionText(x)?x.question_excerpt!.trim():"Question record is present for this paper and number. The original source paper is retained for this question slot, but exact transcription is pending."}</p></article>)}</div><div className="cea-qb-pagination"><button disabled={page===0} onClick={()=>setPage(x=>Math.max(0,x-1))}>Previous</button><span>Page {page+1} of {pages}</span><button disabled={page+1>=pages} onClick={()=>setPage(x=>Math.min(pages-1,x+1))}>Next</button></div></>}
 </section></main>
}

function ChapterTrends({data}:{data:ReturnType<typeof useAnalytics>}){
 const [from,setFrom]=useState("2018"),[to,setTo]=useState("2026"),[subject,setSubject]=useState("all"),[search,setSearch]=useState(""),[analysed,setAnalysed]=useState(false);
 const range=data.years.filter(y=>y>=+from&&y<=+to),filtered=data.rows.filter(r=>range.includes(r.exam_year)&&(subject==="all"||r.subject===subject));
 const map=new Map<string,{subject:string;chapter:string;total:number;years:Map<number,number>;weight:number}>();
 filtered.forEach(r=>{const k=r.subject+"::"+r.chapter,v=map.get(k)||{subject:r.subject,chapter:r.chapter,total:0,years:new Map<number,number>(),weight:0};v.total+=r.question_count;v.years.set(r.exam_year,(v.years.get(r.exam_year)||0)+r.question_count);v.weight+=r.weightage_percent_overall||0;map.set(k,v)});
 const list=[...map.values()].filter(x=>x.chapter.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.total-a.total),total=filtered.reduce((a,x)=>a+x.question_count,0),active=range.filter(y=>filtered.some(x=>x.exam_year===y));
 const duration=1450+Math.min(1700,range.length*125+filtered.length*2);
 return <main className="cea-page"><Header title="Chapter-wise PYQ trends" desc="Explore chapter frequency and weightage from the source Assam CEE analysis. Filter by year range, subject and chapter."/><StateView loading={data.loading} error={data.error}><Filters from={from} to={to} setFrom={v=>{setFrom(v);setAnalysed(false)}} setTo={v=>{setTo(v);setAnalysed(false)}}><SubjectSelect value={subject} onChange={v=>{setSubject(v);setAnalysed(false)}} subjects={data.subjects}/><label className="cea-control">Search chapter<input value={search} onChange={e=>{setSearch(e.target.value);setAnalysed(false)}} placeholder="Type a chapter name"/></label></Filters><AnalysisEngine title="Chapter frequency analysis" subtitle="Counting source chapter appearances and comparing year-by-year records." steps={["Loading selected year records","Grouping source chapter names","Calculating frequency and weightage","Preparing chapter comparison"]} durationMs={duration} mode="analyse" buttonLabel="Analyse chapter trends" disabled={!filtered.length} onComplete={()=>setAnalysed(true)}/>{analysed&&<><div className="cea-summary-metrics"><Metric label="Questions represented" value={fmt(total)}/><Metric label="Chapter groups" value={fmt(list.length)}/><Metric label="Years represented" value={active.length+"/"+range.length}/></div><section className="cea-panel"><div className="cea-section-head"><div><span className="cea-kicker">CHAPTER FREQUENCY</span><h2>Selected chapter trends</h2></div><span className="cea-pill">{from}–{to}</span></div><div className="cea-table-wrap"><table className="cea-table"><thead><tr><th>Chapter</th><th>Subject</th>{active.map(y=><th key={y}>{y}</th>)}<th>Total</th></tr></thead><tbody>{list.map(x=><tr key={x.subject+x.chapter}><td><b>{x.chapter}</b></td><td>{x.subject}</td>{active.map(y=><td key={y}>{x.years.get(y)||"–"}</td>)}<td><strong>{x.total}</strong></td></tr>)}</tbody></table></div></section><Coverage rows={data.rows} years={range}/></>}</StateView></main>
}
function DifficultyAnalysis({data}:{data:ReturnType<typeof useAnalytics>}){
 const [from,setFrom]=useState("2018"),[to,setTo]=useState("2026"),[subject,setSubject]=useState("all");
 const range=data.years.filter(y=>y>=Number(from)&&y<=Number(to));
 const filtered=data.rows.filter(r=>range.includes(r.exam_year)&&(subject==="all"||r.subject===subject));
 const levels:Record<string,number>={"Easy":1,"Easy-Moderate":2,"Moderate":3,"Moderate-Hard":4,"Hard":5};
 const known=filtered.filter(r=>r.difficulty_label&&levels[r.difficulty_label]!==undefined);
 const total=known.reduce((sum,r)=>sum+r.question_count,0);
 const average=total?known.reduce((sum,r)=>sum+r.question_count*levels[r.difficulty_label!],0)/total:0;
 const byYear=range.map(year=>{
  const subjects=data.subjects.map(name=>{
   const rows=known.filter(r=>r.exam_year===year&&r.subject===name);
   const count=rows.reduce((sum,r)=>sum+r.question_count,0);
   const score=count?rows.reduce((sum,r)=>sum+r.question_count*levels[r.difficulty_label!],0)/count:0;
   return {name,count,score};
  }).filter(x=>x.count>0);
  return {year,subjects};
 }).filter(x=>x.subjects.length);
 const bySubject=data.subjects.map(name=>{
  const rows=known.filter(r=>r.subject===name);
  const count=rows.reduce((sum,r)=>sum+r.question_count,0);
  const score=count?rows.reduce((sum,r)=>sum+r.question_count*levels[r.difficulty_label!],0)/count:0;
  const labels=["Easy","Easy-Moderate","Moderate","Moderate-Hard","Hard"].map(label=>({label,count:rows.filter(r=>r.difficulty_label===label).reduce((sum,r)=>sum+r.question_count,0)})).filter(x=>x.count>0);
  const years=range.map(year=>{const yr=rows.filter(r=>r.exam_year===year),n=yr.reduce((sum,r)=>sum+r.question_count,0);return {year,count:n,score:n?yr.reduce((sum,r)=>sum+r.question_count*levels[r.difficulty_label!],0)/n:0};});
  return {name,count,score,labels,years};
 }).filter(x=>x.count>0).sort((a,b)=>b.score-a.score);
 const selected=bySubject.find(x=>x.name===subject);
 const fmtScore=(n:number)=>n?n.toFixed(2)+" / 5":"—";
 return <main className="cea-page"><Header title="Exam difficulty analysis" desc="Compare the difficulty pattern across exam years and subjects. The graph updates automatically when you change the year range or subject."/><StateView loading={data.loading} error={data.error}>
  <Filters from={from} to={to} setFrom={setFrom} setTo={setTo}><SubjectSelect value={subject} onChange={setSubject} subjects={data.subjects}/></Filters>
  {!known.length?<div className="cea-panel"><div className="cea-state">No labelled difficulty records are available for this selection.</div></div>:<>
   <div className="cea-summary-metrics">
    <Metric label="Questions with a difficulty label" value={fmt(total)}/>
    <Metric label={subject==="all"?"Overall difficulty index":subject+" difficulty index"} value={fmtScore(average)} note="Weighted from supplied labels"/>
    <Metric label="Subjects compared" value={String(bySubject.length)}/>
    <Metric label="Years selected" value={String(byYear.length)}/>
   </div>
   <section className="cea-panel">
    <div className="cea-section-head"><div><span className="cea-kicker">YEAR-BY-YEAR</span><h2>{subject==="all"?"Subject difficulty comparison":"Difficulty trend · "+subject}</h2></div><span className="cea-pill">{from}–{to}</span></div>
    <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:18}}>
     {(subject==="all"?data.subjects:[subject]).map((name,i)=><span key={name} style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:13,fontWeight:650}}><i style={{display:"inline-block",width:10,height:10,borderRadius:3,background:["#278c6b","#d39a35","#557fc1"][data.subjects.indexOf(name)]||"#64748b"}}/>{name}</span>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat("+Math.max(1,byYear.length)+",minmax(52px,1fr))",gap:10,alignItems:"end",minHeight:220,overflowX:"auto"}}>
     {byYear.map(y=><div key={y.year} style={{minWidth:48,textAlign:"center"}}>
      <div style={{height:174,display:"flex",alignItems:"end",justifyContent:"center",gap:4,borderBottom:"1px solid var(--border,#dbe3ea)",padding:"0 2px"}}>
       {y.subjects.filter(s=>subject==="all"||s.name===subject).map(s=><div key={s.name} title={s.name+": "+s.score.toFixed(2)+"/5 · "+s.count+" labelled questions"} style={{width:subject==="all"?"28%":"58%",maxWidth:26,height:Math.max(3,s.score/5*100)+"%",borderRadius:"6px 6px 0 0",background:["#278c6b","#d39a35","#557fc1"][data.subjects.indexOf(s.name)]||"#64748b",transition:"height .25s ease"}}/>)}
      </div><b style={{display:"block",fontSize:12,marginTop:8}}>{y.year}</b>
      {y.subjects.filter(s=>subject==="all"||s.name===subject).map(s=><small key={s.name} style={{display:"block",fontSize:10,color:"var(--muted,#64748b)"}}>{s.score.toFixed(1)}</small>)}
     </div>)}
    </div>
    <p className="cea-muted" style={{marginTop:16}}>Difficulty index: Easy = 1, Easy-Moderate = 2, Moderate = 3, Moderate-Hard = 4, Hard = 5. Higher values indicate a tougher labelled mix. Unlabelled records are excluded.</p>
   </section>
   <section className="cea-panel">
    <div className="cea-section-head"><div><span className="cea-kicker">SUBJECT STATISTICS</span><h2>{subject==="all"?"Subject-wise comparison":subject+" analysis"}</h2></div></div>
    {bySubject.filter(s=>subject==="all"||s.name===subject).map(s=><article className="cea-tough-row" key={s.name}><div><b>{s.name}</b><small>{fmt(s.count)} labelled questions · {s.labels.length} difficulty levels represented</small></div><strong>{fmtScore(s.score)}</strong></article>)}
   </section>
   {selected&&<section className="cea-panel">
    <div className="cea-section-head"><div><span className="cea-kicker">SELECTED SUBJECT</span><h2>{selected.name} · detailed statistics</h2></div><span className="cea-pill">{fmt(selected.count)} questions</span></div>
    {selected.labels.map(x=><article className="cea-tough-row" key={x.label}><div><b>{x.label}</b><small>Labelled questions in selected years</small></div><strong>{fmt(x.count)} · {pct(x.count/selected.count*100)}</strong></article>)}
    <div className="cea-table-wrap"><table className="cea-table"><thead><tr><th>Year</th><th>Labelled questions</th><th>Difficulty index</th></tr></thead><tbody>{selected.years.filter(x=>x.count>0).map(x=><tr key={x.year}><td>{x.year}</td><td>{fmt(x.count)}</td><td>{fmtScore(x.score)}</td></tr>)}</tbody></table></div>
   </section>}
  </>}
 </StateView></main>
}
function PriorityAnalysis({data}:{data:ReturnType<typeof useAnalytics>}){
 const [from,setFrom]=useState("2018"),[to,setTo]=useState("2026"),[subject,setSubject]=useState("Mathematics"),[revealed,setRevealed]=useState(false);
 const range=data.years.filter(y=>y>=+from&&y<=+to),q=data.rows.filter(r=>range.includes(r.exam_year)&&r.subject===subject),active=range.filter(y=>q.some(r=>r.exam_year===y));
 const map=new Map<string,{chapter:string;total:number;years:Set<number>;counts:Map<number,number>;weighted:number;last:number;labels:Set<string>}>();
 q.forEach(r=>{const v=map.get(r.chapter)||{chapter:r.chapter,total:0,years:new Set<number>(),counts:new Map<number,number>(),weighted:0,last:0,labels:new Set<string>()};v.total+=r.question_count;v.years.add(r.exam_year);v.counts.set(r.exam_year,(v.counts.get(r.exam_year)||0)+r.question_count);v.weighted+=r.question_count*Math.pow(.82,Math.max(0,+to-r.exam_year));v.last=Math.max(v.last,r.exam_year);v.labels.add(r.difficulty_label||"-");map.set(r.chapter,v)});
 const weightedTotal=q.reduce((a,r)=>a+r.question_count*Math.pow(.82,Math.max(0,+to-r.exam_year)),0),list=[...map.values()].map(x=>({...x,score:(x.years.size/Math.max(1,active.length))*65+(weightedTotal?x.weighted/weightedTotal*35:0)})).sort((a,b)=>b.score-a.score||b.total-a.total),total=q.reduce((a,r)=>a+r.question_count,0),duration=1750+Math.min(1800,active.length*145+q.length*2);
 return <main className="cea-page"><Header title="CEE 2027 chapter prediction" desc="Generate a subject-wise chapter priority outlook from recurrence and recency-weighted question frequency in the updated source dataset."/><StateView loading={data.loading} error={data.error}><Filters from={from} to={to} setFrom={v=>{setFrom(v);setRevealed(false)}} setTo={v=>{setTo(v);setRevealed(false)}}><SubjectSelect value={subject} onChange={v=>{setSubject(v);setRevealed(false)}} subjects={data.subjects} all={false}/></Filters><section className="cea-panel cea-prediction-intro"><div className="cea-section-head"><div><span className="cea-kicker">SMARTPREP PREDICTION ENGINE</span><h2>Chapter priority · {subject}</h2></div><span className="cea-pill">{from}–{to}</span></div><p className="cea-muted">Priority score = 65% recurrence across represented years + 35% recency-weighted question frequency. Each year further from the selected end year receives a 0.82 multiplier. This is a revision-priority estimate, not a guarantee of future questions.</p><AnalysisEngine title="CEE 2027 chapter prediction" subtitle="Scanning historical chapter appearances and calculating recency-weighted priorities." steps={["Loading source paper analysis","Measuring chapter recurrence","Applying recency weighting","Ranking chapter priorities"]} durationMs={duration} mode="predict" buttonLabel="Generate chapter prediction" onComplete={()=>setRevealed(true)}/></section>{revealed&&<><div className="cea-summary-metrics"><Metric label="Subject" value={subject}/><Metric label="Questions represented" value={fmt(total)}/><Metric label="Years with data" value={active.length+"/"+range.length}/><Metric label="Chapters ranked" value={fmt(list.length)}/></div><section className="cea-panel"><div className="cea-section-head"><div><span className="cea-kicker">PREDICTED PRIORITY</span><h2>Most important chapters</h2></div><span className="cea-pill">Evidence-based estimate</span></div>{list.slice(0,20).map((x,i)=><article className="cea-priority-row" key={x.chapter}><span className="cea-rank">#{i+1}</span><div className="cea-priority-main"><b>{x.chapter}</b><small>{i<4?"High":i<10?"Medium":"Watch"} priority · appeared in {x.years.size}/{active.length} represented years · latest {x.last}</small><div className="cea-prediction-bar"><i style={{width:Math.min(100,x.score)+"%"}}/></div><div className="cea-year-pills">{active.map(y=><span key={y}>{y}: {x.counts.get(y)||"–"}</span>)}</div></div><strong>{x.score.toFixed(1)}<small> priority score</small></strong></article>)}</section><section className="cea-panel"><div className="cea-section-head"><div><span className="cea-kicker">SOURCE DIFFICULTY CONTEXT</span><h2>Supplied labels per chapter</h2></div></div>{list.slice(0,15).map(x=><article className="cea-tough-row" key={x.chapter}><div><b>{x.chapter}</b><small>{[...x.labels].join(" · ")}</small></div><strong>{x.total} questions</strong></article>)}</section><Coverage rows={data.rows} years={range}/></>}</StateView></main>
}
export default function CEEAnalytics(){const path=useLocation().pathname;if(path==="/analytics/question-bank")return <QuestionBank/>;const data=useAnalytics();if(path==="/analytics/pyq-analysis")return <ChapterTrends data={data}/>;if(path==="/analytics/exam-difficulty")return <DifficultyAnalysis data={data}/>;if(path==="/analytics/cee-2027-predictions")return <PriorityAnalysis data={data}/>;return <Home data={data}/>;}
