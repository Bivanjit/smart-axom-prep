import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabase";
import ContentStudio from "./ContentStudio";
import { Activity, BookOpen, ClipboardList, CreditCard, LayoutDashboard, LogOut, Plus, Settings, Upload, Users, Check, X, Bell, Star } from "lucide-react";

type Tab = "overview" | "questions" | "pyqs" | "tests" | "lectures" | "students" | "payments" | "settings" | "content" | "support" | "security" | "updates" | "reviews" | "push";
type Row = Record<string, any>;
const money = (n:number) => "â‚¹" + Number(n||0).toLocaleString("en-IN");
const inputStyle:React.CSSProperties={width:"100%",padding:"11px 12px",border:"1px solid #d8e1ed",borderRadius:6,font:"13px Inter",background:"#fff",color:"#14233b"};
const btn:React.CSSProperties={border:0,borderRadius:6,padding:"10px 14px",background:"#087bff",color:"#fff",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:7,fontSize:12};
const card:React.CSSProperties={background:"#fff",border:"1px solid #e2e8f0",padding:20,borderRadius:8};
function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:7,fontSize:11,fontWeight:700,color:"#536278"}}>{label}{children}</label>}
function Notice({children}:{children:React.ReactNode}){return <div style={{padding:13,background:"#eef5ff",borderLeft:"3px solid #087bff",fontSize:12,lineHeight:1.6,color:"#41536d"}}>{children}</div>}
export default function Admin(){
 const quest¶»§q«^