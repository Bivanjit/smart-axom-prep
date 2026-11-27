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

const seoContent={
 "/practice":["Free Assam CEE 2027 chapter-wise practice","Explore the Physics, Chemistry and Mathematics chapter catalogue for Assam CEE preparation. SmartPrep Axom's public website resources are free to access and do not require login or signup. Browse the available chapter outlines, identify important concepts and use linked intelligence tools to review historical question trends. Expanded chapter practice, subject-wise tests and full mock tests are available in the Android app, with optional low-cost membership plans.","Start with the subject you want to strengthen, then use CEE Chapter Outlook and PYQ Intelligence to plan revision. The chapter catalogue is a study-planning aid; verify the current official syllabus when ASTU publishes the 2027 brochure."],
 "/previous-papers":["Assam CEE previous year question papers and free PYQ archive","Browse Assam CEE previous-year papers published in the SmartPrep Axom archive. Select an examination year and download the available paper directly. The public website archive is free to access: no login, no signup and no account creation are required.","Use previous-year papers to become familiar with question styles, subject balance and time management. Paper availability depends on what has been uploaded and published in the archive; this page does not claim that every year or every paper is available. For extra chapter practice, subject-wise tests and full-length mock tests, explore the SmartPrep Axom Android app. Optional paid app features are offered through low-cost plans; check the app for current prices and access details."],
 "/test-series":["Assam CEE 2027 mock test and test-series information","Understand the Assam CEE paper format and explore the SmartPrep Axom mock-test pathway. The public website provides preparation information and reference tools without login or signup. Full-length mock tests, subject-wise tests and expanded chapter practice are available in the Android app according to the published app plan.","Use the official ASTU brochure as the final authority for the 2027 examination pattern. Historical exam format information is labelled by year and should not be treated as a confirmed 2027 notification."],
 "/exam-guide":["Assam CEE 2027 exam guide, syllabus, preparation and admission references","This independent Assam CEE guide brings together exam-pattern references, syllabus navigation, previous-year question resources, chapter intelligence and admission-planning links for students in Assam. SmartPrep Axom's public website resources are free to explore without login or signup.","Check the latest ASTU notification for exam dates, eligibility, application details, admit cards, syllabus and marking rules. For admission and counselling, verify current DTE Assam notices, seat matrix and category rules. Historical cutoffs and rank estimates are planning references, not guarantees of allotment."],
 "/analytics/pyq-analysis":["Assam CEE chapter-wise PYQ analysis and question trends","Explore published Assam CEE previous-year question analysis by subject and chapter. Review question frequency, recurrence, difficulty labels and weightage where records are available. Use these trends to prioritise revision while continuing to cover the complete syllabus.","The analysis reflects the dataset currently published by SmartPrep Axom. Historical frequency is not a promise that a chapter will appear in the next examination. Website intelligence tools are free to access without login or signup."],
 "/analytics/cee-2027-predictions":["Assam CEE 2027 chapter priority and preparation outlook","Use historical Assam CEE question trends to build a practical revision outlook for Physics, Chemistry and Mathematics. Chapter priority signals help organise study time; they are not guaranteed predictions of the 2027 question paper.","Review underlying PYQ analysis, compare chapter recurrence and complete the full syllabus. SmartPrep Axom's public intelligence resources are free to use without login or signup."],
 "/predictor/rank":["Assam CEE marks and rank predictor reference","Explore an indicative Assam CEE rank estimate using historical references and assumptions displayed by the predictor. Results are planning estimates only: actual rank depends on the official examination, candidate performance and merit list.","Use the result alongside official ASTU merit information and current DTE Assam counselling notices. SmartPrep Axom provides public website tools without login or signup; no predictor can guarantee a rank or admission."],
 "/predictor/college":["Assam CEE college predictor and historical cutoff explorer","Compare your expected Assam CEE rank with published historical college and branch closing-rank references. Use results to prepare a preference shortlist, then confirm current seat availability, category rules and counselling rounds through official DTE Assam notices.","Historical cutoffs are not current vacancies and cannot guarantee allotment. SmartPrep Axom's public website predictors and reference tools are free to explore without login or signup."],
 "/analytics":["Assam CEE intelligence: PYQ trends, chapter weightage and admission references","Explore SmartPrep Axom's Assam CEE intelligence tools for chapter-wise previous-year question trends, exam difficulty references, chapter outlook, rank estimates and college cutoff comparisons. Public website tools are free to access without login or signup.","Use historical data as a revision and planning aid, not as a guarantee of future questions or admission. Confirm examination rules and counselling details through ASTU and DTE Assam."],
 "/cee-outlook":["Assam CEE chapter outlook: PYQ frequency and weightage","Review published chapter-level PYQ counts, average yearly frequency, recurrence and weightage for Physics, Chemistry and Mathematics. The outlook helps students plan revision using historical evidence while keeping full syllabus coverage in view.","Priority labels are study-planning signals, not guaranteed 2027 question counts. SmartPrep Axom's public website intelligence tools are free to use without login or signup."]
};
const faqData={
 "/previous-papers":[["Can I access the Assam CEE PYQ archive without login?","Yes. Public SmartPrep Axom website resources, including published PYQ archive entries, can be accessed without login or signup."],["Can I download a previous-year paper?","Yes. Where a paper is published and a downloadable file is available, use its download link on the archive page."],["Are all Assam CEE years available?","Only papers currently published in the archive are shown. Availability depends on uploaded and published records."],["Are mock tests and chapter practice free on the website?","The website's public resources are free. Expanded chapter practice, subject-wise tests and full mock tests are available in the Android app, with optional low-cost paid plans."]],
 "/exam-guide":[["Where should I check the Assam CEE exam date?","Check the latest official ASTU notification for confirmed dates and application updates."],["Where can I find Assam CEE previous-year papers?","Browse the SmartPrep Axom PYQ archive for papers currently published and available to download."],["Does SmartPrep Axom require website signup?","No. Public resources on the SmartPrep Axom website are accessible without login or signup."],["Are rank and college predictions guaranteed?","No. Predictors use historical references and are indicative only. Confirm admissions through official counselling notices."]]
};
function staticSeoBody(path,title,description){
 const custom=seoContent[path];
 const heading=custom?custom[0]:title.replace(/ \\| SmartPrep Axom$/,'');
 const paragraphs=custom?custom.slice(1):[description,"Explore relevant SmartPrep Axom resources for Assam CEE preparation. Public website tools and information are available without login or signup. Check official ASTU and DTE Assam notices for current examination and admission rules."];
 const links=[["Free PYQ archive","/previous-papers"],["Chapter-wise practice","/practice"],["CEE intelligence","/analytics"],["CEE Chapter Outlook","/cee-outlook"],["Android app and optional low-cost plans","/app"]];
 const faq=faqData[path];
 const faqHtml=faq?'<section aria-labelledby="seo-faq"><h2 id="seo-faq">Frequently asked questions</h2>'+faq.map(function(pair){return '<h3>'+esc(pair[0])+'</h3><p>'+esc(pair[1])+'</p>';}).join('')+'</section><script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(function(pair){return {"@type":"Question",name:pair[0],acceptedAnswer:{"@type":"Answer",text:pair[1]}};})})+'</script>':'';
 return '<main class="container page" aria-label="'+esc(title)+'"><h1>'+esc(heading)+'</h1>'+paragraphs.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+'<nav aria-label="Related SmartPrep Axom resources"><h2>Explore more free resources</h2><ul>'+links.map(function(pair){return '<li><a href="'+pair[1]+'">'+esc(pair[0])+'</a></li>';}).join('')+'</ul></nav>'+faqHtml+'</main>';
}
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
 html=html.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/,'<div id="root">'+staticSeoBody(path,title,description)+'</div>'+"\n"+'    <script type="module"');
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
