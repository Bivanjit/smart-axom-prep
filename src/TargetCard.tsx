import {useEffect,useRef,useState} from "react";
import {Download,Share2,ArrowLeft,Image as ImageIcon,Sparkles} from "lucide-react";
import "./target-card.css";
const W=1229,H=1536;
type CardData={name:string;college:string;branch:string;mock:string;target:string};
const initial:CardData={name:"",college:"",branch:"",mock:"",target:""};
export default function TargetCard(){
 const canvasRef=useRef<HTMLCanvasElement>(null),templateRef=useRef<HTMLImageElement|null>(null);
 const [data,setData]=useState<CardData>(initial),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 useEffect(()=>{const img=new Image();img.src="/images/cee-target-template.png";img.onload=()=>{templateRef.current=img;setReady(true)};img.onerror=()=>{setNotice("The exact target-card template could not be loaded.");setReady(true)}},[]);
 const progress=Number(data.target)>0&&data.mock!==""?Math.min(100,Math.round(Number(data.mock)/Number(data.target)*100)):0;
 useEffect(()=>{const c=canvasRef.current,ctx=c?.getContext("2d"),bg=templateRef.current;if(!c||!ctx||!bg)return;
  ctx.clearRect(0,0,W,H);ctx.drawImage(bg,0,0,W,H);
  const text=(value:string,x:number,y:number,max:number,size:number,color:string,weight=700)=>{ctx.save();ctx.font=weight+" "+size+"px Arial, sans-serif";ctx.fillStyle=color;ctx.textAlign="left";let v=value||" ";while(ctx.measureText(v).width>max&&v.length>3)v=v.slice(0,-2)+"…";ctx.fillText(v,x,y);ctx.restore()};
  // Cover only the editable placeholder text; all original artwork remains the uploaded image.
  ctx.fillStyle="#f9faf7";ctx.fillRect(198,594,292,68);ctx.fillRect(654,594,365,68);
  ctx.fillStyle="#075039";ctx.fillRect(198,786,330,70);ctx.fillRect(829,786,205,70);
  ctx.fillStyle="#f8f8f5";ctx.fillRect(222,966,310,70);ctx.fillRect(696,967,220,70);
  text(data.name.trim()||"YOUR NAME",202,642,285,39,"#101915",700);
  text(data.college.trim()||"YOUR TARGET COLLEGE",660,642,365,30,"#101915",700);
  text(data.branch.trim()||"YOUR BRANCH",202,837,330,37,"#fff",700);
  text((data.target?String(data.target):"____")+" / 480",829,837,210,38,"#fff",700);
  text((data.mock?String(data.mock):"____")+" / 480",238,1037,300,43,"#101915",700);
  text(progress+"%",704,1014,190,52,"#126a48",800);
  // Dynamic fill overlays the existing empty progress track.
  ctx.save();ctx.beginPath();ctx.roundRect(88,1174,1053,28,14);ctx.clip();ctx.fillStyle="#0d704d";ctx.fillRect(88,1174,1053*progress/100,28);ctx.restore();
 },[data,ready,progress]);
 const update=(key:keyof CardData,value:string)=>setData(v=>({...v,[key]:value}));
 const blob=()=>new Promise<Blob>((resolve,reject)=>{const c=canvasRef.current;if(!c){reject(new Error("Preview unavailable"));return}c.toBlob(b=>b?resolve(b):reject(new Error("PNG export failed")),"image/png")});
 const download=async()=>{if(!data.name.trim()){setNotice("Add your name before downloading.");return}if(!templateRef.current){setNotice("The target template is still loading.");return}setBusy(true);try{const b=await blob(),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download="SmartPrep-Axom-My-CEE-Target.png";a.click();URL.revokeObjectURL(url);setNotice("Your exact-template target card is ready.")}catch{setNotice("Could not export the card. Please try again.")}finally{setBusy(false)}};
 const share=async()=>{if(!data.name.trim()){setNotice("Add your name before sharing.");return}setBusy(true);try{const b=await blob(),file=new File([b],"SmartPrep-Axom-My-CEE-Target.png",{type:"image/png"});if(navigator.canShare?.({files:[file]})&&navigator.share)await navigator.share({files:[file],title:"My Assam CEE 2027 target",text:"My CEE target with SmartPrep Axom"});else await download()}catch(e){if((e as Error).name!=="AbortError")setNotice("Sharing is unavailable. Download the PNG instead.")}finally{setBusy(false)}};
 return <main className="target-page"><div className="target-wrap"><a className="target-back" href="/cee-tools"><ArrowLeft size={16}/> Back to CEE Workspace</a><header className="target-heading"><span className="target-eyebrow">SMARTPREP AXOM · ASSAM CEE 2027</span><h1>My CEE Target Card.</h1><p>Your uploaded SmartPrep template, kept as the original artwork. Edit only your personal details.</p></header><div className="target-layout"><section className="target-form"><div className="target-form-head"><div><h2>Your details</h2><p>Changes appear on the exact template.</p></div><span><Sparkles size={16}/> Personal card</span></div><label>Student name<input value={data.name} onChange={e=>update("name",e.target.value)} maxLength={32} placeholder="Your name"/></label><label>Target college<input value={data.college} onChange={e=>update("college",e.target.value)} maxLength={38} placeholder="Your target college"/></label><label>Preferred branch<input value={data.branch} onChange={e=>update("branch",e.target.value)} maxLength={24} placeholder="Your branch"/></label><div className="target-two-fields"><label>Target marks<input type="number" min="0" max="480" value={data.target} onChange={e=>update("target",e.target.value)} placeholder="Out of 480"/></label><label>Current mock marks<input type="number" min="0" max="480" value={data.mock} onChange={e=>update("mock",e.target.value)} placeholder="Out of 480"/></label></div><p className="target-notice" role="status">{notice||"Progress is calculated from current mock marks ÷ target marks."}</p><div className="target-actions"><button type="button" className="target-download" onClick={download} disabled={busy||!ready}>{busy?"Preparing…":<><Download size={17}/> Download PNG</>}</button><button type="button" className="target-share" onClick={share} disabled={busy||!ready}><Share2 size={17}/> Share</button></div></section><section className="target-preview"><div className="target-preview-head"><div><h2>Exact template preview</h2><p>Original image · 1229 × 1536</p></div><span><ImageIcon size={15}/> PNG</span></div><div className="target-canvas-frame">{!ready&&<p>Loading your template…</p>}<canvas ref={canvasRef} width={W} height={H} aria-label="Exact SmartPrep Axom target card preview"/></div></section></div></div></main>;
}