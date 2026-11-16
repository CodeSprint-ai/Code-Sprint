export const product = {
  name: "CodeSprint",
  email: "codesprint.ai@gmail.com",
  phase: "Free Beta",
  billingEnabled: false,
  pricing: { monthly: 5, yearly: 40, currency: "USD" },
  limits: {
    free: { hints: 20, analyses: 3 },
    pro: { hints: 200, analyses: 30 },
  },
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/@CodeSprint_ai" },
    { label: "Instagram", href: "https://www.instagram.com/code_sprintai/" },
    { label: "GitHub", href: "https://github.com/CodeSprint-ai" },
  ],
  team: [
    {
      name: "Jamal Nadeem",
      role: "Frontend / Backend / Documentation",
      initials: "JN",
    },
    { name: "Syed Moinuddin", role: "Frontend / Backend", initials: "SM" },
    { name: "Muhammad Usman Khan", role: "Frontend / Backend", initials: "UK" },
    {
      name: "Muhammad Saad Usmani",
      role: "UI/UX / Documentation",
      initials: "SU",
    },
  ],
} as const;

export const features = {
  "problem-bank": {
    title: "Problem Bank",
    eyebrow: "Build your foundations",
    description:
      "Find your next challenge. Practice algorithms by difficulty and topic, understand the statement, and build up your problem-solving skills.",
    steps: [
      "Choose a problem by topic and difficulty.",
      "Read the statement, constraints, and sample cases.",
      "Open its workspace to run, submit, and track your progress.",
    ],
    action: "Browse problems",
    destination: "/problems",
    accent: "Practice with purpose",
  },
  "coding-workspace": {
    title: "Coding Workspace",
    eyebrow: "Think. Code. Test.",
    description:
      "A focused place to turn an approach into working code. Problems, your editor, and submission feedback live together, so you can stay with the challenge.",
    steps: [
      "Choose a problem and a supported language: Python, Java, or C++.",
      "Write your solution and submit it for isolated evaluation.",
      "Use test verdicts to understand what to improve next.",
    ],
    action: "Choose a problem",
    destination: "/problems",
    accent: "Keep your thinking in one place",
  },
  "ai-tutor": {
    title: "AI Tutor",
    eyebrow: "A nudge, then understanding",
    description:
      "Work through a problem with progressive hints and post-submission explanations. The tutor is designed to support your reasoning rather than hand you a finished solution.",
    steps: [
      "Try the problem yourself before revealing a hint.",
      "Unlock guidance one level at a time, from direction to structured pseudocode.",
      "Request an analysis of your submission for approach, complexity, and improvements.",
    ],
    action: "Try guided practice",
    destination: "/problems",
    accent: "Understand why, not just whether",
  },
  "learning-roadmap": {
    title: "Learning Roadmap",
    eyebrow: "Give your practice direction",
    description:
      "See your strengths, identify topics that need attention, and build a steadier learning routine with a roadmap informed by your own practice.",
    steps: [
      "Create an account and start solving problems.",
      "Build a picture of your topic mastery through submissions.",
      "Use your roadmap to choose what to practice next.",
    ],
    action: "Open my roadmap",
    destination: "/roadmap",
    accent: "Your progress, your next step",
  },
} as const;

export const navigation = [
  {
    label: "Platform",
    links: Object.entries(features).map(([slug, feature]) => ({
      label: feature.title,
      href: `/platform/${slug}`,
      description: feature.eyebrow,
    })),
  },
  {
    label: "Practice & Events",
    links: [
      {
        label: "Contest Calendar",
        href: "/calendar",
        description: "Find upcoming programming contests",
      },
      {
        label: "Badges",
        href: "/badges",
        description: "Understand achievements and mastery",
      },
      {
        label: "Coding Sprints",
        href: "/sprints",
        description: "Practice with a timed challenge",
      },
    ],
  },
] as const;

export function loginDestination(path: string) {
  return `/auth/login?redirect=${encodeURIComponent(path)}`;
}
