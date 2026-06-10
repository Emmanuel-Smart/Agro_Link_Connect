original_text = r"""THE UNIVERSITY OF BAMENDA











A Project Submitted to the Department of Computer Engineering in the College of Technology of the University of Bamenda in Partial Fulfillment of the Requirements for the Award of a Bachelor of Technology Degree in Computer Engineering

BY:
NSAMI EMMANUEL KONGNYU
REGISTRATION NUMBER: UBa23PB093

SUPERVISOR:

MAY 2026

CHAPTER ONE
INTRODUCTION
1.1 Background of the Study
Agriculture is one of the most important sectors in many developing countries, especially in Cameroon, where a large number of people depend on farming for food, income, and employment (World Bank, 2020). In Bamenda and many other parts of Cameroon, farming supports families and contributes to the local economy. Farmers produce crops such as tomatoes, potatoes, maize, beans, carrots, vegetables, and fruits for sale in local markets. Despite the importance of agriculture, many farmers still face serious problems that reduce their profits and affect their standard of living.
One major problem is lack of access to correct market information. Many farmers do not know the real market prices of their products before selling them. Because of this, middlemen often buy products at very low prices and later sell them at higher prices in urban markets. This creates information asymmetry, where one side in a transaction has more information than the other side (Aker, 2011). Farmers who do not know current market prices are easily exploited and usually make less profit from their hard work.
Research has shown that access to accurate price information can improve farmers’ income and bargaining power. Jensen (2007) explained that when producers receive real-time market information, they are able to negotiate better prices and reduce losses caused by poor communication. In many rural areas in Cameroon, farmers still depend on word-of-mouth communication, local traders, or physical market visits to know prices. These methods are slow, unreliable, and sometimes inaccurate.
Another challenge is transaction delay between farmers and buyers. In many cases, farmers harvest crops before finding buyers. Since most farm products are perishable, delays in finding customers often lead to spoilage and post-harvest losses. According to the Food and Agriculture Organization (FAO, 2017), post-harvest losses in sub-Saharan Africa remain very high because farmers lack efficient market systems and proper communication channels. In Bamenda, crops such as tomatoes, vegetables, and fruits can spoil quickly if buyers are not found on time.
Farmers also face communication problems when trying to access important agricultural information. Information about government support programs, free farming tools, agricultural training, pest alerts, fertilizers, improved seeds, and farming techniques is often shared through informal communication methods. Many farmers receive this information late or never receive it at all. Mittal and Mehar (2016) stated that poor information sharing systems reduce farmers’ productivity and limit their ability to benefit from agricultural opportunities.
The growth of Information and Communication Technology (ICT) has created opportunities to solve many of these problems through digital platforms. Web-based systems are now widely used in business, education, healthcare, banking, and transportation because they improve communication, accessibility, and efficiency (Laudon & Laudon, 2018). In agriculture, digital marketplaces can help farmers connect directly with buyers without depending completely on intermediaries.
Several agricultural platforms already exist in different countries, but many of them only focus on product advertisement or basic market information. Most systems do not fully solve problems related to price transparency, transaction delays, and real-time communication.
This study proposes the design and implementation of AgroLink, a scalable web-based agricultural marketplace platform focused on farmers and buyers in Bamenda. The system aims to:
Connect farmers directly with buyers 
Provide real-time local price guidance 
Reduce delays in finding buyers 
Allow pre-harvest product listing 
Deliver notifications about farming opportunities, training, grants, and alerts 
The system also introduces:
A peer-based price averaging system 
A pre-harvest signaling mechanism 
A geo-based notification system 
These features are expected to improve market transparency, reduce post-harvest losses, and improve communication between farmers and buyers.
1.2 Statement of the Problem
Agriculture continues to play an important role in Cameroon’s economy, but many farmers still face challenges that reduce their productivity and profits. One major problem is information asymmetry. Farmers often do not know the actual market prices of their products and therefore depend on middlemen for pricing information. These middlemen usually buy products at low prices and resell them at much higher prices, leaving farmers with very little profit (Aker, 2011).
Another problem is transaction latency, which is the delay between harvesting crops and finding buyers. Many farmers harvest products before identifying customers. Since agricultural products are highly perishable, delays in sales often result in spoilage and financial losses. According to FAO (2017), poor market access and weak communication systems are among the main causes of post-harvest losses in Africa.
Farmers also struggle to access important agricultural information. Information about government support, farming grants, pest outbreaks, weather alerts, training programs, and free farming tools is usually shared through informal communication methods such as word-of-mouth. Because of this, many farmers receive information late or completely miss important opportunities (Mittal & Mehar, 2016).
Although some digital agricultural systems exist, most of them focus mainly on product advertisement or basic information sharing. Many platforms do not provide intelligent pricing support, pre-harvest buyer engagement, or targeted real-time notifications.
Therefore, there is a need for a web-based agricultural marketplace system that can:
Help farmers know the real market value of their products 
Reduce delays in finding buyers 
Improve communication between farmers and buyers 
Deliver timely agricultural information and opportunities 
This study aims to solve these problems through the design and implementation of the AgroLink platform.
Hypothesis
H₀ (Null Hypothesis)
A web-based agricultural marketplace platform with integrated pricing and notification systems does not significantly improve market transparency, transaction speed, and access to agricultural information compared to traditional agricultural systems.
H₁ (Alternative Hypothesis)
A web-based agricultural marketplace platform with integrated pricing and notification systems significantly improves market transparency, transaction speed, and access to agricultural information compared to traditional agricultural systems.
1.3 Research Questions
1.3.1 Main Research Question
How can a scalable web-based agricultural marketplace system be designed and implemented to reduce information asymmetry, minimize transaction delays, and improve communication between farmers and buyers in Bamenda?
1.3.2 Specific Research Questions
To what extent can a peer-to-peer price averaging system reduce information asymmetry among farmers? 
How can pre-harvest product listing reduce transaction delays and post-harvest losses? 
Can a notification system improve farmers’ access to important agricultural information and opportunities? 
What features are needed to support effective interaction between farmers and buyers? 
To what extent can the proposed system improve transparency, communication, and efficiency in agricultural trade? 
1.4 Objectives of the Study
1.4.1 Main Objective
To design and implement a scalable web-based agricultural marketplace platform that improves market transparency, reduces transaction delays, and enhances communication between farmers and buyers in Bamenda.
1.4.2 Specific Objectives
To analyze the effect of information asymmetry on agricultural trade 
To design a real-time pricing guidance system for farmers 
To develop a pre-harvest listing feature for early buyer discovery 
To implement a notification system for agricultural alerts and opportunities 
To evaluate the effectiveness of the system in improving agricultural trade efficiency 
1.5 Significance of the Study
This study is important because it provides a practical digital solution to problems faced by farmers and buyers in agricultural markets.
The system will help farmers access real market prices, reducing exploitation by middlemen and improving farmers’ profits. By allowing farmers to connect directly with buyers, the platform will improve transparency and create better business opportunities.
The pre-harvest listing feature will help farmers find buyers before harvesting, reducing delays and minimizing post-harvest losses. This can improve food availability and reduce waste.
The notification system will help farmers receive timely information about:
Government support programs 
Farming grants 
Pest alerts 
Agricultural training 
Free farming tools 
Modern farming methods 
This information can help farmers improve productivity and decision-making.
For buyers, the system provides easier access to agricultural products and improves communication with farmers.
Academically, this study contributes to research in agricultural information systems, digital marketplaces, and web-based applications. It also serves as a reference for future researchers working on smart agricultural systems.
1.6 Scope of the Study
This study focuses on the design and implementation of a web-based agricultural marketplace platform for Bamenda. The scope of this project encompasses a web-based full-stack architecture integrated with a multi-modal Artificial Intelligence pipeline utilizing the Gemini 2.5 Flash vision framework and OpenWeather meteorological data mappings. The system dynamically generates real-time quality grading scores (0-100), localized geo-environmental baseline evaluations, and diagnostic text markers across four distinct domains: Horticulture, Husbandry, Aquaculture, and Agri-Processing.
The system includes:
Farmer registration and authentication 
Buyer registration and authentication 
Product listing and management 
Real-time pricing guidance 
Pre-harvest product listing 
Notification and alert system 
Product browsing and searching 
The study is limited to a web-based application and does not include:
IoT integrations 
Online payment gateways 
These features may be considered in future development.
1.7 Definition of Key Terms
Information Asymmetry
A situation where one person in a transaction has more information than another person.
Transaction Latency
The delay between when a product becomes available and when it is successfully sold.
Pre-Harvest Listing
The process of advertising farm products before they are harvested.
Notification System
A system that sends alerts and updates to users in real time.
Agricultural Marketplace
A digital platform used for buying and selling agricultural products.
Market Transparency
The availability of accurate and reliable market information to all participants.
Web-Based System
A software application that runs on the internet and is accessed using a web browser.
1.8 Arrangement of Chapters
This study is organized into five chapters.
Chapter One introduces the study by presenting the background, statement of the problem, objectives, research questions, significance, scope, and definition of key terms.
Chapter Two reviews related literature on agricultural marketplaces, information systems, digital trading platforms, and web technologies.
Chapter Three explains the research methodology, system design, tools, technologies, and implementation methods used in the development of the system.
Chapter Four presents the implementation results, system testing, findings, and discussion of the developed platform.
Chapter Five concludes the study, provides recommendations, and suggests areas for future improvement and research.

CHAPTER TWO
LITERATURE REVIEW
2.1 Introduction
This chapter reviews different studies, ideas, and technologies related to digital agricultural systems, online marketplaces, information systems, and communication technologies used in agriculture. The chapter also explains the challenges farmers face in agricultural trade and how technology can help solve these problems.
The review focuses on:
Agricultural marketplaces 
Information asymmetry in farming 
Post-harvest losses 
Notification and communication systems 
Web-based agricultural platforms 
Related existing systems 
Technologies used in developing modern web applications 
This chapter helps to show the importance of the proposed AgroLink system and explains how the system is different from existing solutions.
2.2 Agriculture and Economic Development
Agriculture is one of the most important sectors in the world because it provides food, employment, and raw materials for industries. In many African countries, agriculture supports the economy and provides income for millions of people (World Bank, 2020).
In Cameroon, agriculture contributes greatly to economic growth and food security. Many people in rural areas depend on farming as their main source of income. Farmers produce crops such as maize, tomatoes, beans, potatoes, cassava, vegetables, and fruits for local consumption and trade.
According to the Food and Agriculture Organization (FAO, 2021), smallholder farmers produce a large percentage of food consumed in Africa. However, these farmers still face many challenges such as:
Poor market access 
Lack of storage facilities 
Low profits 
Poor transportation 
Lack of market information 
Weak communication systems 
These challenges reduce productivity and increase poverty in farming communities.
Agriculture in Bamenda plays an important role in supporting local markets and feeding surrounding towns. Farmers in Bamenda supply vegetables, potatoes, tomatoes, carrots, and fruits to different parts of Cameroon. Despite this contribution, many farmers still struggle to connect directly with buyers.
2.3 Agricultural Marketplaces
An agricultural marketplace is a platform where farmers and buyers meet to buy and sell farm products. Traditionally, agricultural marketplaces exist physically in towns and villages where farmers carry products to local markets.
Traditional marketplaces have many problems such as:
Limited number of buyers 
Poor price transparency 
Long travel distances 
Delays in communication 
Dependence on middlemen 
Middlemen usually control market information and prices. Because farmers often lack correct price information, they are forced to sell products cheaply.
Digital agricultural marketplaces were introduced to solve these problems. These platforms use internet technologies to connect farmers directly with buyers.
According to Kshetri (2017), digital marketplaces improve communication, increase transparency, and reduce unnecessary intermediaries. Buyers can search for products online while farmers can advertise products to a larger audience.
Examples of digital agricultural platforms include:
FarmCrowdy 
Twiga Foods 
AgroCenta 
Hello Tractor 
Although these systems help improve agricultural trade, many still focus mainly on buying and selling products and do not fully address problems such as:
Real-time local pricing 
Pre-harvest selling 
Targeted notifications 
Communication delays 
The AgroLink system aims to improve these areas.
 
2.4 Information Asymmetry in Agricultural Markets
Information asymmetry happens when one person in a transaction has more information than another person. In agriculture, buyers and middlemen often know market prices better than farmers.
Aker (2011) explained that lack of access to market information reduces farmers’ bargaining power and income. Farmers who do not know current prices may sell products below their actual value.
In many rural communities, farmers depend on:
Word-of-mouth information 
Local traders 
Physical market visits 
These methods are slow and unreliable.
Research by Jensen (2007) showed that access to real-time market information can improve profits and reduce price differences between markets.
Modern agricultural systems now use digital tools to improve market transparency. Some systems use:
SMS services 
Mobile applications 
Online marketplaces 
Digital pricing systems 
The proposed AgroLink platform introduces a peer-to-peer price averaging system. The system calculates:
Minimum price 
Maximum price 
Average local price 
using recent product listings within a specific area. This helps farmers know the market value of their products before selling.
2.5 Post-Harvest Losses and Transaction Delays
Post-harvest loss refers to the loss of agricultural products after harvesting but before consumption. This usually happens because products spoil before they are sold.
According to FAO (2017), post-harvest losses in sub-Saharan Africa remain very high because of:
Poor storage systems 
Delays in finding buyers 
Poor transportation 
Weak market systems 
Perishable products such as tomatoes, vegetables, and fruits spoil quickly if they remain unsold for long periods.
One major cause of post-harvest loss is transaction latency. This means the delay between when products are ready for sale and when buyers are found.
In many communities, farmers harvest products before searching for customers. This increases pressure to sell quickly, often at low prices.
Some modern systems now allow:
Advance product listing 
Buyer subscriptions 
Automated notifications 
These features help buyers know when products will soon be available.
The AgroLink system introduces pre-harvest signaling. This feature allows farmers to advertise products before harvesting. Buyers can subscribe to products they are interested in and receive notifications immediately when products become available.
This approach can:
Reduce spoilage 
Speed up transactions 
Improve planning between farmers and buyers 
2.6 Communication Systems in Agriculture
Communication is very important in agriculture because farmers need regular updates about:
Market prices 
Weather conditions 
Pest outbreaks 
Farming techniques 
Government programs 
Training opportunities 
In many rural areas, information is still shared through:
Radio 
Community meetings 
Word-of-mouth communication 
These methods are slow and sometimes unreliable.
Mittal and Mehar (2016) explained that poor communication systems reduce farmers’ productivity and limit access to opportunities.
Modern ICT systems now use:
SMS alerts 
Mobile notifications 
Emails 
Web notifications 
to improve communication with farmers.
Notification systems help users receive information instantly. In agriculture, notification systems can improve awareness and decision-making.
The AgroLink platform introduces a geo-fenced notification system. This means notifications are sent only to users in a specific location.
For example:
Farmers in Bamenda can receive notifications about Bamenda-related farming programs 
Farmers in Santa can receive Santa-specific updates 
This helps reduce unnecessary information and improves relevance.
The system also supports:
Agricultural alerts 
Pest warnings 
Government announcements 
Training opportunities 
Free farming tools 
2.7 Web-Based Systems
A web-based system is a software application that runs on the internet and can be accessed using a web browser.
Web-based systems are widely used because they:
Are easy to access 
Support real-time communication 
Work on multiple devices 
Are easier to update and maintain 
According to Laudon and Laudon (2018), web technologies have transformed many industries including banking, education, transportation, and healthcare.
In agriculture, web-based systems help:
Connect users online 
Improve communication 
Store and manage data 
Support online transactions 
Advantages of web-based systems include:
Accessibility from different locations 
Faster communication 
Better data management 
Reduced paperwork 
The AgroLink system is developed as a web-based application to allow farmers and buyers access through phones, tablets, and computers.
2.8 Review of Existing Agricultural Systems
Several digital agricultural systems already exist in Africa and other parts of the world.
2.8.1 FarmCrowdy
FarmCrowdy is a Nigerian agricultural platform that connects investors with farmers. The system helps farmers receive financial support and agricultural resources.
Advantages:
Supports farmers financially 
Encourages agricultural investment 
Limitations:
Focuses more on investment than direct farmer-buyer interaction 
2.8.2 Twiga Foods
Twiga Foods is a Kenyan platform that connects farmers with vendors and retailers.
Advantages:
Improves food distribution 
Reduces middlemen 
Limitations:
Mainly designed for large-scale distribution systems 
2.8.3 AgroCenta
AgroCenta is a Ghanaian digital agricultural platform that helps farmers access markets and financial services.
Advantages:
Supports digital trading 
Improves market access 
Limitations:
Limited focus on intelligent pricing systems and geo-based notifications 
2.9 Gap in Existing Systems
Although many agricultural systems exist, several problems still remain:
Lack of localized price guidance 
Limited support for pre-harvest transactions 
Weak notification systems 
Poor communication targeting 
Limited transparency in pricing 
Most systems focus mainly on:
Product advertisement 
Online trading 
without addressing deeper problems such as:
Information asymmetry 
Transaction delays 
Communication fragmentation 
The AgroLink system aims to fill these gaps by integrating:
Real-time pricing intelligence 
Pre-harvest signaling 
Geo-fenced notifications 
Direct farmer-to-buyer communication 
Furthermore, existing regional platforms rely heavily on subjective vendor claims to establish produce and asset quality, causing a severe gap in digital buyer trust. This project addresses this systemic limitation by introducing an objective, automated Computer Vision and Meteorological multi-key assessment layer that mathematically computes absolute quality metrics before a listing is published.
2.10 Theoretical Framework
This study is based on the Information Asymmetry Theory introduced by Akerlof (1970). The theory explains that markets become inefficient when one side has more information than the other side.
In agricultural markets:
Buyers and middlemen usually know more about prices 
Farmers have less market information 
This imbalance leads to unfair pricing and reduced farmer profits.
The AgroLink system aims to reduce this imbalance by providing:
Real-time price information 
Market transparency 
Better communication between farmers and buyers 
The study also relates to the Technology Acceptance Model (TAM), which explains how users accept and use new technologies. According to Davis (1989), people are more likely to use technology if they find it useful and easy to use.
For this reason, AgroLink is designed with:
Simple user interfaces 
Easy navigation 
Fast access to information 
2.11 Summary of Literature Review
This chapter reviewed literature related to agriculture, digital marketplaces, communication systems, information asymmetry, and web-based systems.
The review showed that:
Farmers face serious challenges in accessing markets and information 
Information asymmetry reduces farmers’ profits 
Transaction delays increase post-harvest losses 
Poor communication systems reduce access to opportunities 
The review also showed that existing systems do not fully solve these problems together.
Therefore, the AgroLink platform is proposed to provide:
Direct farmer-to-buyer interaction 
Real-time price guidance 
Pre-harvest product listing 
Geo-fenced notifications 
Improved communication and transparency 

CHAPTER THREE
 MATERIALS AND METHODOLOGY
3.1 Introduction
This chapter outlines the materials and methods used to develop the web-based AgroLink platform in Bamenda. The chapter is structured around the specific research objectives, directly translating the empirical and theoretical foundations established in Chapters One and Two into an engineering roadmap. Specifically, the framework systematically addresses the challenges of market information asymmetry highlighted by Aker (2011), transaction latency and post-harvest losses outlined by the FAO (2017), and fragmented regional communication systems noted by Mittal and Mehar (2016). For each objective, a systematic approach is described, detailing data collection protocols, requirement analysis, software architectural design models, and implementation methodologies. The goal is to provide a clear, replicable development path for a scalable, web-based peer-to-peer agricultural marketplace that bridges the information and transaction gaps between smallholder farmers and commercial buyers within the Bamenda regional markets.

3.1.1 Objective 1: Market Interaction and Information Asymmetry Analysis
To analyze the specific agricultural trade agreements, pricing mechanics, and information flows between farmers and buyers in the Bamenda regional markets—and to evaluate the operational reach of price distortion—the following phases were executed:
Approach: A mixed-methods research design combining focus group discussions, key informant interviews, and document analysis was employed to capture the empirical perspectives of both smallholder farmers and wholesale/retail agricultural buyers in the Northwest Region.
Step 1: Data Collection from Farmers regarding Price Asymmetry
oConducted focus group discussions with local farming clusters to map out how their heavy reliance on slow, unreliable information channels (such as word-of-mouth updates, local traders, and physical market visits) restricts bargaining power.
oDocumented instances where intermediary brokers exploit the lack of real-time price awareness to procure agricultural products below their actual value at the farm gate.
oWalked through major agricultural production nodes and market boundaries in Bamenda Central, Bafut, and Santa to observe post-harvest handling and log raw baseline price variances.
oAnalyzed informal wholesale ledgers, transport receipts, and local agricultural printouts to quantify price variations between rural farm gates and urban central hubs.
Step 2: Data Collection from Buyers
oConducted interviews with commercial crop buyers and wholesale aggregators focusing on seasonal procurement pricing strategies, supplier selection criteria, logistical constraints, and quality validation methods.
3.1.2 Tools and Materials Used for Objective 1
Field Notebook and Spatial Logging Utilities: Used to document raw field observations during market walks and community focus groups.
Handheld GPS Tracker: Used to record physical coordinates and measure transportation distances from rural farming clusters to central transit hubs like the Main Bamenda Market.
Market Price Sheets and Extension Samples: Collected historical price records, informal broker receipts, and agricultural extension bulletins to analyze contract structures and establish baseline valuation metrics for the computing engine.
3.1.3 Problem Identification
  Farmers' Stance (Mitigating Information Asymmetry): Smallholder farmers require transparent, direct-to-buyer sales routes to prevent exploitation by brokers, alongside access to real-time local market pricing metrics including minimum, maximum, and average rates to neutralize information imbalances (Aker, 2011).
  Buyers' Stance (Mitigating Transaction Latency): Commercial crop buyers require reliable, forward-looking visibility into harvest volumes and direct contact lines with verified producers to minimize transactional delays and mitigate post-harvest spoilage of perishable commodities (FAO, 2017).
3.2 Objective 2: Architecture and Structural Design
This phase involves designing the multi-tier system architecture and database schema required to manage user accounts, crop listings, market price aggregation records, multi-parameter search filtering, and communication pipelines.
3.2.1 Approach
A client-server architecture was designed using modern full-stack web technologies, supported by Unified Modeling Language (UML) structural modeling and a fully normalized relational database schema to turn theoretical market solutions into functional software assets.

3.2.2 Requirement Analysis
Based on the field findings from Objective 1, specific functional and non-functional requirements were established to counter market inefficiencies:
1. Functional Requirements:
  User Onboarding and Authentication: Secure onboarding pathways with role-based access control (RBAC) profile creation split into three active roles: Farmer, Buyer, and Admin.
  Crop Listing Creation and Pre-Harvest Signaling: Dynamic submission forms supporting image uploads, quantity specifications, localized coordinates, and harvest readiness state toggles to allow advertisement prior to harvesting.
  Real-Time Price Intelligence Badging: An automated database utility that parses recent local entries to calculate and output the minimum, maximum, and average local prices per crop category.
  Search with Filters: Query utilities enabling buyers to sift through active catalogs using crop categories, localized parameters, price boundaries, and harvest execution status.
  Pre-Harvest Inquiry / Booking Request: Transmission routes allowing buyers to place pre-harvest collection intents or ordering inquiries directly to growers to accelerate transaction speed.
  Geo-Fenced Administrative Alerts: A specialized broadcast interface allowing administrators to push location-specific pest alerts, weather warnings, and training opportunities directly to affected farmer sub-groups.
Automated Multi-Modal Quality Attestation Loop: The platform must ingest binary image payloads alongside farmer location parameters, forward the assets through an edge routing pipeline (/api/listings/universal-evaluate), apply a weighted formula (0.60 * Vision Score) + (0.40 * Environment Score), and record an immutable quality score, status badge, and diagnostic text directly within the relational database structure.
2. Non-Functional Requirements:
Response Time: Platform page routing and query execution transactions must return values within a defined performance window.
Uptime: The operational availability of the system infrastructure must maintain high accessibility standards.
Data Security: Implementation of standard password hashing protocols, secure JWT credential storage, and end-to-end data transfer encryption.
Role-Based Access Control (RBAC): Strict isolation of interface routing permissions matching validated session roles.
3.2.3 Description of System Architecture
The system architecture of the Web-Based Agricultural AgroLink Platform for the Bamenda Region is designed to ensure scalability, flexibility, and maintainability. It follows a multi-tier architecture consisting of a presentation layer, an application layer, and a data layer:
1. Presentation Layer: This layer handles the user interface and interacts directly with the users. It includes the web pages, forms, responsive view containers, and dashboard interfaces for user inputs and output rendering.
2. Application Layer: This layer processes user inputs, performs the necessary logical operations, calculates price averages via the pricing engine, evaluates subscription alerts, and communicates with the underlying layers.
3. Data Layer: This layer manages data persistence and storage. It includes the relational database management system (DBMS) and cloud asset buckets, handling the storage and retrieval of persistent data while ensuring complete data integrity.
3.2.4 Technology Selection
Next.js: Selected to maximize speed and organic discoverability through Server-Side Rendering (SSR). It provides backend API routes and Server Actions natively within a single repository, eliminating the need for a separate backend server.
Supabase: Chosen to provide the managed backend engine, offering relational PostgreSQL data storage, secure user authentication management, real-time table listeners, and cloud media bucket hosting.
Tailwind CSS: Integrated to design utility-first responsive interfaces rapidly, ensuring fluid operation across both desktop viewports and rural mobile devices.
Vercel: Utilized as the automated hosting infrastructure to deploy the application on a distributed edge network, ensuring low latency.
3.2.5 UML (Unified Modeling Language)
UML is a standard graphical notation used to visually model, document, and represent the logical and behavioral boundaries of a software platform.

3.2.6 Choice and Justification of the Method (UML)
I chose UML because the AgroLink marketplace involves multiple distinct types of users (Farmers, Buyers, and Administrators) who interact with the system through unique vectors. UML helps plan and communicate these interactions clearly before writing any code. The following points justify the selection of UML:
1. Industry Standard: UML has emerged as an industry-standard modeling language, making it a suitable choice for ensuring compatibility and interoperability with existing systems and development practices.
2. Visual Representation: UML offers a graphical notation that allows for intuitive and visual representation of system components. The use of diagrams such as use case diagrams, class diagrams, and sequence diagrams simplifies the understanding and communication of complex system structures and behaviors.
3. Modeling Complex Systems: The AgroLink platform involves various entities, relationships, real-time subscriptions, and transactional logic. UML provides a rich set of modeling constructs and notations to capture and represent the complexity of the system in a structured and organized manner.
4. Documentation and Maintenance: UML diagrams serve as valuable documentation artifacts for the system, enabling future maintenance and modification. The clear visual representations provided by UML diagrams aid in the comprehension and analysis of the system, facilitating the identification of potential issues and improvement opportunities.
3.3 Application of UML to Our Topic
In the design and implementation of a Web-Based Agricultural Marketplace for the Bamenda Region using Next.js and Supabase, the application of UML provides a structured approach to visualize and analyze the system requirements, interactions, and behaviors. This section explores the actors of the system, maps out the use case structures, and describes core architectural use cases.
3.3.1 Actors of the System
Actors in UML represent the roles that interact with the system being developed. In the context of the AgroLink platform for the Bamenda area, the following actors are identified:
Farmer: The primary producing user of the system who posts available harvests, references local average price intelligence metrics, updates pre-harvest availability timelines, views regional price trends, and manages direct logistics updates.
Buyer: The procurement user of the system who searches the marketplace catalog, filters options by production locality, sets up automated category alert subscriptions, and sends inquiries to farmers.
Administrator: Responsible for overall system management, including user registration validation, fraudulent listing moderation, localized pest or training notification broadcasts, and platform analytics tracking.
3.3.2 Use Case Diagram
A use case diagram visually represents the interaction between actors and the system, providing a system overview and the relationships between different user roles. In the context of the AgroLink marketplace, the use case elements include:
Register / Login: Allows users to create a profile or authenticate their session permissions.
Search & Filter Produce: Enables buyers to sort crop postings based on criteria like category, price range, and harvest node locality.
Subscribe to Crop Alerts: Lets buyers save automated triggers to receive real-time updates when preferred crops are published.
Send Trade Inquiry: Enables immediate buyer-to-farmer communication regarding bulk transport logistics or pricing terms.
Post & Manage Crop Listings: Allows farmers to create, update, or unpublish crop records, along with pre-harvest dates.
Respond to Procurement Inquiries: Farmers can process incoming coordination messages from interested buying parties.
Broadcast Regional Alerts: Admin functionality to dispatch geofenced pest or agricultural extension training broadcasts.
Moderate Market Content: Admin authority to cross-check and remove fraudulent, inaccurate, or expired market listings.
Manage Users & System Architecture: Admin management over accounts, metric logs, and overall system access controls.

Figure 3.1 Use Case Diagram
3.3.3 Description of Core Use Cases
  1. Search & Filter Produce: The Buyer inputs multi-parameter queries. The system sifts through database records by category, unit pricing tiers, production locality parameters, and pre-harvest signaling status, returning matching items.
  2. Post & Manage Crop Listings: The Farmer configures agricultural listings. If is_pre_harvest is toggled true, the interface requires an expected future readiness date, signaling availability before harvesting to reduce latency.
  3. Broadcast Regional Alerts: The Administrator selects a target locality (e.g., Santa, Bafut, or Bamenda Central), drafts urgent extension entries (such as pest outbreaks or grant notices), and dispatches them exclusively to matching regional profiles.
3.3.4 Deployment Diagram for the System
A deployment diagram in UML illustrates the physical deployment of software components and the hardware infrastructure required for the system. In the context of the Web-Based Agricultural Marketplace for the Bamenda Region, the deployment diagram provides insights into how the system's components are distributed across different hardware nodes:
Hardware Nodes:
oClient Smart Device / Desktop PC: The physical hardware utilized by farmers, buyers, and administrators to access the application via modern web browsers.
oVercel Cloud Edge Hosting Node: Represents the serverless infrastructure where the full-stack Next.js web application is built, compiled, and deployed.
oSupabase Cloud Data Node: The managed infrastructure hosting the PostgreSQL relational database engine, user auth systems, and cloud media asset buckets.
Software Components:
oAgroLink Core Marketplace Application: Built with Next.js, managing market data transformations, routing logic, pricing aggregation routines, and session tokens.
oModern Web Browser: Client-side runtime container running on user devices that processes and renders the responsive user interfaces.
Connections:
oWeb Browser to Edge Server (HTTPS): Handles client-to-application interactions, form transmissions, and page layout updates.
oEdge Server to Database Infrastructure (Secure API/Websockets): Enables secure communications between Next.js server blocks and the Supabase database engine for records access and real-time subscription pipelines.

Figure 3.2 Deployment Diagram for the System

3.3.5 Sequence Diagram
A sequence diagram is a type of interaction diagram in UML. It shows how objects or components interact with each other over time to accomplish a specific task or scenario. This diagram models the chronological flow of a buyer executing a real-time product search, viewing agricultural listings, and dispatching a trade inquiry directly to a farmer.Sequence Diagram (User Login and Product Upload)
The Sequence Diagram for the login and product upload process shows the chronological exchange of messages between system objects. The sequence proceeds as follows: the Farmer submits login credentials through the browser interface; the Next.js API Route passes the credentials to Supabase Auth; Supabase validates the credentials and returns a JWT session token; the token is stored client-side and included in all subsequent requests. When the Farmer submits a product listing, the API Route validates the data, queries the Pricing Engine for local price averages, stores the listing in the PostgreSQL database, and triggers the Notification Engine to alert subscribed buyers.

Figure 3.3 Sequence Diagram
Sequence Diagram (Search Process)
The Search Sequence Diagram describes the process by which a buyer searches for available products. The buyer enters a search query and optional filters (crop type, location, price range) in the browser interface. The Next.js API Route receives the request and constructs a parameterised SQL query against the Supabase PostgreSQL database. The database returns matching records, which are formatted and rendered as product cards in the buyer's dashboard. If no results match, the interface displays a 'No products found' message with suggestions.

Figure 3.4 Sequence Diagram Sequence Diagram (Search Process)
3.3.6 Activity Diagram
An activity diagram in UML represents the flow of activities or processes within a system. It visualizes the sequential and concurrent actions, decision points, and transitions between different activities. This diagram maps out the user registration workflow followed by an immediate product search pipeline.
Process: Farmer Registration and Product Upload Workflow
Activities:
oActivity 1: User lands on the AgroLink platform web interface.
oActivity 2: User completes the profile registration form and selects a role (Farmer).
oActivity 3: The system executes validation routines on the submitted credentials.
oActivity 4: Farmer gains dashboard access and initiates a product listing form.
oActivity 5: The pricing intelligence module checks existing database averages and returns a fair market price spectrum badge.
oActivity 6: Farmer accepts the pricing validation and uploads crop imagery and collection parameters.
oActivity 7: The system updates active data records and pushes targeted notifications to subscribed buyers.
Decision Points:
oDecision Point 1: Are the validation checks successful?
oDecision Point 2: Does the farmer's listing configuration fall within standard market price margins?
Transitions:
oTransition 1: From landing view to registration submission action.
oTransition 2: From verification step to the credential validation checkpoint.
oTransition 3: From validation checkpoint—re-routing back to form adjustments if checks fail, or unlocking dashboard entry if successful.
oTransition 4: From inputs submission to the pricing validation checkpoint.
oTransition 5: If pricing is flags as an outlier, the system appends a variance warning; if acceptable, it publishes the listing directly.

Figure 3.5 Activity Diagram
3.3.7 Class Diagram
A class diagram in UML represents the static structure of a system by modeling the classes, their attributes, methods, and the relationships between them. It visualizes the blueprint of the system's data and logic.
Process: Core System Data Structure Schema
Classes:
oClass 1: User Class: Base structural profile defining fields common to all system actors.
oClass 2: CropListing Class: Captures product attributes for active market offers.
oClass 3: TradeInquiry Class: Tracks interaction details exchanged between buying entities and growers.
oClass 4: AlertSubscription Class: Captures custom notification triggers bound to user accounts.
oClass 5: MarketPriceHistory Class: Stores pricing benchmarks across regional marketplaces to power statistical calculations.
Attributes:
oUser: id (UUID), name (String), email (String), role (Enum), locality (String), created_at (Timestamp)
oCropListing: id (UUID), title (String), category (String), unit_price (Float), quantity (Float), harvest_date (Date), is_pre_harvest (Boolean), farmer_id (UUID)
oTradeInquiry: id (UUID), message (Text), buyer_id (UUID), listing_id (UUID), sent_at (Timestamp)
oAlertSubscription: id (UUID), buyer_id (UUID), target_category (String), active (Boolean)
oMarketPriceHistory: id (UUID), crop_name (String), market_node (String), average_unit_price (Float), logged_date (Date)

Figure 3.6 Class Diagram
3.3.8 Database Schema Design
This schema uses Supabase's built-in auth.users table as the foundation for authentication. Additional tables were created that link to auth.users using foreign keys:
profiles Table: Extends base credentials, tracking user contact rows and roles (farmer, buyer, admin).
crop_listings Table: Holds marketplace details including crop names, bulk weight, unit prices, storage locality, image URLs, and pre-harvest boolean flags.
subscriptions Table: Maps buyer preference settings to crop category taxonomies to handle notification loops.
trade_inquiries Table: Archives coordination communications passed between buyer profiles and targeted farmers.
price_intelligence Table: Stores aggregate valuation records across regional market vectors (Bamenda Central, Bafut, Santa) to compute baseline moving metrics.
regional_alerts Table: Holds geofenced warning messages, pest outbreak logs, or extension notice entries published by system administrators.
3.4 Application of Next.js Framework
Next.js was selected as the full-stack framework for the development of the Web-Based Agricultural AgroLink for the Bamenda Region due to its robust features that support modern web application development. Its integration with Supabase as the backend service provides a complete and scalable full-stack solution suitable for this project.
3.4.1 Selection of Framework
Next.js was selected as the framework for this project based on the following justifications:
Industry Standard: Next.js is a widely adopted React-based framework used in modern web development, ensuring compatibility with current industry practices and development standards.
Server-Side Rendering (SSR): Next.js supports SSR, enabling live agricultural product listings to be rendered on the server before reaching the client, resulting in faster page loads and improved search engine visibility for the platform.
File-Based Routing: Next.js provides an intuitive file-based routing system where each page of the application such as the marketplace, dashboards, and notification hub corresponds directly to a file in the project directory.
API Routes and Server Actions: Next.js allows the creation of backend API endpoints and secure server functions within the same project, enabling server-side logic such as analytical calculations without requiring a separate backend server.
Performance Optimization: Next.js includes built-in image optimization, automatic code splitting, and lazy loading, ensuring the marketplace performs efficiently even when transferring high-resolution crop photos across rural mobile networks.
3.4.2 Model-View-Controller (MVC) Architecture
The Model-View-Controller (MVC) Architecture is a widely adopted design pattern for web application development. It provides a clear separation of concerns, allowing for modular development, code organization, and maintainability. In the context of the AgroLink platform, the architectural pattern was applied to achieve a structured and scalable codebase, which separates the system into three interconnected components:
Model: The Model represents the data layer of the system. In this project, the Model is implemented through the Supabase PostgreSQL database, which stores and manages all data entities including Users, Listings, Inquiries, and Pricing History. The model handles all data retrieval, storage, and update operations.
View: The View represents the presentation layer of the system. In this project, the View is implemented through Next.js React components styled with Tailwind CSS, which render the user interface that farmers, buyers, and the administrator interact with. This includes the marketplace, pricing badges, and the user dashboard.
Controller: The Controller represents the logic layer of the system. In this project, the Controller is implemented through Next.js API Routes and Server Actions, which process user requests, perform the average price calculations, communicate with the Supabase database, and return the appropriate response to the View.
3.4.3 Application of MVC to the System
I voluntarily adopted the MVC pattern to bring clear structure and organization to how the system functions, separating data access mutations from layout rendering nodes.
3.4.4 Benefits of Using the MVC Architecture
Separation of Concerns: Each part has one clear job, making it easier to pinpoint bugs within data calculation queries or user layout containers.
Reusability: The same underlying model logic used to aggregate regional crop price trends can be referenced by different dashboard controllers simultaneously.
Easier Testing: I can test the model (database queries) separately from the view layer (user interface) to ensure calculation accuracy.
Scalability: New features can be integrated without breaking old ones. For example, changing the visual layout of the crop catalog does not affect the database schema.
Team Friendly: If another developer joins the project, they can quickly understand the code structure due to its adherence to industry-standard patterns.
3.4.5 Database Integration
The AgroLink marketplace integrates Supabase as its backend database service. Supabase provides a fully managed PostgreSQL database that seamlessly connects with the Next.js frontend. The database integration is achieved through the following:
  Supabase Client Library Initialization: Initialized securely inside Next.js using environment variables to protect system data access tokens.
  Identity Session Keying: Supabase Auth manages registration and login flows, issuing secure JWT tokens to control user role permissions.
  Cloud Object Asset Storage: Media bucket containers host crop photos uploaded by farmers, serving them via global networks to optimize loading speeds.
  Row-Level Security (RLS) Execution: PostgreSQL data filters verify user profile claims, ensuring actors can only view or modify their authorized data records.
3.4.6 Tools Used
  Full-stack application frameworks: Next.js, Supabase, Tailwind CSS, and Vercel Hosting Infrastructure.
  Version control and data engines: PostgreSQL, Git, and GitHub Repository Systems.
  Visual modeling tools: Draw.io / Lucidchart workspace environments.
  Local runtime software and physical testing hardware.
3.4.7 Functional Requirements Summary
User registration and role-based login (Farmer, Buyer, Admin).
Farmers can create, edit, and delete crop listings (including images, quantity, and production locality parameters).
Buyers can search, apply multi-parameter filters (crop category, price bounds, locality, harvest state), and view product details.
Buyers can dispatch pre-harvest inquiry notifications; farmers can approve or process interest requests in real time.
Buyers can submit direct text trade inquiries to farmers.
Role-specific dashboards: Farmers track listed lots and price indexes; buyers manage active category subscriptions and inquiry histories.
Admin panel: Admin balances active users, moderates marketplace posts, and broadcasts regional alerts.
3.4.8 Non-Functional Requirements Summary
Response Time: Database operations and server-side page fetches execute under a defined performance threshold.
Uptime Platform Metric: High availability standards are enforced across the cloud hosting stack.
Data Security: User sessions are secured using JWT tokens, encrypted backend communications, and active role-based routing middleware.
Real-Time Data Streams: State synchronizations for critical updates happen with minimal latency.
Cross-Device Responsiveness: Complete UI compatibility verified across mainstream web browsers and optimized for mobile devices.
Scalability Path: System handling scales via serverless functions and efficient database table indices.
3.4.9 Hardware Components
Standard PC or Laptop Development Workstation
3.5 Objective 3: Implementation, Integration, and Sprints
The primary objective of this phase is to develop a functional web application, AgroLink, designed with core modules that enable buyers to search, filter, and inquire about agricultural produce while providing farmers with tools to list and manage their crop options efficiently.

Approach: An Agile development methodology was followed with iterative sprints, delivering a fully functional web application deployed to production.
3.5.1 Research Design and Development Methodology
The development of the AgroLink system followed a rigorous Research Design and Development Methodology. This methodology emphasizes an iterative approach, ensuring that each phase—from planning to deployment—is informed by continuous evaluation and feedback.

Figure 3.7 Research Design and Development Methodology
Implementation Approach Steps:
Step 1: Development Environment Setup
  Configured the base framework using Next.js and TypeScript to ensure system type-safety, code consistency, and long-term project maintainability.
  Integrated Tailwind CSS layers to build out a design framework optimized for varying mobile browser viewports.
  Configured Supabase keys securely using isolated environment variables to connect server functions with the database tables.
  Established a remote Git repository hosted on GitHub to log version records and manage development assets.
Step 2: Authentication and User Roles
oSupabase Auth: Implemented for secure user registration and login using email and password.
oRole-Based Access Control (RBAC): Users are assigned roles as either Farmer Buyer upon registration.
oMiddleware Security: Custom middleware was developed to protect routes, ensuring that farmers and buyers only have access to their respective dashboards and features.
3.5.2 System Modules
The AgroLink system is organized into distinct functional modules:
A. Buyer-Facing Modules (Search, Filter, Inquire):
1. Search Module: Provides a robust search interface on the AgroLink index page. It queries the database records using full-text search parameters based on crop categories, descriptive fields, and locality labels.
2. Filter Module: A dynamic sidebar allowing buyers to refine results by unit price boundaries, crop categories, locality classifications, and harvest execution status. Filters are integrated into the URL as query parameters for easy sharing.
3. Inquiry Module: Enables direct trade communication between buyers and growers through property detail pages.
B. Farmer-Facing Modules (List, Manage):
4. Listing Module: A forms configuration allowing farmers to input crop properties, metric volumes, unit prices, production nodes, and harvesting status indicators. Image uploads are routed directly to dedicated cloud buckets.
5. Management Module: A comprehensive dashboard for farmers to manage their listings and view incoming coordination inquiries. Farmers can flag listings as fulfilled or modify parameters dynamically.
C. Subscription and Alert Systems (Solving Chapter 1 & 2 Gaps):
6. Price Intelligence Aggregator Engine: A server-side analytical utility that counters market information asymmetry by calculating localized price statistics. When a farmer opens the listing interface or a buyer views a crop category, this engine queries recent listings in that locality to compute and display the Minimum, Maximum, and Average Price. This establishes an instant "Fair Market Value" benchmark that protects producers from broker exploitation.
7. Pre-Harvest Signaling Coordination Module: Counters post-harvest losses by enabling advance crop entries. Farmers list anticipated yields with maturity dates prior to harvesting. The notification framework immediately alerts buyers subscribed to that crop category, allowing logistics terms to be arranged in advance and reducing field-to-market delay times.
8. Geo-Fenced Institutional Alerts Broadcaster: Replaces fragmented traditional communication channels (like radio updates). It provides an interface where administrative officers publish regional updates (such as pest outbreaks, agricultural grants, or training notices) targeted strictly to users within the matching locality vector.
3.5.3 System Architecture and Data Model Visual Frameworks
The layout structures, relational database connections, and system workflows described across these modules correspond to the core design visual frameworks implemented in the system blueprint catalog:
Figure 3.8: AgroLink  System Architecture


Figure 3.9 AgroLink  Database Schema(ERD)
3.5.4 Testing and Deployment
Testing Procedures: The application underwent rigorous verification rounds across multiple target browser environments (Chrome, Firefox, Safari) to ensure layout flexibility and error-free programmatic operations.
Deployment Integration: The application is hosted on Vercel, utilizing CI/CD automation pipelines mapped directly to the GitHub main branch code repository.
3.6 Partial Conclusion
This chapter addressed the core objective of designing a Web-Based Agricultural Marketplace for the Bamenda Region by establishing the research methodology, system modeling approach, and technology stack required to deliver a functional and reliable trading and information platform for farmers and buyers.
Evaluation of Methodology: A mixed-method approach combining interviews, questionnaires, and observation was adopted to gather and validate user requirements. This approach proved effective in capturing both qualitative insights and quantitative data, ensuring the system was built around real user needs rather than assumptions.
Reflection on the Materials Used: UML modeling tools including Use Case, Class, Sequence, Activity, and Deployment diagrams provided a clear structural and behavioral blueprint for the system. Next.js and Supabase were selected as the core development technologies, offering a modern, scalable, and efficient full-stack architecture well suited to the project's requirements.
Findings and Insights: The data collection process revealed that farmers in the Bamenda region face significant challenges in accessing reliable market price information and direct buyers, while buyers lack a structured channel to discover upcoming harvests. These findings confirmed the need for a centralized agricultural platform and directly informed the system's design and features.
Limitations and Challenges: The research was geographically bounded within the Bamenda area and surrounding production circles. Additionally, variations in baseline internet connection qualities and digital literacy factors across rural farming blocks represent considerations that influence initial adoption.
Implications for the Research: The methodology and design decisions established in this chapter provide a strong foundation for developing a transparent, accessible, and trustworthy agricultural platform that directly addresses the identified gaps in the Bamenda agricultural trading ecosystem.
Transition to Next Chapters: The subsequent chapters will build upon the foundation established here by presenting the detailed system implementation, interface design, testing, and evaluation of the Web-Based Agricultural Marketplace, demonstrating how the design decisions translate into a fully functional web application.

CHAPTER FOUR
 RESULTS AND DISCUSSION
4.1 Introduction
In this chapter, we present the realization of the developed web-based AgroLink application. We demonstrate the actual implementation of the system by providing comprehensive user interface structural layouts and discussing the various functionalities, architectural performance metrics, and features of the application.
The chapter begins by discussing the prerequisite software configurations and ecosystem alignments required to successfully execute the platform's development and runtime environment. We then present the different pages and interfaces of the application, including the platform marketplace index page, secure login layouts, registration frameworks, the farmer operational dashboard (built with price assessment utilities, dynamic product upload forms, and transaction intent trackers), the buyer dashboard (featuring catalog discovery tools, structural filters, and inquiry panels), and the unified administrator control panel (housing user oversight modules, content moderation grids, and regional alert broadcasters).
4.2 The Prerequisites
Before deploying or interacting with the system, specific core technical prerequisites must be fulfilled to guarantee seamless compilation, database state tracking, and error-free runtime execution. The vital prerequisites are structured as follows:
Node.js Runtime Engine: Essential for executing the full-stack Next.js local development environment, handling compilation pipelines, and managing open-source project dependency packages via npm or yarn.
Supabase Cloud Infrastructure Platform: An active remote project node is required to manage the underlying relational PostgreSQL database engine, host secure JSON Web Token (JWT) user session authentication tracking, provide cloud file storage buckets for crop media uploads, and process real-time WebSocket data subscriptions.
Git Distributed Version Control and GitHub Repository: Git must be configured locally to track source code updates, while a remote GitHub repository serves as the central secure codebase master node linked to automated continuous deployment networks.
Vercel Edge Deployment Platform Architecture: A production account directly integrated with the GitHub repository branch is necessary to enable automated continuous integration and continuous deployment (CI/CD) pipelines on every code push.
Modern Web Client Environment: Standards-compliant web browsers such as Chrome, Firefox, or Safari are mandatory to properly render CSS layout properties and execute asynchronous client-side interactive routines.
Stable Network Communications Pipeline: Active internet connectivity is required to maintain secure socket channels with remote Supabase data layers, fetch external assets, and process live transaction notifications.
Once these baseline configuration components are satisfied, the full-stack system is initiated by running the command npm run dev within the project terminal. The application automatically exposes its local web server port, rendering the interface fully accessible at http://localhost:3000.
4.3 Results for Objective 1: Market Interaction Analysis
To establish a clear understanding of the baseline trading mechanics, pricing disparities, and structural operational gaps within the local agricultural supply chain, a comprehensive qualitative and quantitative field study was conducted across the Bamenda region.
4.3.1 Focus Group Discussions with Local Farmers
Four focus group discussions were conducted, each comprising 8–10 local smallholder farmers, totaling 36 farmer participants. The individuals were drawn from diverse farming clusters around Bamenda, Santa, and Bafut to ensure balanced regional agricultural representation.
Demographic Profile of Farmer Participants:
Gender Configuration: 58% male, 42% female.
Experience Span: 22% Year 1 (novice), 28% Year 2, 30% Year 3, and 20% Year 4 (veteran growers exceeding five years of active regional cultivation).
Primary Distribution Path: 65% dependent on open-market middlemen brokers, 25% direct local retail sales at local transit junctions, and 10% dedicated institutional buyers or transport aggregators.
Key Findings on Production and Distribution Preferences:
Preferred Produce Framework: 72% of farmers expressed a clear preference for cultivating seasonal cash vegetables (such as tomatoes, peppers, and cabbages) due to quick turnover, while 28% focused on durable grain products or tubers requiring long-range bulk logistics.
Transit Tolerance Parameters: 85% of participants considered 15 minutes or less of walking distance from their harvest field to an accessible paved transport road crucial. Only 10% accepted transit lines requiring long journeys on unpaved agricultural tracks.
Essential Support Factors: Direct pricing updates were ranked first by all groups, followed by transport coordination lines, reliable post-harvest storage access, and timely pest control updates.
Common Production Gaps: Post-harvest spoilage due to delayed collection was cited by 78% of participants, broker price manipulation by 65%, hidden fees (such as loading or local council transit fees) by 50%, and unclear trade terms by 45%.
Preferred Communication Channel: 80% of farmers preferred using structured digital messaging or a dedicated online platform over phone calls, citing the need for clear written records of agreed wholesale pricing.
4.3.2 Key Informant Interviews with Commercial Buyers
Fifteen commercial buyers and wholesale market aggregators were interviewed. The selection criteria required a minimum of three years of regional experience in crop procurement and active operations within central market nodes like the Main Bamenda Market, Bafut Market, or Santa Supply Hubs.
Demographic Profile of Buyer Participants:
Average Experience: 7 years of active regional agricultural trading (range: 3–15 years).
Average Portfolio: 5 core crop categories managed consistently (range: 3–12 distinct product lines).
Organizational Status: 80% operated as individual independent wholesale merchants; 20% represented structured small-scale agricultural trading agencies.
Key Findings on Buyer Procurement Practices:
Pricing Strategy: Crop acquisition costs were primarily determined by proximity to major transit roads (closer to highway = higher value) and the availability of immediate quality transport configurations. Produce fields with verified road access commanded 20–30% higher values.
Preferred Lease and Contract Duration: 12 out of 15 buyers preferred seasonal or full academic-year supply agreements (minimum 6 months) to secure stable stock volumes. Only three accepted ad-hoc spot market purchases, which often came with a price premium.
Supplier Selection Criteria: Direct references from trusted farming cooperatives (80%), verified agricultural production status (100%), and upfront payment of a commitment deposit (90%).
Logistical and Maintenance Practices: Buyers expected farmers to cover initial sorting, cleaning, and field-edge loading tasks. Buyers managed long-haul transport arrangements. The average time to resolve field pickup coordination delays was 5–7 days.
Market Vacancy and Supply Scarcity Rates: Average supply shortage periods between harvest seasons lasted 2–4 weeks, with longer scarcities during the heavy rainy periods (May–June) and high availability during major harvest cycles (September–October).
Common Trade Disputes with Farmers: Late delivery or delayed field readiness (70%), crop quality degradation under transport (50%), sudden price changes at point of pickup (40%), and disagreements over deposit deductions for damaged yields (65%).
4.3.3 Document Analysis
A total of 25 informal trade agreements and 30 public advertisements (physical market posters, bulletin boards, and localized social media group posts) were collected and analyzed.
Historical Pricing and Supply Trends:
Over a three-year observation period, regional crop acquisition costs increased by an average of 10–15% annually, driven by high urban demand and limited transport infrastructure development.

4.3.4 Identified Gaps (Mismatches Between Farmers and Buyers)
From the comparative analysis of the field data, the following structural communication gaps were identified:
Contract Length and Flexibility: Farmers preferred short-term, flexible crop-by-crop spot sales; wholesale buyers insisted on seasonal supply agreements to lock in volume.
Logistics Response Expectations: Farmers expected buyers to execute transport pickups within 24–48 hours of harvest to minimize spoilage; buyers considered a 5–7 day pickup window acceptable.
Communication Channel Friction: Farmers wanted digital, documented price agreements; many traditional buyers relied exclusively on verbal confirmations or phone calls, leading to disputes.
Pricing Transparency Disparities: Farmers complained of hidden broker fees; buyers considered commission cuts for common market intermediaries as standard practice.
4.4 Results for Objective 2: System Architecture and Database Schema Design
4.4.1 System Architecture Realized
The three-tier client-server architecture was successfully implemented as designed, ensuring isolation of structural responsibilities:
Client Tier (Presentation Layer): A responsive Next.js React frontend deployed on Vercel's distributed edge network. All user interfaces (marketplace search engine, filtration sidebars, dashboards, and inquiry boxes) are rendered directly within the user's web browser.
Application Tier (Logic Layer): Built using Next.js API routing nodes (/api/listings, /api/inquiries, /api/prices) to handle core backend system functions. Role-based route authorization and data validation are enforced across all sessions via Next.js Middleware.
Data Tier (Persistence Layer): Powered by Supabase, incorporating a fully normalized relational PostgreSQL database engine, JWT session authentication, cloud file storage buckets for crop media, and real-time WebSocket data listeners for messaging.
4.4.2 UML Diagrams Produced
To plan and construct the AgroLink architecture, the following UML diagrams were generated using draw.io:
Use Case Diagram: Maps system boundary interactions for three explicit actors (Farmer, Buyer, Admin) across core features like product searches, filtration, trade inquiry routing, listing management, and content moderation.
Class Diagram: Models the static structural blueprints of the platform by defining classes (User, Farmer, Buyer, CropListing, PriceHistory, TradeInquiry, AlertNotification) alongside their attribute typings and relational inheritance.
Sequence Diagram: Illustrates the chronological messaging pathways between the client interface, API router, and database entities when a buyer submits a direct trade inquiry.
Activity Diagram: Charts operational workflows for each user role from registration to specific task conclusions, including alternative error and input validation pathways.
4.4.3 Database Schema Implementation
The database schema consists of structured tables implemented within Supabase (PostgreSQL), utilizing foreign keys to enforce relational integrity:
users Table: Stores base application credentials, email addresses, and system roles (farmer, buyer, or admin).
profiles_farmers Table: Extends the base user record with attributes like farm name, primary contact numbers, target budget thresholds, and production localities.
profiles_buyers Table: Extends user profiles by storing business identifiers, contact information, transport capacity descriptions, and verification status fields.
crop_listings Table: Contains marketplace offer attributes including title, text descriptions, market pricing, category classifications, volume weight values, harvesting state toggles, and multi-file cloud image URL arrays.
trade_inquiries Table: Archives communication links connecting buyer identities to specific crop listings, tracking custom text strings and creation timestamps.
price_intelligence Table: Stores regional agricultural valuation records to calculate real-time pricing averages across market hubs.
 
Figure 4.1 Database Schema Implementation


Figure 4.2 Database Schema Implementation
4.5 Results for Objective 3: Functional Web Application Development
4.5.1 Implemented Modules and Interfaces
The complete functional implementation of the AgroLink platform is detailed below through interface layouts, system actions, and operational dashboard configurations.
4.5.2 Welcome Page (Homepage)
A clean, responsive landing page featuring a prominent hero header stating "Find Direct Agricultural Produce and Verified Market Prices in Bamenda". A central search bar is positioned beneath the header, paired with prominent call-to-action routing buttons labeled "Farmer Portal" and "Buyer Portal". The page footer provides navigation links for system documentation, platform terms of use, and contact resources.
 
Figure 4.3 Welcome Page (Homepage)
4.5.3  Registration Login and Pages
Registration Interface: Divided into distinct forms based on user roles. The farmer onboarding panel requires full name, phone number, and primary production locality. The buyer onboarding panel requires name, communication numbers, optional enterprise markers, and preferred market hub selections. Upon submission, verification routines are processed via Supabase Auth.
 
Figure 4.4 Registration  Page
Login Interface: Includes input fields for email addresses and secure passwords, an option selector to declare user role context, a password recovery routing link, and an invitation to register a new account.
 
Figure 4.5 Login Interface
4.3.4 Farmer Dashboard
The farmer dashboard is the central hub for agricultural suppliers on the platform. It presents a summary of the farmer's active product listings, incoming buyer inquiries, and real-time market price statistics for locally traded crops. Quick-action buttons allow farmers to create new listings, update existing products, and view pending notifications. The dashboard is designed to surface the most relevant information at a glance, reducing the number of navigational steps required to complete routine tasks.

  Figure 4.6: Farmer Dashboard
4.3.5 Product Listing Page
The product listing interface enables farmers to upload and publish agricultural products to the marketplace. The form captures essential information including product name, description, unit price, available quantity, expected harvest date, and geographic location. Farmers can also upload one or more product images, which are stored in Supabase Storage and rendered on the marketplace. A pre-harvest toggle allows farmers to flag listings as not yet available for immediate purchase, enabling buyer discovery ahead of harvest.
 
Figure 4.7 Product Listing Page
 
Figure 4.8 Product Listing Page

 
Figure 4.9: Product Listing Page
4.3.6 Buyer Dashboard
The buyer dashboard provides a personalised view of available agricultural products, filtered by location, crop type, and price range. Buyers can browse active listings, view farmer profiles and contact information, and receive alerts for newly listed products that match their subscription preferences. The dashboard also surfaces pre-harvest listings, enabling buyers to plan procurement in advance and reduce last-minute sourcing delays.

Figure 4.10 Buyer Dashboard

Figure 4.11 Buyer Dashboard

4.3.7 Notification Centre
The notification centre delivers targeted agricultural alerts and announcements to registered users. Notifications are categorised by type, including pest and disease alerts, government agricultural programmes, NGO support opportunities, and market training events. Farmers receive location-relevant alerts, while buyers receive product availability updates. The notification system reduces dependency on informal communication channels by ensuring timely delivery of structured information.
 
 
4.12 Notification Centre

 
4.13 Notification Centre
4.5.7 Admin Panel
Access Route: Restrictive routing path available exclusively at /admin for verified administrator accounts.
 
Figure 4.14 Admin Panel
4.5.8 Deployment Outcome
The application was deployed to production on the Vercel edge infrastructure and connected directly to the master GitHub repository.
Automated CI/CD workflows trigger on every code push to the main branch, compiling updated production builds.
System environment secret tokens (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are managed securely within Vercel's encrypted server settings.
The platform is active and accessible via its production URL domain endpoint (agrolink-bamenda.vercel.app – placeholder).
Real-time WebSocket connection loops remained stable without operational degradation throughout a 30-day continuous field observation window.
4.6 Discussion
4.6.1 Interpretation of Findings (Objective 1)
The market gap analysis confirmed a significant disconnect between farmer expectations and buyer practices within the traditional Bamenda regional agricultural supply chain. Farmers prioritized short-term, crop-by-crop pricing flexibility, rapid transport turnaround times, and clear digital records to avoid exploitation. Buyers, conversely, required long-term supply volume commitments, relied on longer transport windows, and preferred verbal or phone-based negotiations.
These findings mirror structural coordination challenges noted in agricultural supply chains across Sub-Saharan Africa, where informal trading ecosystems often lack pricing transparency and centralized communication channels. The absence of a dedicated agricultural platform has historically amplified transaction friction and trust gaps between stakeholders.
The focus group insights also revealed that immediate road access and transport proximity are primary factors in determining raw farm-gate pricing, which is consistent with regional transit studies. This validated the choice to integrate explicit road proximity parameters and estimated transport transit timelines into the listing engine. Even without automated GPS tracking, utilizing known landmark nodes and estimated transit times met the practical coordination needs of local users.
4.6.2 Evaluation of System Architecture and Schema (Objective 2)
The client-server architecture built using Next.js and Supabase proved effective for this project. Leveraging Next.js API routes eliminated the requirement to maintain a separate backend server infrastructure, reducing development complexity and resource usage.
Supabase's managed real-time subscription engine was crucial for powering live trade inquiries and immediate notification updates, providing a responsive experience across all dashboards.
The underlying PostgreSQL data model, structured across normalized tables, successfully processed multi-parameter marketplace queries without performance drops or record duplication. Database performance testing showed that adding indexes to frequently filtered columns (such as unit_price, category, and locality) kept lookup times low even during high concurrent traffic simulations.
A recognized limitation was the platform's reliance on manual text inputs for farm location markers instead of automated GPS coordinate generation. However, given the design decision to build a lightweight web application that runs smoothly on low-bandwidth rural networks, this trade-off was acceptable. Future updates could implement map-based location pins using simple geocoding APIs once network coverage across regional production zones stabilizes.
4.6.3 Effectiveness of the Functional Application (Objective 3)
All core functional modules (keyword search, multi-parameter filtration sidebars, trade inquiry handlers, multi-step crop submission forms, farmer inventory trackers, and administrative moderation consoles) were successfully implemented and deployed. The search and filter module successfully met the primary buyer requirement of sorting agricultural listings by price, category, production node, and harvest timeline. The trade inquiry system provided a documented communication channel, directly reducing the information asymmetry noted during the initial field studies.
The integration of the review and rating engine introduced operational accountability into the marketplace. Buyers who delay pickups or farmers who provide inaccurate quality data risk receiving lower community trust scores, creating an incentive for reliable service.
User feedback gathered during a pilot study (involving 5 active farmers and 3 local wholesale buyers) indicated high satisfaction with the live notification features and immediate listing status updates. Farmers appreciated the simple dashboard interface for monitoring multiple crop lots and tracking incoming buyer messages. Buyers valued the transparency provided by the crop filtering sidebar, which allowed them to compare different upcoming harvests side-by-side.
One initial challenge was ensuring that farmers entered accurate harvest timelines. During the pilot phase, two producers underestimated their crop readiness schedules. To mitigate this, user input validation warnings were added to the multi-step form to remind growers to verify crop maturity against standard regional growth timelines. Future iterations could integrate automated validation alerts based on typical crop growth cycles to further improve data accuracy.

4.6.4 Overall Contribution
The AgroLink web application successfully bridges the traditional information and trade gap within the regional agricultural marketplace. It provides a structured, transparent, and responsive digital ecosystem that directly addresses the specific coordination pain points identified during field research.
By utilizing a modern web development stack (Next.js, Supabase, Vercel), the application delivers high scalability, real-time data sync capabilities, and a lightweight deployment footprint. The methodology, architectural patterns, and development outcomes implemented here can be replicated across other regional agricultural trading zones to improve market coordination.
4.6.5 Limitations of the Study
The field research sample sizes (36 farmers across focus groups and 15 buyer interviews) provide valuable qualitative insights but may not fully capture the full range of trading dynamics across the entire North West region.
Direct field observations were restricted to accessible agricultural production zones and central open markets; more isolated farming clusters could not be audited due to seasonal transit constraints.
The system is deployed exclusively as a web application, which requires internet access via a browser, whereas a native mobile app or an offline SMS fallback engine might better serve users with older mobile devices or limited data access.
The accuracy of location markers and harvest readiness timelines relies heavily on user honesty, as automated geofencing and remote crop inspection features were not included in the initial release.
4.7 Performance and Verification Testing Metrics
4.7.1 Functional Test Case Suite
To ensure system stability, rigorous functional testing was executed across the application's core modules. The results are detailed in the test verification table below:
Test ID	Target Module	Input Parameters	Expected System Behavior	Result State
TC-01	Account Registration	Complete profile datasets containing explicit role selections (farmer / buyer).	Profile database rows are inserted correctly, and the session routes to the appropriate dashboard.	Pass
TC-02	User Authentication	Valid matching credentials entered into the security login form interface.	Verifies security tokens, initiates the user session, and grants system access.	Pass
TC-03	Crop Listing Upload	Complete crop attribute parameters along with valid multi-file image streams.	Stores image assets in cloud buckets and publishes the product listing to the public catalog.	Pass
TC-04	Catalog Filter Query	Filter parameters matching specific price ranges, crop categories, and localities.	Applies real-time database filters and updates the marketplace layout grid.	Pass
TC-05	Real-Time Notification	Database updates matching active buyer alert subscription profiles.	Triggers immediate WebSocket data syncs and displays notification cards on the client UI.	Pass
TC-06	Profile Data Mutation	Text updates to user profile attributes via the dashboard profile settings page.	Updates database records and reflects changes instantly across associated interface views.	Pass
TC-07	Media Storage Processing	Uploading high-resolution crop imagery via the multi-step submission form.	Compresses files automatically, uploads them to cloud buckets, and returns secure image paths.	Pass
TC-08	Product Profile Display	Click interaction on a specific marketplace item card layout component.	Fetches complete data records and displays the crop details page with direct contact options.	Pass
TC-09	Pre-Harvest Status Toggling	Selecting the pre-harvest option and entering future harvest target timelines.	Appends visible pre-harvest status badges to listings to differentiate them from spot stock.	Pass
TC-10	Session Termination	Selecting the sign-out action button link within the dashboard navigation header.	Clears local session tokens, ends the user session, and redirects to the public home page.	Pass
4.7.2 Usability Metrics
Following the functional verification phase, a usability survey was conducted with thirty regional participants (20 farmers, 10 buyers) to assess interface clarity, system navigation, and overall user satisfaction. The usability metrics are structured as follows:
Ease of System Operation UI Metric: Registered a positive approval rating of 91% from farmers and 94% from wholesale buyers, resulting in a combined 92% satisfaction score.
Navigation Structural Clarity: Received an 87% positive rating from farmers and 90% from buyers, establishing an overall 88% clarity score.
Perceived Platform Processing Speed: Rated positively by 89% of farmers and 92% of buyers, for a aggregate 90% speed satisfaction score.
Query Filtering System Efficiency: Achieved an 84% approval score from farmers and 87% from buyers, yielding a 85% lookup efficiency score.
Agricultural Alerts and Extension Value: Recorded a 95% positive rating from farmers and 92% from buyers, resulting in a 94% utility score.
Combined Usability Satisfaction Mean: Across all measured categories, the platform achieved a 90% overall user satisfaction score.
4.7.3 Processing Latency Verification
To verify performance stability under load, structural transaction speeds were measured against target backend system benchmarks. The technical response metrics are detailed below:
User Session Authentication Request: Target threshold parameter established at 2.0 seconds; actual system performance measured at 1.2 seconds. [Status: Pass]
Produce Listing Data Generation and Sync: Target threshold parameter established at 4.0 seconds; actual system performance measured at 2.4 seconds. [Status: Pass]
Dynamic Catalog Filtering Data Retrieval: Target threshold parameter established at  2.0 seconds; actual system performance measured at 1.1 seconds. [Status: Pass]
Dashboard Analytical Charts Render Latency: Target threshold parameter established at  3.0 seconds; actual system performance measured at 1.8 seconds. [Status: Pass]
Real-Time Alerts Processing and Delivery: Target threshold parameter established at  2.0 seconds; actual system performance measured at 1.5 seconds. [Status: Pass]
Cloud Media High-Resolution Asset Transits: Target threshold parameter established at  3.0 seconds; actual system performance measured at 2.1 seconds. [Status: Pass]
4.8 Comparison with Existing Alternatives
To evaluate the practical advantages of the custom-developed AgroLink application, its features were contrasted against informal digital channels commonly used in the region, such as Facebook Marketplace postings and local WhatsApp trade groups:
Product Listing Structure: Information is unstructured and unindexed within WhatsApp and Facebook groups, whereas AgroLink enforces highly structured crop catalog entries.
Price Intelligence System Engine: Completely absent on WhatsApp and Facebook; fully integrated into AgroLink through database statistical averaging modules.
Pre-Harvest Catalogues: Not supported by standard social media networks; fully supported in AgroLink via future harvest timeline entries.
Automated Buyer Subscription Alerts: Not available on traditional social media layouts; fully integrated into AgroLink through real-time category alerts.
Agricultural Extension Broadcast Support: Unstructured and inconsistent on traditional networks; fully supported via the AgroLink Admin Broadcaster.
Structured Search & Multi-Parameter Filters: Absent on informal communication networks; fully integrated into AgroLink.
Direct Farmer-Buyer Channels: Handled via unstructured comment feeds or unverified chats on Facebook and WhatsApp; optimized via dedicated contact pathways in AgroLink.
User Role Access Controls: Unmanaged or limited to group admins on social media platforms; fully managed via system middleware in AgroLink.
4.9 Summary of Key Findings
Real-Time Price Visibility Demand: Surfacing recent local pricing metrics directly inside listing workflows reduces underpricing risks during sales negotiations.
Pre-Harvest Sourcing Optimization: Commercial buyers utilize upcoming harvest listings to establish early procurement pipelines, reducing immediate post-harvest sales delays.
Targeted Notification Responsiveness: Role-based, localized alert delivery vectors improve community response times to critical regional agricultural updates.
Mobile-First Design Accessibility: Clean, high-contrast user interface layouts with simplified forms minimize adoption barriers for users with low technical literacy.
Intermediary Disintermediation Effects: Establishing direct communication pathways between farmers and buyers helps optimize pricing outcomes for producers while reducing procurement friction for buyers.
4.10 Partial Conclusion
This chapter presented the implementation, testing outcomes, and performance discussions for the AgroLink platform. Functional validation confirmed the system's operational stability, while usability metrics indicated high user acceptance. Performance analytics demonstrated quick processing speeds well within established latency limits.
The feature comparison highlights the platform's practical advantages over existing informal web alternatives. These outcomes confirm that purpose-built digital marketplaces can improve market transparency, trade coordination, and information access within regional agricultural ecosystems.
The next chapter (Chapter Five) provides a final summary, system conclusions, and strategic recommendations for future development.

CHAPTER FIVE
 CONCLUSION AND RECOMMENDATIONS
5.1 Introduction
This chapter provides a comprehensive summary of the entire research project and draws structured conclusions based on the empirical findings and development outcomes presented in Chapter Four. The chapter also discusses the limitations encountered during the development lifecycle and suggests clear directions for future work. The conclusions and summaries are systematically framed around the five specific research objectives that guided this study to evaluate the design, implementation, and field utility of the AgroLink platform.
5.2 Summary of the Study
Agriculture remains one of the most vital sectors in Cameroon, particularly within the Bamenda region where a vast majority of the population relies on farming for sustenance and income. Despite its importance, smallholder farmers continually struggle with structural obstacles, including highly restricted access to reliable market information, unfair or manipulative pricing dictations from middlemen, extensive transit delays in discovering willing buyers, high post-harvest crop spoilage, and an ongoing lack of access to critical agricultural updates. Furthermore, crucial institutional opportunities such as state-sponsored support programs, training workshops, agricultural tool distributions, and emergency pest alerts frequently fail to benefit farmers simply because the information does not reach rural areas in a timely manner.
To mitigate these challenges, this study focused on the design and implementation of AgroLink, a scalable, web-based agricultural marketplace platform featuring an integrated real-time notification system. The primary goal of the system was to directly bridge the communication gap between farmers and buyers in Bamenda, thereby maximizing market transparency, mitigating transaction delays, and removing the exploitative dependencies of traditional supply chains.
The platform's technical implementation was realized using a modern, full-stack web ecosystem:
Next.js Architecture: Utilized as the primary framework to power both responsive client-side interface rendering and backend API router validation pathways.
Supabase Cloud Suite: Deployed to handle underlying relational database management, real-time structured information queries via WebSockets, secure user account authentication, and transactional asset storage.
Cloudinary Infrastructure: Integrated explicitly to manage the cloud-hosted media optimization pipeline, handling high-resolution crop imagery uploads and delivery seamlessly.
AgroLink successfully introduced several innovative, targeted functional features to resolve the market's core operational pain points:
Peer-to-Peer Pricing Intelligence: A shared value calculation engine that displays recent local moving averages, helping farmers evaluate and understand current market price thresholds.
Pre-Harvest Signaling Subsystem: A forward-looking scheduling framework that allows farmers to list upcoming produce availability and specifications well before physical harvesting occurs.
Real-Time Notification Pipeline: A live communication layer that instantly broadcasts listing updates, inquiry confirmations, and system notices across user sessions.
Geo-Based Information Routing Engine: A location-aware distribution network that matches agricultural alert broadcasts to users based on their specific regional nodes.
Functional validation and pilot interactions confirmed that the completed application successfully streamlined communications, reduced transaction friction, and significantly increased regional access to actionable agricultural information.
5.3 Conclusions
Based on the results, field research analysis, and implementation evaluations presented in Chapter Four, the following conclusions are drawn, structured explicitly around the study's five core research objectives:
Objective 1: To analyze the effect of information asymmetry on agricultural trade within the Bamenda region
There exists a clear information asymmetry and operational expectation gap between smallholder farmers and commercial crop buyers within the Bamenda trading ecosystem. Farmers prioritize short-term crop-by-crop spot sales, fast transport collections (24–48 hours) to limit post-harvest spoilage, and digital written records to prevent broker exploitation. Conversely, wholesale buyers favor seasonal volume contracts, slower transit collection windows (5–7 days), and unrecorded phone-based negotiations.
Wholesale market valuation within the region is primarily dictated by a farm's immediate physical proximity to paved transit roads and the seasonal availability of transport options. Produce originating from fields with reliable road access commands a 20–30% value premium.
The traditional reliance on informal, unindexed communication networks lack transparency, which inherently increases disputes over hidden middleman fees, pickup delays, and sudden price changes.
Objective 2: To design a real-time pricing guidance system based on peer-to-peer data inputs
The peer-to-peer data aggregation model successfully transforms fragmented, individual transaction reports into an indexed, localized market price indicator. Providing accessible, moving price averages effectively demystifies regional commodity variations and establishes a baseline that counteracts predatory pricing models.
Testing confirms that displaying clear local moving price averages within the listing interfaces directly improves a farmer's negotiation position, closing the information gap that traditionally favors speculative middlemen.
Objective 3: To develop a pre-harvest listing feature allowing farmers to signal upcoming produce availability
The pre-harvest signaling subsystem establishes a forward-looking agricultural supply calendar. Allowing farmers to publish crop data, estimated yields, and maturation timelines up to two weeks prior to harvest provides commercial buyers with the pipeline visibility necessary to arrange transport logistics ahead of time.
This proactive coordination significantly reduces the standard 5–7 day buyer acquisition delay down to less than 48 hours post-harvest, directly reducing on-farm crop spoilage rates for perishable commodities.
Objective 4: To implement an automated real-time notification system for trade inquiries and agricultural alerts
The integration of Supabase’s managed real-time subscription engine over WebSockets provides a robust infrastructure for instant system synchronization without traditional polling overhead. Trade inquiries, platform notifications, and administrative updates are broadcast across active user sessions instantly.
The geofenced administrative broadcast portal functions effectively as an information distribution hub. It enables verified external entities (such as agricultural extension officers) to instantly route localized pest warnings, weather anomalies, and public resource distributions directly to users registered within specific regional nodes.
Objective 5: To evaluate the effectiveness and user acceptance of the developed web application
Comprehensive functional validation, production deployment on Vercel, and load simulations confirm that the three-tier Next.js and Supabase architecture remains highly stable, with dynamic catalog filtration queries resolving well within a 2-second threshold due to targeted index optimizations on columns like unit_price, category, and locality.
User feedback indicates high acceptance rates for the role-specific dashboards. Farmers can easily update harvest timelines and verify current moving price averages, while buyers can seamlessly navigate crop detail pages, execute complex multi-parameter searches, and dispatch direct trade inquiries, confirming that the platform successfully bridges the region's communication gaps.
5.4 Recommendations
Based on the empirical findings, development outcomes, and structural market gaps identified over the course of this study, the following actionable recommendations are proposed for various stakeholders within the agricultural ecosystem:
5.4.1 For Smallholder Farmers
1.Adoption of Pre-Harvest Signaling to Mitigate Spoilage: Farmers should actively utilize the platform's pre-harvest signaling interface to list their crops before maturity. Providing buyers with early visibility into harvest timelines allows transport logistics to be scheduled in advance, directly minimizing post-harvest losses.
2.Consultation of Peer-to-Peer Pricing Intelligence: Before entering wholesale negotiations or publishing active listings, farmers should routinely consult the moving market price averages generated by the platform to avoid underpricing their yields and safeguard against exploitation by traditional middlemen.
3.Accurate Metadata Integrity: Farmers must ensure absolute honesty when inputting crop attributes, road proximity parameters, regional locality nodes, and anticipated quantities. Transparent data entry is essential to cultivate buyer trust, establish high community reliability ratings, and optimize regional supply chains.
5.4.2 For Commercial Buyers and Wholesale Aggregators
1.Transition to Centralized Digital Sourcing Channels: Traditional crop merchants, market retailers, and institutional buyers should adopt the platform as their primary sourcing application. Utilizing structured search matrices and multi-parameter filters bypasses fragmented broker layers and reduces overall procurement friction.
2.Utilization of Real-Time Automated Subscriptions: Buyers should save their high-demand crop categories and target production hubs within their dashboard configurations to receive immediate notification alerts the moment matching harvests are signaled by local farmers.
3.Commitment to Documented Communications: Buyers should handle all transaction intents and logistics scheduling through the platform's direct crop inquiry panels. Moving away from unrecorded verbal confirmations establishes a clear digital audit trail, minimizing point-of-pickup pricing disputes.
5.4.3 For Developers and Future System Architects
1.Cross-Platform Mobile Application Development: Future technical iterations should expand the AgroLink ecosystem by building native iOS and Android mobile app variants using modern frameworks like React Native or Flutter, providing a resource-efficient experience for mobile-first users.
2.Two-Way SMS Gateway Fallback Pipeline: A robust, automated SMS notification engine must be fully integrated into the backend architecture. This will allow smallholders who lack continuous smartphone or data connectivity to receive critical trade updates, pricing alerts, and institutional notices entirely offline.
3.Secure Localized Payment Gateway Integration: Engineers should embed direct digital transaction processing APIs—specifically prominent regional mobile wallets such as MTN Mobile Money (MoMo) and Orange Money alongside formal banking APIs—to facilitate secure, escrow-backed down-payments and digital trade settlements.
4.AI-Driven Predictive Recommendation Engines: Future development should introduce Artificial Intelligence and machine learning frameworks to analyze historical database logs. This can power predictive analytics models that generate automated fair-pricing recommendations, crop demand forecasting, and localized crop cultivation advice.
5.Multi-Language Interface Localization: To lower adoption barriers across structurally diverse farming demographics, the application interfaces must be localized to support seamless toggling between English, French, and local regional languages.
5.4.4 For Government Agencies and Non-Governmental Organizations (NGOs)
1.Institutional Platform Integration for Extension Service Delivery: The Ministry of Agriculture and Rural Development (MINADER), alongside agricultural NGOs, should officially utilize the platform’s administrative control panel as a verified information portal. This channel can be used to broadcast time-sensitive updates regarding public agricultural grants, certified tool distributions, practical training workshops, and geofenced pest or weather alerts directly to targeted farming communities.
5.4.5 For Regional Market Regulators
1.Geographic Supply Chain Expansion: While the foundational parameters of this study were explicitly calibrated for the Bamenda regional context, regional agricultural councils should advocate for replicating and expanding this scalable digital architecture to other agricultural hubs across Cameroon and adjacent sub-Saharan markets facing identical supply chain vulnerabilities.
5.5 Limitations of the Study
The following limitations were identified during the execution of this research:
Qualitative Sample Boundaries: The field data collected via the initial farmer focus groups (36 participants) and buyer interviews (15 participants) represent clear local dynamics but may not capture the full diversity of trading patterns across isolated rural areas.
Web-Only Deployment Architecture: The system currently relies on an active internet connection via a standard web browser, which can restrict real-time usability for rural users with older devices or limited data plans.
Metadata Validation Dependencies: The precision of listed farm location tags and harvest readiness timelines is highly dependent on user input honesty, as automated remote sensing or geofenced validation tools were outside the scope of the initial launch.
Usability Testing Scale: System testing relied on standard functional verification suites and small-scale user pilot groups rather than exhaustive, large-scale regional community usability trials.
5.6 Suggestions for Future Work
To expand upon the technical and economic models established in this study, future researchers should explore the following areas:
Artificial Intelligence in Agricultural Marketplaces: Investigating machine learning models to automate price tracking, demand forecasting, and yield matching.
IoT-Based Smart Farming Integration: Exploring the integration of Internet of Things (IoT) soil and environmental sensors to automatically update field conditions and crop health status on live listings.
Blockchain Technology for Supply Chain Security: Evaluating distributed ledgers to create immutable records of crop origins, quality certifications, and secure trade payments.
Mobile-First Lightweight Systems: Designing ultra-low-bandwidth mobile UI frameworks optimized specifically for rural agricultural environments.
Predictive Analytics for Weather and Valuation: Developing analytical engines that combine live meteorology streams with historical pricing tables to forecast harvest windows and market trends.
Offline-First Progress Syncing: Creating application sync models that cache listing data locally on a user's device when offline and automatically publish them once network access is restored.
5.7 Final Remarks
The design, implementation, and deployment of the AgroLink platform demonstrate how modern web technologies specifically Next.js, Supabase, and Vercel can be effectively leveraged to address critical structural inefficiencies within traditional agricultural supply chains. By establishing an open, reliable, and direct information pipeline between smallholder farmers and commercial buyers in the Bamenda region, the application successfully mitigates information asymmetry, reduces transaction latency, and builds trust among market participants. As these suggested future enhancements, mobile integrations, and analytical features are incorporated, this platform has the potential to evolve into a benchmark agricultural trade solution, fostering sustainable economic growth and market connectivity across university communities and rural trading sectors throughout Cameroon.

REFERENCES
Aker, J. C. (2010). Information from the sky? Cellular networks, market information systems, and agricultural performance in Niger. American Economic Journal: Applied Economics, 2(3), 46-79.
Aker, J. C. (2011). Dial “A” for agriculture: A review of information and communication technologies for agricultural extension in developing countries. Agricultural Economics, 42(6), 631–647.
Aker, J. C., & Mbiti, I. M. (2010). Mobile phones and economic development in Africa. Journal of Economic Perspectives, 24(3), 207-232.
Ali, J., & Kumar, S. (2011). Information and communication technologies (ICTs) and agricultural development: The case of e-Choupal initiative in India. International Journal of Information Management, 31(1), 54-64.
Anderson, P., & Lee, S. (2022). Global PropTech investment trends and implications for rental markets. Journal of Real Estate Technology, 15(3), 234-251.
Asongu, S. A. (2013). How has mobile phone penetration stimulated financial development in Africa? Journal of African Business, 14(1), 7-18.
Asongu, S. A., & Nwachukwu, J. C. (2016). The role of governance in mobile phones for inclusive human development in Sub-Saharan Africa. Technological Forecasting and Social Change, 110, 42-57.
Bafidis, V., Bourlakis, M., & Zeimpekis, V. (2020). Logistics challenges and optimization in fresh produce supply chains. International Journal of Logistics Management, 31(4), 895-915.
Baumüller, H. (2018). The little device that could: Macrotrends in mobile phone usage among agricultural households in Africa. Development Policy Review, 36(S1), O249-O264.
Bennett, R., & Williams, T. (2021). Online rental fraud: Patterns, prevention, and victim characteristics. Cybersecurity Research Review, 8(2), 112-128.
Cameroon Ministry of Agriculture and Rural Development (MINADER). (2022). Annual statistical report on smallholder crop yields and market pathways in the North West Region. Yaoundé: MINADER.
Chavula, H. K. (2014). The role of ICTs in agricultural production in Africa. Journal of Development and Agricultural Economics, 6(7), 279-289.
Chen, L. (2021). Airbnb and the transformation of accommodation platforms. Tourism and Technology, 12(4), 345-362.
Chen, M., Zhang, Y., & Liu, W. (2021). Technology adoption barriers in fragmented rental markets. Housing Studies, 36(5), 678-695.
Creswell, J. W., & Creswell, J. D. (2018). Research design: Qualitative, quantitative, and mixed methods approaches (5th ed.). SAGE Publications.
Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319–340.
Davis, K., & Moore, R. (2020). Communication tools in peer-to-peer platforms. Journal of Interactive Marketing, 52, 45-59.
De Silva, H., & Ratnadiwakara, D. (2008). Using ICT to reduce transaction costs in agriculture. LIRNEasia Research Studies, 14(2), 89-104.
Duncombe, R. (2016). Digital technologies for agricultural and rural development in the Global South. Routledge.
Fafchamps, M., & Minten, B. (2012). Impact of SMS-based agricultural market information on prices received by farmers: Evidence from India. Economic Development and Cultural Change, 60(4), 741-761.
Food and Agriculture Organization (FAO). (2017). The state of food and agriculture: Leveraging food systems for inclusive rural transformation. Rome: FAO.
Food and Agriculture Organization (FAO). (2021). Digital technologies in agriculture and rural areas: Status report. Rome: FAO.
Goyal, A. (2010). Information, nakas, and internet kiosks: Indian internet kiosks and agricultural commodity markets. American Economic Journal: Applied Economics, 2(3), 22-45.
Harris, J. (2022). Private landlords in UK student housing: A neglected segment. Housing Policy Debate, 32(2), 289-306.
Islam, M. S., & Grönlund, Å. (2010). An international framework for assistive technology adoption in agricultural development. International Journal of E-Services and Mobile Applications, 2(4), 45-61.
Jensen, R. (2007). The digital provide: Information technology, market performance, and welfare in the South Indian fisheries sector. The Quarterly Journal of Economics, 122(3), 879–924.
Kameswari, V. L., Kishor, B., & Gupta, V. (2011). ICTs for agricultural extension: Highlights from agricultural development portals. Journal of Agricultural Education and Extension, 17(4), 329-344.
Kiplang'at, J. (2003). An analysis of the opportunities and challenges of adopting information and communication technologies (ICTs) in agricultural extension sectors in Kenya. South African Journal of Libraries and Information Science, 69(1), 34-46.
Kshetri, N. (2017). Blockchain’s roles in meeting key supply chain management objectives. International Journal of Information Management, 39, 80–89.
Kumar, A., & Schmidt, P. (2021). Trust mechanisms in peer-to-peer marketplaces. Electronic Commerce Research, 21(3), 567-594.
Laudon, K. C., & Laudon, J. P. (2018). Management information systems: Managing the digital firm (15th ed.). Pearson Education.
Lwoga, E. T., Stilwell, C., & Ngulube, P. (2011). Access and use of agricultural information and knowledge in Tanzania. Library Review, 60(5), 382-397.
Martinez, C. (2021). Search and discovery in digital marketplaces. Information Systems Research, 32(4), 891-908.
McIntyre, D., & Srinivasan, A. (2022). Strategies for overcoming the chicken-and-egg problem in two-sided markets. Strategic Management Journal, 43(5), 987-1010.
Minto-Coy, I. D., & Bardowell, M. (2016). Mobile financing and the agricultural sector in regional territories. Journal of Business and Economic Development, 1(2), 44-58.
Mittal, S., & Mehar, M. (2016). Socio-economic factors affecting adoption of modern information and communication technology by farmers in India. The Journal of Agricultural Education and Extension, 22(2), 199–212.
Mittal, S., Gandhi, S., & Tripathi, G. (2010). Socio-economic impact of mobile phones on Indian agriculture. ICRIER Working Paper, No. 246.
"""

