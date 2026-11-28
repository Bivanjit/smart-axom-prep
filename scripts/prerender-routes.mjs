import {mkdir,readFile,writeFile} from "node:fs/promises";
import {dirname,join} from "node:path";

const origin="https://smartprep-axom.pages.dev";
const routes=[
 ["/about","About SmartPrep Axom","Learn about SmartPrep Axom, an independent Assam CEE preparation project and its study resources."],
 ["/about-developer","About the Developer | SmartPrep Axom","Read the story behind SmartPrep Axom: an independent Assam CEE preparation project built by an aspirant to make useful study resources easier to access and affordable."],
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
 ["/copyright","Copyright Policy | SmartPrep Axom","Read the SmartPrep Axom copyright and content policy."],
 ["/assam-cee-dates","Assam CEE 2027 Exam Dates and Schedule | SmartPrep Axom","Check the official Assam CEE 2027 notification status and follow application, admit card, exam, answer key and result updates."],
 ["/assam-cee-admit-card","Assam CEE 2027 Admit Card Download Guide | SmartPrep Axom","Find official admit-card links, download steps, details to verify and exam-day preparation guidance."],
 ["/assam-cee-result","Assam CEE 2027 Result and Rank Card | SmartPrep Axom","Find official ASTU result and rank-card links, merit-list guidance and next steps after results."],
 ["/assam-cee-counselling","Assam CEE 2027 Counselling, Rounds and Seat Allotment | SmartPrep Axom","Understand DTE Assam counselling registration, documents, choice filling, allotment rounds and reporting."],
 ["/assam-engineering-colleges","Assam Engineering Colleges, Branches and Rankings | SmartPrep Axom","Explore Assam government engineering colleges, official branch availability, NIRF ranks and comparison guidance."],
 ["/assam-cee-seat-matrix","Assam CEE Seat Matrix and Branch Intake | SmartPrep Axom","Find official DTE Assam seat-intake and vacancy documents and learn how to verify branch availability."],
 ["/assam-cee-choice-filling","Assam CEE Choice Filling Strategy | SmartPrep Axom","Learn how to order Assam CEE college and branch preferences using eligibility and historical cutoffs."],
 ["/assam-cee-pyq","Assam CEE Previous Year Question Papers 2018–2026 PDF & Solutions | SmartPrep Axom","Browse published Assam CEE previous-year question papers, answer-key references and free public PYQ downloads."],
 ["/assam-cee-chapter-wise-pyq","Assam CEE Chapter-Wise PYQs for Physics, Chemistry & Maths | SmartPrep Axom","Organise Assam CEE Physics, Chemistry and Mathematics PYQs by chapter and review historical trends."],
 ["/assam-cee-marks-vs-rank","Assam CEE Marks vs Rank & AEC JEC Cutoff | SmartPrep Axom","Understand marks versus rank and compare verified historical AEC and JEC cutoffs by branch, category and round."],
 ["/how-to-crack-assam-cee","How to Crack Assam CEE 2027: Study Plan & Best Books | SmartPrep Axom","A practical Assam CEE study plan with 90-day and 30-day roadmaps, PYQ practice and mock review."],
 ["/assam-cee-spot-counselling","Assam CEE Spot Counselling: Vacancies, Eligibility & Documents | SmartPrep Axom","Understand DTE Assam spot counselling, vacancy lists, eligibility and current-year document checks."],
 ["/blog/assam-cee-marks-vs-rank-cse-aec-jec","Assam CEE 2027 Marks vs Rank for AEC & JEC CSE | SmartPrep Axom","A source-led guide to AEC and JEC CSE cutoffs and why fixed score guarantees are misleading."],
 ["/blog/repeated-chapters-assam-cee","Repeated Chapters in Assam CEE: PYQ Analysis | SmartPrep Axom","Review recurring PCM chapters in available Assam CEE PYQs without treating unverified counts as predictions."],
 ["/blog/assam-cee-vs-jee-main","Assam CEE vs JEE Main: Difficulty, Syllabus & Preparation | SmartPrep Axom","Compare Assam CEE and JEE Main using official exam bulletins, syllabus and admission pathways."],
 ["/blog/avoid-negative-marking-assam-cee","Avoid Negative Marking in Assam CEE OMR: 7 Tips | SmartPrep Axom","Seven practical habits for MCQ decisions, OMR accuracy and negative-marking review."],
 ["/blog/assam-government-engineering-colleges-seat-matrix","Assam Government Engineering Colleges & Seat Matrix | SmartPrep Axom","Explore Assam government engineering colleges and how to verify current DTE seat matrices and branches."],
 ["/blog/dte-assam-btech-counselling-documents-prc-choice-filling","DTE Assam B.Tech Counselling: Documents, PRC & Choice Filling | SmartPrep Axom","A detailed DTE Assam counselling guide to documents, PRC, category certificates and choice filling."],
 ["/assam-cee-2027","Assam CEE 2027: Complete Exam Guide | SmartPrep Axom","Assam CEE 2027 guide with verified 2026 pattern, official updates, syllabus references and free PYQs."],
 ["/assam-cee-exam-pattern","Assam CEE Exam Pattern and Marking Scheme | SmartPrep Axom","Official 2026 Assam CEE pattern: 120 MCQs, 40 each in PCM, three hours and +4/-1 marking."],
 ["/assam-cee-syllabus","Assam CEE Syllabus: Physics, Chemistry and Mathematics | SmartPrep Axom","Browse the SmartPrep Axom PCM chapter planning index, Class 11 and 12 topics and PYQ references."],
 ["/assam-cee-cutoff","Assam CEE College Cutoff: Verified Historical Ranks | SmartPrep Axom","Explore verified Assam engineering college closing-rank records for 2023 and 2024."],
 ["/assam-cee-strategy","Assam CEE 2027 Preparation Strategy | SmartPrep Axom","A practical Assam CEE strategy with a sample three-hour PCM time split and negative-marking discipline."],
 ["/assam-cee-mock-test","Assam CEE 2027 Mock Test: Free Practice Guide | SmartPrep Axom","Find Assam CEE mock-test guidance, free public PYQ papers and available SmartPrep Axom app test-series options."],
 ["/assam-cee-rank-predictor","Assam CEE 2027 Rank Predictor and Marks vs Rank | SmartPrep Axom","Explore indicative Assam CEE marks-versus-rank estimates and understand their limitations."],
 ["/assam-cee-college-predictor","Assam CEE College Predictor: AEC, JEC and Cutoffs | SmartPrep Axom","Compare available verified historical Assam CEE college cutoff references for AEC, JEC and other institutes."],
 ["/cee-tools","Assam CEE Workspace | SmartPrep Axom","Open SmartPrep Axom daily practice, chapter intelligence, college planning and preparation tools."],
 ["/daily-10","Assam CEE Daily 10 Challenge | SmartPrep Axom","Attempt the published daily Assam CEE question challenge when available."],
 ["/practice-arena","Assam CEE Practice Arena | SmartPrep Axom","Explore available Assam CEE practice entry points and the chapter catalogue."],
 ["/my-college-path","Assam CEE My College Path | SmartPrep Axom","Organise a personal Assam engineering college and branch preference list."],
 ["/chapter-intelligence","Assam CEE Chapter Intelligence | SmartPrep Axom","Review published chapter-wise Assam CEE historical question analytics."],
 ["/question-finder","Assam CEE Question Finder | SmartPrep Axom","Search available Assam CEE question records by subject, chapter and year."],
 ["/admission-navigator","Assam CEE Admission Navigator | SmartPrep Axom","Organise counselling preparation and official-source checks."],
 ["/my-cee-journey","My Assam CEE Preparation Journey | SmartPrep Axom","Track personal Assam CEE preparation milestones in this browser."],
 ["/my-target-card","Assam CEE Target Card Generator | SmartPrep Axom","Create a personal Assam CEE target card."],
 ["/app/features","SmartPrep Axom Android App Features","Explore Android app learning, practice and revision features."],
 ["/cee-outlook","Assam CEE Chapter Outlook | SmartPrep Axom","Explore available historical chapter question trends and revision priorities."]
];
for(let y=2018;y<=2026;y++) routes.push(["/previous-papers/"+y,"Assam CEE "+y+" Question Paper – Free PDF Download | SmartPrep Axom","Download the published Assam CEE "+y+" question paper PDF free, without login or signup."]);

