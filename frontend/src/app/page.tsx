"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ChallengeDetail } from "../components/ChallengeDetail";
import { Generating } from "../components/Generating";
import { Onboarding } from "../components/Onboarding";
import { PlanView } from "../components/PlanView";
import { ProgressView } from "../components/ProgressView";
import { ReflectionView } from "../components/ReflectionView";
import { Shell } from "../components/Shell";
import { useAppStore } from "../lib/store";

export default function Home() {
    const view = useAppStore((state) => state.view);
    const preferences = useAppStore((state) => state.preferences);
    const plan = useAppStore((state) => state.plan);
    const selectedChallenge = useAppStore((state) => state.selectedChallenge);
    const week = useAppStore((state) => state.week);
    const step = useAppStore((state) => state.step);
    const note = useAppStore((state) => state.note);
    const reflection = useAppStore((state) => state.reflection);
    const error = useAppStore((state) => state.error);
    const hydrated = useAppStore((state) => state.hydrated);
    const hydrate = useAppStore((state) => state.hydrate);
    const setView = useAppStore((state) => state.setView);
    const setStep = useAppStore((state) => state.setStep);
    const setWeek = useAppStore((state) => state.setWeek);
    const setError = useAppStore((state) => state.setError);
    const setLocation = useAppStore((state) => state.setLocation);
    const setNote = useAppStore((state) => state.setNote);
    const setSinglePreference = useAppStore((state) => state.setSinglePreference);
    const togglePreference = useAppStore((state) => state.togglePreference);
    const selectChallenge = useAppStore((state) => state.selectChallenge);
    const completeSelectedChallenge = useAppStore(
        (state) => state.completeSelectedChallenge,
    );
    const createNextPlan = useAppStore((state) => state.createNextPlan);

    useEffect(() => {
        void hydrate();
    }, [hydrate]);

    const currentChallenges = useMemo(
        () => plan?.challenges.filter((challenge) => challenge.week === week) ?? [],
        [plan, week],
    );

    if (!hydrated) return null;

    if (view === "welcome") {
        return <Welcome onStart={() => setView("onboarding")} />;
    }

    if (view === "onboarding") {
        return (
            <Onboarding
                step={step}
                preferences={preferences}
                error={error}
                onBack={() => {
                    if (step > 0) setStep(step - 1);
                    else setView("welcome");
                }}
                onNext={() => {
                    const valid = [
                        preferences.location,
                        preferences.interests.length,
                        preferences.frequency,
                        preferences.time,
                        preferences.motivations.length,
                    ][step];
                    if (!valid) {
                        setError("Choose an answer to continue.");
                        return;
                    }
                    setError("");
                    if (step < 4) setStep(step + 1);
                    else setView("generating");
                }}
                onLocation={setLocation}
                onSingle={setSinglePreference}
                onToggle={togglePreference}
            />
        );
    }

    if (view === "generating") return <Generating />;

    if (view === "detail" && selectedChallenge && plan) {
        return (
            <ChallengeDetail
                challenge={selectedChallenge}
                note={note}
                setNote={setNote}
                upcoming={selectedChallenge.week > plan.currentWeek}
                onBack={() => setView("plan")}
                onSave={() => void completeSelectedChallenge()}
            />
        );
    }

    if (view === "progress" && plan) {
        return <ProgressView plan={plan} onBack={() => setView("plan")} />;
    }

    if (view === "reflection" && plan && reflection) {
        return (
            <ReflectionView
                plan={plan}
                reflection={reflection}
                onBack={() => setView("plan")}
                onNext={(mode) => void createNextPlan(mode)}
            />
        );
    }

    if (plan) {
        return (
            <PlanView
                plan={plan}
                week={week}
                challenges={currentChallenges}
                onWeekChange={setWeek}
                onOpen={selectChallenge}
                onProgress={() => setView("progress")}
            />
        );
    }

    return <Welcome onStart={() => setView("onboarding")} />;
}

function Welcome({ onStart }: { onStart: () => void }) {
    return (
        <Shell>
            <section className="welcome">
                <div className="kicker">
                    <span /> A little more outside
                </div>
                <h1>Make a little more room for the outside.</h1>
                <p>
                    Get a personalized set of outdoor challenges based on where you are,
                    what you enjoy, and how much time you have.
                </p>
                <button className="primary" onClick={onStart}>
                    Get started <ArrowRight size={17} />
                </button>
                <div className="tagline">
                    <b>AI plans.</b> You go.
                </div>
            </section>
        </Shell>
    );
}
