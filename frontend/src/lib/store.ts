import { create } from "zustand";
import { completeChallenge, updateChallengeNote } from "./api/challenges";
import { createNextPlan, generatePlan, getCurrentPlan } from "./api/plans";
import { generateReflection } from "./api/reflection";
import type { Challenge, Plan, Reflection, UserPreferences } from "./types";

export type View =
    | "welcome"
    | "onboarding"
    | "generating"
    | "plan"
    | "detail"
    | "progress"
    | "reflection";

type PreferenceList = "interests" | "motivations";
type SinglePreference = "frequency" | "time";
type NextPlanMode = "repeat" | "new" | "surprise";

const emptyPreferences: UserPreferences = {
    location: "",
    interests: [],
    frequency: "",
    time: "",
    motivations: [],
};

interface AppState {
    view: View;
    preferences: UserPreferences;
    plan: Plan | null;
    selectedChallenge: Challenge | null;
    week: number;
    step: number;
    generationStep: number;
    generationAttempt: number;
    note: string;
    reflection: Reflection | null;
    error: string;
    hydrated: boolean;
    hydrate: () => Promise<void>;
    setView: (view: View) => void;
    setStep: (step: number) => void;
    setWeek: (week: number) => void;
    setGenerationStep: (step: number) => void;
    retryGeneration: () => void;
    setError: (error: string) => void;
    setLocation: (location: string) => void;
    setSinglePreference: (key: SinglePreference, value: string) => void;
    togglePreference: (key: PreferenceList, value: string) => void;
    selectChallenge: (challenge: Challenge) => void;
    setNote: (note: string) => void;
    generatePlan: () => Promise<void>;
    completeSelectedChallenge: () => Promise<void>;
    createNextPlan: (mode: NextPlanMode) => Promise<void>;
}

function savePlanId(id: string) {
    window.localStorage.setItem("outdoor-plan-id", id);
}

function hasPreferences(preferences: UserPreferences) {
    return Boolean(
        preferences.location.trim() ||
        preferences.interests.length ||
        preferences.frequency ||
        preferences.time ||
        preferences.motivations.length,
    );
}

export const useAppStore = create<AppState>((set, get) => ({
    view: "welcome",
    preferences: emptyPreferences,
    plan: null,
    selectedChallenge: null,
    week: 1,
    step: 0,
    generationStep: 0,
    generationAttempt: 0,
    note: "",
    reflection: null,
    error: "",
    hydrated: false,

    hydrate: async () => {
        const planId = window.localStorage.getItem("outdoor-plan-id");
        const savedPreferences = window.localStorage.getItem(
            "touch-grass-preferences",
        );
        const savedStep = window.localStorage.getItem(
            "touch-grass-onboarding-step",
        );
        let preferences = emptyPreferences;
        if (savedPreferences) {
            try {
                const parsed = JSON.parse(savedPreferences) as UserPreferences;
                if (hasPreferences(parsed)) preferences = parsed;
            } catch {
                window.localStorage.removeItem("touch-grass-preferences");
            }
        }
        set({
            preferences,
            step: savedStep ? Number(savedStep) : 0,
            hydrated: true,
        });
        if (planId) {
            try {
                const plan = await getCurrentPlan(planId);
                set({ plan, week: plan.currentWeek, view: "plan" });
            } catch {
                window.localStorage.removeItem("outdoor-plan-id");
                set({ view: hasPreferences(preferences) ? "onboarding" : "welcome" });
            }
        } else if (hasPreferences(preferences)) {
            set({ view: "onboarding" });
        }
    },

    setView: (view) => set({ view }),
    setStep: (step) => {
        window.localStorage.setItem("touch-grass-onboarding-step", String(step));
        set({ step });
    },
    setWeek: (week) => set({ week }),
    setGenerationStep: (generationStep) => set({ generationStep }),
    retryGeneration: () =>
        set({
            error: "",
            generationStep: 0,
            generationAttempt: get().generationAttempt + 1,
        }),
    setError: (error) => set({ error }),
    setLocation: (location) =>
        set((state) => {
            const preferences = { ...state.preferences, location };
            window.localStorage.setItem(
                "touch-grass-preferences",
                JSON.stringify(preferences),
            );
            return { preferences };
        }),
    setSinglePreference: (key, value) =>
        set((state) => {
            const preferences = { ...state.preferences, [key]: value };
            window.localStorage.setItem(
                "touch-grass-preferences",
                JSON.stringify(preferences),
            );
            return { preferences };
        }),
    togglePreference: (key, value) =>
        set((state) => {
            const preferences = {
                ...state.preferences,
                [key]: state.preferences[key].includes(value)
                    ? state.preferences[key].filter((item) => item !== value)
                    : [...state.preferences[key], value],
            };
            window.localStorage.setItem(
                "touch-grass-preferences",
                JSON.stringify(preferences),
            );
            return { preferences };
        }),
    selectChallenge: (selectedChallenge) =>
        set({
            selectedChallenge,
            note: selectedChallenge.note ?? "",
            view: "detail",
            error: "",
        }),
    setNote: (note) => set({ note }),

    generatePlan: async () => {
        try {
            const preferences = get().preferences;
            const plan = await generatePlan(preferences);
            savePlanId(plan.id);
            window.localStorage.setItem(
                "touch-grass-preferences",
                JSON.stringify(preferences),
            );
            set({ plan, week: plan.currentWeek, view: "plan", error: "" });
        } catch (cause) {
            set({
                error:
                    cause instanceof Error && cause.message === "BACKEND_UNAVAILABLE"
                        ? "Couldn't connect to the planner."
                        : "We couldn't create your plan.",
            });
        }
    },

    completeSelectedChallenge: async () => {
        const { plan, selectedChallenge, note } = get();
        if (!plan || !selectedChallenge) return;
        if (selectedChallenge.week > plan.currentWeek) {
            set({
                error: `This challenge becomes available in week ${selectedChallenge.week}.`,
            });
            return;
        }
        try {
            if (selectedChallenge.completed) {
                await updateChallengeNote(selectedChallenge.id, note.trim());
                set({
                    selectedChallenge: {
                        ...selectedChallenge,
                        note: note.trim() || undefined,
                    },
                    error: "",
                });
                return;
            }
            const result = await completeChallenge(
                selectedChallenge.id,
                note.trim() || undefined,
            );
            const next = {
                ...plan,
                challenges: plan.challenges.map((item) =>
                    item.id === selectedChallenge.id ? result.challenge : item,
                ),
                progress: { ...plan.progress, ...result.progress },
            };
            set({ plan: next, selectedChallenge: result.challenge, error: "" });
            if (result.progress.completed === result.progress.total) {
                const reflection = await generateReflection(next.id);
                set({ reflection, view: "reflection" });
            }
        } catch {
            try {
                const current = await getCurrentPlan(plan.id);
                set({
                    plan: current,
                    selectedChallenge:
                        current.challenges.find(
                            (item) => item.id === selectedChallenge.id,
                        ) ?? null,
                    error:
                        "That challenge was already completed. Your plan has been refreshed.",
                });
            } catch {
                set({ error: "We couldn't update that challenge. Please try again." });
            }
        }
    },

    createNextPlan: async (mode) => {
        const plan = get().plan;
        if (!plan) return;
        try {
            const next = await createNextPlan(plan.id, mode);
            savePlanId(next.id);
            set({
                plan: next,
                reflection: null,
                week: next.currentWeek,
                view: "plan",
                error: "",
            });
        } catch {
            set({ error: "We couldn't create your next plan. Please try again." });
        }
    },
}));

export { emptyPreferences };
