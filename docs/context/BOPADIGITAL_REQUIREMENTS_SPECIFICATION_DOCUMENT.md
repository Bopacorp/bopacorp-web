## BOPACORP S.A. Requirements Specification Document 

## by 

## Grupo 2 BOPADIGITAL 

## PROJECT PRESENTED TO ESCUELA SUPERIOR POLITÉCNICA DEL LITORAL 

## GUAYAQUIL, NOVEMBER 13, 2025 

## ESCUELA SUPERIOR POLITÉCNICA DEL LITORAL ESPOL 

Grupo 2 BOPADIGITAL, 2025 

This Creative Commons license allows readers to download this work and share it with others as long as the author is credited. The content of this work cannot be modified in any way or used commercially. 

## **TEAM MEMBERS** 

THIS PROJECT HAS BEEN DEVELOPED 

BY THE FOLLOWING GROUP OF STUDENTS 

Shirley Aragon Facultad de Ingenieria en Electricidad y Computación 

Nahim Díaz 

Facultad de Ingenieria en Electricidad y Computación 

Salvador Muñoz 

Facultad de Ingenieria en Electricidad y Computación 

Gabriel Tumbaco 

Facultad de Ingenieria en Electricidad y Computación 

Anthony Navarrete Facultad de Ingenieria en Electricidad y Computación 

## **TABLE OF CONTENTS** 

||Page|
|---|---|
|CHAPTER 1<br>PURPOSE OF THE PROJECT ................................................1||
|1.1|Problem Description ......................................................................1|
|1.2|Project Description ........................................................................1|
|1.3|Project Purpose ........................................................................... 2|
|CHAPTER 2<br>STAKEHOLDERS ............................................................ 4||
|2.1|Business Client ........................................................................... 4|
|2.2|Sales Advisor ............................................................................. 4|
|2.3|Immediate Supervisor / Sales Manager ................................................. 4|
|2.4|Documentation Coordinator ............................................................. 5|
|2.5|Management / Executive Board ......................................................... 5|
|2.6|Sales Advisor Candidate ................................................................. 5|
|2.7|Web Administrator ....................................................................... 5|
|CHAPTER 3<br>CONSTRAINTS ............................................................... 7||
|3.1|Solution Constraints ...................................................................... 7|
|3.2|Implementation Environment of the Current System ................................... 7|
|CHAPTER 4<br>SCOPE OF THE WORK ...................................................... 8||
|4.1|Public Website ............................................................................ 8|
||4.1.1<br>Hierarchical Service Catalog .................................................. 8|
||4.1.2<br>Detailed Service Information .................................................. 8|
||4.1.3<br>Employment Application Module ............................................. 9|
|4.2|Internal Application (Web and Mobile) ................................................. 9|
||4.2.1<br>Negotiation Management ...................................................... 9|
||4.2.2<br>Negotiation Tracking .......................................................... 9|
||4.2.3<br>Intelligent Reporting ........................................................... 9|
||4.2.4<br>Document Management ...................................................... 10|
|4.3|Scope Summary ......................................................................... 10|
|CHAPTER 5<br>FUNCTIONAL REQUIREMENTS ......................................... 11||
|5.1|Public Website ........................................................................... 12|
||5.1.1<br>Service Catalog and Website Module (CAT) ................................ 12|
||5.1.2<br>Content Management Module (CMS) ....................................... 13|
||5.1.3<br>Employability and Application Module (EMP) ............................. 14|
|5.2|Internal Application ..................................................................... 15|
||5.2.1<br>Client Relationship Management Module (CRM) ........................... 15|
||5.2.2<br>Ofer Matrix Module (MAT) ................................................. 18|
||5.2.3<br>Supervision and Approvals Module (SUP) .................................. 20|
||5.2.4<br>Document Management Module (DOC) ..................................... 21|



II 

|5.2.5<br>Reporting Module (REP) ..................................................... 22|
|---|
|5.2.6<br>Basic Security Module (SEG) ................................................ 24|
|5.2.7<br>Notifcations Module (NOT) ................................................. 25|
|CHAPTER 6<br>NON-FUNCTIONAL REQUIREMENTS .................................. 26|
|CHAPTER 7<br>USER STORIES .............................................................. 33|
|7.1<br>Service Catalog and Website Module (CAT) .......................................... 33|
|7.2<br>Content Management Module (CMS) .................................................. 35|
|7.3<br>Employability and Application Module (EMP) ........................................ 37|
|7.4<br>Client Management Module (CRM) ................................................... 39|
|7.5<br>Ofer Matrix Module (MAT) ........................................................... 46|
|7.6<br>Supervision and Approvals Module (SUP) ............................................ 48|
|7.7<br>Document Management Module (DOC) ............................................... 50|
|7.8<br>Reporting Module (REP) ............................................................... 54|
|CHAPTER 8<br>PROTOTYPE ................................................................. 58|
|8.1<br>Link ...................................................................................... 58|
|CHAPTER 9<br>EVIDENCES .................................................................. 59|
|9.1<br>Requirements Elicitation Technique .................................................... 59|
|9.2<br>Evidence Repository .................................................................... 59|
|CHAPTER 10<br>INDIVIDUAL CONTRIBUTIONS .......................................... 60|
|CHAPTER 11<br>AUTHORSHIP DECLARATION ........................................... 61|
|APPENDIX I<br>PROTOTYPE ................................................................. 62|
|APPENDIX II<br>CLIENT ACCEPTANCE LETTER .......................................... 74|
|APPENDIX III SIGNED AUTORSHIP DECLARATION ................................... 75|



## **LIST OF TABLES** 

|||Page|
|---|---|---|
|Table|5.1|Functional Requirements - Service Catalog and Website (CAT) ........... 12|
|Table|5.2|Functional Requirements - Content Management Module (CMS) ......... 13|
|Table|5.3|Functional Requirements - Employability and Application Module|
|||(EMP) ......................................................................... 14|
|Table|5.4|Functional Requirements - Client Relationship Management Module|
|||(CRM) ......................................................................... 15|
|Table|5.5|Functional Requirements - Ofer Matrix Module (MAT) ................... 18|
|Table|5.6|Functional Requirements - Supervision and Approvals Module (SUP) .... 20|
|Table|5.7|Functional Requirements - Document Management Module (DOC) ...... 21|
|Table|5.8|Functional Requirements - Reporting Module (REP) ...................... 22|
|Table|5.9|Functional Requirements - Basic Security Module (SEG) ................. 24|
|Table|5.10|Functional Requirements - Notifcations Module (NOT) ................... 25|
|Table|6.1|Non-Functional Requirements - BOPADIGITAL System .................. 27|
|Table|10.1|Individual Contributions of the Project ...................................... 60|



## **LIST OF FIGURES** 

|||Page|
|---|---|---|
|Figure|8.1|Prototype of BOPADIGITAL ............................................... 58|
|Figure|9.1|Meeting with the managers of BOPACORP S.A. .......................... 59|
|Figure|I-1|Screenshots of BOPADIGITAL mobile app from the perspective of a|
|||Sales Advisor. ............................................................... 63|
|Figure|I-2|Screenshots of BOPADIGITAL mobile app from the perspective of a|
|||Sales Advisor. ............................................................... 64|
|Figure|I-3|Screenshots of BOPADIGITAL mobile app from the perspective of|
|||Management. ................................................................ 65|
|Figure|I-4|Screenshots of BOPADIGITAL CMS website ............................. 66|
|Figure|I-5|Screenshots of BOPADIGITAL CMS website ............................. 67|
|Figure|I-6|Website from the perspective of a sales advisor candidate. ............... 68|
|Figure|I-7|Screenshots of BOPADIGITAL CRM website for sales consultant ....... 69|
|Figure|I-8|Screenshots of BOPADIGITAL CRM website for sales consultant ....... 70|
|Figure|I-9|Screenshots of BOPADIGITAL CRM form the perspective of|
|||Management.<br>............................................................... 71|
|Figure|I-10|Screenshots of BOPADIGITAL CRM form the perspective of|
|||Management.<br>............................................................... 72|
|Figure|I-11|Screenshots of BOPADIGITAL CRM form the perspective of|
|||Management.<br>............................................................... 73|



## **LIST OF ABBREVIATIONS** 

BOPACORP S.A. Telecommunications company and main client of the project 

BOPADIGITAL Digital platform developed for BOPACORP S.A. 

B2B Business-to-Business (commercial model between companies) CMS Content Management System – module for website content administration CRM Customer Relationship Management – module for managing business clients and negotiations DOC Document Management Module EMP Employability / Application Module MAT Offer Matrix Module REP Reporting Module SUP Supervision and Approvals Module CAT Catalog and Website Module SEG Basic Security Module NOT Notifications Module GPS Global Positioning System UI User Interface UX User Experience JWT JSON Web Token (authentication mechanism) TLS Transport Layer Security (encryption protocol for HTTPS) PDF Portable Document Format 

VI 

KPI Key Performance Indicator RUC Unique Taxpayer Registry ID Identifier (unique reference or key) 

## **LIST OF SYMBOLS AND UNITS OF MEASUREMENTS** 

% Percentage (used in performance indicators such as availability or success rate) 

s Seconds (used for system response times, e.g., ≤ 3 s) 

MB Megabytes (used for file upload size limits, e.g., 50 MB) 

h Hours (used for availability and operational timeframes) 

## **CHAPTER 1** 

## **PURPOSE OF THE PROJECT** 

## **1.1 Problem Description** 

BOPACORP is a strategic commercial partner of Movistar, focused on selling telecommunication services to business clients (B2B). The company’s commercial process relies on a team of sales executives (advisors) who perform prospecting, field visits, and contract closures. 

The current operating model is manual, decentralized, and heavily dependent on tools such as Excel, Google Drive, and instant messaging (WhatsApp and Email), which generates three critical bottlenecks directly impacting productivity and profitability: 

