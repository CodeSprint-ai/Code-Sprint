import type { Metadata } from "next";
import { LegalDocument } from "@/features/marketing/LegalDocument";
export const metadata: Metadata = {
  title: "Planned Billing & Refund Terms",
  alternates: { canonical: "/legal/billing" },
};
export default function Page() {
  return (
    <LegalDocument
      title={"Planned Billing & Refund Terms"}
      intro={
        "A transparent preview of the proposed Pro model. Paid service is not active."
      }
      sections={[
        {
          title: "Status: not active",
          text: "These are planned commercial terms for a future Pro launch. CodeSprint is currently Free Beta, collects no subscription payments, and does not start subscriptions through the waitlist. No payment gateway or checkout is enabled.",
        },
        {
          title: "Proposed prices and allowances",
          text: "Pro Monthly is planned at USD $5 per month. Pro Annual is planned at USD $40 upfront per year, equivalent to approximately $3.33 per month and about 33% less than twelve monthly payments. Pilot allowances are 200 hints and 30 detailed analyses per month on either plan. Final prices, taxes, currency, and usage limits will be displayed before any purchase.",
        },
        {
          title: "Renewals and cancellation",
          text: "The proposed model is upfront recurring billing with the next amount and renewal date disclosed. Users should be able to cancel future renewal from their account and keep access through the paid period. An annual renewal reminder should be sent before billing. These controls must be implemented and tested before subscriptions are activated.",
        },
        {
          title: "Proposed refunds",
          text: "We plan to offer a 7-day refund window on a first paid purchase for monthly and annual plans. Duplicate or incorrect charges should be fully refunded. After that window, routine cancellation would stop future renewal without a prorated refund, except where applicable law or a substantial service failure requires otherwise. No refund handling time or payment method is promised before a provider is selected.",
        },
        {
          title: "No automatic overages",
          text: "The planned service will show remaining usage and reset dates. Exhausting an allowance should not automatically create an extra charge. Any future additional purchase must require a separate, clearly priced action.",
        },
        {
          title: "Institutions and launch readiness",
          text: "University and bootcamp pilots will be quoted individually for their seats, scope, and usage. Before any paid launch, CodeSprint must identify its legal operator and jurisdiction, validate AI/execution costs, and test purchase, receipts, renewals, cancellation, and refunds end to end.",
        },
      ]}
    />
  );
}
