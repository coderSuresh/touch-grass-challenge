import {
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
} from "lucide-react";
import { Shell } from "./Shell";
import type { Challenge, Plan } from "../lib/types";

export function PlanView({
    plan,
    week,
    challenges,
    onWeekChange,
    onOpen,
    onProgress,
}: {
    plan: Plan;
    week: number;
    challenges: Challenge[];
    onWeekChange: (week: number) => void;
    onOpen: (challenge: Challenge) => void;
    onProgress: () => void;
}) {
    const maxWeek = Math.max(
        4,
        ...plan.challenges.map((challenge) => challenge.week),
    );
    return (
        <Shell label="Your plan">
            <section className="plan">
                <div className="plan-head">
                    <div>
                        <span className="month">{plan.month}</span>
                        <h1>{plan.title}</h1>
                    </div>
                    <button className="progress-link" onClick={onProgress}>
                        <b>
                            {plan.progress.completed} / {plan.progress.total}
                        </b>
                        <small>progress</small>
                    </button>
                </div>
                <div className="progress">
                    <div>
                        <span style={{ width: `${plan.progress.percentage}%` }} />
                    </div>
                    <small>
                        {plan.progress.percentage}% of the month{" "}
                        <button onClick={onProgress}>
                            See progress <ArrowRight size={13} />
                        </button>
                    </small>
                </div>
                <div className="week">
                    <button
                        className="round"
                        onClick={() => onWeekChange(Math.max(1, week - 1))}
                    >
                        <ChevronLeft size={17} />
                    </button>
                    <div>
                        <span className="kicker-text">Week {week}</span>
                        <b>
                            {week === plan.currentWeek
                                ? "This week"
                                : week < plan.currentWeek
                                    ? "Earlier"
                                    : "Coming up"}
                        </b>
                    </div>
                    <button
                        className="round"
                        onClick={() => onWeekChange(Math.min(maxWeek, week + 1))}
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
                <div className="challenges">
                    {challenges.map((item) => (
                        <button
                            className={`challenge ${item.completed ? "completed" : ""} ${item.week > plan.currentWeek ? "upcoming" : ""}`}
                            onClick={() => onOpen(item)}
                            aria-label={
                                item.week > plan.currentWeek
                                    ? `${item.title}, available in week ${item.week}`
                                    : item.title
                            }
                            key={item.id}
                        >
                            <span className="check">
                                {item.completed && <Check size={13} />}
                            </span>
                            <span>
                                <b>{item.title}</b>
                                <small>{item.description}</small>
                                <em>
                                    <span>{item.category}</span>
                                    <span>
                                        <Clock3 size={12} /> {item.estimatedTime}
                                    </span>
                                    <span>{item.difficulty}</span>
                                </em>
                            </span>
                            <ChevronRight className="arrow" size={17} />
                        </button>
                    ))}
                </div>
                <div className="week-dots">
                    {Array.from({ length: maxWeek }, (_, index) => index + 1).map(
                        (item) => (
                            <button
                                className={week === item ? "active" : ""}
                                onClick={() => onWeekChange(item)}
                                aria-label={`View week ${item}`}
                                key={item}
                            />
                        ),
                    )}
                </div>
            </section>
        </Shell>
    );
}