1. The main bottleneck occurs after a successful sales close. The executive must collect physical documentation from the client (contract, ID, RUC, etc.) and physically return to the office to deliver it to the operational area. This travel generates "dead time," a significant opportunity cost where the comercial advisor could be making another commercial visit. This delay worsens at month-end, accumulating work for the operations team (coordination) and delaying service activation. 

2. Management and immediate supervisors lack real-time visibility into the sales team’s activities. Supervision is based on manual communication (asking via WhatsApp or chat) to find out an executive’s location or the status of a visit. 

3. All performance tracking and sales pipeline management are done in Excel spreadsheets. Immediate supervisors must consolidate this information manually for their weekly "oneon-one" meetings. 

## **1.2 Project Description** 

The BOPADIGITAL project is a comprehensive software solution, composed of an administrative web application and a mobile application, custom-designed for BOPACORP. 

2 

The system’s main objective is to digitize and centralize the complete B2B (business-to-business) sales lifecycle. Currently, this process is managed manually using a set of decentralized tools, which includes: 

- Google Drive, for storing and transferring contractual documentation. 

- Excel spreadsheets for reporting and tracking advisor performance. 

- Direct communication channels (such as WhatsApp or email) for daily supervision and status reporting. 

The proposed solution will replace these manual processes by implementing several interconnected modules: 

1. CRM Module (Web and Mobile): Allows for prospect registration, client portfolio management, and updating negotiation statuses (e.g., Initial Visit, Negotiation, Closing). 

2. Mobile Document Management Module: Facilitates the uploading of contractual documentation (ID, RUC, appointment, contract) directly from the advisor’s mobile device in the field. 

3. Supervision Module: Provides management with a feed of recent activity and tools for scheduling and tracking visits, improving visibility of field management. 

4. Intelligent Reporting Module: Centralizes sales data in an administrative dashboard for performance evaluation. 

## **1.3 Project Purpose** 

The fundamental purpose of BOPADIGITAL is to increase the operational efficiency of the commercial team and improve managerial visibility for strategic decision-making. 

The objectives of the project are: 

1. Mobility and Field Productivity Module: Develop an internal web and mobile application that eliminates “Dead Time” by enabling consultants to upload contractual documentation (RUC, ID, Contract) in real time from the field, while also providing structured client management through the registration and updating of prospects with key commercial data (invoicing, number of lines) and the scheduling of visits. 

3 

2. Content Management and Web Catalog Module (CMS): Design and develop a web product catalog under a content management scheme to facilitate its administration, allowing business clients to contact a sales consultant to initiate negotiation. 

3. Centralize and Automate Supervision: Replace manual supervision (based on asking “Where are you?” or “How’s it going?” via chat) with an active system. The project aims to give management real-time visibility into advisors’ locations, visit statuses, and field activity validation, reducing the likelihood of false or unverified visits. 

4. Enable Data-Driven Decision Making: Transform the current manual report generation process (in Excel) into an automated dashboard. This will make weekly follow-up meetings (“one-on-ones”) more efficient and focused on actionable insights, with consolidated key metrics such as pipeline by stage, billing, closing time, and performance in strategic products. 

## **CHAPTER 2** 

## **STAKEHOLDERS** 

## **2.1 Business Client** 

Business clients are external users who will access BOPACORP’s public website to explore the catalog of products and services offered, including voice, connectivity, digital, satellite tracking, and cloud security solutions. Their main interest is to find suitable options for their companies, compare prices and benefits, and contact a sales advisor to start a negotiation. They expect a clear, reliable, and visually appealing platform that allows them to identify services quickly and communicate effectively with the company. 

## **2.2 Sales Advisor** 

The sales advisor is the key operational user of the internal system, responsible for managing the entire sales cycle, from client prospecting to post-sale follow-up. They use the web and mobile application to register clients, plan visits, document negotiations, create offer matrices, and upload supporting documentation. Their main goal is to have an agile tool that allows them to work from the client’s office, upload information in real time, and optimize their time without needing to return to the company’s premises, thereby improving customer service efficiency. 

## **2.3 Immediate Supervisor / Sales Manager** 

The immediate supervisor or sales manager is an administrative user who oversees the work of sales advisors and monitors negotiation progress. Their responsibilities include approving offer matrices, analyzing performance indicators, and generating sales reports by period or by advisor. They need a system that provides complete visibility of the commercial flow, facilitates decision-making, and keeps real-time control over the team’s performance to ensure sales objectives are met. 

5 

## **2.4 Documentation Coordinator** 

The coordinator is responsible for managing documentation and activating contracted services. They use the internal application to define mandatory documents, review files uploaded by sales advisors, and update their approval status. They also coordinate with Telefónica’s platform to complete the service activation process. Their main objective is to reduce bottlenecks during closing periods and ensure all documentation is complete and verified on time, thus improving operational efficiency across departments. 

## **2.5 Management / Executive Board** 

The management team represents the company’s executive stakeholders, responsible for making strategic decisions based on data generated by the system. Their focus is on analyzing consolidated reports on sales, productivity, and commercial performance through the intelligent reporting module. They expect the platform to provide reliable metrics, visual dashboards, and historical comparisons that support data-driven decision-making and the strategic growth of the organization. 

## **2.6 Sales Advisor Candidate** 

Sales advisor candidates are external users interested in joining BOPACORP’s commercial team. They use the employment section of the website to view available vacancies, complete online application forms, and upload their resumes in PDF format. They expect a simple, transparent, and automated process that provides visual and email confirmation once their application is submitted, enhancing the company’s professional image and facilitating human resource management. 

## **2.7 Web Administrator** 

The web administrator is responsible for maintaining and updating the public content of BOPACORP’s website. Through the Content Management System (CMS) module, they can edit 

6 

text, images, links, service categories, and publish new products without requiring advanced technical knowledge. Their goal is to keep the website’s information accurate and attractive, ensuring consistency, branding alignment, and clear communication with potential clients. 

## **CHAPTER 3** 

## **CONSTRAINTS** 

## **3.1 Solution Constraints** 

The development of the BOPADIGITAL platform will be carried out using React for the frontend interface, Node.js with Express for the backend services, and PostgreSQL as the primary relational database. These technologies have been selected due to their proven scalability, active community support, and compatibility with modern web architectures. The use of open-source tools minimizes licensing costs and ensures maintainability by the development team after project delivery. The solution must also use Docker containers for deployment to guarantee consistency across environments. Therefore, the final product must be fully operational using these technologies and deployed within a Dockerized environment, without depending on proprietary or paid software frameworks. 

## **3.2 Implementation Environment of the Current System** 

The platform will be implemented in a cloud-based environment running on Linux servers, using Docker for containerization and NGINX as the web server. Development and testing will be performed in a controlled cloud environment before being deployed to production. This approach ensures scalability, security, and easy maintenance. The system must be compatible with both web and mobile devices, ensuring that authorized users can access it from any location with an internet connection. 

## **CHAPTER 4** 

## **SCOPE OF THE WORK** 

The BOPADIGITAL project aims to design and develop an integrated digital platform for BOPACORP S.A., a company specialized in telecommunications products and services. The system will consist of two main components: a public website and an internal web and mobile application. Together, these components will optimize the company’s commercial processes, from client acquisition to post-sale management. 

## **4.1 Public Website** 

The website is designed to increase BOPACORP’s online visibility and facilitate interaction with potential business clients. It will provide detailed and up-to-date information on all products and services, allowing external users to explore available options and initiate contact with the sales team. In addition, the site will include a recruitment section to manage job applications for new sales advisors. 

## **4.1.1 Hierarchical Service Catalog** 

The platform will feature a hierarchical catalog that organizes services into categories such as Voice, Connectivity, and Digital Services. Each category will include subcategories that enable structured navigation and efficient search of service information. 

## **4.1.2 Detailed Service Information** 

Every service entry will contain comprehensive details, including costs, benefits, and additional conditions. This ensures transparency and allows potential clients to make informed decisions before initiating a commercial contact. 

9 

## **4.1.3 Employment Application Module** 

The website will provide a dedicated employment module allowing prospective sales advisors to view available positions, fill out application forms, and upload their resumes (CVs) in PDF format. This feature will streamline recruitment processes and centralize applicant data. 

## **4.2 Internal Application (Web and Mobile)** 

The internal application is intended to support the complete sales negotiation process, allowing the commercial team to manage prospects, monitor negotiations, and maintain updated client information. It will also optimize document handling and provide analytical tools to evaluate commercial performance. 

## **4.2.1 Negotiation Management** 

Sales advisors will register potential clients, track negotiation stages, and record interactions in real time. The application will allow continuous monitoring of each business opportunity until closure. 

## **4.2.2 Negotiation Tracking** 

Supervisors will be able to visualize the current status of all negotiations, including client details, deal stages, approval matrices, and estimated closing times. This enables greater oversight of the commercial process and advisor productivity. 

## **4.2.3 Intelligent Reporting** 

The system will include a reporting module that generates metrics and performance analyses, such as sales by period, advisor performance, and clients not yet converted. These reports will serve as a decision-making tool for management and supervisors. 

10 

## **4.2.4 Document Management** 

The internal system will incorporate a document management module allowing advisors to upload required documentation for each negotiation. Coordinators will have access to review, approve, or reject files, ensuring all necessary information is validated for service activation. 

## **4.3 Scope Summary** 

Overall, the system will enable BOPACORP S.A. to: 

- Present a structured, user-friendly catalog of telecommunications services. 

- Streamline and digitize the commercial process from client prospecting to service activation. 

- Provide real-time visibility of sales operations for supervisors and management. 

- Centralize documentation and standardize approval workflows. 

- Facilitate recruitment of new sales advisors through the corporate website. 

- Ensure scalability for the future integration of new services and strategic partners. 

## **CHAPTER 5** 

## **FUNCTIONAL REQUIREMENTS** 

This section defines the functional requirements of the BOPADIGITAL system, which describe the specific behaviors, actions, and processes that the software must perform to meet the needs of its stakeholders. Each requirement has been derived from the system’s modules, stakeholder interviews, and the client’s business processes. 