const seoContent={
  "/assam-cee-pyq":["Assam CEE previous-year question papers and solutions","The SmartPrep Axom public paper archive currently lists published year pages for 2018–2026. It does not claim that every paper from 2015–2026 or a complete solution set is available.","Use the official ASTU previous-year paper page alongside the SmartPrep archive. Download availability depends on the paper records published in the database."],
  "/assam-cee-chapter-wise-pyq":["Assam CEE chapter-wise PYQs for Physics, Chemistry and Mathematics","Organise published question records by syllabus chapter and subject. The current chapter list is a study index, not a guarantee of future questions.","Review actual paper coverage and dataset notes before interpreting chapter frequency. Maintain complete syllabus coverage."],
  "/assam-cee-marks-vs-rank":["Assam CEE marks vs rank and AEC JEC cutoffs","SmartPrep's current verified cutoff dataset contains closing-rank records for 2023 and 2024, not a verified marks-to-rank conversion table.","Compare AEC and JEC by exact branch, category, seat type and counselling round. Do not treat any unverified marks band as a guaranteed CSE cutoff."],
  "/how-to-crack-assam-cee":["How to crack Assam CEE 2027: study plan and best books","Build a plan around the latest ASTU brochure, ASSEB Division II textbooks, NCERT, timed PYQs and error analysis.","Use the 90-day and 30-day roadmap as adaptable study frameworks, not guaranteed result formulas."],
  "/assam-cee-spot-counselling":["Assam CEE spot counselling: vacancies and documents","DTE Assam published a specific CEE-2026 spot-counselling notice. That historical notice does not confirm a 2027 spot round.","Check the current DTE notice for venue or portal, eligibility, vacancy list, original documents, fee and reporting deadline."],
  "/blog/assam-cee-marks-vs-rank-cse-aec-jec":["Assam CEE 2027 marks vs rank for CSE at AEC and JEC","There is no fixed score that guarantees CSE at AEC or JEC. Compare verified historical closing ranks by branch, category and round.","SmartPrep's verified cutoff release currently covers 2023 and 2024 and does not provide a verified marks-to-rank conversion."],
  "/blog/repeated-chapters-assam-cee":["Repeated chapters in Assam CEE: PYQ analysis","SmartPrep's public year-wise archive currently lists 2018–2026. It does not claim a complete ten-year 2015–2026 tagged dataset.","Use CEE Chapter Outlook for published counts and check coverage notes. Historical frequency is not a prediction."],
  "/blog/assam-cee-vs-jee-main":["Assam CEE vs JEE Main: difficulty and syllabus","ASTU's CEE brochure and NTA's JEE Main information bulletin define the respective formats and syllabi.","Compare documents from the same admission year and prepare with exam-specific papers and timing."],
  "/blog/avoid-negative-marking-assam-cee":["How to avoid negative marking in Assam CEE OMR","The ASTU 2025 brochure specifies +4 for a correct answer and −1 for an incorrect answer. Confirm the current-year rules in the next brochure.","Use seven practical habits: read carefully, eliminate with reasons, separate confident attempts, set an attempt threshold, transfer OMR accurately, audit bubbles and review errors."],
  "/blog/assam-government-engineering-colleges-seat-matrix":["Government engineering colleges under Assam CEE and seat matrix","DTE references list AEC, JEC, JIST, BBEC, BVEC, Golaghat Engineering College and Dhemaji Engineering College among state engineering institutions.","The 2027 seat matrix must be checked in the current DTE notice. Do not carry historical intake forward as a current seat count."],
  "/blog/dte-assam-btech-counselling-documents-prc-choice-filling":["DTE Assam B.Tech counselling documents, PRC and choice filling","DTE's 2025 guidelines list age proof, qualifying examination marksheet and Assam PRC among core documents for the applicable process, with category-specific certificates where relevant.","The current admission notice controls the final document list, PRC exceptions, validity dates, choice filling and spot-round process."],

  "/assam-cee-dates":["Assam CEE 2027 dates and schedule","As of 28 November 2026, ASTU has not published an official Assam CEE 2027 examination schedule on its CEE notices page. Dates shown elsewhere should be treated as estimates until ASTU confirms them.","Track the notification, application window, fee deadline, admit card, exam date, answer key and result. Check ASTU for examination notices and DTE Assam for admission and counselling notices."],
  "/assam-cee-admit-card":["Assam CEE 2027 admit card download guide","The Assam CEE 2027 admit-card release has not been officially announced. When the link is published, download the hall ticket through the official ASTU website and follow the current-year instructions.","Check your name, photograph, application details, exam centre, date and reporting time. Carry the documents and stationery specified in the official instructions. Never share passwords or application credentials publicly."],
  "/assam-cee-result":["Assam CEE 2027 result, rank card and merit list","The Assam CEE 2027 result date has not been announced. ASTU's official CEE page currently lists CEE 2026 result and rank-card information.","When released, use the official ASTU result link, save the rank card and follow the current DTE Assam counselling notice. A predictor estimate is not an official rank or seat allotment."],
  "/assam-cee-counselling":["Assam CEE 2027 counselling, rounds and seat allotment","ASTU conducts the entrance examination. DTE Assam publishes B.Tech admission notices, counselling information, institution and branch preference documents, intake capacity and vacancy notices.","The number and format of 2027 rounds are not confirmed. Follow the current DTE notice for registration, documents, choice filling, locking, allotment, acceptance, reporting and any spot round."],
  "/assam-engineering-colleges":["Assam engineering colleges, branches and published rankings","DTE Assam's institutional directory lists Assam Engineering College, Barak Valley Engineering College, Bineswar Brahma Engineering College, Dhemaji Engineering College, Golaghat Engineering College, Jorhat Institute of Science and Technology and Jorhat Engineering College. Its 2026 intake PDF lists AEC with Civil, Electrical, Mechanical, Chemical, Electronics and Telecommunication, Computer Science, Industrial and Production, and Instrumentation; JEC with Civil, Electrical, Mechanical, Computer Science and Instrumentation; JIST with Power Electronics and Instrumentation, Electronics and Telecommunication, Civil and Mechanical; BBEC with Electrical, Chemical, Mechanical and Civil; BVEC with Computer Science and Electronics and Telecommunication; and Golaghat Engineering College with Civil, Mechanical and Chemical.","These are 2026 intake references, not a 2027 seat matrix. Confirm current-year branches and intake with DTE. NIRF 2025 Engineering lists IIT Guwahati at national rank 8 and NIT Silchar at rank 50. Do not assign invented NIRF ranks to colleges without an individual published rank."],
  "/assam-cee-seat-matrix":["Assam CEE seat matrix, branch intake and vacancies","The 2027 seat matrix was not available in the official DTE documents checked on 28 November 2026. DTE's 2026 counselling page provides historical intake-capacity, institution and branch preference, and round-specific vacancy documents.","A seat matrix and a later-round vacancy list are different documents. Confirm institution, branch, intake, category, quota, document date and counselling round before making choices."],
  "/assam-cee-choice-filling":["Assam CEE choice filling and college branch preference strategy","Start with the current DTE institution and branch list. Include only combinations shown in the official portal that you are eligible for and would genuinely accept.","Use verified 2023 and 2024 cutoff records as historical context. Put preferences in your real order, save and lock them according to the current portal instructions, and keep the final confirmation."],

  "/practice": [
    "Free Assam CEE 2027 chapter-wise practice",
    "Explore the Physics, Chemistry and Mathematics chapter catalogue for Assam CEE preparation. SmartPrep Axom's public website resources are free to access and do not require login or signup. Browse the available chapter outlines, identify important concepts and use linked intelligence tools to review historical question trends. Expanded chapter practice, subject-wise tests and full mock tests are available in the Android app, with optional low-cost membership plans.",
    "Start with the subject you want to strengthen, then use CEE Chapter Outlook and PYQ Intelligence to plan revision. The chapter catalogue is a study-planning aid; verify the current official syllabus when ASTU publishes the 2027 brochure."
  ],
  "/previous-papers": [
    "Assam CEE previous year question papers and free PYQ archive",
    "Browse Assam CEE previous-year papers published in the SmartPrep Axom archive. Select an examination year and download the available paper directly. The public website archive is free to access: no login, no signup and no account creation are required.",
    "Use previous-year papers to become familiar with question styles, subject balance and time management. Paper availability depends on what has been uploaded and published in the archive; this page does not claim that every year or every paper is available. For extra chapter practice, subject-wise tests and full-length mock tests, explore the SmartPrep Axom Android app. Optional paid app features are offered through low-cost plans; check the app for current prices and access details."
  ],
  "/test-series": [
    "Assam CEE 2027 mock test and test-series information",
    "Understand the Assam CEE paper format and explore the SmartPrep Axom mock-test pathway. The public website provides preparation information and reference tools without login or signup. Full-length mock tests, subject-wise tests and expanded chapter practice are available in the Android app according to the published app plan.",
    "Use the official ASTU brochure as the final authority for the 2027 examination pattern. Historical exam format information is labelled by year and should not be treated as a confirmed 2027 notification."
  ],
  "/exam-guide": [
    "Assam CEE 2027 exam guide, syllabus, preparation and admission references",
    "This independent Assam CEE guide brings together exam-pattern references, syllabus navigation, previous-year question resources, chapter intelligence and admission-planning links for students in Assam. SmartPrep Axom's public website resources are free to explore without login or signup.",
    "Check the latest ASTU notification for exam dates, eligibility, application details, admit cards, syllabus and marking rules. For admission and counselling, verify current DTE Assam notices, seat matrix and category rules. Historical cutoffs and rank estimates are planning references, not guarantees of allotment."
  ],
  "/analytics/pyq-analysis": [
    "Assam CEE chapter-wise PYQ analysis and question trends",
    "Explore published Assam CEE previous-year question analysis by subject and chapter. Review question frequency, recurrence, difficulty labels and weightage where records are available. Use these trends to prioritise revision while continuing to cover the complete syllabus.",
    "The analysis reflects the dataset currently published by SmartPrep Axom. Historical frequency is not a promise that a chapter will appear in the next examination. Website intelligence tools are free to access without login or signup."
  ],
  "/analytics/cee-2027-predictions": [
    "Assam CEE 2027 chapter priority and preparation outlook",
    "Use historical Assam CEE question trends to build a practical revision outlook for Physics, Chemistry and Mathematics. Chapter priority signals help organise study time; they are not guaranteed predictions of the 2027 question paper.",
    "Review underlying PYQ analysis, compare chapter recurrence and complete the full syllabus. SmartPrep Axom's public intelligence resources are free to use without login or signup."
  ],
  "/predictor/rank": [
    "Assam CEE marks and rank predictor reference",
    "Explore an indicative Assam CEE rank estimate using historical references and assumptions displayed by the predictor. Results are planning estimates only: actual rank depends on the official examination, candidate performance and merit list.",
    "Use the result alongside official ASTU merit information and current DTE Assam counselling notices. SmartPrep Axom provides public website tools without login or signup; no predictor can guarantee a rank or admission."
  ],
  "/predictor/college": [
    "Assam CEE college predictor and historical cutoff explorer",
    "Compare your expected Assam CEE rank with published historical college and branch closing-rank references. Use results to prepare a preference shortlist, then confirm current seat availability, category rules and counselling rounds through official DTE Assam notices.",
    "Historical cutoffs are not current vacancies and cannot guarantee allotment. SmartPrep Axom's public website predictors and reference tools are free to explore without login or signup."
  ],
  "/analytics": [
    "Assam CEE intelligence: PYQ trends, chapter weightage and admission references",
    "Explore SmartPrep Axom's Assam CEE intelligence tools for chapter-wise previous-year question trends, exam difficulty references, chapter outlook, rank estimates and college cutoff comparisons. Public website tools are free to access without login or signup.",
    "Use historical data as a revision and planning aid, not as a guarantee of future questions or admission. Confirm examination rules and counselling details through ASTU and DTE Assam."
  ],
  "/cee-outlook": [
    "Assam CEE chapter outlook: PYQ frequency and weightage",
    "Review published chapter-level PYQ counts, average yearly frequency, recurrence and weightage for Physics, Chemistry and Mathematics. The outlook helps students plan revision using historical evidence while keeping full syllabus coverage in view.",
    "Priority labels are study-planning signals, not guaranteed 2027 question counts. SmartPrep Axom's public website intelligence tools are free to use without login or signup."
  ],
  "/assam-cee-2027": [
    "Assam CEE 2027 complete guide",
    "Assam CEE is conducted by ASTU for B.Tech admission in Assam. The official 2026 brochure confirms a three-hour, 120-question paper with 40 questions each in Mathematics, Physics and Chemistry. Correct answers carried four marks and incorrect answers lost one mark.",
    "As of 27 November 2026, 2027 application and examination dates are awaiting official ASTU notification. Check ASTU notices for confirmed dates, eligibility, syllabus and final rules."
  ],
  "/assam-cee-exam-pattern": [
    "Assam CEE exam pattern and marking scheme",
    "The official ASTU CEE 2026 brochure specifies one paper of 120 MCQs and three hours. Mathematics, Physics and Chemistry each had 40 questions, for 480 marks in total.",
    "The 2026 marking scheme was +4 for a correct answer and −1 for an incorrect answer. These are historical rules, not a guarantee of the 2027 format."
  ],
  "/assam-cee-syllabus": [
    "Assam CEE syllabus chapter index for Physics, Chemistry and Mathematics",
    "Browse the SmartPrep Axom Class 11 and 12 PCM planning catalogue. It is a study-navigation aid, not an official 2027 syllabus.",
    "The official CEE 2026 brochure states that the exam followed the ASSEB Division II (Higher Secondary Division) syllabus. Confirm current chapter coverage with the 2027 ASTU brochure."
  ],
  "/assam-cee-cutoff": [
    "Assam CEE college cutoff: verified historical admission data",
    "The SmartPrep Axom database currently contains 695 source-verified cutoff rows: 375 for 2023 and 320 for 2024. The verified public dataset does not yet cover all years from 2017 to 2026.",
    "Records are organised by college, branch, category, counselling round and seat type. Historical closing ranks are not guarantees of future admission."
  ],
  "/assam-cee-strategy": [
    "Assam CEE 2027 preparation strategy and time management",
    "Use the official 2026 three-hour, 120-question paper as a historical timed-practice framework. One possible practice allocation is 45 minutes Chemistry, 55 minutes Physics, 70 minutes Mathematics and 10 minutes review.",
    "This is a suggested training split, not an official exam rule. Adjust it using your own timed-test accuracy and speed."
  ],
  "/previous-papers/2026": [
    "Assam CEE 2026 question paper PDF download",
    "Download the Assam CEE 2026 question paper PDF from the SmartPrep Axom public archive. The published paper is a free PDF with no login or signup. The paper follows the 2026 format: 120 multiple-choice questions across Physics, Chemistry and Mathematics, with 40 questions per subject, a three-hour duration and 480 maximum marks.",
    "Use the original PDF to practise the paper under timed conditions. The 2026 marking scheme was +4 for a correct answer, −1 for an incorrect answer and 0 for an unattempted question. This page provides the published PDF; it does not claim to provide interactive question-by-question solutions."
  ],
  "/assam-cee-mock-test": [
    "Free Assam CEE 2027 mock-test guide and practice options",
    "Use the SmartPrep Axom public website to read the verified exam-format guide, browse published Assam CEE previous-year papers and explore preparation resources without login or signup. The public website does not claim that a full interactive mock-test engine is available here.",
    "Full-length mock tests, subject-wise tests and expanded practice are offered through the Android app according to the current plan. Check the app for current price, validity and inclusions. Confirm the 2027 exam pattern with the latest ASTU brochure."
  ],
  "/assam-cee-rank-predictor": [
    "Assam CEE 2027 rank predictor and marks-versus-rank reference",
    "Explore an indicative Assam CEE marks-to-rank estimate using the assumptions and historical references displayed by the SmartPrep Axom predictor. The output is a planning estimate, not an official merit position.",
    "Actual rank depends on the current paper, candidate score distribution, tie-break rules and the official ASTU merit list. Use the estimate as a rough guide only and verify results through official notices."
  ],
  "/assam-cee-college-predictor": [
    "Assam CEE college predictor for AEC, JEC and other engineering colleges",
    "Compare available verified historical Assam CEE college cutoff records by institution, branch, category and counselling round. The current verified reference release covers 2023 and 2024 records; it is not a live seat matrix.",
    "Historical closing ranks do not guarantee future allotment. Confirm current DTE Assam seat availability, eligibility, category rules and counselling schedules before preparing a preference list."
  ],
  "/about": [
    "Built by a student, for every Assam CEE aspirant",
    "SmartPrep Axom began as a student-built project with a simple goal: make useful Assam CEE preparation resources easier to find without clutter or forced website signup. The public website brings together exam guides, published PYQ downloads and reference tools for Physics, Chemistry and Mathematics.",
    "The project is being developed for students across Assam, including those using slower mobile connections. English and Assamese learning support is available where the relevant content has been prepared. Public website resources are free; optional app plans and current inclusions are described in the app before activation."
  ],
  "/faq": [
    "SmartPrep Axom FAQ: free Assam CEE resources, PYQs and predictors",
    "Find clear answers about free public website access, Assam CEE previous-year papers, Assamese learning support, rank estimates, college cutoffs and optional Android app plans.",
    "SmartPrep Axom is an independent educational preparation project. Verify examination details with ASTU and counselling information with DTE Assam."
  ]
};
const faqData={
  "/assam-cee-pyq":[["Which years are currently listed?","The SmartPrep public archive currently lists 2018–2026. It does not claim all 2015–2017 papers are available."],["Are every paper and solution available?","Only published paper records and solutions should be treated as available."],["Can I access the public archive without login?","Yes. Published public website resources are free without login or signup."]],
  "/assam-cee-chapter-wise-pyq":[["Do chapter-wise PYQs predict the next paper?","No. Historical frequency is a revision signal, not a guarantee of future questions."],["Should I skip less frequent chapters?","No. Keep complete syllabus coverage and use PYQs to guide revision order."]],
  "/assam-cee-marks-vs-rank":[["Does a particular score guarantee AEC CSE?","No. Actual admission depends on official merit rank, category, eligibility, seats and counselling."],["Does SmartPrep publish verified marks-to-rank data?","The current verified dataset contains 2023 and 2024 closing ranks, not a verified score-to-rank conversion."]],
  "/how-to-crack-assam-cee":[["Which books should I start with?","Start with the prescribed ASSEB Division II and NCERT textbooks, then add one reliable practice source."],["Can a 30-day plan guarantee success?","No. A short plan organises revision; results depend on starting level, coverage and effort."]],
  "/assam-cee-spot-counselling":[["Will there definitely be a 2027 spot round?","No. A spot round happens only if DTE Assam publishes a notice for that admission cycle."],["Does a vacancy screenshot confirm a seat?","No. Verify the live official vacancy list and follow the notice's reporting instructions."]],

  "/assam-cee-dates":[["Has Assam CEE 2027 been announced?","No official 2027 schedule was visible on ASTU's CEE notice page when checked on 28 November 2026."],["Where are confirmed dates published?","ASTU publishes examination notices. DTE Assam publishes admission and counselling notices."]],
  "/assam-cee-admit-card":[["Is the Assam CEE 2027 admit card available?","No official 2027 admit-card release has been announced."],["Where should I download it?","Use the admit-card link published on the official ASTU website."]],
  "/assam-cee-result":[["Where will Assam CEE 2027 results be published?","Check ASTU's official CEE notices page for the result and rank-card link."],["Is a rank predictor an official rank?","No. Only the official ASTU merit result establishes the candidate's rank."]],
  "/assam-cee-counselling":[["Who conducts Assam CEE counselling?","DTE Assam publishes the state B.Tech admission and counselling notices. ASTU conducts the entrance examination."],["How many counselling rounds will there be in 2027?","The 2027 round schedule has not been announced. Follow the current DTE admission notice."]],
  "/assam-engineering-colleges":[["Does every college offer every branch?","No. Branches and intake differ by institution and year. Check the current DTE seat matrix."],["Which Assam colleges have NIRF Engineering ranks?","NIRF 2025 lists IIT Guwahati at national rank 8 and NIT Silchar at national rank 50."]],
  "/assam-cee-seat-matrix":[["Has the 2027 seat matrix been released?","No 2027 seat matrix was available in the official DTE material checked on 28 November 2026."],["Are seat matrix and vacancy list the same?","No. The seat matrix describes intake or seat distribution, while a vacancy list reports remaining seats at a particular counselling stage."]],
  "/assam-cee-choice-filling":[["Should I put my preferred college first?","Order acceptable choices by your genuine preference, after confirming eligibility and current branch availability."],["Can I change choices after locking?","Only if the current counselling rules provide an edit or unlock window. Check the official schedule."]],

  "/previous-papers": [
    [
      "Can I access the Assam CEE PYQ archive without login?",
      "Yes. Public SmartPrep Axom website resources, including published PYQ archive entries, can be accessed without login or signup."
    ],
    [
      "Can I download a previous-year paper?",
      "Yes. Where a paper is published and a downloadable file is available, use its download link on the archive page."
    ],
    [
      "Are all Assam CEE years available?",
      "Only papers currently published in the archive are shown. Availability depends on uploaded and published records."
    ],
    [
      "Are mock tests and chapter practice free on the website?",
      "The website's public resources are free. Expanded chapter practice, subject-wise tests and full mock tests are available in the Android app, with optional low-cost paid plans."
    ]
  ],
  "/exam-guide": [
    [
      "Where should I check the Assam CEE exam date?",
      "Check the latest official ASTU notification for confirmed dates and application updates."
    ],
    [
      "Where can I find Assam CEE previous-year papers?",
      "Browse the SmartPrep Axom PYQ archive for papers currently published and available to download."
    ],
    [
      "Does SmartPrep Axom require website signup?",
      "No. Public resources on the SmartPrep Axom website are accessible without login or signup."
    ],
    [
      "Are rank and college predictions guaranteed?",
      "No. Predictors use historical references and are indicative only. Confirm admissions through official counselling notices."
    ]
  ],
  "/assam-cee-2027": [
    [
      "Has Assam CEE 2027 been officially announced?",
      "The 2027 examination schedule and detailed rules have not been confirmed in the official ASTU material checked for this guide. Check ASTU notices for the next announcement."
    ],
    [
      "What was the Assam CEE exam pattern in 2026?",
      "The official 2026 brochure specifies one three-hour paper with 120 MCQs: 40 Mathematics, 40 Physics and 40 Chemistry. Correct answers carry four marks and wrong answers lose one mark."
    ]
  ],
  "/assam-cee-exam-pattern": [
    [
      "How many questions were in Assam CEE 2026?",
      "The official CEE 2026 brochure specifies 120 multiple-choice questions in one three-hour paper."
    ],
    [
      "Is the same pattern confirmed for Assam CEE 2027?",
      "No 2027 pattern should be treated as final until ASTU publishes the 2027 information brochure."
    ]
  ],
  "/assam-cee-syllabus": [
    [
      "Which syllabus did Assam CEE 2026 follow?",
      "The official CEE 2026 brochure states that the examination followed the ASSEB Division II (Higher Secondary Division) syllabus."
    ],
    [
      "Is this the official Assam CEE 2027 syllabus?",
      "No. It is a SmartPrep Axom planning catalogue. Confirm the 2027 official syllabus with ASTU and ASSEB."
    ]
  ],
  "/assam-cee-cutoff": [
    [
      "Which years are covered by verified cutoff data?",
      "The current verified dataset contains 375 records for 2023 and 320 records for 2024."
    ],
    [
      "Does a previous closing rank guarantee admission next year?",
      "No. Cutoffs vary with seat intake, preferences, category, quota, counselling round and merit position."
    ]
  ],
  "/assam-cee-strategy": [
    [
      "How should I divide three hours between PCM?",
      "One possible practice split is 45 minutes Chemistry, 55 minutes Physics, 70 minutes Mathematics and 10 minutes for review."
    ],
    [
      "Should I skip chapters with fewer PYQs?",
      "No. Historical frequency can guide revision order, but it cannot guarantee future questions."
    ]
  ],
  "/previous-papers/2026": [
    [
      "Can I download the Assam CEE 2026 question paper PDF for free?",
      "Yes. The published Assam CEE 2026 question paper PDF is available free from the SmartPrep Axom public archive without login or signup."
    ],
    [
      "What is the Assam CEE 2026 question paper pattern?",
      "The 2026 paper has 120 MCQs: 40 each in Physics, Chemistry and Mathematics, with a three-hour duration and 480 maximum marks."
    ],
    [
      "Does this PDF include interactive question-by-question solutions?",
      "The archive provides the published PDF. Interactive question-by-question records are not currently linked to this paper in the public question bank."
    ]
  ],
  "/faq": [
    [
      "Is SmartPrep Axom free for Assam CEE 2027 preparation?",
      "Public guides, published PYQ downloads and website reference tools are free to access. Some expanded practice and mock-test features are offered through optional Android app plans; check the app for current prices and inclusions."
    ],
    [
      "Do I need to create an account to use the website?",
      "No. Public website pages and published resources can be opened without login or signup. Account-based progress and membership features in the Android app may require sign-in."
    ],
    [
      "Can I practise Assam CEE previous-year question papers without login?",
      "Yes. Published free-access papers in the SmartPrep Axom PYQ archive can be downloaded without creating an account. Only papers currently published in the archive are shown."
    ],
    [
      "Does SmartPrep Axom support Assamese?",
      "The platform supports English and Assamese learning content where available. Language availability can vary by page, question and app feature."
    ],
    [
      "Does the Assam CEE rank or college predictor guarantee admission?",
      "No. Rank estimates and college comparisons are indicative tools based on historical data and assumptions. Always verify current merit lists, seat matrices, eligibility and counselling rules through ASTU and DTE Assam."
    ]
  ],
  "/assam-cee-mock-test": [
    [
      "Can I take a full Assam CEE mock test directly on the website?",
      "The public website provides exam guides, published PYQ PDFs and reference tools. Full-length mock tests and expanded test-series access are offered through the Android app according to the current plan."
    ],
    [
      "Can I practise Assam CEE questions without login?",
      "Yes. Public guides and published PYQ downloads are available without login or signup."
    ],
    [
      "What is the Assam CEE 2026 paper format?",
      "The official 2026 brochure specifies 120 MCQs, 40 each in Mathematics, Physics and Chemistry, a three-hour duration and +4/−1 marking. Confirm the 2027 format with ASTU."
    ]
  ],
  "/assam-cee-rank-predictor": [
    [
      "How accurate is the Assam CEE 2027 rank predictor?",
      "It is an indicative planning estimate, not an official rank. Historical references may not represent every candidate or tie-break rule."
    ],
    [
      "Does the predictor guarantee my Assam CEE rank?",
      "No. Only the official ASTU merit list establishes a candidate's rank."
    ],
    [
      "Can expected marks be converted into a guaranteed rank?",
      "No. Marks-to-rank relationships vary with paper difficulty, candidate performance and merit distribution."
    ]
  ],
  "/assam-cee-college-predictor": [
    [
      "Can I check AEC and JEC Assam CEE cutoffs?",
      "The college tools compare available verified historical cutoff records by institution, branch, category and round. Coverage currently includes verified 2023 and 2024 records."
    ],
    [
      "Does a previous AEC or JEC closing rank guarantee admission?",
      "No. Historical closing ranks are not current vacancies or allotment guarantees."
    ],
    [
      "Where can I verify current Assam CEE counselling rules?",
      "Use the latest DTE Assam counselling notice, official seat matrix and ASTU merit information before preparing a preference list."
    ]
  ],
  "/about": [
    [
      "Who built SmartPrep Axom?",
      "SmartPrep Axom is a student-built independent preparation project focused on Assam CEE."
    ],
    [
      "Can I use public website resources without login?",
      "Yes. Public guides, published PYQ downloads and reference pages are available without website login or signup."
    ],
    [
      "Which subjects does SmartPrep Axom focus on?",
      "The platform focuses on Physics, Chemistry and Mathematics for Assam CEE preparation."
    ],
    [
      "Does SmartPrep Axom provide Assamese content?",
      "English and Assamese learning support is available where the relevant content has been prepared; availability varies by resource."
    ],
    [
      "Is SmartPrep Axom affiliated with ASTU or DTE Assam?",
      "No. It is independent and is not operated by ASTU, DTE Assam or the Government of Assam."
    ]
  ]
};
function staticSeoBody(path,title,description){
 const custom=seoContent[path];
 const heading=custom?custom[0]:title.replace(/ \\| SmartPrep Axom$/,'');
 const paragraphs=custom?custom.slice(1):[description,"Explore relevant SmartPrep Axom resources for Assam CEE preparation. Public website tools and information are available without login or signup. Check official ASTU and DTE Assam notices for current examination and admission rules."];
 const links=[["Free PYQ archive","/previous-papers"],["Chapter-wise practice","/practice"],["CEE intelligence","/analytics"],["CEE Chapter Outlook","/cee-outlook"],["Android app and optional low-cost plans","/app"]];
 const faq=faqData[path];
 const paper2026=path==="/previous-papers/2026";
 const pdfUrl="https://yydstdwknkgqelbxnvre.supabase.co/storage/v1/object/public/pyq-papers/2026/1795620386027-cee-2026.pdf";
 const paperHtml=paper2026?'<section aria-labelledby="paper-download"><h2 id="paper-download">Download Assam CEE 2026 question paper PDF</h2><p>The published Assam CEE 2026 paper is available as a free PDF. It contains the complete paper file for offline reading and timed practice.</p><p><strong>Exam format:</strong> 120 MCQs · 40 each in Physics, Chemistry and Mathematics · 180 minutes · 480 maximum marks.</p><p><strong>Marking scheme (2026):</strong> +4 correct · −1 incorrect · 0 unattempted.</p><p><a href="'+pdfUrl+'" rel="noopener" type="application/pdf" aria-label="Download Assam CEE 2026 question paper PDF">Download Assam CEE 2026 Question Paper PDF (Free)</a></p><p><a href="/previous-papers">Browse all Assam CEE previous-year question papers</a></p></section><script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"DigitalDocument","name":"Assam CEE 2026 Question Paper","description":"Published Assam CEE 2026 question paper PDF. Free public download from SmartPrep Axom.","url":origin+path,"encodingFormat":"application/pdf","contentUrl":pdfUrl,"inLanguage":"en"})+'</script>':'';
 const faqHtml=faq?'<section aria-labelledby="seo-faq"><h2 id="seo-faq">Frequently asked questions</h2>'+faq.map(function(pair){return '<h3>'+esc(pair[0])+'</h3><p>'+esc(pair[1])+'</p>';}).join('')+'</section><script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(function(pair){return {"@type":"Question",name:pair[0],acceptedAnswer:{"@type":"Answer",text:pair[1]}};})})+'</script>':'';
 return '<main class="container page" aria-label="'+esc(title)+'"><h1>'+esc(heading)+'</h1>'+paragraphs.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+paperHtml+'<nav aria-label="Related SmartPrep Axom resources"><h2>Explore more free resources</h2><ul>'+links.map(function(pair){return '<li><a href="'+pair[1]+'">'+esc(pair[0])+'</a></li>';}).join('')+'</ul></nav>'+faqHtml+'</main>';
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
 html=setMeta(html,'<meta\\s+name="twitter:title"[^>]*>',`<meta name="twitter:title" content="${esc(title)}" />`);
 html=setMeta(html,'<meta\\s+name="twitter:description"[^>]*>',`<meta name="twitter:description" content="${esc(description)}" />`);
 html=html.replace(/<div id="root">[\s\S]*?<\/div>/,'<div id="root">'+staticSeoBody(path,title,description)+'</div>');
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
