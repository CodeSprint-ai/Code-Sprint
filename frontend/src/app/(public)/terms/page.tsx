import type { Metadata } from "next";
import { LegalDocument } from "@/features/marketing/LegalDocument";
export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};
export default function Page() {
  return (
    <LegalDocument
      title={"Terms of Service"}
      intro={"The expectations for using CodeSprint Free Beta."}
      sections={[
        {
          title: "Free Beta service",
          text: "CodeSprint currently provides a free beta for algorithm practice and learning. Features and allowances may change as we test reliability and costs. Beta access does not create a paid subscription, and joining a waitlist does not commit you to a purchase.",
        },
        {
          title: "Accounts and eligibility",
          text: "You must meet applicable age and consent requirements to use the service. If parental permission is required, obtain it before creating an account. Provide accurate account details, protect your credentials, and use an account you control. You are responsible for activity through your account and should report suspected unauthorized access.",
        },
        {
          title: "Your code and content",
          text: "You retain ownership of code and content you submit. You grant CodeSprint permission to store, process, and transmit it to the providers needed to deliver requested evaluation, AI feedback, and learning features. Submit only content you are entitled to use. Problem statements and other platform materials may have their own ownership and license terms.",
        },
        {
          title: "Acceptable use",
          text: "Do not use the platform for malicious code, attacks, unauthorized access, credential theft, abusive automation, impersonation, or attempts to bypass isolation, quotas, or access controls. Do not submit other people\u2019s private information, secrets, or confidential code. We may restrict abusive activity or suspend access to protect the service and other users.",
        },
        {
          title: "AI guidance and evaluation",
          text: "Hints and analysis are educational assistance. AI output may be incorrect or incomplete, and judging can be affected by execution or provider failures. Review outputs and verify your own reasoning. CodeSprint does not guarantee interview outcomes, employment, contest results, or uninterrupted availability.",
        },
        {
          title: "Free AI allowances",
          text: "Free Beta provides 20 new hint unlocks and 3 completed detailed analyses per calendar month. The month resets at 00:00 UTC on the first day. Pending analyses reserve capacity until completion or permanent failure. Failed operations do not consume the completed allowance; retrying an existing analysis job and rereading cached results do not incur another charge. Code execution is subject to operational rate limits, separate from AI allowances.",
        },
        {
          title: "Future subscriptions",
          text: "No purchase or automatic overage charge is currently enabled. Planned Pro prices, usage allowances, and billing terms are informational until paid service is offered. Final pricing, operator details, and applicable terms must be shown before purchase; existing waitlist consent is not payment consent.",
        },
        {
          title: "Support, closure, and responsibility",
          text: "Contact codesprint.ai@gmail.com for support, account closure, or privacy requests. Beta features are provided as available. Nothing in these terms removes rights that cannot lawfully be excluded. Applicable paid-service operator, jurisdiction, and detailed commercial terms will be confirmed before a paid launch.",
        },
      ]}
    />
  );
}