The functional requirements are organized by modules that represent the main subsystems of BOPADIGITAL, including the public website and the internal application (web and mobile). This structure ensures clarity, traceability, and alignment with the project scope. 

12 

## **5.1 Public Website** 

## **5.1.1 Service Catalog and Website Module (CAT)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-CAT-001|1.0|The system shall allow the business client<br>to view a catalog of products and services<br>organized into categories such as Voice,<br>Connectivity, and Digital Services.|Business<br>Client|High|
|RF-CAT-002|1.0|The system shall allow the business client to<br>view costs, benefts, and usage conditions<br>for each item in the catalog.|Business<br>Client|High|
|RF-CAT-003|1.0|The system shall allow the business client<br>to flter catalog items by category, coverage,<br>and price.|Business<br>Client|Medium|
|RF-CAT-004|1.0|The system shall allow the business client<br>to contact a sales advisor to initiate<br>a negotiation regarding selected catalog<br>items.|Business<br>Client|High|
|RF-CAT-005|1.0|The system shall allow the business client to<br>view information about BOPACORP S.A.’s<br>history, mission, vision, and values.|Business<br>Client|High|



Table 5.1 Functional Requirements - Service Catalog and Website (CAT) 

13 

## **5.1.2 Content Management Module (CMS)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-CMS-001|1.0|The<br>system<br>shall<br>allow<br>the<br>web<br>administrator<br>to<br>access<br>the<br>content<br>management panel using credential-based<br>authentication (username and password).|Web<br>Administrator|High|
|RF-CMS-002|1.0|The<br>system<br>shall<br>allow<br>the<br>web<br>administrator to edit texts, images, and<br>links of the public website.|Web<br>Administrator|High|
|RF-CMS-003|1.0|The<br>system<br>shall<br>allow<br>the<br>web<br>administrator to create new products and<br>services within the catalog.|Web<br>Administrator|High|
|RF-CMS-004|1.0|The<br>system<br>shall<br>allow<br>the<br>web<br>administrator to update the information<br>of existing products and services in the<br>catalog.|Web<br>Administrator|High|
|RF-CMS-005|1.0|The<br>system<br>shall<br>allow<br>the<br>web<br>administrator to delete products and<br>services from the catalog.|Web<br>Administrator|High|



Table 5.2 Functional Requirements - Content Management Module (CMS) 

14 

## **5.1.3 Employability and Application Module (EMP)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-EMP-001|1.0|The system shall allow the sales advisor<br>candidate to view available vacancies,<br>displaying the position title, description,<br>requirements, and publication date.|Sales Advisor<br>Candidate|High|
|RF-EMP-002|1.0|The system shall allow the sales advisor<br>candidate to complete an application form<br>by entering personal details and contact<br>information.|Sales Advisor<br>Candidate|High|
|RF-EMP-003|1.0|The system shall allow the sales advisor<br>candidate to upload their resume (CV) in<br>PDF format as a mandatory part of the<br>application process.|Sales Advisor<br>Candidate|High|
|RF-EMP-004|1.0|The system shall validate that all required<br>felds in the application form are correctly<br>flled before allowing submission.|Sales Advisor<br>Candidate|High|
|RF-EMP-005|1.0|The system shall notify the sales advisor<br>candidate visually and via email once<br>their application has been successfully<br>submitted.|Sales Advisor<br>Candidate|High|
|RF-EMP-006|1.0|The system shall allow the sales advisor<br>candidate to be informed of the result of<br>their application.|Sales Advisor<br>Candidate|Medium|



Table 5.3 Functional Requirements - Employability and Application Module (EMP) 

15 

## **5.2 Internal Application** 

## **5.2.1 Client Relationship Management Module (CRM)** 

Table 5.4 Functional Requirements - Client Relationship Management Module (CRM) 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-CRM-001|1.0|The system shall allow the sales advisor to<br>fll out a client registration form including<br>the company’s RUC (tax ID), business<br>name, number of active services, and<br>current monthly billing.|Sales Advisor|High|
|RF-CRM-002|1.0|The system shall allow the sales advisor to<br>update the information of assigned business<br>clients.|Sales Advisor|High|
|RF-CRM-003|1.0|The system shall allow the sales advisor<br>to flter and search business clients by<br>negotiation stage or visit date.|Sales Advisor|High|
|RF-CRM-004|1.0|The system shall allow the sales advisor<br>to schedule on-site visits with assigned<br>business clients.|Sales Advisor|High|
|RF-CRM-005|1.0|The system shall allow the sales advisor<br>to register a new client visit by entering<br>date, time, observations, and GPS location<br>automatically obtained from their mobile<br>device.|Sales Advisor|High|
|Continued on next page|||||



16 

**Table 5.4 (continued) – Client Relationship Management Module (CRM)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-CRM-006|1.0|The system shall allow the immediate<br>supervisor to view the GPS location<br>registered by the sales advisor during each<br>visit to verify its validity.|Immediate<br>Supervisor|High|
|RF-CRM-007|1.0|The system shall allow the sales advisor<br>to view a history of visits made to their<br>assigned business clients.|Sales Advisor|High|
|RF-CRM-008|1.0|The system shall allow the sales advisor<br>to update the negotiation status with an<br>assigned business client.|Sales Advisor|High|
|RF-CRM-009|1.0|The system shall allow the immediate<br>supervisor to register new business clients,<br>including RUC, business name, number of<br>active services, and current monthly billing.|Immediate<br>Supervisor|High|
|RF-CRM-010|1.0|The system shall allow the immediate<br>supervisor to update information about<br>business clients.|Immediate<br>Supervisor|High|
|RF-CRM-011|1.0|The system shall allow the immediate<br>supervisor to deactivate business clients<br>when necessary.|Immediate<br>Supervisor|High|
|RF-CRM-012|1.0|The system shall allow the immediate<br>supervisor to assign business clients to sales<br>advisors to initiate negotiations.|Immediate<br>Supervisor|High|
|Continued on next page|||||



17 

**Table 5.4 (continued) – Client Relationship Management Module (CRM)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-CRM-013|1.0|The system shall allow the immediate<br>supervisor to view the list of business<br>clients assigned to each sales advisor.|Immediate<br>Supervisor|High|
|RF-CRM-014|1.0|The system shall allow the immediate<br>supervisor to remove business clients from<br>a sales advisor’s portfolio.|Immediate<br>Supervisor|High|
|RF-CRM-015|1.0|The system shall allow the immediate<br>supervisor to view the recent activity of<br>all company sales advisors.|Immediate<br>Supervisor|High|
|RF-CRM-016|1.0|The system shall allow management to<br>view, for each sales advisor, the number<br>of business clients contacted, visited, and<br>successfully closed.|Management|High|
|RF-CRM-017|1.0|The system shall allow management to view<br>the total billed amount per advisor, along<br>with the total number of services sold and<br>the average revenue per service.|Management|High|
|RF-CRM-018|1.0|The system shall allow management to view<br>the count and total value of terminals and<br>equipment sold by each advisor.|Management|High|
|RF-CRM-019|1.0|The system shall allow management to view,<br>for each advisor, the number of business<br>clients in each sales funnel stage.|Management|High|
|Continued on next page|||||



18 

**Table 5.4 (continued) – Client Relationship Management Module (CRM)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-CRM-020|1.0|The system shall allow the immediate<br>supervisor to flter and search business<br>clients by negotiation stage, visit date, or<br>assigned advisor.|Immediate<br>Supervisor|High|
|RF-CRM-021|1.0|The system shall restrict access so that sales<br>advisors can only view and modify data of<br>business clients assigned to them.|Sales Advisor|High|
|RF-CRM-022|1.0|The system shall allow the immediate<br>supervisor to consult a detailed history of<br>modifcations made by each sales advisor<br>to their clients.|Immediate<br>Supervisor|High|



## **5.2.2 Offer Matrix Module (MAT)** 

Table 5.5 Functional Requirements - Offer Matrix Module (MAT) 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-MAT-001|1.0|The system shall allow the sales advisor to<br>create a new ofer matrix associated with a<br>business client and an ongoing negotiation.|Sales Advisor|High|
|RF-MAT-002|1.0|The system shall allow the sales advisor to<br>enter the services and products proposed to<br>the client, specifying quantities, unit prices,<br>totals, and observations as part of the ofer<br>matrix.|Sales Advisor|High|
|Continued on next page|||||



19 

**Table 5.5 (continued) – Offer Matrix Module (MAT)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-MAT-003|1.0|The system shall automatically calculate<br>the applicable subsidy range based on<br>client billing and the number of proposed<br>services, displaying the total estimated<br>beneft amount.|Sales Advisor|High|
|RF-MAT-004|1.0|The system shall allow the sales advisor<br>to attach quotations or supporting fles in<br>PDF, Excel, JPG, or PNG formats up to 50<br>MB to the ofer matrix.|Sales Advisor|High|
|RF-MAT-005|1.0|The system shall allow the sales advisor<br>to save ofer matrices as drafts to edit<br>them before sending them to the immediate<br>supervisor for approval.|Sales Advisor|High|
|RF-MAT-006|1.0|The system shall allow the sales advisor<br>to send the ofer matrix to the immediate<br>supervisor for approval, changing its status<br>to “Pending Approval.”|Sales Advisor|High|
|RF-MAT-007|1.0|The<br>system<br>shall<br>allow<br>the<br>sales<br>advisor to consult the history of their<br>matrices, including creation date, status,<br>observations, and total subsidy amount.|Sales Advisor|High|



20 

