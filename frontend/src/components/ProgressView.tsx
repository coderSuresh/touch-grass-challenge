import { Shell } from "./Shell";
import type { Plan } from "../lib/types";

export function ProgressView({
  plan,
  onBack,
}: {
  plan: Plan;
  onBack: () => void;
}) {
  return (
    <Shell onBack={onBack} label="Your progress">
      <section className="progress-page">
        <span className="kicker-text">A month outside</span>
        <h1>
          {plan.progress.completed} of {plan.progress.total} challenges
          completed
        </h1>
        <div className="big-progress">
          <div className="progress">
            <div>
              <span style={{ width: `${plan.progress.percentage}%` }} />
            </div>
          </div>
          <b>{plan.progress.percentage}%</b>
        </div>
        <div className="categories">
          {plan.progress.categories.map((category) => (
            <div key={category.name}>
              <span>{category.name}</span>
              <b>
                {category.completed} / {category.total}
              </b>
              <div>
                <i
                  style={{
                    width: `${(category.completed / category.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="quiet">
          The point is not to do it all at once. Just keep making a little room.
        </p>
      </section>
    </Shell>
  );
}
