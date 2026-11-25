alter table public.exam_papers add column if not exists source_document_id uuid references public.admission_source_documents(id);
insert into public.engineering_institutions(code,name,city) values
('AEC','Assam Engineering College','Guwahati'),('JEC','Jorhat Engineering College','Jorhat'),('JIST','Jorhat Institute of Science and Technology','Jorhat'),('BBEC','Bineswar Brahma Engineering College','Kokrajhar'),('BVEC','Barak Valley Engineering College','Karimganj'),('DEC','Dhemaji Engineering College','Dhemaji'),('GEC','Golaghat Engineering College','Golaghat')
on conflict(code) do nothing;
insert into public.engineering_branches(code,name) values
('CSE','Computer Science and Engineering'),('ETE','Electronics and Telecommunication Engineering'),('EE','Electrical Engineering'),('ME','Mechanical Engineering'),('CE','Civil Engineering'),('CHE','Chemical Engineering'),('IE','Instrumentation Engineering'),('IPE','Industrial and Production Engineering'),('PEI','Power Electronics and Instrumentation Engineering')
on conflict(code) do nothing;
insert into public.admission_categories(code,name) values
('UR','Unreserved / General'),('OBC_MOBC','OBC / MOBC'),('SC','Scheduled Caste'),('STP','Scheduled Tribe (Plains)'),('STH','Scheduled Tribe (Hills)'),('EWS','Economically Weaker Section'),('TGLC','Tea Garden Labour Community'),('EXTGLC','Ex-Tea Garden Labour Community'),('PH','Persons with Disabilities'),('FF','Freedom Fighter'),('RDP','Retired Defence Personnel'),('NCC','NCC'),('SPORTS','Sports'),('CGE','Central Government Employee'),('KOCH','Koch'),('TAI_AHOM','Tai Ahom'),('CHUTIYA','Chutiya'),('MORAN','Moran'),('MATAK','Matak')
on conflict(code) do nothing;