## **5.2.3 Supervision and Approvals Module (SUP)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-SUP-001|1.0|The system shall allow the immediate<br>supervisor to view the list of ofer matrices<br>pending approval.|Immediate<br>Supervisor|High|
|RF-SUP-002|1.0|The system shall allow the immediate<br>supervisor to review commercial indicators<br>such as billing, number of services, and<br>the calculated subsidy range for each ofer<br>matrix.|Immediate<br>Supervisor|High|
|RF-SUP-003|1.0|The system shall allow the immediate<br>supervisor to approve or reject ofer<br>matrices, recording a mandatory reason<br>in case of rejection.|Immediate<br>Supervisor|High|
|RF-SUP-004|1.0|The system shall allow the immediate<br>supervisor to view a history of ofer<br>matrices that have been approved or<br>rejected.|Immediate<br>Supervisor|High|
|RF-SUP-005|1.0|The system shall allow the sales advisor to<br>receive an internal notifcation and an email<br>with the result of the approval or rejection<br>of their matrix.|Sales Advisor|High|
|RF-SUP-006|1.0|The system shall allow the immediate<br>supervisor to flter matrices by advisor,<br>date, approval status, or subsidy range to<br>facilitate their review.|Immediate<br>Supervisor|High|



Table 5.6 Functional Requirements - Supervision and Approvals Module (SUP) 

21 

## **5.2.4 Document Management Module (DOC)** 

Table 5.7 Functional Requirements - Document Management Module (DOC) 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-DOC-001|1.0|The system shall allow the sales advisor<br>to attach documents related to negotiations<br>with assigned business clients.|Sales Advisor|High|
|RF-DOC-002|1.0|The system shall allow the sales advisor to<br>upload fles up to 50 MB in PDF, JPG, or<br>PNG formats.|Sales Advisor|High|
|RF-DOC-003|1.0|The system shall require the sales advisor to<br>label each uploaded document with its type<br>(e.g., “Provisional RUC,” “Initial Proposal,”<br>“Visit Report,” “Final Contract”).|Sales Advisor|High|
|RF-DOC-004|1.0|The system shall allow the coordinator to<br>defne mandatory or optional documents<br>depending on the type of service or<br>negotiation.|Coordinator|High|
|RF-DOC-005|1.0|The system shall allow the sales advisor to<br>check the documentation status during a<br>negotiation, displaying which fles have<br>been reviewed, approved, or are still<br>pending.|Sales Advisor|High|
|RF-DOC-006|1.0|The system shall allow the coordinator<br>to review documents uploaded by each<br>sales advisor related to negotiations with<br>business clients.|Coordinator|Medium|
|Continued on next page|||||



22 

**Table 5.7 (continued) – Document Management Module (DOC)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-DOC-007|1.0|The system shall allow the coordinator to<br>download documents individually or in<br>bulk that are associated with a negotiation<br>for review.|Coordinator|Medium|
|RF-DOC-008|1.0|The system shall allow the sales advisor<br>to receive internal and email notifcations<br>when their documents have been reviewed,<br>approved, or rejected by the coordinator.|Sales Advisor|Medium|
|RF-DOC-009|1.0|The system shall allow the coordinator to<br>view a list of sales advisors with pending<br>document uploads or reviews.|Coordinator|Medium|



## **5.2.5 Reporting Module (REP)** 

Table 5.8 Functional Requirements - Reporting Module (REP) 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-REP-001|1.0|The system shall allow the manager to<br>generate commercial performance reports<br>by advisor, month, or period to evaluate<br>team productivity.|Manager|High|
|RF-REP-002|1.0|The system shall allow the immediate<br>supervisor to generate sales and closure<br>reports for the sales advisors under their<br>supervision, fltered by date, service type,<br>or zone.|Immediate<br>Supervisor|High|
|Continued on next page|||||



23 

**Table 5.8 (continued) – Reporting Module (REP)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-REP-003|1.0|The system shall allow the manager to view<br>key metrics such as sales, closures, visits,<br>and average negotiation time to assess<br>overall performance.|Manager|High|
|RF-REP-004|1.0|The system shall allow the immediate<br>supervisor to view operational metrics of<br>sales advisors, including sales, closures,<br>and visits made during a specifc period.|Immediate<br>Supervisor|High|
|RF-REP-005|1.0|The system shall allow the immediate<br>supervisor to compare the performance of<br>their sales advisors against the objectives<br>defned by management.|Immediate<br>Supervisor|Medium|
|RF-REP-006|1.0|The system shall allow the manager to<br>export generated reports in PDF or Excel<br>format for analysis or presentation.|Manager|Medium|
|RF-REP-007|1.0|The system shall allow the immediate<br>supervisor to export generated reports in<br>PDF or Excel format for review and follow-<br>up of commercial activities.|Immediate<br>Supervisor|Medium|
|RF-REP-008|1.0|The system shall allow the manager to<br>visualize consolidated information through<br>bar charts, line graphs, or KPI indicators<br>that facilitate interpretation of overall<br>results.|Manager|Medium|
|Continued on next page|||||



24 

**Table 5.8 (continued) – Reporting Module (REP)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-REP-009|1.0|The system shall restrict access to reports<br>according to user roles so that each user<br>only views the information corresponding<br>to their access level.|System|High|
|RF-REP-010|1.0|The<br>system<br>shall<br>allow<br>the<br>sales<br>advisor to view their own commercial<br>performance, including the number of<br>clients contacted,<br>active negotiations,<br>closures, and accumulated billing.|Sales Advisor|High|



## **5.2.6 Basic Security Module (SEG)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-SEG-001|1.0|The system shall require authentication<br>using a valid username and password to<br>allow access to the internal application.|System|High|
|RF-SEG-002|1.0|The system shall assign permissions<br>and restrict functionalities according to<br>the user’s role (Manager,<br>Immediate<br>Supervisor, Sales Advisor, Coordinator,<br>Web Administrator).|System|High|
|RF-SEG-003|1.0|The system shall ensure that users with the<br>Manager role inherit the access privileges<br>of the Immediate Supervisor role.|System|High|



Table 5.9 Functional Requirements - Basic Security Module (SEG) 

25 

## **5.2.7 Notifications Module (NOT)** 

|**ID**|**Version**|**Description**|**User / Role**|**Priority**|
|---|---|---|---|---|
|RF-NOT-001|1.0|The system shall send internal and email<br>notifcations to users when relevant events<br>occur, such as approvals, rejections, or<br>document reviews.|System|High|
|RF-NOT-002|1.0|The system shall allow each user to view a<br>history of received notifcations within the<br>application.|System|High|



Table 5.10 Functional Requirements - Notifications Module (NOT) 

## **CHAPTER 6** 

## **NON-FUNCTIONAL REQUIREMENTS** 

This section specifies the non-functional requirements of the BOPADIGITAL system, which define the quality attributes, constraints, and performance characteristics that the software must meet. Unlike functional requirements, these requirements do not describe specific system behaviors but rather establish the standards and conditions under which the system operates effectively. 

The non-functional requirements ensure that the BOPADIGITAL platform is reliable, secure, efficient, and user-friendly. They address key aspects such as usability, performance, scalability, maintainability, availability, security, and compliance with organizational and technological constraints. 

These requirements apply to both components of the system, the public website and the internal application (web and mobile), ensuring a consistent user experience, operational stability, and compliance with industry best practices. Each non-functional requirement contributes to the overall quality and sustainability of the system throughout its lifecycle. 

27 

Table 6.1 Non-Functional Requirements - BOPADIGITAL System 

|**ID**|**Version**|**Description**|**Validation**<br>**Criterion**|**Priority**|
|---|---|---|---|---|
|RNF-001|1.0|The system shall guarantee a response<br>time below 3 seconds for any user action<br>under a load of up to 50 concurrent<br>users.<br>(Category: Product – Efciency<br>– Performance)|Performance<br>and<br>stress<br>testing<br>with<br>JMeter<br>or<br>equivalent<br>shows ≤3s<br>response time<br>with 50 users.|High|
|RNF-002|1.0|The platform shall ensure at least 99%<br>monthly availability during business hours<br>(08h00–20h00).<br>(Category:<br>Product –<br>Dependability – Availability)|Server<br>logs<br>and<br>uptime<br>reports<br>confrm<br>≥<br>99%<br>availability.|High|
|RNF-003|1.0|The system shall support scaling from 7 to<br>25 concurrent advisors without afecting<br>response time.<br>(Category:<br>Product –<br>Efciency – Performance)|Load<br>test<br>results<br>confrm<br>stability<br>under<br>25<br>simultaneous<br>users.|Medium|
|Continued on next page|||||



28 

**Table 6.1 (continued) – Non-Functional Requirements** 

|**ID**|**Version**|**Description**|**Validation**<br>**Criterion**|**Priority**|
|---|---|---|---|---|
|RNF-004|1.0|User passwords shall be hashed using<br>bcrypt with random salt and at least 12<br>characters. (Category: Product – Security)|Code<br>audit<br>confrms<br>bcrypt usage<br>and required<br>length.|High|
|RNF-005|1.0|All communication between client and<br>server shall use HTTPS with TLS 1.3<br>encryption. (Category: Product – Security)|SSL<br>certifcate<br>and<br>server<br>confguration<br>inspection.|High|
|RNF-006|1.0|The mobile app shall work correctly on<br>Android 10–16 and iOS 13–16.1; the web<br>version shall be compatible with Chrome,<br>Firefox, and Edge. (Category: Product –<br>Usability)|Cross-device<br>and<br>cross-<br>browser<br>compatibility<br>tests.|High|
|RNF-007|1.0|The interface shall remain responsive from<br>360 px to 1440 px width and meet WCAG<br>2.1 AA accessibility. (Category: Product –<br>Usability)|Visual<br>inspection<br>and<br>accessibility<br>validation.|High|
|RNF-008|1.0|The system shall log all critical events<br>(logins, uploads, approvals, rejections) with<br>timestamp and user. (Category: Product –<br>Security)|Audit<br>log<br>verifcation.|High|
|Continued on next page|||||



29 

**Table 6.1 (continued) – Non-Functional Requirements** 

