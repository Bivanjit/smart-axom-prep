import {useEffect,useRef,useState} from "react";
import {Download,Share2,ArrowLeft,Sparkles} from "lucide-react";
import "./target-card.css";
const W=1080,H=1350;
type CardData={name:string;college:string;branch:string;mock:string;target:string};
const initial:CardData={name:"",college:"",branch:"",mock:"",target:""};
function rounded(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function fitText(ctx:CanvasRenderingContext2D,value:string,x:number,y:number,max:number,size:number,color:string,weight=700,family="Inter,Arial,sans-serif"){let s=size;ctx.font=weight+" "+s+"px "+family;while(ctx.measureText(value).width>max&&s>18){s--;ctx.font=weight+" "+s+"px "+family}ctx.fillStyle=color;ctx.fillText(value,x,y)}
export default function TargetCard(){
 const canvasRef=useRef<HTMLCanvasElement>(null),logoRef=useRef<HTMLImageElement|null>(null);
 const [data,setData]=useState<CardData>(initial),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 useEffect(()=>{const img=new Image();img.src="/favicon.svg";img.onload=()=>{logoRef.current=img;setReady(true)};img.onerror=()=>setReady(true);return()=>{logoRef.current=null}},[]);
 const progress=Number(data.target)>0&&data.mock!==""?Math.max(0,Math.min(100,Number(data.mock)/Number(data.target)*100)):0;
 useEffect(()=>{const canvas=canvasRef.current,ctx=canvas?.getContext("2d");if(!canvas||!ctx)return;ctx.clearRect(0,0,W,H);
 const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#07152f");bg.addColorStop(.58,"#102b4a");bg.addColorStop(1,"#123e43");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 const glow=ctx.createRadialGradient(870,280,20,870,280,520);glow.addColorStop(0,"rgba(72,205,174,.24)");glow.addColorStop(1,"rgba(72,205,174,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#38d6b0";ctx.fillRect(0,0,W,12);
 if(logoRef.current){rounded(ctx,72,66,78,78,20);ctx.fillStyle="#fff";ctx.fill();ctx.save();ctx.beginPath();ctx.roundRect(72,66,78,78,20);ctx.clip();ctx.drawImage(logoRef.current,72,66,78,78);ctx.restore()}
 ctx.textBaseline="alphabetic";fitText(ctx,"SmartPrep",174,105,230,34,"#f5f8ff",800);ctx.font="800 34px Inter,Arial,sans-serif";const brandGapX=174+ctx.measureText("SmartPrep").width+14;fitText(ctx,"Axom",brandGapX,105,125,34,"#54b8ff",800);ctx.fillStyle="#a9bdd5";ctx.font="600 15px Inter,Arial,sans-serif";ctx.fillText("PREPARE SMARTER. PERFORM BETTER.",176,132);
 rounded(ctx,780,75,228,48,24);ctx.fillStyle="rgba(56,214,176,.13)";ctx.fill();ctx.strokeStyle="rgba(103,234,204,.42)";ctx.stroke();ctx.fillStyle="#8df2d8";ctx.font="800 15px Inter,Arial,sans-serif";ctx.textAlign="center";ctx.fillText("ASSAM CEE 2027",894,105);ctx.textAlign="left";
 ctx.fillStyle="#8df2d8";ctx.font="800 15px Inter,Arial,sans-serif";ctx.fillText("MY TARGET · MY JOURNEY",76,250);
 ctx.fillStyle="#fff";ctx.font="800 76px Inter,Arial,sans-serif";ctx.fillText("One goal.",76,345);ctx.fillStyle="#6de0c2";ctx.fillText("One engineering seat.",76,430);
 ctx.fillStyle="#c3d1e1";ctx.font="400 23px Inter,Arial,sans-serif";ctx.fillText("A focused plan for my Assam CEE 2027 preparation.",78,478);
 rounded(ctx,66,545,948,390,28);ctx.fillStyle="rgba(255,255,255,.97)";ctx.fill();ctx.strokeStyle="rgba(255,255,255,.5)";ctx.stroke();
 ctx.fillStyle="#527086";ctx.font="800 13px Inter,Arial,sans-serif";ctx.fillText("STUDENT",104,600);ctx.fillText("TARGET COLLEGE",575,600);
 fitText(ctx,data.name.trim()||"Your name",104,653,410,40,data.name.trim()?"#122d43":"#9aabba",600,"Georgia,Times New Roman,serif");
 fitText(ctx,data.college.trim()||"Your dream college",575,653,390,36,data.college.trim()?"#122d43":"#9aabba",600,"Georgia,Times New Roman,serif");
 ctx.strokeStyle="#dce5e9";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(104,685);ctx.lineTo(976,685);ctx.stroke();
 ctx.fillStyle="#527086";ctx.font="800 13px Inter,Arial,sans-serif";ctx.fillText("PREFERRED BRANCH",104,735);ctx.fillText("TARGET MARKS",575,735);
 fitText(ctx,data.branch.trim()||"Choose your branch",104,790,410,36,data.branch.trim()?"#122d43":"#9aabba",600,"Georgia,Times New Roman,serif");
 fitText(ctx,data.target?data.target+" / 480":"— / 480",575,790,390,34,"#122d43",800);
 ctx.strokeStyle="#dce5e9";ctx.beginPath();ctx.moveTo(104,820);ctx.lineTo(976,820);ctx.stroke();
 ctx.fillStyle="#527086";ctx.font="800 13px Inter,Arial,sans-serif";ctx.fillText("CURRENT MOCK SCORE",104,865);ctx.fillText("TARGET PROGRESS",575,865);
 fitText(ctx,data.mock?data.mock+" / 480":"— / 480",104,908,390,29,"#122d43",800);
 fitText(ctx,data.target&&data.mock?Math.round(progress)+"%":"Set your marks",575,908,390,29,"#087c67",800);
 rounded(ctx,76,985,928,20,10);ctx.fillStyle="rgba(255,255,255,.15)";ctx.fill();if(progress>0){rounded(ctx,76,985,928*progress/100,20,10);ctx.fillStyle="#4be0b7";ctx.fill()}
 ctx.fillStyle="#d9e6ef";ctx.font="italic 25px Georgia,serif";ctx.fillText("“One focused step closer to my goal.”",76,1095);
 ctx.strokeStyle="rgba(206,231,237,.35)";ctx.beginPath();ctx.moveTo(76,1160);ctx.lineTo(1004,1160);ctx.stroke();
 ctx.fillStyle="#a9c4d4";ctx.font="700 13px Inter,Arial,sans-serif";ctx.fillText("SMARTPREP AXOM  ·  ASSAM CEE 2027",76,1205);
 ctx.textAlign="right";ctx.fillText("MY JOURNEY  /  MY TARGET",1004,1205);ctx.textAlign="left";
 ctx.fillStyle="#8da8bb";ctx.font="400 14px Inter,Arial,sans-serif";ctx.fillText("smartprep-axom.pages.dev",76,1250);
 ctx.fillStyle="#6de0c2";ctx.beginPath();ctx.arc(990,1250,5,0,Math.PI*2);ctx.fill();
 },[data,progress,ready]);
 const update=(key:keyof CardData,value:string)=>setData(v=>({...v,[key]:value}));
 const blob=()=>new Promise<Blob>((resolve,reject)=>{const c=canvasRef.current;if(!c){reject(new Error("Preview unavailable"));return}c.toBlob(b=>b?resolve(b):reject(new Error("PNG export failed")),"image/png")});
 const download=async()=>{if(!data.name.trim()){setNotice("Add your name before downloading.");return}setBusy(true);try{const b=await blob(),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download="SmartPrep-Axom-My-CEE-Target.png";a.click();URL.revokeObjectURL(url);setNotice("Your editable target details are now on the exported card.")}catch{setNotice("Could not export the card. Please try again.")}finally{setBusy(false)}};
 const share=async()=>{if(!data.name.trim()){setNotice("Add your name before sharing.");return}setBusy(true);try{const b=await blob(),file=new File([b],"SmartPrep-Axom-My-CEE-Target.png",{type:"image/png"});if(navigator.canShare?.({files:[file]})&&navigator.share)await navigator.share({files:[file],title:"My Assam CEE 2027 target",text:"My CEE target with SmartPrep Axom"});else await download()}catch(e){if((e as Error).name!=="AbortError")setNotice("Sharing is unavailable. Download the PNG instead.")}finally{setBusy(false)}};
 return <main className="target-page"><div className="target-wrap"><a className="target-back" href="/cee-tools"><ArrowLeft size={16}/> Back to CEE Workspace</a><header className="target-heading"><span className="target-eyebrow">SMARTPREP AXOM · ASSAM CEE 2027</span><h1>My CEE Target</h1><p>A clean, code-drawn card. Set your CEE goal and share your progress.</p></header><div className="target-layout"><section className="target-form"><div className="target-form-head"><div><h2>Your details</h2><p>Changes appear on the card instantly.</p></div><span><Sparkles size={16}/> Personal card</span></div><label>Student name<input value={data.name} onChange={e=>update("name",e.target.value)} maxLength={42} placeholder="Your name"/></label><label>Target college<input value={data.college} onChange={e=>update("college",e.target.value)} maxLength={48} placeholder="Your target college"/></label><label>Preferred branch<input value={data.branch} onChange={e=>update("branch",e.target.value)} maxLength={40} placeholder="Your preferred branch"/></label><div className="target-two-fields"><label>Target marks<input type="number" min="0" max="480" value={data.target} onChange={e=>update("target",e.target.value)} placeholder="Out of 480"/></label><label>Current mock marks<input type="number" min="0" max="480" value={data.mock} onChange={e=>update("mock",e.target.value)} placeholder="Out of 480"/></label></div><p className="target-notice" role="status">{notice||"Progress is calculated from your current mock score and target marks."}</p><div className="target-actions"><button type="button" className="target-download" onClick={download} disabled={busy||!ready}>{busy?"Preparing…":<><Download size={17}/> Download PNG</>}</button><button type="button" className="target-share" onClick={share} disabled={busy||!ready}><Share2 size={17}/> Share</button></div></section><section className="target-preview"><div className="target-preview-head"><div><h2>Live card preview</h2><p>1080 × 1350 PNG</p></div><span>PNG</span></div><div className="target-canvas-frame"><canvas ref={canvasRef} width={W} height={H} aria-label="SmartPrep Axom target card preview"/></div></section></div></div></main>;
}