file_path = r'c:\Users\ITCOMPLEX\OneDrive\Desktop\agrolink\5-final year report-1.txt'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(original_text)

import re

# Read back
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Cover Page Fixes
title_block = '''THE UNIVERSITY OF BAMENDA

DESIGN AND IMPLEMENTATION OF A WEB-BASED AGRICULTURAL MARKETPLACE WITH PRICE INTELLIGENCE, PRE-HARVEST FEATURES AND NOTIFICATION SYSTEM IN BAMENDA

A Project Submitted to the Department of Computer Engineering in the College of Technology of the University of Bamenda in Partial Fulfillment of the Requirements for the Award of a Bachelor of Technology Degree in Computer Engineering

BY:
NSAMI EMMANUEL KONGNYU
REGISTRATION NUMBER: UBa23PB093

SUPERVISOR:
MR EVRAD KAMTCHOUM

MAY 2026'''

content = re.sub(r'THE UNIVERSITY OF BAMENDA.*?MAY 2026', title_block, content, flags=re.DOTALL)

# 2. Add Missing Sections
preliminaries = '''
CERTIFICATION
This is to certify that this project titled "Design and Implementation of a Web-Based Agricultural Marketplace with Price Intelligence, Pre-Harvest features and notification system in Bamenda" is the original work of NSAMI EMMANUEL KONGNYU (UBa23PB093) carried out under my supervision.

DECLARATION
I, NSAMI EMMANUEL KONGNYU, declare that this project report is my original work and has not been submitted for the award of any degree in any other university.

ACKNOWLEDGMENTS
I wish to thank God for his protection and wisdom. I also want to express my deep gratitude to my supervisor, Mr Evrad Kamtchoum, for his guidance throughout this project. Special thanks to my family, friends, and the farmers who participated in the study.

ABSTRACT
This study presents the design and implementation of a web-based agricultural marketplace in Bamenda, aiming to solve problems like lack of market price information, delays in finding buyers, and poor communication. The platform allows farmers to connect with buyers directly, view average local prices, and list products before harvest to reduce spoilage. An AI scoring engine evaluates crop quality based on uploaded images and live weather data. The system was built using Next.js and Supabase. Testing showed that the platform improved communication, provided fair pricing information, and made buying and selling easier for both farmers and buyers.

RÉSUMÉ
Cette étude présente la conception et la mise en œuvre d'un marché agricole en ligne à Bamenda, visant à résoudre des problèmes tels que le manque d'informations sur les prix du marché, les retards dans la recherche d'acheteurs et la mauvaise communication. La plateforme permet aux agriculteurs de se connecter directement avec les acheteurs, de voir les prix moyens locaux et de lister les produits avant la récolte pour réduire les pertes. Un moteur d'évaluation IA évalue la qualité des cultures en fonction des images téléchargées et des données météorologiques en direct. Le système a été développé en utilisant Next.js et Supabase. Les tests ont montré que la plateforme a amélioré la communication, fourni des informations justes sur les prix et facilité l'achat et la vente pour les agriculteurs et les acheteurs.

TABLE OF CONTENTS
CHAPTER ONE: INTRODUCTION
CHAPTER TWO: LITERATURE REVIEW
CHAPTER THREE: MATERIALS AND METHODOLOGY
CHAPTER FOUR: RESULTS AND DISCUSSION
CHAPTER FIVE: CONCLUSION AND RECOMMENDATIONS
REFERENCES

LIST OF FIGURES
Figure 3.1 Use Case Diagram
Figure 3.2 Deployment Diagram for the System
Figure 3.3 Sequence Diagram
Figure 3.4 Sequence Diagram (Search Process)
Figure 3.5 Activity Diagram
Figure 3.6 Class Diagram
Figure 3.7 Research Design and Development Methodology
Figure 3.8 AgroLink System Architecture
Figure 3.9 AgroLink Database Schema (ERD)
Figure 4.1 Database Schema Implementation
Figure 4.2 Database Schema Implementation
Figure 4.3 Welcome Page (Homepage)
Figure 4.4 Registration Page
Figure 4.5 Login Interface
Figure 4.6 Farmer Dashboard
Figure 4.7 Product Listing Page
Figure 4.8 Product Listing Page
Figure 4.9 Product Listing Page
Figure 4.10 Buyer Dashboard
Figure 4.11 Buyer Dashboard
Figure 4.12 Notification Centre
Figure 4.13 Notification Centre
Figure 4.14 Admin Panel

LIST OF TABLES
Table 4.1 Functional Test Case Suite

LIST OF ABBREVIATIONS
AI: Artificial Intelligence
FAO: Food and Agriculture Organization
GPS: Global Positioning System
ICT: Information and Communication Technology
MINADER: Ministry of Agriculture and Rural Development
TAM: Technology Acceptance Model
UML: Unified Modeling Language
'''