|**ID**|**Version**|**Description**|**Validation**<br>**Criterion**|**Priority**|
|---|---|---|---|---|
|RNF-009|1.0|Uploaded fles shall be validated by<br>extension (PDF, JPG, PNG, XLSX) and<br>limited to 50 MB. (Category: Product –<br>Efciency – Space)|Upload<br>and<br>validation test<br>results.|High|
|RNF-010|1.0|The system shall perform daily automated<br>database backups for disaster recovery.<br>(Category: Organizational – Operational)|Backup<br>and<br>restore<br>verifcation.|Medium|
|RNF-011|1.0|The source code shall comply with OWASP<br>Top 10 security standards.<br>(Category:<br>Organizational – Development)|Static<br>code<br>analysis<br>and<br>linting<br>validation.|High|
|RNF-012|1.0|The system shall follow an MVC client-<br>server architecture with logical separation<br>of layers.<br>(Category: Organizational –<br>Development)|Design<br>and<br>folder<br>structure<br>review.|Medium|
|RNF-013|1.0|User data shall comply with Ecuador’s<br>Personal Data Protection Law (2021).<br>(Category: External – Legislative)|Legal<br>audit<br>and<br>policy<br>review.|High|
|RNF-014|1.0|Uploaded documents shall be encrypted<br>with AES-256 both in transit and at rest.<br>(Category: Product – Security)|Hosting<br>confguration<br>and<br>encryption<br>validation.|High|
|Continued on next page|||||



30 

**Table 6.1 (continued) – Non-Functional Requirements** 

|**ID**|**Version**|**Description**|**Validation**<br>**Criterion**|**Priority**|
|---|---|---|---|---|
|RNF-015|1.0|Error messages shall be in Spanish, identify<br>the failing module, and hide technical<br>details. (Category: Product – Usability)|Interface<br>inspection<br>and<br>error<br>testing.|Medium|
|RNF-016|1.0|The system shall ensure data consistency<br>during concurrent writes, avoiding race<br>conditions.<br>(Category:<br>Product<br>–<br>Dependability – Reliability)|Concurrent<br>operation<br>testing<br>confrms<br>integrity.|High|
|RNF-017|1.0|Critical operations (approvals, activations,<br>uploads) shall be recorded in an audit<br>log with user, action, and timestamp.<br>(Category: Product – Security)|Database<br>traceability<br>verifcation.|High|
|RNF-018|1.0|Forms shall validate input on client and<br>server sides with clear feedback and prevent<br>duplicates. (Category: Product – Usability)|Validation<br>tests<br>with<br>incorrect<br>inputs.|High|
|RNF-019|1.0|The application shall run continuously for<br>at least 8 hours without restart. (Category:<br>Product – Dependability – Availability)|Endurance<br>testing<br>demonstrates<br>≥8 h stability.|High|
|Continued on next page|||||



31 

**Table 6.1 (continued) – Non-Functional Requirements** 

|**ID**|**Version**|**Description**|**Validation**<br>**Criterion**|**Priority**|
|---|---|---|---|---|
|RNF-020|1.0|All components shall include technical<br>documentation and comments in standard<br>format.<br>(Category:<br>Organizational –<br>Development)|Code<br>and<br>documentation<br>review.|Medium|
|RNF-021|1.0|Unit tests shall cover at least 80% of<br>critical code. (Category: Organizational –<br>Development)|Test coverage<br>report review.|Medium|
|RNF-022|1.0|System updates shall not exceed 15 minutes<br>of downtime. (Category: Organizational –<br>Operational)|Controlled<br>deployment<br>and downtime<br>logging.|Medium|
|RNF-023|1.0|Personal data shall be anonymized in testing<br>and development environments. (Category:<br>External – Legislative)|Database<br>audit ensures<br>anonymization.|High|
|RNF-024|1.0|Sessions shall expire after 15 minutes<br>of inactivity, requiring reauthentication.<br>(Category: Product – Security)|Inactivity<br>test confrms<br>session<br>timeout.|High|
|RNF-025|1.0|The system shall restore databases from<br>backups without interrupting ongoing<br>operations.<br>(Category:<br>Product<br>–<br>Dependability)|Recovery<br>testing<br>with<br>data<br>validation.|Medium|
|Continued on next page|||||



32 

**Table 6.1 (continued) – Non-Functional Requirements** 

|**ID**|**Version**|**Description**|**Validation**<br>**Criterion**|**Priority**|
|---|---|---|---|---|
|RNF-026|1.0|Only authenticated users may access API<br>endpoints through JWT tokens with 15-<br>minute expiration. (Category: Product –<br>Security)|Token<br>authentication<br>and<br>expiration<br>tests.|High|



## **CHAPTER 7** 

## **USER STORIES** 

This section presents the user stories defined for the BOPADIGITAL system. Each story describes, in concise and user-centered terms, the specific goals, motivations, and expected outcomes of the main actors interacting with the system. These user stories were derived from the functional requirements, stakeholder interviews, and the analysis of the company’s business processes. 

The user stories are organized by modules that correspond to the main subsystems of BOPADIGITAL, ensuring consistency with the system architecture and requirements traceability. Each module groups the stories related to a particular functional area, covering both the public website and the internal application (web and mobile). 

This modular organization allows a clear understanding of the system from the user’s perspective and facilitates the transition to subsequent stages of design, development, and testing. 

## **7.1 Service Catalog and Website Module (CAT)** 

## **HU-CAT-001** 

## **Related Requirement:** RF-CAT-001 

## **Actor:** Business Client 

**User Story:** As a business client, I want to explore a catalog of products and services organized by categories such as Voice, Connectivity, and Digital Services, so that I can easily find the solutions offered by BOPACORP. 

## **Acceptance Criteria:** 

- The catalog displays the main categories and available subcategories. 

- The user can navigate between categories without errors. 

- Each category loads its list of services in less than 3 seconds. 

34 

## **HU-CAT-002** 

## **Related Requirement:** RF-CAT-002 

## **Actor:** Business Client 

**User Story:** As a business client, I want to view the costs, benefits, and usage conditions of 

each service, so I can compare options and choose the one that best suits my company. 

## **Acceptance Criteria:** 

- Each catalog service displays its cost, benefits, and conditions. 

- Information is clearly visible on the website. 

- Services without complete information are not allowed. 

## **HU-CAT-003** 

## **Related Requirement:** RF-CAT-003 

## **Actor:** Business Client 

**User Story:** As a business client, I want to filter services by category, coverage, and price to 

quickly find the options that meet my needs. 

## **Acceptance Criteria:** 

- Results update dynamically according to the selected filters. 

- Filters can be combined simultaneously. 

## **HU-CAT-004** 

## **Related Requirement:** RF-CAT-004 

**Actor:** Business Client 

**User Story:** As a business client, I want to contact a sales advisor directly from the catalog to request more information or start a negotiation. 

## **Acceptance Criteria:** 

- The contact function is available for each listed service. 

- The system processes the contact request successfully. 

- The user receives confirmation of their request. 

35 

## **HU-CAT-005** 

## **Related Requirement:** RF-CAT-005 

## **Actor:** Business Client 

**User Story:** As a business client, I want to learn about BOPACORP’s history, mission, vision, 

and values to better understand the company’s philosophy and reliability. 

## **Acceptance Criteria:** 

- A “About Us” section is accessible from the main menu. 

- History, mission, vision, and values are displayed correctly. 

- Content is viewable on both desktop and mobile. 

## **7.2 Content Management Module (CMS)** 

## **HU-CMS-001** 

## **Related Requirement:** RF-CMS-001 

## **Actor:** Web Administrator 

**User Story:** As a web administrator, I want to access the content management panel using 

credentials (username and password), so that I can control editing operations on the website. 

## **Acceptance Criteria:** 

- The system requests valid credentials before granting access to the panel. 

- Only users with the Web Administrator role can log in. 

- Unauthorized access attempts display an error message. 

## **HU-CMS-002** 

## **Related Requirement:** RF-CMS-002 

**Actor:** Web Administrator 

**User Story:** As a web administrator, I want to modify texts, images, and links of the published 

content to keep the website’s information accurate and up to date. 

## **Acceptance Criteria:** 

- All modifications are saved and made available for publication. 

- The system validates file types and sizes before accepting the modification. 

36 

## **HU-CMS-003** 

## **Related Requirement:** RF-CMS-003 

## **Actor:** Web Administrator 

**User Story:** As a web administrator, I want to register new products and services in the catalog to expand the range of offerings available to business clients. 

## **Acceptance Criteria:** 

- Mandatory fields include name, description, category, and price. 

- The entered data are correctly stored and available for review. 

## **HU-CMS-004** 

## **Related Requirement:** RF-CMS-004 

## **Actor:** Web Administrator 

**User Story:** As a web administrator, I want to update existing product or service information in the catalog to reflect changes in prices, benefits, or conditions. 

## **Acceptance Criteria:** 

- Every update is recorded with the date and responsible user. 

- The system preserves data integrity after each modification. 

## **HU-CMS-005** 

## **Related Requirement:** RF-CMS-005 

## **Actor:** Web Administrator 

**User Story:** As a web administrator, I want to delete outdated products or services from the catalog to ensure that only current offers are visible and avoid confusion for users. 

## **Acceptance Criteria:** 

- The system must request explicit confirmation from the administrator before permanent deletion. 

- Once confirmed, the deleted service must no longer appear in the public catalog (verified by a Business Client). 

37 

- The deleted service must also be removed from the active services list in the Content Management Module (CMS). 

## **7.3 Employability and Application Module (EMP)** 

## **HU-EMP-001** 

## **Related Requirement:** RF-EMP-001 

**Actor:** Sales Advisor Candidate 

**User Story:** As a sales advisor candidate, I want to view the available job vacancies with their descriptions and requirements so that I can identify opportunities that fit my professional profile. 

## **Acceptance Criteria:** 

- The system displays active vacancies with complete information: position title, requirements, description, and publication date. 

- Only valid (non-expired) vacancies are shown. 

- The candidate can access the details of each vacancy without authentication. 

## **HU-EMP-002** 

## **Related Requirement:** RF-EMP-002 

**Actor:** Sales Advisor Candidate 

**User Story:** As a sales advisor candidate, I want to enter my personal and contact information in an application form so that I can formally apply to an open vacancy. 

## **Acceptance Criteria:** 

- The form requests defined mandatory fields (name, ID, email, phone, etc.). 

