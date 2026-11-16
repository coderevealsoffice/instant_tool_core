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
    updatedAt: "2026-11-15",
    content: `
      <h2>1. Introduction & Commitment to Privacy</h2>
      <p>At <strong>InstantTool</strong> (accessible at <a href="https://devigo.cloud">https://devigo.cloud</a>), protecting the privacy and personal data of our users is our paramount commitment. This Privacy Policy details the types of information collected, processed, and safeguarded by InstantTool, as well as our zero-retention guarantee for uploaded media and files.</p>
      <p>If you have any questions or require additional details regarding our privacy practices, please contact our data protection team directly at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a>.</p>

      <h2>2. File Processing & Zero-Storage Architecture</h2>
      <p>InstantTool provides browser-based utilities including PDF manipulation, media converters, audio/video tools, and AI assistants. Our architecture operates under two transparent principles:</p>
      <ul>
        <li><strong>Client-Side WebAssembly Processing (Primary):</strong> The majority of our utilities—including PDF splitting/merging, image compression, image format conversion, and client text utilities—execute directly inside your browser using client-side WebAssembly (WASM), Canvas, and HTML5 APIs. In these instances, <strong>your files never leave your computer or device</strong> and are never transmitted over the internet to our servers.</li>
        <li><strong>Transient Server Processing:</strong> For tasks that require specialized cloud models or heavy GPU rendering, files are transmitted via bank-grade TLS 1.3 encrypted connections. These files are processed strictly in volatile temporary RAM and are automatically and permanently purged as soon as your download begins or your session ends. We never inspect, index, sell, or retain user files.</li>
      </ul>

      <h2>3. Google AdSense & DoubleClick DART Cookies</h2>
      <p>Google is one of our verified third-party advertising partners on InstantTool. Google uses cookies, specifically DART cookies, to serve relevant advertisements to visitors based upon their visit to <a href="https://devigo.cloud">https://devigo.cloud</a> and other websites across the internet.</p>
      <p>Visitors may manage, review, or opt out of the use of personalized advertising DART cookies at any time by visiting the official Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a> or through Google's Ad Settings portal at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</a>.</p>
      <p>You may also opt out of third-party vendor cookies across multiple advertising networks by visiting the Network Advertising Initiative (NAI) consumer choice tool at <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">https://optout.networkadvertising.org</a> or the Digital Advertising Alliance (DAA) portal at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>

      <h2>4. Third-Party Advertisers & Technologies</h2>
      <p>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons within the advertisements and links that appear on InstantTool. These are delivered directly to your web browser and automatically log your IP address. These technologies measure advertising campaign effectiveness and personalize ad content according to your browsing preferences.</p>
      <p>InstantTool has no access to or control over these third-party cookies placed by independent advertising partners.</p>

      <h2>5. Log Files & Anonymous Analytics</h2>
      <p>InstantTool follows industry-standard server log procedures. Logged data includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and anonymous click counts. This telemetry is strictly non-personally identifiable and is utilized solely for capacity planning, detecting denial-of-service exploits, and debugging platform latency.</p>

      <h2>6. GDPR Compliance (General Data Protection Regulation - EU Users)</h2>
      <p>Users residing within the European Economic Area (EEA) possess full statutory rights under the GDPR, including:</p>
      <ul>
        <li><strong>Right to Access:</strong> You may request copies of any personal profile data we hold.</li>
        <li><strong>Right to Rectification:</strong> You may request correction of inaccurate or incomplete records.</li>
        <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You may request immediate deletion of your account and associated session data.</li>
        <li><strong>Right to Restrict or Object to Processing:</strong> You may limit how we process non-essential analytics.</li>
        <li><strong>Right to Data Portability:</strong> You may request transfer of your account data in a structured, machine-readable format.</li>
      </ul>

      <h2>7. CCPA & CPRA Privacy Rights (California Residents)</h2>
      <p>Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to request disclosure of categories and specific pieces of personal information collected, request deletion of personal information, and opt out of the sale or sharing of personal information. InstantTool <strong>does not sell or rent personal user data</strong> to any third parties.</p>

      <h2>8. Children's Privacy Protection</h2>
      <p>InstantTool is designed for general audiences and does not knowingly collect personal identifiable information from children under the age of 13. If you believe your child has submitted personal details on our site, please contact us immediately so we can remove such information from our records.</p>

      <h2>9. Consent & Policy Modifications</h2>
      <p>By using InstantTool, you hereby consent to our Privacy Policy and agree to its terms. Any updates or revisions to this policy will be immediately reflected on this page with an updated modification timestamp.</p>
    `
  },
  "terms-of-service": {
    title: "Terms of Service",
    updatedAt: "2026-11-15",
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using InstantTool (<a href="https://devigo.cloud">https://devigo.cloud</a>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any portion of these terms, you are prohibited from accessing or using our services.</p>

      <h2>2. Permitted Use & Free Utility Access</h2>
      <p>InstantTool grants you a non-exclusive, revocable license to utilize our browser-based file tools, converters, compressors, and AI utilities for personal, educational, and commercial purposes. You agree not to:</p>
      <ul>
        <li>Attempt to reverse-engineer, decompile, or compromise the proprietary security infrastructure of our backend services.</li>
        <li>Deploy automated scrapers, flood scripts, or bots that degrade platform responsiveness for other users.</li>
        <li>Upload, process, or transmit malicious code, malware, spyware, or unlawful and infringing media.</li>
      </ul>

      <h2>3. Intellectual Property Rights & Content Ownership</h2>
      <p><strong>You retain 100% full legal ownership, rights, and title</strong> to all files, documents, images, and text content you upload or process through InstantTool. InstantTool asserts zero ownership, copyright claim, or usage rights over user-processed files.</p>

      <h2>4. Disclaimer of Warranties</h2>
      <p>The materials, software, and utilities on InstantTool are provided strictly on an 'as is' and 'as available' basis. InstantTool makes no warranties, expressed or implied, regarding uptime, algorithmic precision, or fitness for a particular commercial purpose.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall InstantTool, its founders, or affiliates be liable for any damages (including, without limitation, damages for loss of data, loss of business revenue, or work interruption) arising from the use or inability to use our tools.</p>

      <h2>6. Governing Law & Modifications</h2>
      <p>These terms shall be governed by and interpreted in accordance with applicable statutory laws. InstantTool reserves the right to modify these Terms of Service at any time with prior notice posted on this page.</p>
    `
  },
  "cookie-policy": {
    title: "Cookie Policy",
    updatedAt: "2026-11-15",
    content: `
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your computer or mobile device by websites you visit. They are widely used to maintain application state, preserve user preferences, and provide analytical data to website operators.</p>

      <h2>2. How InstantTool Uses Cookies</h2>
      <p>InstantTool uses cookies for the following specific purposes:</p>
      <ul>
        <li><strong>Essential / Technical Cookies:</strong> Required to preserve user authentication sessions, remember dark/light theme choices, and manage active workspace tool settings.</li>
        <li><strong>Analytics Cookies:</strong> Help our engineering team measure processing latency, detect software bugs, and optimize user experience across different browser versions.</li>
        <li><strong>Advertising Cookies (Google AdSense):</strong> Placed by Google and authorized third-party ad networks to deliver relevant advertisements and monitor advertising engagement.</li>
      </ul>

      <h2>3. How to Manage and Disable Cookies</h2>
      <p>You can choose to block or delete cookies through your web browser preferences (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge). Furthermore, you can opt out of personalized Google advertisements at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
    `
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    updatedAt: "2026-11-15",
    content: `
      <h2>1. Free Core Utilities</h2>
      <p>All core PDF, media conversion, compression, and basic editing utilities on InstantTool are 100% free to use without requiring payment or credit card registration.</p>

      <h2>2. Voluntary Donations & Support</h2>
      <p>Voluntary contributions made via our "Support the Project / Buy us a coffee" feature are non-refundable gifts aimed at funding cloud bandwidth, server upkeep, and open web development.</p>

      <h2>3. Pro Subscriptions & Credit Packages</h2>
      <p>If you purchase a paid subscription or credit package and experience a technical glitch where credits were debited without delivering the requested output, please contact our support desk at <a href="mailto:info.techyfe@gmail.com">info.techyfe@gmail.com</a> within 7 calendar days with your transaction ID. We will promptly investigate and credit your account or issue a full refund.</p>
    `
  },
  "disclaimer": {
    title: "Disclaimer",
    updatedAt: "2026-11-15",
    content: `
      <h2>1. General Informational Use</h2>
      <p>All utilities, converters, SEO analyzers, and AI assistants on InstantTool (<a href="https://devigo.cloud">https://devigo.cloud</a>) are provided for general informational, educational, and productivity purposes only.</p>

      <h2>2. AI and SEO Heuristics Disclaimer</h2>
      <p>Our SEO analyzers, readability calculators, and AI generators utilize statistical models and heuristics. While we continually refine our algorithms for maximum accuracy, outputs should be treated as diagnostic aids rather than legal or technical guarantees.</p>

      <h2>3. External Links Disclaimer</h2>
      <p>InstantTool may contain links to external third-party websites or services that are not controlled or maintained by InstantTool. InstantTool does not endorse, guarantee, or assume liability for the accuracy or integrity of content on external websites.</p>
    `
  }
}