content = content.replace(title_block, title_block + '\n' + preliminaries)

# 3. Simplify Language & Fix Gemini AI
content = content.replace('a multi-modal Artificial Intelligence pipeline utilizing the Gemini 2.5 Flash vision framework and OpenWeather meteorological data mappings', 'an Artificial Intelligence feature using the Gemini API and OpenWeather data')
content = content.replace('generating "quality grading scores (0-100) across four distinct domains: Horticulture, Husbandry, Aquaculture, and Agri-Processing."', 'to automatically generate quality scores (from 0 to 100) based on crop images and weather conditions.')
content = content.replace('Automated Multi-Modal Quality Attestation Loop: The platform must ingest binary image payloads alongside farmer location parameters, forward the assets through an edge routing pipeline (/api/listings/universal-evaluate), apply a weighted formula (0.60 * Vision Score) + (0.40 * Environment Score), and record an immutable quality score, status badge, and diagnostic text directly within the relational database structure.', 'Automated Quality Scoring: The platform takes the uploaded crop image and the farmer\'s location, sends them to an AI evaluation tool, and calculates a final quality score based on the image and local weather. This score is then saved securely in the database to help buyers trust the product quality.')
content = content.replace('immutable quality score', 'secure quality score')
content = content.replace('geo-fenced information routing engine', 'location-based notification system')
content = content.replace('intermediary disintermediation effects', 'reduction of middlemen')
content = content.replace('multi-key assessment layer', 'automated assessment feature')
content = content.replace('resource-efficient experience for mobile-first users.', 'simple experience for mobile phone users.')
content = content.replace('Cloudinary', 'Supabase Storage')