- Entered data are stored correctly in the system. 

- The application is associated with a specific vacancy. 

## **HU-EMP-003** 

## **Related Requirement:** RF-EMP-003 

## **Actor:** Sales Advisor Candidate 

**User Story:** As a sales advisor candidate, I want to upload my resume (CV) in PDF format so 

38 

that my professional information is included in the application process. 

## **Acceptance Criteria:** 

- The system accepts PDF files only. 

- The file size complies with the defined maximum limit. 

- The uploaded CV is stored together with the corresponding application. 

## **HU-EMP-004** 

## **Related Requirement:** RF-EMP-004 

## **Actor:** Sales Advisor Candidate 

**User Story:** As a sales advisor candidate, I want the system to validate that all required fields 

are complete before submission so that my application is processed correctly. 

## **Acceptance Criteria:** 

- The application cannot be submitted if any required fields are missing. 

- The system displays validation messages indicating incomplete fields. 

- Submission is allowed only when all validations pass. 

## **HU-EMP-005** 

## **Related Requirement:** RF-EMP-005 

## **Actor:** Sales Advisor Candidate 

**User Story:** As a sales advisor candidate, I want to receive visual and email confirmation when 

my application is submitted so that I have proof that the process was completed successfully. 

## **Acceptance Criteria:** 

- Upon submission, the system records the application successfully. 

- The candidate receives an in-app notification and a confirmation email. 

- The submission date and time are recorded. 

## **HU-EMP-006** 

## **Related Requirement:** RF-EMP-006 

**Actor:** Sales Advisor Candidate 

39 

**User Story:** As a sales advisor candidate, I want to receive the result of my application by email so that I know whether I was accepted or rejected. 

## **Acceptance Criteria:** 

- The applicant is notified of the application result via email. 

## **7.4 Client Management Module (CRM)** 

## **HU-CRM-001** 

## **Related Requirement:** RF-CRM-001 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to register new business clients with their RUC, name, 

number of services, and monthly billing, so that I can start tracking their negotiations. 

## **Acceptance Criteria:** 

- The system requires mandatory fields (RUC, name, services, billing). 

- The information is stored correctly. 

- Created records are associated with the responsible advisor. 

## **HU-CRM-002** 

## **Related Requirement:** RF-CRM-002 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to update the data of my assigned clients to keep accurate information during the negotiation process. 

## **Acceptance Criteria:** 

- The system allows modifying only clients assigned to the advisor. 

- After saving, the updated information persists and is visible to the Sales Advisor, Immediate Supervisor, and Management Staff. 

## **HU-CRM-003** 

## **Related Requirement:** RF-CRM-003 

**Actor:** Sales Advisor 

40 

**User Story:** As a sales advisor, I want to search and filter my clients by negotiation stage or visit date so that I can prioritize my commercial follow-up. 

## **Acceptance Criteria:** 

- The results correspond only to the advisor’s clients. 

- Filters can be combined. 

## **HU-CRM-004** 

## **Related Requirement:** RF-CRM-004 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to plan on-site visits to my assigned clients to organize my schedule and maintain continuity in the sales process. 

## **Acceptance Criteria:** 

- The advisor can register the date, time, and client for each planned visit. 

- Visits are stored for later consultation. 

## **HU-CRM-005** 

## **Related Requirement:** RF-CRM-005 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to view the location recorded by advisors 

during each visit to verify the validity of reported activities. 

## **Acceptance Criteria:** 

- The supervisor can view the location of past visits. 

- The information includes coordinates and client details. 

## **HU-CRM-006** 

## **Related Requirement:** RF-CRM-006 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to consult the history of visits made to analyze my client 

41 

follow-up over time. 

## **Acceptance Criteria:** 

- The history lists all visits made by the advisor. 

- Each record includes date, time, observations, and client. 

- The information can be sorted chronologically. 

## **HU-CRM-007** 

## **Related Requirement:** RF-CRM-007 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to update the negotiation status of my clients to reflect progress in the commercial process. 

## **Acceptance Criteria:** 

- The system allows selecting valid stages (prospecting, negotiation, closing, post-sale). 

- Each change is recorded with date and user. 

- Only the responsible advisor can modify the status. 

## **HU-CRM-008** 

## **Related Requirement:** RF-CRM-008 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to register new business clients to include them 

in the system and assign them to available advisors. 

## **Acceptance Criteria:** 

- The form includes RUC, name, services, and billing fields. 

- Registered clients remain unassigned initially. 

- Only users with the Immediate Supervisor role can perform this action. 

## **HU-CRM-009** 

## **Related Requirement:** RF-CRM-009 

**Actor:** Immediate Supervisor 

42 

**User Story:** As an immediate supervisor, I want to update information about business clients to correct or maintain company records up to date. 

## **Acceptance Criteria:** 

- The supervisor can edit any business client record. 

- Each update is logged with date and user. 

- Updated data are reflected in real time. 

## **HU-CRM-010** 

## **Related Requirement:** RF-CRM-010 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to deactivate business clients to prevent the use 

of inactive or outdated records. 

## **Acceptance Criteria:** 

- The system allows setting a client status to “Inactive.” 

- Inactive clients do not appear in active searches. 

- The supervisor can revert the status if necessary. 

## **HU-CRM-011** 

## **Related Requirement:** RF-CRM-011 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to assign business clients to sales advisors to 

distribute the workload efficiently. 

## **Acceptance Criteria:** 

- The supervisor selects the advisor and client for assignment. 

- Assigned clients are immediately linked to the advisor. 

- The system prevents duplicate assignments. 

## **HU-CRM-012** 

## **Related Requirement:** RF-CRM-012 

43 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to view the list of clients assigned to each 

advisor to monitor each team member’s portfolio. 

## **Acceptance Criteria:** 

- The list displays clients and their negotiation status. 

- It can be filtered by advisor. 

- The data update in real time. 

## **HU-CRM-013** 

## **Related Requirement:** RF-CRM-013 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to reassign or remove clients from a sales 

advisor to redistribute them when necessary. 

## **Acceptance Criteria:** 

- The supervisor can remove the link between advisor and client. 

- All changes are recorded with date and reason. 

## **HU-CRM-014** 

## **Related Requirement:** RF-CRM-014 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to review recent activity from sales advisors to 

evaluate their compliance with visits and record keeping. 

## **Acceptance Criteria:** 

- The system displays the latest activity from each advisor. 

- Each record includes action type, date, and affected client. 

## **HU-CRM-015** 

## **Related Requirement:** RF-CRM-015 

**Actor:** Management 

44 

**User Story:** As management, I want to view contact, visit, and closure indicators per advisor to evaluate team performance. 

## **Acceptance Criteria:** 

- The system displays the number of clients contacted, visited, and closed. 

- Data are grouped by advisor and updated in real time. 

## **HU-CRM-016** 

## **Related Requirement:** RF-CRM-016 

**Actor:** Management 

**User Story:** As management, I want to view total billed amounts and averages per service for each advisor to measure commercial efficiency. 

## **Acceptance Criteria:** 

- The system consolidates billed amounts per advisor. 

- The average billing per service is calculated automatically. 

## **HU-CRM-017** 

## **Related Requirement:** RF-CRM-017 

**Actor:** Management 

**User Story:** As management, I want to view the total terminals and equipment sold by each advisor to analyze complementary sales. 

## **Acceptance Criteria:** 

- The system displays the number and total value of equipment sold. 

- Information is grouped by advisor and based on confirmed records. 

## **HU-CRM-018** 

## **Related Requirement:** RF-CRM-018 

## **Actor:** Management 

**User Story:** As management, I want to view the number of clients at each stage of the sales 

45 

funnel to identify opportunities and bottlenecks. 

## **Acceptance Criteria:** 

- The system groups clients by funnel stage (prospecting, negotiation, closing, post-sale). 

- Data can be filtered by advisor. 

- Visualization reflects the most current state. 

## **HU-CRM-019** 

## **Related Requirement:** RF-CRM-019 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to search and filter clients by negotiation stage, visit date, or assigned advisor to follow up in an organized way. 

## **Acceptance Criteria:** 

- Filters include stage, date, and advisor. 

- Results are displayed according to the selected criteria. 

- Only active clients are shown. 

## **HU-CRM-020** 

## **Related Requirement:** RF-CRM-020 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to view the clients assigned to me immediately to provide timely follow-up. 

## **Acceptance Criteria:** 

- The advisor can only view assigned clients. 

- Selecting a client loads the detailed client information view successfully. 

## **HU-CRM-021** 

## **Related Requirement:** RF-CRM-021 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to consult the change history made by each 

46 

advisor on their clients to maintain control over modifications. 

## **Acceptance Criteria:** 

- The system keeps a record of all changes made by advisors. 

- Each record includes user, date, modified field, and previous value. 

- The history is accessible only to immediate supervisors. 

## **7.5 Offer Matrix Module (MAT)** 

## **HU-MAT-001** 

## **Related Requirement:** RF-MAT-001 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to create a new offer matrix associated with a client and 

an active negotiation so that I can record the proposed sales conditions. 

## **Acceptance Criteria:** 

- The created matrix is automatically associated with both the client and the negotiation. 

- The record is saved with the date and responsible user. 

## **HU-MAT-002** 

## **Related Requirement:** RF-MAT-002 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to enter the offered products and services, specifying 

quantity, unit prices, totals, and observations so that I can properly structure the commercial proposal. 

## **Acceptance Criteria:** 

- Each catalog service displays its cost, benefits, and conditions. 

- The information is clearly visible on the interface. 

- Incomplete services cannot be registered in the matrix. 

## **HU-MAT-003** 

**Related Requirement:** RF-MAT-003 

47 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want the system to automatically calculate the applicable subsidy based on the client’s billing and number of proposed services, to estimate the total benefit for the client. 

## **Acceptance Criteria:** 

- The calculated subsidy value is displayed within the matrix. 

- The calculation is reproducible and verifiable in test conditions. 

## **HU-MAT-004** 

