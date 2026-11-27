import {useEffect,useMemo,useRef,useState} from "react";
import {Check,ChevronDown,Search} from "lucide-react";
import "./smart-select.css";
export type SmartSelectOption={value:string;label:string;description?:string};
type Props={label:string;value:string;onChange:(value:string)=>void;options:SmartSelectOption[];placeholder?:string;searchable?:boolean;disabled?:boolean};
export default function SmartSelect({label,value,onChange,options,placeholder="Select an option",searchable,disabled=false}:Props){
 const [open,setOpen]=useState(false),[query,setQuery]=useState("");
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const selected=options.find(x=>x.value===value);
 const showSearch=searchable??false;
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?options.filter(x=>(x.label+" "+(x.description||"")).toLowerCase().includes(q)):options},[options,query]);
 useEffect(()=>{if(!open)return;const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpen(false);trigger.current?.focus()}};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key)}},[open]);
 const choose=(next:string)=>{onChange(next);setOpen(false);setQuery("");trigger.current?.focus()};
 return <div className={"smart-select "+(open?"is-open":"")+(disabled?" is-disabled":"")} ref={root}>
  <span className="smart-select-label">{label}</span>
  <button ref={trigger} type="button" className="smart-select-trigger" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(x=>!x)}>
   <span className="smart-select-value">{selected?.label||placeholder}</span><ChevronDown size={17} className="smart-select-chevron"/>
  </button>
  {open&&<div className="smart-select-menu" role="listbox" aria-label={label}>
   {showSearch&&<div className="smart-select-search"><Search size={15}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={"Search "+label.toLowerCase()+"…"} onKeyDown={e=>{if(e.key==="Escape"){setOpen(false);trigger.current?.focus()}if(e.key==="Enter"&&filtered[0])choose(filtered[0].value)}}/></div>}
   <div className="smart-select-options">{filtered.length?filtered.map((option,index)=><button type="button" role="option" aria-selected={option.value===value} key={option.value} className={"smart-select-option "+(option.value===value?"selected":"")} style={{animationDelay:Math.min(index*18,180)+"ms"}} onClick={()=>choose(option.value)}><span><b>{option.label}</b>{option.description&&<small>{option.description}</small>}</span>{option.value===value&&<Check size={16}/>}</button>):<div className="smart-select-empty">No matching options</div>}</div>
  </div>}
 </div>
}
