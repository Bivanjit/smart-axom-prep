import {useEffect,useRef,useState} from "react";
import {Activity,ArrowRight,CheckCircle2,Database,LoaderCircle,ScanSearch,ShieldCheck,Sparkles,Target} from "lucide-react";
import "./analysis-engine.css";

type Props={title:string;subtitle:string;steps:string[];durationMs?:number;buttonLabel:string;mode?:"analyse"|"predict"|"calculate"|"match";onComplete:()=>void;disabled?:boolean};
export default function AnalysisEngine({title,subtitle,steps,durationMs=1900,buttonLabel,mode="analyse",onComplete,disabled=false}:Props){
 const [running,setRunning]=useState(false),[progress,setProgress]=useState(0),[phase,setPhase]=useState(0);\n const completeRef=useRef(onComplete);completeRef.current=onComplete;
 useEffect(()=>{if(!running)return;const started=Date.now();const tick=window.setInterval(()=>{const p=Math.min(100,((Date.now()-started)/durationMs)*100);setProgress(p);setPhase(Math.min(steps.length-1,Math.floor((p/100)*steps.length)));if(p>=100){window.clearInterval(tick);setRunning(false);completeRef.current();}},45);return()=>window.clearInterval(tick)},[running,durationMs,steps.length]);
 const Icon=mode==="predict"?Sparkles:mode==="calculate"?Target:mode==="match"?ScanSearch:Activity;
 const verb=mode==="predict"?"Generating":mode==="calculate"?"Calculating":mode==="match"?"Matching":"Analysing";
 return <section className={"analysis-engine "+(running?"is-running":"")} aria-live="polite">
  {!running?<div className="analysis-engine-ready"><div className="analysis-engine-mark"><Icon size={20}/></div><div className="analysis-engine-copy"><b>{title}</b><span>{subtitle}</span></div><button type="button" disabled={disabled} onClick={()=>{setProgress(0);setPhase(0);setRunning(true)}}>{buttonLabel}<ArrowRight size={16}/></button></div>
  :<div className="analysis-engine-console"><div className="analysis-engine-top"><span><i/> SMARTPREP ANALYSIS CORE</span><span>{Math.round(progress)}%</span></div><div className="analysis-engine-visual"><div className="analysis-engine-rings"><i/><i/><i/><b><Icon size={24}/></b></div><div className="analysis-engine-scan"/></div><div className="analysis-engine-status"><b>{verb} {title.toLowerCase()}</b><span>{steps[phase]||subtitle}</span></div><div className="analysis-engine-progress"><i style={{width:progress+"%"}}/></div><div className="analysis-engine-steps">{steps.map((step,index)=><span className={index<phase?"done":index===phase?"active":""} key={step}>{index<phase?<CheckCircle2 size={12}/>:<LoaderCircle size={12}/>} {step}</span>)}</div></div>}
 </section>
}