## **Related Requirement:** RF-MAT-004 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to attach quotations or complementary files to my offer matrix to support the proposal with additional documentation. 

## **Acceptance Criteria:** 

- The system accepts files in PDF, Excel, JPG, or PNG format. 

- The maximum allowed size per file is 50 MB. 

- Uploaded documents are linked to the matrix and available for download. 

## **HU-MAT-005** 

## **Related Requirement:** RF-MAT-005 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to save my offer matrices as drafts so that I can review and complete them before submitting them for approval. 

## **Acceptance Criteria:** 

- Draft matrices can be reopened and edited by the advisor. 

- Drafts are not visible to the immediate supervisor until submission. 

## **HU-MAT-006** 

## **Related Requirement:** RF-MAT-006 

48 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to send the offer matrix to my immediate supervisor for 

approval so that the proposal can be formalized and negotiation can continue. 

## **Acceptance Criteria:** 

- The matrix status automatically changes to “Pending Approval.” 

- The immediate supervisor receives a notification upon submission. 

- The advisor can no longer modify the matrix after sending it. 

## **HU-MAT-007** 

## **Related Requirement:** RF-MAT-007 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to consult the history of my created matrices so that I can 

review their status, observations, and associated subsidy amounts. 

## **Acceptance Criteria:** 

- The history displays the creation date, total amount, and observations. 

- Previous versions are preserved for audit purposes. 

## **7.6 Supervision and Approvals Module (SUP)** 

## **HU-SUP-001** 

## **Related Requirement:** RF-SUP-001 

## **Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to view all offer matrices pending approval so 

that I can prioritize those that require review and avoid delays in the commercial process. 

## **Acceptance Criteria:** 

- The system displays only matrices with the status “Pending Approval.” 

- Essential data are shown: client, advisor, submission date, and total amount. 

- The information updates automatically when new matrices are added. 

49 

## **HU-SUP-002** 

## **Related Requirement:** RF-SUP-002 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to consult the commercial indicators of each matrix, including billing, number of services, and subsidy range, to objectively evaluate each proposal before making a decision. 

## **Acceptance Criteria:** 

- The system displays billing, number of services, and calculated subsidy indicators. 

- The displayed values match the data from the original matrix. 

- The supervisor cannot modify this information. 

## **HU-SUP-003** 

## **Related Requirement:** RF-SUP-003 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to approve or reject offer matrices, entering a 

reason in case of rejection, to maintain a clear record of all decisions made. 

## **Acceptance Criteria:** 

- The supervisor can change the matrix status to “Approved” or “Rejected.” 

- In case of rejection, the system requires entering a mandatory reason. 

- Each decision is recorded with date, time, and user. 

## **HU-SUP-004** 

## **Related Requirement:** RF-SUP-004 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to access a history of approved or rejected 

matrices so that I can review previous decisions and facilitate audits or follow-ups. 

## **Acceptance Criteria:** 

- The system stores approval and rejection decisions with their details. 

- The history includes date, user, client, and advisor involved. 

50 

- Records cannot be modified once generated. 

## **HU-SUP-005** 

## **Related Requirement:** RF-SUP-005 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to receive a notification when my matrix is approved or rejected so that I can know the review outcome and proceed accordingly. 

## **Acceptance Criteria:** 

- The system sends both an internal and email notification to the advisor. 

- The message includes the result (approved or rejected) and, if applicable, the rejection reason. 

- Notifications are recorded in the advisor’s history. 

## **HU-SUP-006** 

## **Related Requirement:** RF-SUP-006 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to filter matrices by advisor, date, status, or 

subsidy range to make searching and analysis easier during the review process. 

## **Acceptance Criteria:** 

- Filters allow combining multiple criteria (advisor, date, status, subsidy). 

- The displayed results exactly match the selected filters. 

- The supervisor can clear or modify filters at any time. 

## **7.7 Document Management Module (DOC)** 

## **HU-DOC-001** 

## **Related Requirement:** RF-DOC-001 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to attach documents related to my negotiations so that I 

can support the commercial process and facilitate its review. 

## **Acceptance Criteria:** 

51 

- The advisor can select an active negotiation and attach the corresponding documents. 

- Documents are associated with the correct client and negotiation. 

- The system records the upload date, time, and responsible user. 

## **HU-DOC-002** 

## **Related Requirement:** RF-DOC-002 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to upload files up to 50 MB in PDF, JPG, or PNG formats 

to ensure that the required documentation is sent in compatible formats. 

## **Acceptance Criteria:** 

- The system validates file formats (PDF, JPG, PNG). 

- Files exceeding 50 MB are not accepted. 

- Valid files are stored correctly in the system. 

## **HU-DOC-003** 

## **Related Requirement:** RF-DOC-003 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to label each uploaded document with its corresponding 

type to maintain a clear organization of each client’s documentation. 

## **Acceptance Criteria:** 

- The system requires selecting a label type (“Provisional RUC,” “Initial Proposal,” “Visit Report,” “Final Contract”). 

- The label is recorded together with the document. 

- Documents can later be filtered by type. 

## **HU-DOC-004** 

## **Related Requirement:** RF-DOC-004 

## **Actor:** Coordinator 

**User Story:** As a coordinator, I want to define which documents are mandatory or optional 

52 

depending on the type of service so that negotiation requirements are standardized. 

## **Acceptance Criteria:** 

- The coordinator can mark documents as “mandatory” or “optional.” 

- The system enforces the corresponding rules based on service or negotiation type. 

- Advisors can see which documents must be uploaded before closing a negotiation. 

## **HU-DOC-005** 

## **Related Requirement:** RF-DOC-005 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to check the status of uploaded documents so that I know 

which ones have been reviewed, approved, or are still pending. 

## **Acceptance Criteria:** 

- The system displays the current status of each document (Pending, Approved, Rejected). 

- Statuses update automatically according to the coordinator’s actions. 

- The advisor can consult this information from their account at any time. 

## **HU-DOC-006** 

## **Related Requirement:** RF-DOC-006 

## **Actor:** Coordinator 

**User Story:** As a coordinator, I want to review the documents uploaded by each sales advisor to 

verify compliance with documentation requirements. 

## **Acceptance Criteria:** 

- The system lists documents grouped by advisor and negotiation. 

- Each record displays document type, upload date, and status. 

- Only coordinators have access to this view. 

## **HU-DOC-007** 

**Related Requirement:** RF-DOC-007 

**Actor:** Coordinator 

53 

**User Story:** As a coordinator, I want to download negotiation documents individually or in bulk so that I can review and store the information more efficiently. 

## **Acceptance Criteria:** 

- The system allows downloading a specific document or all negotiation files. 

- Files are preserved in their original format. 

- A record of downloads is kept in the system. 

## **HU-DOC-008** 

## **Related Requirement:** RF-DOC-008 

**Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to receive a notification when my documents are reviewed, 

approved, or rejected so that I can track the validation progress. 

## **Acceptance Criteria:** 

- The system sends both an internal notification and an email to the advisor. 

- The message includes the result of the review and any comments. 

- The notification is stored in the user’s history. 

## **HU-DOC-009** 

## **Related Requirement:** RF-DOC-009 

## **Actor:** Coordinator 

**User Story:** As a coordinator, I want to view a list of advisors with pending document uploads 

or reviews so that I can prioritize cases that require follow-up. 

## **Acceptance Criteria:** 

- The system generates a list of advisors with pending documentation. 

- The list includes associated clients and missing document types. 

- The list updates automatically as uploads are completed. 

54 

## **7.8 Reporting Module (REP)** 

## **HU-REP-001** 

## **Related Requirement:** RF-REP-001 

## **Actor:** Manager 

**User Story:** As a manager, I want to generate commercial performance reports by advisor, 

month, or period so that I can evaluate team productivity and identify areas for improvement. 

## **Acceptance Criteria:** 

- Reports include metrics such as sales, closures, and billing. 

- Generated data correspond to the selected period. 

## **HU-REP-002** 

## **Related Requirement:** RF-REP-002 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to generate sales and closure reports for the 

advisors under my supervision, filtering by date, service type, or zone, to conduct detailed performance tracking. 

## **Acceptance Criteria:** 

- Results include only advisors under the supervisor’s responsibility. 

- Reports display total sales and closures by advisor. 

## **HU-REP-003** 

## **Related Requirement:** RF-REP-003 

## **Actor:** Manager 

**User Story:** As a manager, I want to visualize key metrics such as sales, closures, visits, and 

average negotiation time to measure the overall performance of the sales force. 

## **Acceptance Criteria:** 

- The system calculates and presents the mentioned metrics. 

- Values are automatically updated based on registered data. 

55 

- Information is consolidated by period or defined range. 

## **HU-REP-004** 

## **Related Requirement:** RF-REP-004 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to view operational metrics of the advisors, 

including sales, closures, and visits made, to monitor their commercial performance. 

## **Acceptance Criteria:** 

- Data correspond to the selected period. 

- Only advisors under the supervisor’s direct supervision are displayed. 

## **HU-REP-005** 

## **Related Requirement:** RF-REP-005 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to compare the performance of my advisors 

against the objectives defined by management so that I can identify deviations and take corrective actions. 

## **Acceptance Criteria:** 

- The system compares actual metrics with defined objectives. 

- The percentage of compliance for each advisor is displayed. 

- Data update automatically based on registered metrics. 

## **HU-REP-006** 

## **Related Requirement:** RF-REP-006 

**Actor:** Manager 

**User Story:** As a manager, I want to export generated reports in PDF or Excel format so that I 

can analyze them externally or present them during meetings. 

## **Acceptance Criteria:** 

- Exported files retain the original report’s structure and content. 

56 

- The export process completes successfully without errors. 

## **HU-REP-007** 

## **Related Requirement:** RF-REP-007 

**Actor:** Immediate Supervisor 

**User Story:** As an immediate supervisor, I want to export generated reports in PDF or Excel 

format so that I can back up the commercial management tracking. 

## **Acceptance Criteria:** 

- Exported reports preserve applied filters. 

- Files can be downloaded successfully. 

## **HU-REP-008** 

