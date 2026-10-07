import { Check, Leaf, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Shell } from "./Shell";
import { useAppStore } from "../lib/store";

const statuses = [
  "Getting to know your interests",
  "Considering your surroundings",
  "Checking the season",
  "Choosing your challenges",
  "Putting everything together",
];

export function Generating() {
  const generationStep = useAppStore((state) => state.generationStep);
  const generationAttempt = useAppStore((state) => state.generationAttempt);
  const error = useAppStore((state) => state.error);
  const setGenerationStep = useAppStore((state) => state.setGenerationStep);
  const generatePlan = useAppStore((state) => state.generatePlan);
  const retryGeneration = useAppStore((state) => state.retryGeneration);
  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = useAppStore.getState().generationStep;
      if (current === statuses.length - 1) {
        window.clearInterval(timer);
        void generatePlan();
      } else setGenerationStep(current + 1);
    }, 850);
    return () => window.clearInterval(timer);
  }, [generationAttempt, generatePlan, setGenerationStep]);
  return (
    <Shell>
      <section className="generating">
        <div className="breathing">
          <Leaf size={23} />
        </div>
        <span className="kicker-text">Just a moment</span>
        <h1>Creating your plan</h1>
        <p>A few thoughtful ideas for getting outside, made around you.</p>
        <div className="statuses">
          {statuses.map((status, index) => (
            <div
              className={`${index < generationStep ? "done" : ""} ${index === generationStep ? "current" : ""}`}
              key={status}
            >
              <i>
                {index < generationStep ? (
                  <Check size={12} />
                ) : index === generationStep ? (
                  <em />
                ) : null}
              </i>
              {status}
            </div>
          ))}
        </div>
        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={retryGeneration}>
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        )}
      </section>
    </Shell>
  );
}
