import { Check, Clock3 } from "lucide-react";
import { Shell } from "./Shell";
import type { Challenge } from "../lib/types";

export function ChallengeDetail({
    challenge,
    note,
    setNote,
    upcoming,
    onBack,
    onSave,
}: {
    challenge: Challenge;
    note: string;
    setNote: (note: string) => void;
    upcoming: boolean;
    onBack: () => void;
    onSave: () => void;
}) {
    return (
        <Shell onBack={onBack}>
            <section className="detail">
                <span className="kicker-text">
                    {challenge.category} · {challenge.estimatedTime}
                </span>
                <h1>{challenge.title}</h1>
                <p>{challenge.description}</p>
                <div className="facts">
                    <span>
                        <Clock3 size={15} /> {challenge.estimatedTime}
                    </span>
                    <span>{challenge.difficulty}</span>
                </div>
                <label htmlFor="note">
                    What did you notice? <small>Optional</small>
                </label>
                <textarea
                    id="note"
                    value={note}
                    disabled={upcoming}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="A thought, a detail, a small surprise..."
                    rows={4}
                />
                {upcoming ? (
                    <div className="success">Available in week {challenge.week}.</div>
                ) : challenge.completed ? (
                    <>
                        <div className="success">
                            <Check size={15} /> Completed. Nice work making room for it.
                        </div>
                        <button className="primary" onClick={onSave}>
                            Save note <Check size={17} />
                        </button>
                    </>
                ) : (
                    <button className="primary" onClick={onSave}>
                        Mark complete <Check size={17} />
                    </button>
                )}
            </section>
        </Shell>
    );
}