## **Related Requirement:** RF-REP-008 

**Actor:** Manager 

**User Story:** As a manager, I want to visualize consolidated information through charts and KPI 

indicators to easily interpret the team’s overall results. 

## **Acceptance Criteria:** 

- The system presents bar charts, line graphs, or KPI indicators. 

- Displayed data correspond to consolidated reports. 

## **HU-REP-009** 

## **Related Requirement:** RF-REP-010 

## **Actor:** Sales Advisor 

**User Story:** As a sales advisor, I want to view my own performance metrics, including contacted 

clients, active negotiations, closures, and accumulated billing, so that I can assess my personal 

progress. 

## **Acceptance Criteria:** 

- The system displays updated personal metrics for the advisor. 

- Data include contacted clients, closures, and total billing. 

57 

- The advisor can only view their own information. 

## **CHAPTER 8** 

## **PROTOTYPE** 

## **8.1 Link** 

The prototype of the BOPADIGITAL system was developed using Excalidraw, providing a visual representation of the main modules, navigation flow, and user interface layout. More images and the user flow can be found in the appendix section. The prototype can be accessed through the following link: **BOPADIGITAL Prototype** . 

Figure 8.1 Prototype of BOPADIGITAL 

## **CHAPTER 9** 

## **EVIDENCES** 

## **9.1 Requirements Elicitation Technique** 

For the requirements elicitation process, the development team applied the interview technique with the project’s client representatives from BOPACORP S.A. Through structured interviews, relevant information was gathered regarding the company’s current commercial processes, operational challenges, and expectations for the new system. This technique enabled the team to capture detailed functional and non-functional needs directly from key stakeholders, ensuring that the defined requirements aligned with real business objectives and daily workflows. 

Figure 9.1 Meeting with the managers of BOPACORP S.A. 

## **9.2 Evidence Repository** 

The evidence can be accessed through the following link: **Repository** . 

## **CHAPTER 10** 

## **INDIVIDUAL CONTRIBUTIONS** 

|**Name**|**Contributions**|
|---|---|
|Aragon Intriago Shirley<br>Yamel|Preparation<br>of<br>functional<br>and<br>non-functional<br>requirements, and drafting of user stories.|
|Diaz<br>Osorio<br>Fernando<br>Nahim|Communication with the client and participation in the<br>preparation of the project specifcation document.|
|Muñoz Sanchez Salvador<br>Gabriel|Preparation<br>of<br>functional<br>and<br>non-functional<br>requirements, and coordination of the requirements<br>validation process.|
|Navarrete Castillo Anthony<br>Josue|Preparation of the project prototype and collaboration<br>in the drafting of the specifcation document in LaTeX.|
|Tumbaco Santana Gabriel<br>Alejandro|Communication with the client, preparation of the<br>prototype, and compilation of the fnal LaTeX<br>document.|



Table 10.1 Individual Contributions of the Project 

## **CHAPTER 11** 

## **AUTHORSHIP DECLARATION** 

We, the undersigned members of the BOPADIGITAL development team, hereby declare that the present document titled “BOPACORP S.A. Requirements Specification Document” has been entirely prepared by us as part of the course Software Engineering I at Escuela Superior Politécnica del Litoral (ESPOL). 

We affirm that all sections, analyses, and specifications contained in this document represent our own work and understanding, based on information gathered from the client and the methodologies applied during the software requirements engineering process. 

No part of this document has been copied, plagiarized, or taken from other sources without proper acknowledgment. Any external reference used has been duly cited in the bibliography according to academic integrity standards. 

Each member of the team assumes full responsibility for the authenticity, accuracy, and originality of the content herein. 

**Digital Confirmation:** All members of the team confirm authorship through their electronic submission of this document. 

## **Team Members:** 

Aragon Intriago Shirley Yamel 

Diaz Osorio Fernando Nahim 

Muñoz Sanchez Salvador Gabriel 

Navarrete Castillo Anthony Josue 

Tumbaco Santana Gabriel Alejandro 

## **APPENDIX I** 

**PROTOTYPE** 

**1. Prototype’s Screenshots** 

63 

## a) Advisor’s event view 

## c) Client Document Management 

**==> picture [78 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
b) Client’s profile<br>**----- End of picture text -----**<br>


## d) Create an event associated with a client 

Figure-A I-1 Screenshots of BOPADIGITAL mobile app from the perspective of a Sales Advisor. 

64 

a) Advisor’s assigned clients by assignment date 

b) Monthly performance overview of a sales advisor 

## Figure-A I-2 Screenshots of BOPADIGITAL mobile app from the perspective of a Sales Advisor. 

65 

a) Admin’s event view grouped by Sales Advisor 

b) Clients grouped by state 

c) System’s users grouped by role 

d) Dashboard showing overall client statistics and performance indicators. 

Figure-A I-3 Screenshots of BOPADIGITAL mobile app from the perspective of Management. 

66 

**==> picture [76 x 10] intentionally omitted <==**

**----- Start of picture text -----**<br>
a) Website Home<br>**----- End of picture text -----**<br>


b) Product catalog 

Figure-A I-4 Screenshots of BOPADIGITAL CMS website 

67 

a) Product catalog by section 

b) Web admin view 

Figure-A I-5 Screenshots of BOPADIGITAL CMS website 

68 

Figure-A I-6 Website from the perspective of a sales advisor candidate. 

69 

a) Sales funnel overview 

b) Sales funnel overview 2 

Figure-A I-7 Screenshots of BOPADIGITAL CRM website for sales consultant 

70 

a) Form to create contacts 

b) List of assigned contacts 

Figure-A I-8 Screenshots of BOPADIGITAL CRM website for sales consultant 

71 

a) Table view of all sales advisors 

b) Dashboard of overall business statistics 

Figure-A I-9 Screenshots of BOPADIGITAL CRM form the perspective of Management. 

72 

a) View of the recent activity of all sales advisors 

b) Table view of all clients 

Figure-A I-10 

Screenshots of BOPADIGITAL CRM form the perspective of Management. 

73 

a) View for assigning a client to a sales advisor 

Figure-A I-11 Screenshots of BOPADIGITAL CRM form the perspective of Management. 

## **APPENDIX II** 

## **CLIENT ACCEPTANCE LETTER** 

## **1. Signed Approval Document** 

This appendix contains the official acceptance letter signed by the stakeholder representative of BOPACORP S.A., confirming their agreement with the content of this Requirements Specification Document and validating that it meets the functional and non-functional expectations discussed during the requirements elicitation process. 

## **Carta de aceptación de proyecto BOPADIGITAL** 

Guayaquil, 4 de Noviembre del 2025. 

A la fecha de hoy, ante los documentos presentados, los cuales representan el trabajo realizado hacia el proyecto BOPADIGITAL. En el que se ponen a evidencia los siguientes contenidos: 

- Perfiles de interés en el marco del proyecto (Stakeholders). 

- Funcionalidad básica en formato de requerimientos funcionales del aplicativo móvil establecido. 

- Funcionalidad básica en formato de requerimientos funcionales del sitio web público acordado. 

- Restricciones y limitaciones del alcance del proyecto BOPADIGITAL en formato de requerimientos no funcionales del aplicativo móvil y web acordadas. 

- Casos de uso del proyecto BOPADIGITAL en formato de historias de usuario, separadas y organizadas según perfiles de interés (Stakeholders) del aplicativo móvil y web acordadas. 

- Prototipado e ideación de estructura visual del aplicativo móvil interno acordado. 

- Prototipado e ideación de estructura visual del sitio web público acordado. 

- Prototipo de flujo de navegación básico para el aplicativo móvil y el sitio web acordados. 

Mediante la presente acta de conformidad, el cliente, representado por **Mgtr. Christian Pauta** , declara haber recibido, revisado y aceptado el contenido del documento entregado, reconociendo que refleja adecuadamente lo establecido durante las reuniones y manifestando su conformidad con los puntos especificados previamente, los cuales cumplen con los objetivos planteados para el proyecto BOPADIGITAL. 

De la misma forma, declara su disposición a continuar trabajando con el equipo establecido, en futuras reuniones y discusiones que den lugar para seguir realizando avances en el proyecto ya mencionado. 

Por su parte, el equipo de desarrollo reitera su compromiso a seguir trabajando de manera dinámica y continua, fieles a los intereses que presenta el proyecto, en las siguientes fases de desarrollo del proyecto BOPADIGITAL. 

Recibo conforme y en acuerdo con lo establecido en el presente documento. 

______________________________________ 

**Mgtr. Christian Pauta Propietario Gerente de BOPACORP S.A.** 

## **APPENDIX III** 

## **SIGNED AUTORSHIP DECLARATION** 

## **1. Signatures and Formal Confirmation** 

This appendix includes the signed authorship declaration, in which the members of the development team formally certify that the work presented in this document is original, was produced collaboratively, and complies with the academic and ethical standards established by the institution. The signatures below represent each member’s personal attestation to this statement and their commitment to the document’s authenticity. 

## **FIRMAS - DECLARACIÓN DE AUTORÍA** 

Nombre Firma Fecha ~~ee ee~~ 12/11/2025 Aragon Intriago Shirley Yamel Estudiante de Ingeniería en Computación Escuela Superior Politécnica del Litoral (ESPOL) ~~ea~~ 12/11/2025 Díaz Osorio Fernando Nahim Estudiante de Ingeniería en Computación Escuela Superior Politécnica del Litoral (ESPOL) ~~ae~~ 12/11/2025 Navarrete Castillo Anthony Josué Estudiante de Ingeniería en Computación Escuela Superior Politécnica del Litoral (ESPOL) ~~ara~~ 12/11/2025 Muñoz Sánchez Salvador Gabriel Estudiante de Ingeniería en Computación Escuela Superior Politécnica del Litoral (ESPOL) ~~S| te |~~ 12/11/2025 Tumbaco Santana Gabriel Alejandro Estudiante de Ingeniería en Computación Escuela Superior Politécnica del Litoral (ESPOL) ~~| mat |~~ 

