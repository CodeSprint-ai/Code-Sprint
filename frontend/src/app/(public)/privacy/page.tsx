import type { Metadata } from "next";
import { LegalDocument } from "@/features/marketing/LegalDocument";
export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};
export default function Page() {
  return (
    <LegalDocument
      title={"Privacy Policy"}
      intro={"How CodeSprint processes information during Free Beta."}
      sections={[
        {
          title: "Who to contact",
          text: "CodeSprint is a project developed by the team named on our About page. The service contact is codesprint.ai@gmail.com. We do not represent CodeSprint as an incorporated company. The contracting operator and jurisdiction for any future paid service will be identified before payment is offered.",
        },
        {
          title: "Information you provide",
          text: "We process account details such as your name, email, sign-in provider identifiers, password hash where applicable, profile information, submissions and code, saved problems, and preferences. Practice activity includes verdicts, hints revealed, topic mastery, streaks, and AI allowance records. Contact messages and waitlist entries are collected only when you submit those forms.",
        },
        {
          title: "Why we use it",
          text: "Information is used to authenticate you, evaluate code, deliver requested hints and analysis, save progress, maintain security, and respond to support requests. Pro waitlist consent is separate from account creation and is used to contact you about Pro availability. We do not automatically add support requests to a marketing list.",
        },
        {
          title: "Code evaluation and AI processing",
          text: "Code and test inputs may be sent to the configured Judge0 execution service for evaluation. When AI features are requested, relevant code, problem context, and performance information may be sent to Google Gemini through the AI pipeline. Do not submit credentials, secrets, confidential business code, or personal information in code. These providers process requests under their own terms; we do not make a blanket promise about provider retention or model training.",
        },
        {
          title: "Other service providers",
          text: "The application uses hosted PostgreSQL for account and learning records, Redis/Bull for queues and caches, Cloudinary for uploaded profile images, and Resend for service email where configured. Google and GitHub are used if you choose their sign-in options. The frontend and backend hosting providers may process operational logs. Third-party destinations such as YouTube, Instagram, and GitHub have their own privacy policies.",
        },
        {
          title: "Storage and retention",
          text: "Contact submissions are deleted by a daily cleanup after 90 days and waitlist entries after 365 days unless you ask for earlier removal. Account and learning records remain while your account is maintained, subject to necessary security and operational retention. AI allowance ledger entries are retained for up to 90 days. Background-job and cache retention varies by configuration; an active-record deletion does not imply immediate removal from all provider backups.",
        },
        {
          title: "Your requests and choices",
          text: "Email codesprint.ai@gmail.com or use the Contact page to request access, correction, account/data deletion, or waitlist removal. We may need to verify control of the account before acting. We will explain any information that must be retained rather than promise deletion we cannot perform. Manage browser preferences on the Cookie Settings page.",
        },
        {
          title: "Beta audience and changes",
          text: "CodeSprint is intended for adult students and learners. Younger learners should use the service only where applicable age and parental-consent requirements are met. Contact us about data submitted without required consent. Material changes to these practices will be reflected in this notice and communicated where appropriate. Operational measures reduce risk but no service can guarantee absolute security.",
        },
      ]}
    />
  );
}