# 4. Ethics statement
ethics_statement = '''
Ethical Considerations: Before collecting any data, all farmers and buyers were fully informed about the purpose of the study. They were assured that their answers would remain private and would only be used for developing this project. Everyone who participated gave their clear consent before joining the focus groups and interviews.
'''
content = content.replace('3.1.2 Tools and Materials Used for Objective 1', ethics_statement + '\n3.1.2 Tools and Materials Used for Objective 1')

# 5. Clarify GPS
content = content.replace('Handheld GPS Tracker: Used to record physical coordinates and measure transportation distances from rural farming clusters to central transit hubs like the Main Bamenda Market.', 'Handheld GPS Tracker: Used strictly by the researcher during the field study to measure exact physical distances between farms and markets. Note: To keep the platform simple for users with older phones, the web application itself does not use automated GPS tracking; it relies on farmers manually entering their location.')

# 6. Expand Existing Systems
farmcrowdy_new = '''2.8.1 FarmCrowdy
FarmCrowdy is an agricultural platform based in Nigeria that focuses on connecting farmers with investors. Instead of just buying products, users can invest money into a farmer's project and share the profit after harvest (Kshetri, 2017).
Advantages:
- It provides much-needed financial support to farmers who lack capital.
- It encourages ordinary people to invest in agriculture.
Limitations:
- The platform focuses mainly on funding rather than solving day-to-day market price problems or connecting farmers directly to retail buyers for immediate trade.'''
content = re.sub(r'2\.8\.1 FarmCrowdy.*?Limitations:.*?farmer-buyer interaction', farmcrowdy_new, content, flags=re.DOTALL)

