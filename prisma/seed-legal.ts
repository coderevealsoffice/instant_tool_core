import prisma from '../src/lib/prisma/client'

const legalPages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `
      <p>Last updated: July 2026</p>
      
      <h2>1. Introduction</h2>
      <p>Welcome to <strong>InstantTool</strong> ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at info.codereveals@gmail.com.</p>
      <p>When you visit our website https://devigo.cloud (the "Website"), and more generally, use any of our services (the "Services", which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.</p>
      
      <h2>2. What Information Do We Collect?</h2>
      <p><strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.</p>
      <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
      <ul>
        <li>Names</li>
        <li>Email Addresses</li>
        <li>Usernames</li>
        <li>Passwords</li>
        <li>Billing Addresses</li>
      </ul>
      <p><strong>Information automatically collected:</strong> We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information.</p>
      
      <h2>3. Google AdSense & Advertising Cookies</h2>
      <p>We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet.</p>
      <p>Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy. We have implemented the following:</p>
      <ul>
        <li>Remarketing with Google AdSense</li>
        <li>Google Display Network Impression Reporting</li>
        <li>Demographics and Interests Reporting</li>
      </ul>
      <p>We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.</p>

      <h2>4. How Do We Use Your Information?</h2>
      <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
      <ul>
        <li>To facilitate account creation and logon process.</li>
        <li>To post testimonials with your consent.</li>
        <li>Request feedback and to contact you about your use of our Website.</li>
        <li>To manage user accounts and keep them in working order.</li>
        <li>To send administrative information to you.</li>
        <li>To protect our Services from malicious activity.</li>
      </ul>

      <h2>5. How Long Do We Keep Your Information?</h2>
      <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>
      <p><strong>File Processing Privacy:</strong> Any files (PDFs, Videos, Images) uploaded to InstantTool for processing are held in temporary memory or secure cloud storage purely for the duration of the processing task. These files are automatically and permanently deleted from our servers within a maximum of 2 hours post-processing. We do not claim ownership, read, or distribute your uploaded files.</p>

      <h2>6. GDPR & CCPA Rights</h2>
      <p>If you are a resident of the European Economic Area (EEA) or California, you have specific rights regarding your personal data. You have the right to request access to the personal data we hold about you, to request that your personal data be corrected or deleted, and to object to the processing of your data. To exercise any of these rights, please contact us directly.</p>
    `
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    content: `
      <p>Last updated: July 2026</p>

      <h2>1. Agreement to Terms</h2>
      <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and InstantTool ("we", "us", or "our"), concerning your access to and use of the https://devigo.cloud website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>
      <p>You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.</p>

      <h2>2. Intellectual Property Rights</h2>
      <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.</p>
      
      <h2>3. User Representations</h2>
      <p>By using the Site, you represent and warrant that:</p>
      <ol>
        <li>All registration information you submit will be true, accurate, current, and complete.</li>
        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
        <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise without explicit permission.</li>
        <li>You will not use the Site for any illegal or unauthorized purpose.</li>
      </ol>

      <h2>4. Acceptable Use Policy</h2>
      <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
      <p>As a user of the Site, you agree not to:</p>
      <ul>
        <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
        <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
        <li>Circumvent, disable, or otherwise interfere with security-related features of the Site.</li>
        <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming.</li>
      </ul>

      <h2>5. AI Tools Usage</h2>
      <p>InstantTool provides various Artificial Intelligence (AI) powered tools. You acknowledge that AI algorithms may generate output that is inaccurate, inappropriate, or unintended. You are solely responsible for reviewing and verifying any content generated by our AI tools before using it for commercial, legal, or personal purposes. InstantTool shall not be held liable for any damages resulting from reliance on AI-generated content.</p>

      <h2>6. Governing Law</h2>
      <p>These Terms shall be governed by and defined following the laws of India. InstantTool and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>
    `
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    content: `
      <p>Last updated: July 2026</p>

      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
      <p>Cookies set by the website owner (in this case, InstantTool) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., like advertising, interactive content and analytics).</p>

      <h2>2. Why Do We Use Cookies?</h2>
      <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.</p>

      <h2>3. Types of Cookies We Use</h2>
      <ul>
        <li><strong>Essential website cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</li>
        <li><strong>Performance and functionality cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</li>
        <li><strong>Analytics and customization cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are.</li>
        <li><strong>Advertising cookies (Google AdSense):</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</li>
      </ul>

      <h2>4. Google AdSense & DoubleClick Cookie</h2>
      <p>Google, as a third-party vendor, uses cookies to serve ads on our Service. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our Service or other websites on the Internet. You may opt out of the use of the DoubleClick Cookie for interest-based advertising by visiting the Google Ads Settings web page.</p>

      <h2>5. How Can I Control Cookies?</h2>
      <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.</p>
      <p>If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
    `
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    content: `
      <p>Last updated: July 2026</p>

      <h2>1. General Overview</h2>
      <p>Thank you for choosing InstantTool. We stand behind our products and your satisfaction with them is important to us. However, because our products are digital goods delivered via the Internet, we generally offer refunds only under specific, strict conditions.</p>

      <h2>2. Eligibility for a Refund</h2>
      <p>We offer a <strong>7-day money-back guarantee</strong> on all of our premium subscription plans. To be eligible for a refund, you must meet ALL of the following criteria:</p>
      <ul>
        <li>Your request must be submitted within 7 days of the original purchase date.</li>
        <li>You must have consumed less than 10% of your allocated monthly processing credits or AI generations.</li>
        <li>You must have encountered a verifiable, reproducible technical error that prevents our tools from functioning as advertised, and our support team was unable to resolve the issue within 72 hours of your report.</li>
      </ul>

      <h2>3. Circumstances Not Eligible for Refund</h2>
      <p>We will NOT issue a refund under the following circumstances:</p>
      <ul>
        <li>You changed your mind, decided you do not need the software, or found a different alternative.</li>
        <li>You lack the necessary hardware, internet connection, or modern web browser to utilize the platform.</li>
        <li>You forgot to cancel your subscription before the automatic renewal date. (Our system clearly states that subscriptions auto-renew. It is your responsibility to cancel your plan from the dashboard if you no longer wish to be billed).</li>
        <li>You violated our Terms of Service (e.g., using the API for malicious purposes, account sharing).</li>
      </ul>

      <h2>4. Dispute Resolution & Chargebacks</h2>
      <p>We kindly request that you contact us to resolve any issues before initiating a chargeback with your bank or credit card provider. Fraudulent chargebacks will result in the immediate and permanent suspension of your account and your IP address will be blacklisted.</p>

      <h2>5. How to Request a Refund</h2>
      <p>If you meet the eligibility criteria, please send an email to <strong>info.codereveals@gmail.com</strong> with the subject line "Refund Request - [Your Order ID]". Include a detailed explanation of the issue, screenshots of the error, and the email address associated with your account.</p>
      <p>Approved refunds are processed within 3-5 business days and will be returned to the original payment method. Depending on your bank, it may take an additional 5-10 business days for the funds to appear on your statement.</p>
    `
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    content: `
      <p>Last updated: July 2026</p>

      <h2>1. General Information</h2>
      <p>The information provided by InstantTool ("we," "us," or "our") on https://devigo.cloud (the "Site") is for general informational and utility purposes only. All information and tools on the Site are provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or digital outputs generated on the Site.</p>
      <p>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION OR OUTPUT PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.</p>

      <h2>2. Professional Disclaimer</h2>
      <p>The Site cannot and does not contain legal, financial, tax, or medical advice. The tools and information are provided for general informational and educational purposes only and are not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional advice.</p>
      
      <h2>3. Artificial Intelligence Disclaimer</h2>
      <p>Many features on InstantTool rely on Artificial Intelligence (AI) and Machine Learning models (such as text generation, image manipulation, and data extraction). You explicitly acknowledge that AI technologies are experimental and prone to "hallucinations" or errors. Outputs may be inaccurate, biased, or nonsensical.</p>
      <p>InstantTool holds no responsibility for the publication, distribution, or reliance upon AI-generated content. You are entirely responsible for fact-checking, editing, and verifying the legality and accuracy of any AI output before using it in a personal, commercial, or academic capacity.</p>

      <h2>4. File Security and Data Loss Disclaimer</h2>
      <p>While we employ enterprise-grade security and automatic deletion protocols for files uploaded to our servers, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security. We are not responsible for any data breaches, leaks, or data loss.</p>
      <p>Users are strongly advised to keep original backups of all files (PDFs, Videos, Images, Audio) before processing them through InstantTool. We are not liable for any corrupted files resulting from compression, conversion, or formatting errors.</p>

      <h2>5. Affiliates & Third-Party Links</h2>
      <p>The Site may contain links to affiliate websites, and we may receive an affiliate commission for any purchases made by you on the affiliate website using such links. The Site may also feature Google AdSense advertisements. We do not endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising.</p>
    `
  }
];

async function main() {
  console.log("Starting to seed COMPREHENSIVE Legal Pages...");

  for (const page of legalPages) {
    await prisma.legalPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
      }
    });
    console.log(`✅ Seeded Comprehensive Legal Page: ${page.title}`);
  }

  console.log("🎉 All Comprehensive Legal Pages successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding legal pages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
