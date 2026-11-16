export interface LegalContent {
  title: string
  updatedAt: string
  content: string
}

export const LEGAL_ALIASES: Record<string, string> = {
  "privacy": "privacy-policy",
  "privacy-policy": "privacy-policy",
  "terms": "terms-of-service",
  "terms-of-service": "terms-of-service",
  "tos": "terms-of-service",
  "cookie": "cookie-policy",
  "cookies": "cookie-policy",
  "cookie-policy": "cookie-policy",
  "refund": "refund-policy",
  "refund-policy": "refund-policy",
  "disclaimer": "disclaimer",
}

export const DEFAULT_LEGAL_PAGES: Record<string, LegalContent> = {
  "privacy-policy": {
    title: "Privacy Policy",
    updatedAt: "2026-11-16",
    content: `
      <p class="lead"><strong>Effective Date:</strong> November 16, 2026 | <strong>Last Material Update:</strong> November 16, 2026</p>
      
      <h2>1. Introduction &amp; Commitment to Data Protection</h2>
      <p>Welcome to <strong>InstantTool</strong> (accessible online at <a href="https://devigo.cloud">https://devigo.cloud</a>), operated and maintained by <strong>Techyfe</strong> ("we," "our," "us," or "the Platform"). Protecting the fundamental privacy rights and digital security of our global users is the cornerstone of our engineering philosophy. We have purposefully engineered InstantTool to provide high-throughput, professional-grade online utilities—including PDF manipulation, audio/video encoding, raster and vector format conversion, developer aids, and AI content assistants—with an uncompromising focus on data minimization, transparency, and user autonomy.</p>
      <p>This Privacy Policy serves as a binding, exhaustive explanation of how InstantTool collects, handles, processes, and safeguards information when you visit our website, utilize our web-based tools, create an account, or interact with our services. If you have questions, ethical concerns, or requests regarding our compliance with international privacy statutes, our Data Protection Officer (DPO) and engineering desk can be reached directly via email at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a>.</p>

      <h2>2. Groundbreaking Zero-Data-Retention Architecture: Client-Side WebAssembly vs. Ephemeral Cloud Execution</h2>
      <p>Unlike conventional web utilities that silently ingest your documents, images, and videos into central databases for unauthorized training or marketing analysis, InstantTool is built on a privacy-first, zero-retention paradigm divided into two distinct processing pipelines:</p>
      
      <h3>2.1. Client-Side WebAssembly (WASM) Sandbox Processing (Primary Pipeline)</h3>
      <p>Over 85% of our utilities—including PDF splitting, PDF merging, PDF page rotation, document compression, image conversion (PNG, JPG, WEBP, SVG, AVIF, HEIC), audio trimming, volume adjustment, and developer formatters—execute <strong>100% locally on your device</strong> inside your web browser's isolated JavaScript and WebAssembly runtime sandbox. During client-side processing:</p>
      <ul>
        <li><strong>Zero Network Transmission of Files:</strong> Your source files, confidential documents, photographs, and media clips are never uploaded, streamed, or transmitted over the internet to our servers.</li>
        <li><strong>Zero Server Access:</strong> Our backend servers and engineers have zero physical or digital access to your file payloads, metadata, or rendered outputs.</li>
        <li><strong>Instant In-Memory Disposal:</strong> When you complete your task or close the browser tab, the allocated browser memory (RAM) is instantly recycled by your operating system, leaving zero persistent footprints on any external network.</li>
      </ul>

      <h3>2.2. Ephemeral Server Processing (Secondary Pipeline)</h3>
      <p>For specialized utilities that demand computational capabilities exceeding standard browser runtimes (such as high-demand server OCR, heavy GPU video rendering, or deep neural network AI analysis):</p>
      <ul>
        <li><strong>End-to-End Cryptographic Encryption:</strong> All data in transit is protected using bank-grade Transport Layer Security (TLS 1.3) with modern SHA-256 cipher suites, preventing interception or man-in-the-middle attacks.</li>
        <li><strong>Volatile Memory Only:</strong> Files are held strictly in temporary volatile RAM during execution and are never written to permanent disk storage or relational databases.</li>
        <li><strong>Automated Purge Protocol:</strong> Uploaded payloads and their processed derivatives are automatically, irreversibly, and permanently deleted from our server cluster within a maximum of sixty (60) minutes following completion or immediately upon user download.</li>
        <li><strong>No Indexing or Model Training:</strong> We explicitly warrant that <strong>we do not inspect, read, mine, sell, or utilize your private documents or media to train proprietary AI models</strong> or feed third-party datasets.</li>
      </ul>

      <h2>3. Categories of Information We Collect</h2>
      <p>Depending on how you interact with our platform, InstantTool may process limited categories of technical, transactional, and voluntary data:</p>

      <h3>3.1. Technical Telemetry &amp; Anonymous Access Logs</h3>
      <p>Like virtually all modern web services, our web servers automatically generate standard HTTP access logs for security and performance auditing. This non-personally identifiable telemetry includes:</p>
      <ul>
        <li>Internet Protocol (IP) addresses (anonymized or truncated where mandated by local jurisdictions).</li>
        <li>Browser client type, language settings, and engine version (e.g., Chrome, Safari, Firefox, Edge).</li>
        <li>Operating system environment and device architecture (e.g., macOS, Windows, Linux, Android, iOS).</li>
        <li>Referring webpage URLs, exit pages, timestamped access requests, and HTTP status response codes.</li>
        <li>Aggregated clickpaths and processing latency metrics.</li>
      </ul>
      <p>We process this telemetry strictly under legitimate business interests to prevent Distributed Denial of Service (DDoS) attacks, detect brute-force intrusion attempts, resolve platform latency bottlenecks, and verify server capacity.</p>

      <h3>3.2. Voluntarily Submitted Account &amp; Communication Data</h3>
      <p>When you voluntarily create an account, purchase premium subscriptions, or communicate with our support desk, we collect:</p>
      <ul>
        <li><strong>Account Identifiers:</strong> Your chosen username, registered email address, and encrypted password hash (utilizing industry-standard bcrypt with high-work factors).</li>
        <li><strong>Customer Support Records:</strong> The content of inquiries, bug reports, and emails sent to our support desk, maintained strictly for resolving your technical questions.</li>
        <li><strong>Transactional Records:</strong> Subscription status, credit allocation balances, transaction timestamps, and order identifiers. <strong>We do not collect, process, or store credit card numbers or banking secrets on our servers.</strong> All payment processing is delegated to certified Level 1 PCI-DSS compliant payment gateways (such as Stripe or Razorpay).</li>
      </ul>

      <h2>4. Google AdSense, DoubleClick DART Cookies &amp; Advertising Disclosures</h2>
      <p>To sustain our commitment to providing free, high-performance web utilities without mandatory paywalls, InstantTool partners with <strong>Google AdSense</strong> and authorized third-party advertising exchanges to display non-intrusive advertisements across our platform. Transparency regarding ad tech is of paramount importance to us:</p>

      <h3>4.1. DoubleClick DART Cookies &amp; Interest-Based Advertising</h3>
      <p>Google, as a verified third-party vendor, utilizes HTTP cookies—specifically the DoubleClick DART cookie—to serve relevant advertisements to users based upon their visit history to <a href="https://devigo.cloud">https://devigo.cloud</a> and other websites across the World Wide Web. DART cookies allow advertising algorithms to display contextual and personalized commercial offers based on inferred categories of interest.</p>

      <h3>4.2. How You Can Exercise Choice &amp; Opt Out of Personalized Ads</h3>
      <p>We believe every user should possess absolute control over their advertising profile. You may opt out of personalized DART cookies and tailored advertising at any time through any of the following official mechanisms:</p>
      <ul>
        <li><strong>Google Ad Settings Portal:</strong> Customize or completely disable Google personalized ads by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</a>.</li>
        <li><strong>Google Advertising Privacy Policy:</strong> Learn how Google handles ad data at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.</li>
        <li><strong>Network Advertising Initiative (NAI):</strong> Opt out of behavioral advertising across dozens of certified networks via the NAI consumer choice page at <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">https://optout.networkadvertising.org</a>.</li>
        <li><strong>Digital Advertising Alliance (DAA):</strong> Manage your multi-vendor ad preferences via the DAA portal at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">https://www.aboutads.info/choices</a>.</li>
        <li><strong>European Interactive Digital Advertising Alliance (EDAA):</strong> European residents can manage behavioral targeting at <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">https://www.youronlinechoices.eu</a>.</li>
      </ul>
      <p><em>Please note that opting out of personalized advertising does not eliminate advertisements entirely; rather, you will continue to see generic, contextual ad units that are not based on your historical browsing behavior.</em></p>

      <h2>5. Use of Cookies and Local Storage Technologies</h2>
      <p>InstantTool employs cookies, web beacons, and browser local storage (including IndexedDB) for strictly limited, functional purposes:</p>
      <ul>
        <li><strong>Essential / Authentication Cookies:</strong> Managing active user login sessions, maintaining secure CSRF tokens, and verifying authorization states.</li>
        <li><strong>Functional Local Storage:</strong> Preserving your personal UI preferences, such as Dark Mode / Light Mode theme toggles, and maintaining temporary workspace state in browser IndexedDB so accidental page refreshes do not disrupt your ongoing edits.</li>
        <li><strong>Analytical Cookies:</strong> Collecting aggregated, anonymized metrics on feature usage to help our engineers optimize browser execution speed and memory footprints.</li>
      </ul>
      <p>For exhaustive specifics regarding cookie lifetimes, third-party tags, and browser-level blocking configurations, please consult our dedicated <a href="/legal/cookie-policy">Cookie Policy</a>.</p>

      <h2>6. Lawful Grounds for Data Processing (GDPR Article 6)</h2>
      <p>Under the European Union General Data Protection Regulation (GDPR) and the UK GDPR, we process personal information strictly under recognized legal bases:</p>
      <ul>
        <li><strong>Contractual Performance (Art. 6(1)(b)):</strong> Providing the file manipulation services, authentication credentials, and customer support requested by the user.</li>
        <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> Maintaining server uptime, mitigating fraud and cyber attacks, diagnosing technical glitches, and optimizing tool performance.</li>
        <li><strong>Legal Obligations (Art. 6(1)(c)):</strong> Retaining financial transaction records for statutory accounting, taxation, and regulatory reporting.</li>
        <li><strong>User Consent (Art. 6(1)(a)):</strong> Delivering non-essential advertising and tracking cookies where explicit opt-in consent is provided via our cookie banner.</li>
      </ul>

      <h2>7. Your Statutory Rights under GDPR (European Economic Area &amp; UK Residents)</h2>
      <p>If you reside within the European Economic Area (EEA), the United Kingdom, or Switzerland, you are endowed with comprehensive data subject rights under Chapter III of the GDPR:</p>
      <ul>
        <li><strong>Right to Access (Art. 15):</strong> You have the right to request confirmation of whether your personal data is processed and obtain a copy of all such records.</li>
        <li><strong>Right to Rectification (Art. 16):</strong> You may request immediate correction of inaccurate or outdated personal details.</li>
        <li><strong>Right to Erasure / "Right to be Forgotten" (Art. 17):</strong> You may demand the permanent deletion of your user account, profile, and associated records, subject to statutory retention obligations.</li>
        <li><strong>Right to Restriction of Processing (Art. 18):</strong> You may demand that we freeze or limit processing of your data while a dispute or verification request is pending.</li>
        <li><strong>Right to Data Portability (Art. 20):</strong> You may request your account data in a structured, commonly used, machine-readable JSON format.</li>
        <li><strong>Right to Object (Art. 21):</strong> You may object at any time to processing predicated on our legitimate interests or direct marketing.</li>
        <li><strong>Right to Withdraw Consent:</strong> Where processing is rooted in consent, you may withdraw that consent at any time with immediate forward-looking effect.</li>
      </ul>
      <p>To exercise any statutory right, email our compliance team at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a>. We respond to all authenticated requests within thirty (30) calendar days without fee.</p>

      <h2>8. California Consumer Privacy Rights (CCPA &amp; CPRA Compliance)</h2>
      <p>Under the California Consumer Privacy Act of 2018 (CCPA) as amended by the California Privacy Rights Act of 2020 (CPRA), California residents enjoy specific privacy guarantees:</p>
      <ul>
        <li><strong>Notice of Collection:</strong> We collect only the limited technical identifiers and account credentials enumerated in Section 3 above.</li>
        <li><strong>Right to Know &amp; Delete:</strong> You have the right to request disclosure of the categories and specific pieces of personal information collected over the preceding 12 months, and to request erasure thereof.</li>
        <li><strong>"Do Not Sell or Share My Personal Information":</strong> InstantTool explicitly affirms that <strong>we do not sell, rent, lease, or monetize your personal information or uploaded documents to any third-party data brokers</strong> for monetary or commercial consideration.</li>
        <li><strong>Right to Non-Discrimination:</strong> We will never deny you service, degrade tool processing speeds, or charge different prices because you exercised your privacy rights.</li>
      </ul>

      <h2>9. Children's Online Privacy Protection Act (COPPA) Compliance</h2>
      <p>InstantTool is designed for general audiences, professionals, and students. We do not knowingly target, solicit, or collect personal information from children under the age of thirteen (13), or under sixteen (16) within the European Union. If you are a parent or legal guardian and discover that your minor child has submitted identifiable information to our platform without authorization, please notify us immediately at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a>, and we will expeditiously expunge such records from our systems.</p>

      <h2>10. Third-Party Links, Extensions &amp; Integrations</h2>
      <p>InstantTool may contain hyperlinks to external websites, documentation repositories, or open-source libraries. Please be aware that once you click an external link, you leave our digital boundary. We do not control and cannot assume responsibility for the content, privacy protocols, or security measures of third-party websites. We encourage you to review the privacy notices of every destination website you visit.</p>

      <h2>11. Data Security &amp; Cryptographic Standards</h2>
      <p>We deploy robust organizational, administrative, and technological security controls to shield information against unauthorized access, alteration, destruction, or disclosure. These controls include TLS 1.3 cryptographic transport, automated DDoS mitigation at the edge, least-privilege administrative access policies, isolated container execution, and routine vulnerability scanning. However, no internet transmission method or electronic storage system is 100% impenetrable; therefore, while we strive to utilize commercially acceptable protections, we cannot guarantee absolute inviolability.</p>

      <h2>12. Revisions &amp; Material Updates to This Privacy Policy</h2>
      <p>We reserve the right to revise, modernize, or amend this Privacy Policy periodically to reflect technological advancements, statutory updates, or service modifications. Any amendments will become effective immediately upon posting to this URL, marked with a refreshed "Effective Date" at the top of this document. Continued usage of InstantTool following updates constitutes legal acknowledgment and acceptance of the revised terms.</p>

      <h2>13. Contact Information &amp; Data Protection Officer</h2>
      <p>If you have any questions, formal notices, or grievances concerning this Privacy Policy or our operational practices, please contact our administrative desk:</p>
      <ul>
        <li><strong>Operating Brand:</strong> InstantTool (by Techyfe)</li>
        <li><strong>Official Website:</strong> <a href="https://devigo.cloud">https://devigo.cloud</a></li>
        <li><strong>Official Privacy &amp; Support Email:</strong> <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a></li>
        <li><strong>Registered Office:</strong> Techyfe Engineering Desk, Sector 62, Noida, Uttar Pradesh 201309, India</li>
      </ul>
    `
  },
  "terms-of-service": {
    title: "Terms of Service",
    updatedAt: "2026-11-16",
    content: `
      <p class="lead"><strong>Effective Date:</strong> November 16, 2026 | <strong>Last Material Update:</strong> November 16, 2026</p>

      <h2>1. Agreement to Terms &amp; Legal Capacity</h2>
      <p>These Terms of Service ("Terms," "Agreement") constitute a legally binding contractual covenant entered into between you, whether personally or on behalf of an entity ("you," "user," "Client"), and <strong>InstantTool</strong>, operated by <strong>Techyfe</strong> ("we," "us," "our," or "the Platform"), governing your access to and utilization of the website located at <a href="https://devigo.cloud">https://devigo.cloud</a>, our workspace web applications, converters, editors, APIs, and associated digital services (collectively, the "Services").</p>
      <p>By accessing, browsing, interacting with, or utilizing any portion of InstantTool, you explicitly acknowledge that you have read, understood, and agreed to be legally bound by every clause of this Agreement, as well as our <a href="/legal/privacy-policy">Privacy Policy</a> and <a href="/legal/cookie-policy">Cookie Policy</a>. <strong>IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, YOU ARE EXPRESSLY PROHIBITED FROM ACCESSING OR USING THE SERVICES AND MUST DISCONTINUE USE IMMEDIATELY.</strong></p>

      <h2>2. Description of the Platform &amp; Service Tiers</h2>
      <p>InstantTool provides an expansive suite of browser-based digital utilities designed to empower creators, developers, students, and businesses. Our core service portfolio includes, but is not limited to:</p>
      <ul>
        <li><strong>PDF Document Tools:</strong> Merging, splitting, compressing, locking, unlocking, page numbering, e-signing, and format conversions.</li>
        <li><strong>Media &amp; Video Utilities:</strong> High-speed trimming, audio extraction, volume enhancement, speed adjustments, and video downloading utilities.</li>
        <li><strong>Image &amp; Asset Converters:</strong> Universal lossless conversion, compression, resizing, and format optimization (PNG, JPG, WEBP, SVG, AVIF, HEIC).</li>
        <li><strong>Developer &amp; Webmaster Suites:</strong> Code minifiers, syntax formatters, QR code generators, and color palette designers.</li>
        <li><strong>AI Creative Utilities:</strong> AI plagiarism analysis, duplicate content detection, content humanizers, and summarizers.</li>
      </ul>
      <p>We offer both completely free, ad-supported tier access and optional premium credit/subscription packages designed for higher file volumes and elevated quotas.</p>

      <h2>3. Intellectual Property Rights &amp; Uncompromised Content Ownership</h2>

      <h3>3.1. 100% User Ownership of Uploaded Files</h3>
      <p>InstantTool champions creator rights. <strong>You retain 100% full, exclusive, and unencumbered legal ownership, copyright, title, and intellectual property rights</strong> in and to all documents, source code, videos, audio clips, images, text, and data files that you upload, process, or generate through our platform. InstantTool asserts zero copyright claim, zero licensing rights, and zero ownership over your files. We process your content solely to execute the operational task you direct.</p>

      <h3>3.2. InstantTool Proprietary Assets</h3>
      <p>Except for user-owned files, the platform, its underlying source code, algorithms, WebAssembly compilations, UI designs, databases, stylesheets, logos, trademarks, and documentation (collectively, the "Proprietary Materials") are the exclusive intellectual property of Techyfe, protected by international copyright, trademark, trade secret, and unfair competition laws. You may not copy, reverse-engineer, decompile, redistribute, mirror, or repackage our software without prior written authorization.</p>

      <h2>4. User Representations, Warranties &amp; Eligibility</h2>
      <p>By accessing or utilizing InstantTool, you represent, warrant, and covenant that:</p>
      <ul>
        <li>You possess the full legal capacity and competence to enter into this binding Agreement under your local jurisdiction.</li>
        <li>You are at least 13 years of age (or 16 where required by local statute), and if acting on behalf of a corporation, you are authorized to bind that entity.</li>
        <li>All information you submit during registration or checkout is truthful, accurate, and up to date.</li>
        <li>You hold all necessary copyrights, licenses, and legal authorizations for all files you upload, convert, or process on the platform.</li>
        <li>Your use of our services will strictly adhere to all applicable municipal, national, and international laws and regulations.</li>
      </ul>

      <h2>5. Acceptable Use Policy &amp; Prohibited Conduct</h2>
      <p>You agree not to utilize InstantTool for any unlawful, hazardous, abusive, or unauthorized purpose. Specifically, you agree NOT to:</p>
      <ul>
        <li><strong>Infringing Media:</strong> Upload, convert, or distribute files that infringe upon any patent, trademark, trade secret, copyright, or moral rights of any third party.</li>
        <li><strong>Malicious Code:</strong> Introduce, upload, or transmit software viruses, worms, Trojan horses, spyware, ransomware, or other malicious computer code designed to damage or hijack hardware or networks.</li>
        <li><strong>Exploitation &amp; Abuse:</strong> Utilize the platform to process, generate, or circulate child sexual exploitation materials, violent extremism, hate speech, defamation, or harassment.</li>
        <li><strong>Automated Abuse &amp; Scraping:</strong> Deploy automated spiders, bots, scraping scripts, or flood protocols that disrupt platform responsiveness, degrade server stability, or exhaust compute resources for other legitimate users.</li>
        <li><strong>Security Breaches:</strong> Probe, scan, or test the vulnerability of our backend infrastructure, bypass authentication barriers, or tamper with credit counters or billing endpoints.</li>
        <li><strong>Commercial Resale:</strong> Resell, lease, or sub-license access to InstantTool APIs or interfaces without explicit enterprise contractual agreements with Techyfe.</li>
      </ul>

      <h2>6. Free Tier vs. Premium Subscriptions &amp; Billing Terms</h2>

      <h3>6.1. Free Utility Access</h3>
      <p>Core client-side utilities are provided entirely free of monetary charge. To support server infrastructure and bandwidth costs, free tier services may be accompanied by contextual advertisements served via Google AdSense and authorized ad exchanges.</p>

      <h3>6.2. Premium Subscriptions &amp; Credit Allocations</h3>
      <p>Users requiring advanced quotas, batch processing, or elevated file sizes may purchase Pro or Business subscriptions or pay-as-you-go credit packages. Billing is conducted on either a monthly or annual cycle, payable in advance via our authorized payment processors.</p>
      <ul>
        <li><strong>Automatic Renewal:</strong> Recurring subscription plans automatically renew at the conclusion of each billing cycle unless cancelled prior to the renewal date via your Account Dashboard.</li>
        <li><strong>Cancellation Policy:</strong> You may cancel your subscription at any time. Cancellation prevents future billing charges, while paid benefits remain accessible through the end of the current billing cycle.</li>
        <li><strong>Refund Terms:</strong> For detailed provisions governing payment disputes, technical delivery failures, and refund windows, please review our binding <a href="/legal/refund-policy">Refund &amp; Cancellation Policy</a>.</li>
      </ul>

      <h2>7. Disclaimer of Warranties ("As-Is" &amp; "As-Available")</h2>
      <p>TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE SERVICES, UTILITIES, CONVERTERS, EDITORS, AND DOCUMENTATION ON INSTANTTOOL ARE PROVIDED STRICTLY ON AN <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> BASIS, WITH ALL FAULTS AND WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.</p>
      <p>TECHYFE AND ITS FOUNDERS, EMPLOYEES, AND LICENSORS EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY. WE MAKE NO WARRANTY THAT:</p>
      <ul>
        <li>The Services will meet your specific technical or commercial requirements.</li>
        <li>Platform operations will be uninterrupted, timely, secure, or entirely error-free.</li>
        <li>File conversions will achieve 100% typographic or visual fidelity across complex, non-standard document formats.</li>
        <li>Outputs generated by AI modules (such as plagiarism checkers or content humanizers) will be statistically infallible or free from false positives.</li>
      </ul>

      <h2>8. Limitation of Liability</h2>
      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TECHYFE, INSTANTTOOL, ITS OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES, AGENTS, OR LICENSORS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION DAMAGES FOR:</p>
      <ul>
        <li>Loss of commercial profits, revenue, contracts, or goodwill.</li>
        <li>Loss, corruption, distortion, or deletion of data, documents, or digital assets.</li>
        <li>Business interruption, work stoppage, or computer malfunction.</li>
        <li>Unauthorized access to or alteration of your transmissions or data.</li>
      </ul>
      <p>REGARDLESS OF THE LEGAL THEORY (WHETHER IN CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR STATUTE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN ALL CIRCUMSTANCES, OUR AGGREGATE TOTAL LIABILITY ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE SERVICES SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO INSTANTTOOL IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE CLAIM; OR (B) FIFTY UNITED STATES DOLLARS ($50.00 USD).</p>

      <h2>9. Indemnification</h2>
      <p>You agree to defend, indemnify, and hold harmless Techyfe, InstantTool, its subsidiaries, affiliates, officers, directors, agents, partners, and employees from and against any loss, damage, liability, claim, demand, penalty, or expense (including reasonable legal and attorney fees) asserted by any third party arising out of or related to:</p>
      <ul>
        <li>Your use, misuse, or inability to use the platform.</li>
        <li>Any file, document, or media asset you upload or process through the Services.</li>
        <li>Your violation of any provision of these Terms or the Acceptable Use Policy.</li>
        <li>Your violation of any third-party rights, including intellectual property, privacy, or publicity rights.</li>
      </ul>

      <h2>10. Dispute Resolution &amp; Mandatory Individual Arbitration</h2>
      <p>Please read this section carefully as it affects your legal rights to pursue court litigation:</p>

      <h3>10.1. Mandatory Informal Negotiation</h3>
      <p>In the event of any controversy, claim, or dispute arising out of or relating to these Terms or the Services, the parties agree to first attempt in good faith to resolve the dispute through informal negotiations for a period of at least thirty (30) calendar days following written notice sent to <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a>.</p>

      <h3>10.2. Binding Arbitration &amp; Class Action Waiver</h3>
      <p>If informal negotiations fail, any unresolved dispute shall be resolved through final, binding individual arbitration administered under the prevailing rules of commercial arbitration in the jurisdiction of Techyfe's registration. <strong>YOU AND INSTANTTOOL AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.</strong></p>

      <h2>11. Governing Law &amp; Jurisdiction</h2>
      <p>These Terms and your use of InstantTool shall be governed by, construed, and interpreted in accordance with the substantive laws of India, without regard to its conflict of law principles. Any legal suit, action, or proceeding arising out of these Terms that is not subject to arbitration shall be instituted exclusively in the competent civil courts located in Gautam Buddha Nagar / Noida, Uttar Pradesh, India, and you hereby consent to personal jurisdiction therein.</p>

      <h2>12. Severability, Entire Agreement &amp; Non-Waiver</h2>
      <p>These Terms, together with our Privacy Policy, Cookie Policy, and Refund Policy, constitute the complete, exclusive, and unified agreement between you and InstantTool regarding the Services, superseding all prior oral or written discussions. If any provision of these Terms is deemed unlawful, void, or unenforceable by a court of competent jurisdiction, that specific provision shall be severed without impairing the validity and enforceability of the remaining provisions. Our failure to enforce any strict performance of these Terms shall not be construed as a waiver of any subsequent right.</p>

      <h2>13. Modifications to Terms &amp; Services</h2>
      <p>We reserve the right to amend, update, or revise these Terms at our sole discretion at any time. Changes will be posted to this page with an updated "Effective Date." Continued use of our platform following the posting of revisions signifies your conclusive assent to the amended Terms of Service.</p>

      <h2>14. Official Contact Information</h2>
      <p>If you have any questions, legal notices, or compliance concerns regarding these Terms of Service, please contact our administrative desk:</p>
      <ul>
        <li><strong>Operating Brand:</strong> InstantTool (by Techyfe)</li>
        <li><strong>Official Domain:</strong> <a href="https://devigo.cloud">https://devigo.cloud</a></li>
        <li><strong>Legal &amp; Support Email:</strong> <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a></li>
        <li><strong>Registered Office:</strong> Techyfe Engineering Desk, Sector 62, Noida, Uttar Pradesh 201309, India</li>
      </ul>
    `
  },
  "cookie-policy": {
    title: "Cookie Policy",
    updatedAt: "2026-11-16",
    content: `
      <p class="lead"><strong>Effective Date:</strong> November 16, 2026 | <strong>Last Material Update:</strong> November 16, 2026</p>

      <h2>1. Introduction &amp; Scope of This Cookie Policy</h2>
      <p>This Cookie Policy explains comprehensively how <strong>InstantTool</strong>, operated by <strong>Techyfe</strong> ("we," "us," or "our"), utilizes cookies, web beacons, pixel tags, HTML5 local storage, IndexedDB, and similar browser-side tracking technologies when you access our platform at <a href="https://devigo.cloud">https://devigo.cloud</a>. We believe in complete transparency regarding the automated telemetry tools we deploy, how third-party advertising partners like <strong>Google AdSense</strong> utilize cookies on our domain, and how you can exercise granular control over these technologies.</p>

      <h2>2. What Are Cookies and Local Tracking Technologies?</h2>
      <p>Cookies are minute alphanumeric text files placed onto your computer, smartphone, or tablet hard drive by web servers when you navigate internet sites. Cookies allow web applications to maintain state across pages, recognize returning visitors, remember personal preferences, and compile aggregated statistical metrics. Tracking technologies deployed on InstantTool include:</p>
      <ul>
        <li><strong>Session Cookies:</strong> Temporary files that remain active only while your browser session is open and are automatically purged when you close your web browser.</li>
        <li><strong>Persistent Cookies:</strong> Text records that remain saved on your device's hard drive for a predetermined expiration period (ranging from days to months) unless manually expunged.</li>
        <li><strong>HTML5 Local Storage &amp; IndexedDB:</strong> Advanced browser storage mechanisms that allow web applications to store structured offline data (such as active file canvas states or dark mode toggles) locally without transmitting that data across HTTP headers with every request.</li>
        <li><strong>Web Beacons / Pixel Tags:</strong> Tiny transparent graphic images (often 1x1 pixel) embedded in web pages that communicate with analytics and ad servers to monitor user visits.</li>
      </ul>

      <h2>3. The Categories of Cookies Deployed on InstantTool</h2>
      <p>InstantTool classifies its cookies and tracking technologies into four transparent functional categories:</p>

      <h3>3.1. Strictly Necessary &amp; Security Cookies (Always Active)</h3>
      <p>These cookies are indispensable for the core operation of our web application. Without these technical tokens, the platform cannot function safely or securely. They include:</p>
      <ul>
        <li><strong>Session &amp; Authentication Tokens:</strong> Keeping you logged into your user profile and verifying authorization states across workspace tabs.</li>
        <li><strong>Cross-Site Request Forgery (CSRF) Tokens:</strong> Preventing malicious third-party websites from spoofing actions on your behalf.</li>
        <li><strong>Rate Limiting &amp; DDoS Protection:</strong> Shielding our API endpoints against automated brute-force attacks and bot exploits.</li>
      </ul>

      <h3>3.2. Functional &amp; Preference Storage</h3>
      <p>These local storage keys allow InstantTool to deliver enhanced, personalized functionality based on your choices:</p>
      <ul>
        <li><strong>Theme Preferences:</strong> Remembering whether you selected Dark Mode, Light Mode, or System Theme across visits.</li>
        <li><strong>Workspace Cache (IndexedDB):</strong> Storing active tool parameters (such as compression levels or audio trim timestamps) so accidental page reloads do not destroy your in-progress work.</li>
        <li><strong>Language &amp; Region Settings:</strong> Preserving locale selections for international users.</li>
      </ul>

      <h3>3.3. Analytical &amp; Performance Telemetry Cookies</h3>
      <p>Performance cookies collect aggregated, anonymized diagnostic data that helps our software engineering team monitor and enhance our platform:</p>
      <ul>
        <li>Measuring page rendering speeds and client-side WebAssembly execution latencies across diverse operating systems and browsers.</li>
        <li>Identifying broken links, 404 errors, and JavaScript exceptions in real-time.</li>
        <li>Compiling non-personally identifiable telemetry regarding which tools (e.g., PDF compressor vs. YouTube downloader) experience the highest demand, assisting in cloud infrastructure capacity planning.</li>
      </ul>

      <h3>3.4. Advertising &amp; Commercial Targeting Cookies (Google AdSense &amp; DoubleClick)</h3>
      <p>To keep the vast majority of our utilities 100% free for users worldwide, InstantTool displays commercial advertising powered by <strong>Google AdSense</strong> and certified third-party ad networks:</p>
      <ul>
        <li><strong>Google DoubleClick DART Cookies:</strong> Allow Google and its advertising partners to serve targeted ads based on your visit history to InstantTool and other websites across the internet.</li>
        <li><strong>Frequency Capping:</strong> Ensuring you are not repeatedly shown the exact same advertisement.</li>
        <li><strong>Ad Measurement &amp; Fraud Prevention:</strong> Verifying legitimate impressions, detecting bot-driven invalid traffic, and measuring campaign effectiveness.</li>
      </ul>

      <h2>4. Comprehensive Cookie Inventory &amp; Specifications</h2>
      <p>Below is a non-exhaustive table detailing the primary cookies and local storage tokens utilized on InstantTool:</p>
      <div class="overflow-x-auto my-6">
        <table class="w-full text-left border-collapse border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <th class="p-3 font-bold">Cookie Name</th>
              <th class="p-3 font-bold">Provider</th>
              <th class="p-3 font-bold">Category</th>
              <th class="p-3 font-bold">Purpose</th>
              <th class="p-3 font-bold">Lifespan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <td class="p-3 font-mono">__Host-next-auth.csrf-token</td>
              <td class="p-3">InstantTool (1st Party)</td>
              <td class="p-3">Strictly Necessary</td>
              <td class="p-3">Cryptographic protection against CSRF exploits</td>
              <td class="p-3">Session</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <td class="p-3 font-mono">next-auth.session-token</td>
              <td class="p-3">InstantTool (1st Party)</td>
              <td class="p-3">Strictly Necessary</td>
              <td class="p-3">Maintains authenticated user session</td>
              <td class="p-3">30 Days</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <td class="p-3 font-mono">theme</td>
              <td class="p-3">InstantTool (1st Party)</td>
              <td class="p-3">Functional</td>
              <td class="p-3">Remembers user preference for Dark Mode / Light Mode</td>
              <td class="p-3">1 Year</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <td class="p-3 font-mono">workspace_context</td>
              <td class="p-3">InstantTool (IndexedDB)</td>
              <td class="p-3">Functional</td>
              <td class="p-3">Caches active workspace tool and parameters</td>
              <td class="p-3">Persistent</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <td class="p-3 font-mono">__gads / __gpi</td>
              <td class="p-3">Google AdSense (3rd Party)</td>
              <td class="p-3">Advertising</td>
              <td class="p-3">Enables ad delivery, frequency capping, and reporting</td>
              <td class="p-3">13 Months</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-800">
              <td class="p-3 font-mono">IDE / DSID</td>
              <td class="p-3">DoubleClick (Google)</td>
              <td class="p-3">Advertising</td>
              <td class="p-3">Serves targeted ads across non-Google sites</td>
              <td class="p-3">1 Year</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. How to Control, Manage, and Disable Cookies</h2>
      <p>You possess absolute legal and technical autonomy to govern cookies on your devices. You can inspect, restrict, or purge cookies through multiple avenues:</p>

      <h3>5.1. Direct Web Browser Settings</h3>
      <p>Virtually all modern browsers allow you to modify your cookie settings, reject third-party cookies, or clear stored cookies upon browser exit. Follow these vendor-specific guides:</p>
      <ul>
        <li><strong>Google Chrome:</strong> Navigate to Settings &gt; Privacy and Security &gt; Third-party cookies (or visit <a href="chrome://settings/cookies" target="_blank" rel="noopener noreferrer">chrome://settings/cookies</a>).</li>
        <li><strong>Apple Safari:</strong> Navigate to Preferences &gt; Privacy &gt; Prevent cross-site tracking and Block all cookies.</li>
        <li><strong>Mozilla Firefox:</strong> Navigate to Options &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.</li>
        <li><strong>Microsoft Edge:</strong> Navigate to Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data.</li>
      </ul>
      <p><em>Please note that blocking all cookies may disable critical platform features, such as preserving user login sessions or theme preferences.</em></p>

      <h3>5.2. Industry-Wide Targeted Advertising Opt-Out Portals</h3>
      <p>You can opt out of behavioral advertising cookies deployed by Google and hundreds of other accredited digital marketing firms using centralized consumer portals:</p>
      <ul>
        <li><strong>Google Ad Settings:</strong> <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</a></li>
        <li><strong>Network Advertising Initiative (NAI):</strong> <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">https://optout.networkadvertising.org</a></li>
        <li><strong>Digital Advertising Alliance (DAA):</strong> <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">https://www.aboutads.info/choices</a></li>
        <li><strong>European Interactive Digital Advertising Alliance (EDAA):</strong> <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">https://www.youronlinechoices.eu</a></li>
      </ul>

      <h2>6. Global Privacy Control (GPC) &amp; "Do Not Track" Signals</h2>
      <p>Some modern browsers transmit "Do Not Track" (DNT) or Global Privacy Control (GPC) HTTP signal headers. InstantTool recognizes and respects Global Privacy Control signals. When our platform detects an active GPC signal from your browser, we automatically suppress non-essential third-party advertising tracking cookies in compliance with California (CCPA/CPRA) and European regulations.</p>

      <h2>7. Consent Management &amp; Legal Compliance (ePrivacy Directive &amp; GDPR)</h2>
      <p>In adherence to the European Union ePrivacy Directive (Directive 2002/58/EC as amended) and the GDPR, InstantTool presents a transparent Cookie Consent Banner upon your first visit. Non-essential cookies (such as analytics and advertising tags) are loaded only after you grant affirmative consent. You may revisit, alter, or revoke your consent choices at any time through our footer consent preferences.</p>

      <h2>8. Periodic Revisions to This Cookie Policy</h2>
      <p>We may periodically update this Cookie Policy to reflect changes in our technological stack, additions of new utilities, or updates to global privacy jurisprudence. All updates become effective immediately upon publication on this page, indicated by the revised "Effective Date" at the top. We encourage you to review this policy periodically.</p>

      <h2>9. Questions &amp; Support Contact</h2>
      <p>For inquiries, feedback, or technical assistance regarding our cookie architecture or data practices, please reach out to our team:</p>
      <ul>
        <li><strong>Operating Brand:</strong> InstantTool (by Techyfe)</li>
        <li><strong>Official Website:</strong> <a href="https://devigo.cloud">https://devigo.cloud</a></li>
        <li><strong>Data Protection Desk:</strong> <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a></li>
        <li><strong>Registered Address:</strong> Techyfe Engineering Desk, Sector 62, Noida, Uttar Pradesh 201309, India</li>
      </ul>
    `
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    updatedAt: "2026-11-16",
    content: `
      <p class="lead"><strong>Effective Date:</strong> November 16, 2026 | <strong>Last Material Update:</strong> November 16, 2026</p>

      <h2>1. Overview &amp; Our Transparent Customer Philosophy</h2>
      <p>At <strong>InstantTool</strong>, operated by <strong>Techyfe</strong> ("we," "our," or "us"), we are dedicated to providing fair, honest, and straightforward digital services. We believe that clarity in billing, cancellations, and refunds is essential to maintaining enduring trust with our global community of creators, students, developers, and corporate clients.</p>
      <p>This Refund and Cancellation Policy outlines the comprehensive terms, eligibility criteria, timelines, and procedures governing purchases made on <a href="https://devigo.cloud">https://devigo.cloud</a>, including recurring subscription plans (Pro, Business, Starter) and pay-as-you-go credit packages. Please review this document carefully before initiating any financial transaction on our platform.</p>

      <h2>2. Free Core Utilities Commitment</h2>
      <p>Before purchasing any paid tier or credit allocation, we strongly encourage users to test our platform. Over 90% of our core utilities—including client-side PDF merging, document splitting, basic compression, image conversion, video trimming, and code formatting—are provided <strong>100% free of charge</strong> without requiring account creation, credit card submission, or financial obligation. Free access allows you to verify that our browser-based WebAssembly tools satisfy your workflow requirements prior to spending any money.</p>

      <h2>3. Subscription Plans: Billing, Renewal &amp; Cancellation Terms</h2>

      <h3>3.1. Recurring Billing Cycles</h3>
      <p>InstantTool offers voluntary subscription tiers (e.g., Starter, Pro, and Business) billed on either a monthly or annual recurring basis. When you subscribe, your payment method is automatically charged in advance at the start of each billing period until you explicitly cancel your subscription.</p>

      <h3>3.2. Effortless 1-Click Cancellation Anytime</h3>
      <p>You maintain complete control over your subscription. You may cancel your active subscription at any time without penalty, cancellation fees, or convoluted phone calls. To cancel:</p>
      <ol>
        <li>Log into your account at <a href="https://devigo.cloud/dashboard">https://devigo.cloud/dashboard</a>.</li>
        <li>Navigate to the <strong>Billing &amp; Plans</strong> section.</li>
        <li>Click <strong>"Cancel Subscription"</strong> and confirm your choice.</li>
      </ol>
      <p>Upon cancellation, your subscription will not renew at the end of the current billing cycle. You will retain full access to all premium features, higher file limits, and allocated quotas through the exact expiration date of your current paid billing period.</p>

      <h2>4. 7-Day Refund Eligibility Window &amp; Qualifying Circumstances</h2>
      <p>We stand firmly behind the technical quality of our software. We offer a <strong>7-Day Money-Back Guarantee</strong> under the clear, qualifying conditions detailed below:</p>

      <h3>4.1. Qualifying Scenarios for a 100% Full Refund</h3>
      <p>You are eligible to receive a complete, 100% refund of your recent payment if your request satisfies any of the following criteria:</p>
      <ul>
        <li><strong>Persistent Technical Glitch or System Downtime:</strong> A verified technical defect, server error, or platform outage on InstantTool prevented you from successfully utilizing our premium tools or processing your files, and our engineering support desk was unable to resolve the issue within forty-eight (48) business hours of your formal bug report.</li>
        <li><strong>Accidental Duplicate Billing:</strong> Due to a network anomaly or payment gateway glitch, your credit card, debit card, or UPI account was charged multiple times for a single subscription transaction.</li>
        <li><strong>Unused Subscription within 7 Calendar Days:</strong> You purchased an initial monthly or annual subscription and, within seven (7) calendar days of the initial transaction, submit a refund request having consumed zero or an incidental fraction (less than 5%) of your allocated credit balance.</li>
        <li><strong>Unauthorized Account Charge:</strong> In the verified event of credit card fraud or unauthorized account compromise, subject to formal payment gateway verification.</li>
      </ul>

      <h2>5. Non-Refundable Circumstances &amp; Ineligible Items</h2>
      <p>To prevent fraudulent exploitation and offset unrecoverable cloud compute and GPU costs, refunds will <strong>NOT</strong> be issued under the following circumstances:</p>
      <ul>
        <li><strong>Consumed Credits &amp; High-Volume Batch Usage:</strong> Any account that has already consumed a substantial portion (5% or greater) of its monthly or annual credit allocation, completed batch file conversions, or executed extensive AI content generations.</li>
        <li><strong>Requests Outside the 7-Day Statutory Window:</strong> Refund claims submitted more than seven (7) calendar days following the original transaction date.</li>
        <li><strong>Voluntary Contributions &amp; Donations:</strong> Financial tips, donations, or "Buy Us a Coffee" voluntary gifts contributed to support open-source web development and bandwidth costs are strictly non-refundable.</li>
        <li><strong>Account Violations &amp; AUP Bans:</strong> Accounts that have been suspended or terminated due to violations of our <a href="/legal/terms-of-service">Terms of Service</a> or Acceptable Use Policy (including uploading malware, launching DDoS attacks, illegal content distribution, or credential stuffing) forfeit all rights to refunds.</li>
        <li><strong>Third-Party Conversion Incompatibilities:</strong> Marginal variations in typographic layout or non-standard formatting arising from proprietary, password-corrupted, or defective third-party source files.</li>
      </ul>

      <h2>6. Automated Credit Refund Protocol for Failed Jobs</h2>
      <p>We operate an algorithmic fairness protocol for our credit-based tools. If an automated processing job (such as a complex PDF OCR conversion or video demuxing task) fails to execute due to an internal server error or unhandled backend exception:</p>
      <ul>
        <li>The system automatically intercepts the failure signal.</li>
        <li>The exact number of credits debited for that job is <strong>automatically and instantaneously refunded</strong> back to your user account balance within sixty (60) seconds.</li>
        <li>You are not penalized for server hiccups or transient network disconnects.</li>
      </ul>

      <h2>7. How to Submit a Formal Refund Request (Step-by-Step)</h2>
      <p>To ensure prompt processing, please follow these simple instructions when requesting a refund:</p>
      <ol>
        <li>Send an email to our official billing desk at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a>.</li>
        <li>Use the exact subject line: <code>Refund Request - [Your Registered Email] - [Transaction ID]</code>.</li>
        <li>Include the following information in the body of your message:
          <ul>
            <li>Your full name and registered InstantTool account email.</li>
            <li>Date and time of the transaction.</li>
            <li>Payment transaction reference or invoice number (from Stripe, Razorpay, or your receipt).</li>
            <li>A clear, concise explanation of the reason for your refund request (e.g., duplicate billing or technical failure with error screenshots attached if applicable).</li>
          </ul>
        </li>
      </ol>
      <p>Our dedicated billing team will review your application, verify your account usage logs, and respond with an official determination within twenty-four to forty-eight (24–48) business hours.</p>

      <h2>8. Refund Processing Timelines &amp; Payment Reversals</h2>
      <p>Once your refund request is formally approved by our billing desk:</p>
      <ul>
        <li>We immediately initiate the refund instruction through our certified payment gateway (Stripe or Razorpay).</li>
        <li>Refunds are issued <strong>strictly to the original payment instrument</strong> (the exact credit card, debit card, bank account, or UPI handle used during checkout). Under anti-money laundering regulations, we cannot remit refunds to alternative bank accounts or cash.</li>
        <li><strong>Standard Banking Timelines:</strong> While we process approvals within 48 hours, financial institutions, card networks (Visa, MasterCard, RuPay), and issuing banks typically take five to ten (5–10) business days to post the credit back to your account statement.</li>
      </ul>

      <h2>9. Chargebacks &amp; Payment Disputes</h2>
      <p>We pride ourselves on our responsiveness and customer support. If you experience an issue with a charge, <strong>please contact us directly at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a> before filing an unannounced chargeback or payment dispute with your bank or credit card company</strong>. Most inquiries can be resolved amicably within hours. Initiating an unauthorized chargeback without prior communication may trigger automated fraud defense mechanisms, resulting in the immediate suspension of your InstantTool account and blacklisting of associated payment credentials across our gateway partners.</p>

      <h2>10. Statutory Consumer Rights (EU/UK Cooling-Off Periods)</h2>
      <p>Nothing in this policy shall be construed as limiting, restricting, or waiving any mandatory statutory rights you possess under applicable consumer protection legislation, including the European Union Consumer Rights Directive (Directive 2011/83/EU) or the UK Consumer Rights Act 2015. Under EU/UK law, consumers purchasing digital goods explicitly acknowledge that by immediate access and consumption of digital services, statutory withdrawal periods are subject to immediate performance waivers.</p>

      <h2>11. Policy Modifications</h2>
      <p>Techyfe reserves the right to amend, update, or modify this Refund and Cancellation Policy periodically to adapt to evolving banking standards or service offerings. Any revisions will be published immediately on this page with an updated "Effective Date." Continued use of our paid services after modifications constitutes binding acceptance of the updated terms.</p>

      <h2>12. Contact Information for Billing Inquiries</h2>
      <p>If you have any questions regarding invoices, payment receipts, or refund statuses, our billing support desk is available to assist you:</p>
      <ul>
        <li><strong>Operating Entity:</strong> InstantTool (by Techyfe)</li>
        <li><strong>Official Website:</strong> <a href="https://devigo.cloud">https://devigo.cloud</a></li>
        <li><strong>Billing &amp; Refund Desk:</strong> <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a></li>
        <li><strong>Registered Office:</strong> Techyfe Engineering Desk, Sector 62, Noida, Uttar Pradesh 201309, India</li>
      </ul>
    `
  },
  "disclaimer": {
    title: "Disclaimer",
    updatedAt: "2026-11-16",
    content: `
      <p class="lead"><strong>Effective Date:</strong> November 16, 2026 | <strong>Last Material Update:</strong> November 16, 2026</p>

      <h2>1. General Informational &amp; Productivity Purpose Only</h2>
      <p>The information, utilities, software applications, converters, editors, heuristics, documentation, and tools provided on <strong>InstantTool</strong> (accessible online at <a href="https://devigo.cloud">https://devigo.cloud</a>), operated by <strong>Techyfe</strong> ("we," "us," or "our"), are made available strictly for <strong>general informational, productivity, educational, and personal utility purposes only</strong>.</p>
      <p>By accessing or interacting with InstantTool, you expressly acknowledge and agree that your use of the platform, including any reliance placed upon converted documents, extracted data, statistical heuristics, or AI-generated outputs, is undertaken entirely at your own independent discretion, volition, and risk.</p>

      <h2>2. No Professional Advice (Legal, Financial, Tax, or Medical)</h2>
      <p>The tools and content on InstantTool do NOT constitute, and must never be interpreted as, professional legal, financial, accounting, tax, or medical advice:</p>
      <ul>
        <li><strong>Document &amp; PDF Tools:</strong> Converting, signing, numbering, or editing legal contracts, tax forms, financial statements, or medical records using our PDF tools does not certify the legal validity, admissibility, or jurisdictional compliance of those documents. You must have critical contracts and legal documents vetted by licensed legal counsel before execution or submission to courts or government bodies.</li>
        <li><strong>Financial &amp; Spreadsheet Converters:</strong> While our converters (such as PDF to Excel or JSON formatters) strive for mathematical and tabular accuracy, algorithmic interpretation errors can occur. Never rely solely on converted spreadsheets for formal accounting, audits, tax filings, or statutory compliance without manual verification.</li>
      </ul>

      <h2>3. Specialized AI Tools &amp; Algorithmic Heuristics Disclaimer</h2>
      <p>InstantTool provides sophisticated AI-driven tools, including AI Plagiarism Checkers, AI Duplicate Content Detectors, AI Text Humanizers, AI YouTube Summarizers, AI Resume Builders, and AI Video Caption Generators. You must understand the mathematical realities and inherent limitations of artificial intelligence:</p>

      <h3>3.1. Probabilistic Nature of AI Models</h3>
      <p>Large language models and neural heuristic engines operate based on statistical probabilities and pattern recognition rather than factual cognition. Consequently, AI outputs may occasionally contain factual inaccuracies, hallucinations, contextual misunderstandings, or outdated information.</p>

      <h3>3.2. Plagiarism &amp; Content Detection Heuristics</h3>
      <p>Our plagiarism and AI detection algorithms search web indexes and analyze stylistic perplexity and burstiness. However, <strong>no plagiarism checker or AI detector on the internet is 100% infallible</strong>. False positives (human-authored text flagged as AI or duplicated) and false negatives (AI-generated or copied text flagged as original) can and do occur. Detection scores should be utilized strictly as diagnostic indicators and editorial aids, not as definitive proof or legal determinations of academic misconduct, copyright violation, or authorship.</p>

      <h3>3.3. AI Resume &amp; Career Generators</h3>
      <p>Resume templates and bullet points generated by our AI tools are recommendations intended to facilitate drafting. InstantTool makes no representation or warranty regarding job placement, interview callbacks, or compliance with specific employer applicant tracking systems (ATS).</p>

      <h2>4. Document Conversion Fidelity &amp; Algorithmic Limitations</h2>
      <p>Converting files between fundamentally disparate binary formats (e.g., converting a non-linear PostScript/PDF document into an editable Microsoft Word .DOCX, or transcoding multi-track video streams into compressed MP4 formats) involves intricate algorithmic approximation:</p>
      <ul>
        <li>We cannot guarantee 100% typographical, kerning, font embedding, color profile, or structural layout fidelity across all documents.</li>
        <li>Non-standard document elements, corrupted font subsets, complex vector graphics, macro scripts, or protected DRM content may not translate identically into target formats.</li>
        <li><strong>MANDATORY BACKUP REQUIREMENT:</strong> You are strictly required to preserve your original, unedited master files on your local hardware. InstantTool is not a persistent cloud storage provider and is not responsible for any file corruption, data loss, or visual discrepancies resulting from conversion operations.</li>
      </ul>

      <h2>5. External Hyperlinks &amp; Third-Party Services Disclaimer</h2>
      <p>InstantTool may contain hyperlinks directing users to external websites, third-party software repositories, developer tools, or commercial services that are not owned, operated, or monitored by Techyfe. Such links are provided solely as a convenience to our users:</p>
      <ul>
        <li>InstantTool does not investigate, verify, endorse, or guarantee the accuracy, relevance, completeness, or safety of external websites.</li>
        <li>We assume zero legal liability or responsibility for any damages, malware, fraudulent transactions, or privacy breaches arising from your access to or reliance on third-party domains.</li>
        <li>We strongly urge you to review the terms of service and privacy notices of any external site you visit.</li>
      </ul>

      <h2>6. Commercial Advertising &amp; Google AdSense Disclosure</h2>
      <p>To support server infrastructure, bandwidth expenses, and engineering maintenance without imposing paywalls, InstantTool displays commercial advertising powered by <strong>Google AdSense</strong> and authorized advertising exchanges:</p>
      <ul>
        <li>The presence of an advertisement on InstantTool does NOT constitute an endorsement, recommendation, guarantee, or warranty by Techyfe of the advertised product, commercial company, or service.</li>
        <li>InstantTool maintains absolute editorial separation between educational utility content and commercial ad placements.</li>
        <li>We do not control the specific commercial claims, promotional offers, or content of third-party advertisements served dynamically by ad networks. Any business dealings, purchases, or interactions with advertisers are strictly between you and the respective third-party merchant.</li>
      </ul>

      <h2>7. Platform Availability, Uptime &amp; Service Reliability</h2>
      <p>While InstantTool strives for 99.9% platform availability and continuous server uptime, we make no representations or warranties that:</p>
      <ul>
        <li>Access to the Services will be uninterrupted, continuous, timely, or completely error-free at all times.</li>
        <li>Defects, temporary routing glitches, or hardware failures will be corrected instantaneously.</li>
        <li>The platform will remain free of server outages resulting from upstream cloud providers, international DDoS attacks, fiber-optic interruptions, or scheduled maintenance windows.</li>
      </ul>
      <p>We reserve the right to temporarily modify, suspend, or decommission any utility or feature without prior notice or liability.</p>

      <h2>8. Media Downloader &amp; Copyright Compliance Disclaimer</h2>
      <p>InstantTool provides media extraction and video downloading utilities (including tools for YouTube, X, Facebook, and Instagram). These utilities are engineered and provided strictly for lawful, personal, and fair-use archiving:</p>
      <ul>
        <li><strong>User Responsibility:</strong> You are solely and exclusively responsible for ensuring that you hold the legal right, copyright ownership, or explicit permission from the copyright holder to download, convert, or archive any media asset.</li>
        <li><strong>Prohibition of Copyright Piracy:</strong> You are expressly prohibited from utilizing our download utilities to infringe upon intellectual property rights, pirate commercial films or music, or violate the terms of service of third-party content providers.</li>
        <li><strong>Indemnity:</strong> InstantTool disclaims all legal liability for unauthorized downloads or copyright violations executed by users, and users agree to indemnify Techyfe against any legal actions arising from their copyright misuse.</li>
      </ul>

      <h2>9. Zero-Storage Architecture &amp; Data Loss Disclaimer</h2>
      <p>Because InstantTool utilizes a privacy-first, zero-retention architecture—where files are processed either directly inside your browser's local WebAssembly memory or held in volatile RAM purged within sixty (60) minutes—<strong>InstantTool maintains zero backup copies of your files</strong>. If your browser crashes, your internet connection drops, or you close your browser tab before downloading your processed output, your files cannot be retrieved from our servers. InstantTool is not liable for any lost work, unrecoverable data, or operational delays resulting from local client-side crashes.</p>

      <h2>10. "Use at Your Own Risk" &amp; Total Limitation of Liability</h2>
      <p>ALL MATERIALS, INFORMATION, UTILITIES, AND SERVICES ON INSTANTTOOL ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, TECHYFE, INSTANTTOOL, ITS FOUNDERS, DIRECTORS, EMPLOYEES, AND PARTNERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, AND SHALL NOT BE HELD LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR ACCESS TO, USE OF, OR INABILITY TO USE OUR WEBSITE OR TOOLS.</p>

      <h2>11. Revisions &amp; Inquiries</h2>
      <p>We reserve the right to modify, amend, or modernize this Disclaimer at our sole discretion at any time. Changes will be posted to this URL with an updated "Effective Date." If you have questions regarding this Disclaimer or require clarification regarding any tool on our platform, please contact us:</p>
      <ul>
        <li><strong>Operating Brand:</strong> InstantTool (by Techyfe)</li>
        <li><strong>Official Domain:</strong> <a href="https://devigo.cloud">https://devigo.cloud</a></li>
        <li><strong>Legal &amp; Support Email:</strong> <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a></li>
        <li><strong>Registered Office:</strong> Techyfe Engineering Desk, Sector 62, Noida, Uttar Pradesh 201309, India</li>
      </ul>
    `
  }
}