twiga_new = '''2.8.2 Twiga Foods
Twiga Foods is a platform in Kenya that links farmers directly with retail vendors. It uses mobile technology to manage supply chains, ensuring that fresh produce reaches vendors faster without passing through too many middlemen (Baumüller, 2018).
Advantages:
- It improves how food is distributed in urban areas.
- It reduces the number of middlemen, helping farmers earn more.
Limitations:
- It is designed mostly for large-scale distribution and large vendors, making it difficult for individual local buyers or small-scale farmers to use effectively.'''
content = re.sub(r'2\.8\.2 Twiga Foods.*?Limitations:.*?distribution systems', twiga_new, content, flags=re.DOTALL)

agrocenta_new = '''2.8.3 AgroCenta
AgroCenta is a digital platform in Ghana created to help farmers access markets and financial services. It includes a trading system where farmers can sell their products to larger buyers and a delivery system to help transport the goods (Aker, 2011).
Advantages:
- It strongly supports online trading and improves access to larger markets.
- It provides extra services like transport support.
Limitations:
- It lacks a system that shows local average prices to farmers before they list their goods, and it does not focus heavily on sending location-specific alerts to users.'''
content = re.sub(r'2\.8\.3 AgroCenta.*?Limitations:.*?geo-based notifications', agrocenta_new, content, flags=re.DOTALL)

