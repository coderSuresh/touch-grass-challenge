import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Shell } from "./Shell";
import type { Plan, Reflection } from "../lib/types";

type NextPlanMode = "repeat" | "new" | "surprise";

export function ReflectionView({
  plan,
  reflection,
  onBack,
  onNext,
}: {
  plan: Plan;
  reflection: Reflection;
  onBack: () => void;
  onNext: (mode: NextPlanMode) => void;
}) {
  return (
    <Shell onBack={onBack}>
      <section className="reflection">
        <div className="reflection-mark">
          <Sparkles size={20} />
        </div>
        <span className="kicker-text">{plan.month} · complete</span>
        <h1>You made it.</h1>
        <b className="count">
          {plan.progress.completed} / {plan.progress.total} completed
        </b>
        <div className="reflection-copy">
          <p>{reflection.body}</p>
        </div>
        <span className="next-label">What next?</span>
        <div className="actions">
          <button onClick={() => onNext("repeat")}>
            Do it again <RotateCcw size={15} />
          </button>
          <button onClick={() => onNext("new")}>
            Try something new <ArrowRight size={15} />
          </button>
          <button onClick={() => onNext("surprise")}>
            Surprise me <Sparkles size={15} />
          </button>
        </div>
      </section>
    </Shell>
  );
}
