"use client";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
const hints = [
  {
    title: "Think about the missing value.",
    text: "For each number in the array, ask which other number would complete the target sum. What information would help you find it?",
    stage: "Thinking direction",
  },
  {
    title: "Remember what you have seen.",
    text: "A hash map can associate a number with its index. As you scan the array, check whether its complement was visited earlier.",
    stage: "Approach",
  },
  {
    title: "Turn that idea into steps.",
    text: "Visit each number. Determine its complement. If that complement is already recorded, you have a pair. Otherwise, record the current number and continue.",
    stage: "Pseudocode",
  },
  {
    title: "Test the reasoning.",
    text: "What happens with duplicate numbers? Could an index be reused? Explain how looking up before recording the current number handles those cases.",
    stage: "Reasoning check",
  },
];
export function GuidancePreview() {
  const [step, setStep] = useState(0);
  const hint = hints[step];
  return (
    <div className="m-guidance-example">
      <div className="m-example-heading">
        <span>Two Sum</span>
        <span className="m-muted">Sample guidance</span>
      </div>
      <div className="m-example-body" aria-live="polite">
        <div key={step} className="m-hint-transition">
          <p className="m-small-label">
            Hint {step + 1} of 4 · {hint.stage}
          </p>
          <h3>{hint.title}</h3>
          <p>{hint.text}</p>
        </div>
      </div>
      <div className="m-example-bottom">
        <span>Preview only · no allowance used</span>
        <button
          type="button"
          onClick={() => setStep(step === 3 ? 0 : step + 1)}
        >
          {step === 3 ? "Start again" : "Next hint"}
          {step === 3 ? <RotateCcw size={13} /> : <ArrowRight size={13} />}
        </button>
      </div>
    </div>
  );
}