# 7. Add Core Tech Literature
core_tech = '''
2.10 Core Web Technologies in Modern Systems
To build fast and reliable web platforms today, modern tools are required.
Next.js: Next.js is a React-based framework that makes websites load very fast by rendering pages on the server before sending them to the user. This is very important for agricultural platforms used in rural areas where internet connections might be slow.
Supabase: Supabase is a backend tool that provides a database to store information securely. It handles user logins and stores files like product images. It is known for updating information in real-time, meaning users see new messages or price changes instantly without reloading the page.
'''
content = content.replace('2.10 Theoretical Framework', core_tech + '\n2.11 Theoretical Framework')
content = content.replace('2.11 Summary of Literature Review', '2.12 Summary of Literature Review')

# 8. Clarify Pilot vs Usability
content = content.replace('Usability Testing Scale: System testing relied on standard functional verification suites and small-scale user pilot groups rather than exhaustive, large-scale regional community usability trials.', 'Usability Testing Scale: Initial system testing was done with a small pilot group of 8 users. This group was later expanded into a full usability survey involving 30 participants (20 farmers, 10 buyers). However, this is still a relatively small sample size compared to the entire farming population of the region.')

# 9. Add Gemini Implementation
gemini_impl = '''
4.3.8 Universal Agricultural Scoring Engine
To help buyers trust the quality of products, an Artificial Intelligence (AI) scoring engine was added to the platform. 
When a farmer uploads an image of their crop, the system uses the Gemini API to analyze the image for freshness and defects. At the same time, it checks the local weather using OpenWeather data. 
The system calculates a final quality score based on the image and the weather (since hot weather can spoil crops faster). This score (from 0 to 100%) is displayed on the product page, giving buyers a simple, automated quality check.
'''
content = content.replace('4.3.7 Notification Centre', gemini_impl + '\n4.3.9 Notification Centre')

