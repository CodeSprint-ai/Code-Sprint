export function WebAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CodeSprint",
    url: "https://code-sprint.com",
    description:
      "AI-powered competitive programming platform for coding contest preparation with personalized learning roadmaps.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    featureList: [
      "AI Post-Submission Analysis",
      "Personalized Learning Roadmap",
      "Real-time Code Execution via Judge0",
      "Global Contest Calendar",
      "Smart Multi-Level Hints",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
