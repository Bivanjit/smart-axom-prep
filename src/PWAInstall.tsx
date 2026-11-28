import {useEffect,useState} from "react";
import {Download} from "lucide-react";
interface InstallPromptEvent extends Event { prompt:()=>Promise<void>; userChoice:Promise<{outcome:"accepted"|"dismissed";platform:string}>; }
declare global { interface Window { deferredSmartPrepInstall?:InstallPromptEvent|null } }
export default function PWAInstall(){
 const [available,setAvailable]=useState(false);
 const [installed,setInstalled]=useState(false);
 useEffect(()=>{
  if("serviceWorker" in navigator){const register=()=>{void navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(error=>console.warn("PWA service worker registration failed",error));};if(document.readyState==="complete")register();else window.addEventListener("load",register,{once:true});}
  const onPrompt=(event:Event)=>{event.preventDefault();window.deferredSmartPrepInstall=event as InstallPromptEvent;setAvailable(true);};
  const onInstalled=()=>{setInstalled(true);setAvailable(false);window.deferredSmartPrepInstall=null;};
  window.addEventListener("beforeinstallprompt",onPrompt);window.addEventListener("appinstalled",onInstalled);
  if(window.matchMedia("(display-mode: standalone)").matches||(navigator as Navigator&{standalone?:boolean}).standalone)setInstalled(true);
  return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled);};
 },[]);
 const install=async()=>{const prompt=window.deferredSmartPrepInstall;if(!prompt)return;await prompt.prompt();const choice=await prompt.userChoice;window.deferredSmartPrepInstall=null;setAvailable(false);if(choice.outcome==="accepted")setInstalled(true);};
 if(installed||!available)return null;
 return <button type="button" className="pwa-install-button" onClick={()=>void install()}><Download size={15}/> Install app</button>;
}