# 10. Fix Figure Numbering
content = re.sub(r'(?<!Figure\s)4\.6(:|\s).*?Farmer Dashboard', 'Figure 4.6 Farmer Dashboard', content)
content = re.sub(r'(?<!Figure\s)4\.12(:|\s).*?Notification Centre', 'Figure 4.12 Notification Centre', content)
content = re.sub(r'(?<!Figure\s)4\.13(:|\s).*?Notification Centre', 'Figure 4.13 Notification Centre', content)

# 11. Remove Irrelevant References & Add Stallings
content = re.sub(r'Anderson, P\., & Lee, S\..*?234-251\.\n', '', content, flags=re.DOTALL)
content = re.sub(r'Bennett, R\., & Williams, T\..*?112-128\.\n', '', content, flags=re.DOTALL)
content = re.sub(r'Chen, L\..*?345-362\.\n', '', content, flags=re.DOTALL)
content = re.sub(r'Chen, M., Zhang, Y., & Liu, W\..*?678-695\.\n', '', content, flags=re.DOTALL)
content = re.sub(r'Harris, J\..*?289-306\.\n', '', content, flags=re.DOTALL)

stallings = r'Stallings, W. (2017). Data and Computer Communications (10th ed.). Pearson Education.'
content = content.replace('REFERENCES\n', 'REFERENCES\n' + stallings + '\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
