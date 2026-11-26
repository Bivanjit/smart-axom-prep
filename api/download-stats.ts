import type { VercelRequest, VercelResponse } from "@vercel/node";
type Release = { assets?: Array<{ name: string; download_count: number }> };
const URL="https://yydstdwknkgqelbxnvre.supabase.co";
const KEY="sb_publishable_zPHi6yA--NsNBJmXQy0Rhg_gwgP-Xbd";
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(req.method!=="GET"&&req.method!=="HEAD"){res.setHeader("Allow","GET, HEAD");return res.status(405).json({error:"Method not allowed"});}
 try{
  const [github,setting]=await Promise.all([
   fetch("https://api.github.com/repos/Bivanjit/SMART-PREP-AXOM-APP/releases?per_page=100",{headers:{Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"SmartPrep-Axom-Download-Stats/1.0"},signal:AbortSignal.timeout(4500)}),
   fetch(URL+"/rest/v1/app_content_settings?select=setting_value&setting_key=eq.apk_download_stats&is_public=eq.true",{headers:{apikey:KEY,Authorization:"Bearer "+KEY,Accept:"application/json"},signal:AbortSignal.timeout(3000)})
  ]);
  if(!github.ok)throw new Error("GitHub statistics unavailable");
  const releases=await github.json() as Release[];
  const rows=setting.ok?await setting.json() as Array<{setting_value?:{historical_baseline?:number}}>:[]; 
  const baseline=Number(rows[0]?.setting_value?.historical_baseline??768);
  const live=releases.flatMap(x=>x.assets||[]).filter(x=>x.name.toLowerCase().endsWith(".apk")).reduce((n,x)=>n+Number(x.download_count||0),0);
  res.setHeader("Cache-Control","public, max-age=300, s-maxage=600, stale-while-revalidate=86400");
  return res.status(200).json({downloads:baseline+live,historicalBaseline:baseline,liveDownloads:live});
 }catch{
  res.setHeader("Cache-Control","public, max-age=300, s-maxage=600, stale-while-revalidate=86400");
  return res.status(200).json({downloads:839,historicalBaseline:768,liveDownloads:71,stale:true});
 }
}
