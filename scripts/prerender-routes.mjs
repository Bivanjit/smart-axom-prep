import {mkdir,readFile,writeFile} from "node:fs/promises";
import {dirname,join} from "node:path";

const origin="https://smartprep-axom.pages.dev";
const routes=[
 ["/about","About SmartPrep Axom","Learn about SmartPrep Axom, an independent Assam CEE preparation project and its study resources."],
 ["/practice","Chapter-wise Practice | SmartPrep Axom","Explore structured Assam CEE practice by Physics, Chemistry and Mathematics."],
 ["/practice/physics","Physics Practice | SmartPrep Axom","Practise Physics questions and strengthen concepts for Assam CEE."],
 ["/practice/chemistry","Chemistry Practice | SmartPrep Axom","Practise Chemistry questions and revise key Assam CEE topics."],
 ["/practice/mathematics","Mathematics Practice | SmartPrep Axom","Practise Mathematics questions and build problem-solving confidence for Assam CEE."],
 ["/test-series","Assam CEE 2027 Test Series","Explore structured mock-test preparation for Assam CEE 2027."],
 ["/pricing","Pricing | SmartPrep Axom","Review SmartPrep Axom learning plans, access details and pricing information."],
 ["/app","SmartPrep Axom Android App","Learn about and download the SmartPrep Axom Android app."],
 ["/reviews","Student Reviews | SmartPrep Axom","Read student feedback about SmartPrep Axom."],
 ["/community","SmartPrep Axom Community","Learn about the SmartPrep Axom student community."],
 ["/faq","Frequently Asked Questions | SmartPrep Axom","Find answers about SmartPrep Axom, Assam CEE preparation and app access."],
 ["/contact","Contact SmartPrep Axom","Contact the SmartPrep Axom team for support, corrections and enquiries."],
 ["/previous-papers","Assam CEE Previous Year Question Papers","Browse published Assam CEE previous-year question papers in the SmartPrep archive."],
 ["/analytics","Assam CEE Intelligence Dashboard","Explore Assam CEE question trends, exam analysis, predictions and admission reference tools."],
 ["/analytics/pyq-analysis","Assam CEE Chapter-wise PYQ Analysis","Explore chapter-wise Assam CEE previous-year question trends."],
 ["/analytics/question-bank","Assam CEE Question Bank","Browse Assam CEE questions by subject, chapter and year."],
 ["/analytics/exam-difficulty","Assam CEE Exam Difficulty Analysis","Review year-wise and subject-wise Assam CEE exam difficulty estimates."],
 ["/analytics/cee-2027-predictions","Assam CEE 2027 Chapter Predictions","Explore SmartPrep Axom's chapter-priority outlook based on historical paper trends."],
 ["/predictor/rank","Assam CEE Rank Predictor","Estimate an indicative Assam CEE merit-rank range using historical references."],
 ["/predictor/marks-to-rank","Assam CEE Marks-to-Rank Predictor","Compare expected Assam CEE marks or rank with historical counselling cutoff references."],
 ["/predictor/college","Assam CEE College Predictor","Explore indicative Assam CEE college options using historical admission cutoff references."],
 ["/analytics/college-cutoff-analysis","Assam CEE College Cutoff Analysis","Explore historical Assam engineering college cutoff references."],
 ["/exam-guide","Assam CEE Exam Guide","Read an independent overview of Assam CEE exam format and admission references."],
 ["/privacy-policy","Privacy Policy | SmartPrep Axom","Read the SmartPrep Axom privacy policy."],
 ["/terms-and-conditions","Terms and Conditions | SmartPrep Axom","Read the SmartPrep Axom terms and conditions."],
 ["/refund-policy","Refund Policy | SmartPrep Axom","Read the SmartPrep Axom refund policy."],
 ["/disclaimer","Educational Disclaimer | SmartPrep Axom","Read important limitations and source guidance for SmartPrep Axom educational tools."],
 ["/copyright","Copyright Policy | SmartPrep Axom","Read the SmartPrep Axom copyright and content policy."]
];

function esc(value){return value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");}
function setMeta(html,selector,replacement){
 const re=new RegExp(selector,"i");
 if(re.test(html)) return html.replace(re,replacement);
 return html.replace("</head>",replacement+"\n  </head>");
}
const template=await readFile("dist/index.html","utf8");
for(const [path,title,description] of routes){
 const canonical=origin+path;
 let html=template.replace(/<title>[^<]*<\/title>/i,`<title>${esc(title)}</title>`);
 html=setMeta(html,'<meta\\s+name="description"[^>]*>',`<meta name="description" content="${esc(description)}" />`);
 html=setMeta(html,'<meta\\s+name="robots"[^>]*>','<meta name="robots" content="index, follow, max-image-preview:large" />');
 html=setMeta(html,'<link\\s+rel="canonical"[^>]*>',`<link rel="canonical" href="${canonical}" />`);
 html=setMeta(html,'<meta\\s+property="og:url"[^>]*>',`<meta property="og:url" content="${canonical}" />`);
 html=setMeta(html,'<meta\\s+property="og:title"[^>]*>',`<meta property="og:title" content="${esc(title)}" />`);
 html=setMeta(html,'<meta\\s+property="og:description"[^>]*>',`<meta property="og:description" content="${esc(description)}" />`);
 const target=join("dist",path.slice(1),"index.html");
 await mkdir(dirname(target),{recursive:true});
 await writeFile(target,html,"utf8");
}
for(const path of ["/admin","/admin/login","/admin/intelligence"]){
 let html=template.replace(/<title>[^<]*<\/title>/i,"<title>SmartPrep Axom Admin</title>");
 html=setMeta(html,'<meta\\s+name="robots"[^>]*>','<meta name="robots" content="noindex, nofollow" />');
 const target=join("dist",path.slice(1),"index.html");
 await mkdir(dirname(target),{recursive:true});
 await writeFile(target,html,"utf8");
}
console.log(`Generated ${routes.length} public route metadata documents and 3 noindex admin documents.`);
