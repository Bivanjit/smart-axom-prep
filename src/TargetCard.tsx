import { useEffect, useRef, useState } from "react";
import { Download, Share2, Sparkles, ArrowLeft, Image as ImageIcon } from "lucide-react";
import "./target-card.css";

const W=1080,H=1350;
type CardData={name:string;college:string;branch:string;mock:string;target:string;message:string};
const initial:CardData={name:"",college:"",branch:"",mock:"",target:"",message:"One focused step closer to my goal."};

function rounded(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
}
function drawText(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,max:number,size:number,color:string,weight=600){
  ctx.fillStyle=color;ctx.font=weight+" "+size+"px Inter, Arial, sans-serif";ctx.textAlign="left";
  let value=text||"Not added";while(ctx.measureText(value).width>max&&value.length>3)value=value.slice(0,-2)+"…";
  ctx.fillText(value,x,y);
}
export default function TargetCard(){
 const canvasRef=useRef<HTMLCanvasElement>(null),logoRef=useRef<HTMLImageElement|null>(null);
 const [data,setData]=useState<CardData>(initial),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 useEffect(()=>{const img=new Image();img.src="/app-icon.webp";img.onload=()=>{logoRef.current=img;setReady(true)};img.onerror=()=>setReady(true)},[]);
 useEffect(()=>{const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#0b1226");bg.addColorStop(.58,"#111a36");bg.addColorStop(1,"#171b3a");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle="rgba(179,165,255,.16)";ctx.lineWidth=2;for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(940,150,120+i*42,0,Math.PI*2);ctx.stroke()}
  ctx.fillStyle="#c8c2ff";ctx.font="700 22px Inter, Arial";ctx.fillText("ASSAM CEE 2027  /  MY TARGET",88,94);
  if(logoRef.current){ctx.save();ctx.beginPath();ctx.arc(118,178,43,0,Math.PI*2);ctx.clip();ctx.drawImage(logoRef.current,75,135,86,86);ctx.restore()}
  ctx.fillStyle="#f3f5ef";ctx.font="700 34px Inter, Arial";ctx.fillText("SmartPrep",182,176);ctx.fillStyle="#b8a4ff";ctx.fillText("Axom",365,176);
  ctx.fillStyle="#d8dafa";ctx.font="500 19px Inter, Arial";ctx.fillText("PREPARE SMARTER. PERFORM BETTER.",182,208);
  ctx.fillStyle="#f4f5ef";ctx.font="700 66px Inter, Arial";ctx.fillText("My CEE goal.",88,360);
  ctx.fillStyle="#b8a4ff";ctx.font="500 25px Inter, Arial";ctx.fillText("A plan worth showing up for, every day.",88,410);
  rounded(ctx,72,470,936,390,30);ctx.fillStyle="rgba(245,249,242,.07)";ctx.fill();
  ctx.fillStyle="#b8a4ff";ctx.font="700 19px Inter, Arial";ctx.fillText("STUDENT",112,530);
  drawText(ctx,data.name.trim()||"Your name",112,585,820,46,"#f5f7f1",700);
  ctx.fillStyle="#b8a4ff";ctx.font="700 19px Inter, Arial";ctx.fillText("TARGET COLLEGE",112,665);
  drawText(ctx,data.college.trim()||"Your dream college",112,715,820,34,"#f5f7f1",650);
  ctx.fillStyle="#b8a4ff";ctx.font="700 19px Inter, Arial";ctx.fillText("PREFERRED BRANCH",112,785);
  drawText(ctx,data.branch.trim()||"Your preferred branch",112,830,820,30,"#e3ebe2",600);
  rounded(ctx,72,910,446,220,24);ctx.fillStyle="rgba(173,155,255,.13)";ctx.fill();
  rounded(ctx,562,910,446,220,24);ctx.fillStyle="rgba(173,155,255,.13)";ctx.fill();
  ctx.fillStyle="#b8a4ff";ctx.font="700 18px Inter, Arial";ctx.fillText("CURRENT MOCK MARKS",108,965);drawText(ctx,data.mock?data.mock+" / 480":"— / 480",108,1040,360,52,"#ffffff",700);
  ctx.fillStyle="#b8a4ff";ctx.font="700 18px Inter, Arial";ctx.fillText("TARGET MARKS",598,965);drawText(ctx,data.target?data.target+" / 480":"— / 480",598,1040,360,52,"#ffffff",700);
  ctx.fillStyle="#f2f5ef";ctx.font="italic 500 24px Inter, Arial";const msg=data.message.trim()||"One focused step closer to my goal.";ctx.fillText("“"+(ctx.measureText(msg).width>850?msg.slice(0,58)+"…":msg)+"”",88,1205);
  ctx.fillStyle="#b8a4ff";ctx.font="700 18px Inter, Arial";ctx.fillText("SMARTPREP-AXOM.PAGES.DEV",88,1290);
  ctx.textAlign="right";ctx.fillStyle="rgba(242,245,239,.7)";ctx.font="500 17px Inter, Arial";ctx.fillText("MY JOURNEY · MY TARGET",992,1290);ctx.textAlign="left";
 },[data,ready]);
 const update=(key:keyof CardData,value:string)=>setData(old=>({...old,[key]:value}));
 const validate=()=>{if(!data.name.trim()){setNotice("Add your name to personalise the card.");return false}return true};
 const getBlob=()=>new Promise<Blob>((resolve,reject)=>{const c=canvasRef.current;if(!c){reject(new Error("Preview is not ready"));return}c.toBlob(b=>b?resolve(b):reject(new Error("PNG export failed")),"image/png")});
 const download=async()=>{if(!validate())return;setBusy(true);setNotice("");try{const blob=await getBlob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="smartprep-axom-my-cee-target.png";a.click();URL.revokeObjectURL(url);setNotice("Your PNG is ready.");}catch{setNotice("Could not create the image. Please try again.")}finally{setBusy(false)}};
 const share=async()=>{if(!validate())return;setBusy(true);setNotice("");try{const blob=await getBlob();const file=new File([blob],"smartprep-axom-my-cee-target.png",{type:"image/png"});if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:"My Assam CEE 2027 target",text:"My CEE goal with SmartPrep Axom"});setNotice("Share sheet opened.")}else{await download()}}catch(e){if((e as Error).name!=="AbortError")setNotice("Sharing isn't available here. Use Download PNG instead.")}finally{setBusy(false)}};
 return <main className="target-page"><div className="target-wrap"><a className="target-back" href="/analytics"><ArrowLeft size={16}/> Back to Intelligence</a><header className="target-heading"><span className="target-eyebrow">SMARTPREP AXOM · ASSAM CEE 2027</span><h1>Make your goal visible.</h1><p>Add a few details, preview your card and share it. No account or complicated setup needed.</p></header><div className="target-layout"><section className="target-form"><div className="target-form-head"><div><h2>Your details</h2><p>Only include what you want to share.</p></div><span><Sparkles size={16}/> Personal card</span></div><label>Student name<input value={data.name} onChange={e=>update("name",e.target.value)} maxLength={32} placeholder="Your name"/></label><label>Target college<input value={data.college} onChange={e=>update("college",e.target.value)} maxLength={54} placeholder="e.g. Jorhat Engineering College"/></label><label>Preferred branch<input value={data.branch} onChange={e=>update("branch",e.target.value)} maxLength={48} placeholder="e.g. Mechanical Engineering"/></label><div className="target-two-fields"><label>Current mock marks<input type="number" min="0" max="480" value={data.mock} onChange={e=>update("mock",e.target.value)} placeholder="Out of 480"/></label><label>Target marks<input type="number" min="0" max="480" value={data.target} onChange={e=>update("target",e.target.value)} placeholder="Out of 480"/></label></div><label>Short message <span className="target-optional">Optional</span><input value={data.message} onChange={e=>update("message",e.target.value)} maxLength={68} placeholder="One focused step closer to my goal."/></label><div className="target-actions"><button type="button" className="target-download" onClick={download} disabled={busy}>{busy?<span className="target-spinner"/>:<Download size={17}/>} Download PNG</button><button type="button" className="target-share" onClick={share} disabled={busy}><Share2 size={17}/> Share</button></div><p className="target-notice" role="status">{notice||"High-resolution PNG · 1080 × 1350 · ready for social sharing"}</p></section><section className="target-preview"><div className="target-preview-head"><div><h2>Live preview</h2><p>Your image updates as you type.</p></div><span><ImageIcon size={15}/> PNG preview</span></div><div className="target-canvas-frame"><canvas ref={canvasRef} width={W} height={H} aria-label="Preview of your SmartPrep Axom CEE target card"/></div><p className="target-preview-note">The exported PNG uses the SmartPrep Axom app logo and keeps your text crisp.</p></section></div></div></main>;
}
