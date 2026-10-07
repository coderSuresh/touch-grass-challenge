import { ArrowRight, Check } from "lucide-react";
import { Shell } from "./Shell";
import type { UserPreferences } from "../lib/types";

const interests = [
  "Nature",
  "Walking",
  "Photography",
  "Running",
  "Exploring",
  "History & culture",
  "Wildlife",
  "Food & local places",
  "Sunrise / sunset",
  "Cafés & quiet places",
];
const frequencies = [
  "Every day",
  "3–4 days a week",
  "1–2 days a week",
  "Whenever I can",
];
const times = [
  "15–30 minutes",
  "30–60 minutes",
  "1–2 hours",
  "2+ hours",
  "It varies",
];
const motivations = [
  "Explore somewhere new",
  "Be more active",
  "Notice nature",
  "Try something I've never done",
  "Spend less time on screens",
  "Slow down and clear my head",
];
const questions = [
  "What area do you want to explore?",
  "What sounds good to you?",
  "How often do you want to get outside?",
  "How much time can you usually spend outside?",
  "What do you want more of?",
];

export function Onboarding({
  step,
  preferences,
  error,
  onBack,
  onNext,
  onLocation,
  onSingle,
  onToggle,
}: {
  step: number;
  preferences: UserPreferences;
  error: string;
  onBack: () => void;
  onNext: () => void;
  onLocation: (value: string) => void;
  onSingle: (key: "frequency" | "time", value: string) => void;
  onToggle: (key: "interests" | "motivations", value: string) => void;
}) {
  return (
    <Shell onBack={onBack} label={`${step + 1} / 5`}>
      <section className="onboarding">
        <div className="dots">
          {questions.map((_, index) => (
            <i className={index <= step ? "active" : ""} key={index} />
          ))}
        </div>
        <div className="question">
          <span className="kicker-text">A few quick questions</span>
          <h1>{questions[step]}</h1>
          {step === 0 && (
            <input
              autoFocus
              value={preferences.location}
              onChange={(event) => onLocation(event.target.value)}
              placeholder="City or area"
            />
          )}
          {step === 1 && (
            <Choices
              options={interests}
              selected={preferences.interests}
              onPick={(value) => onToggle("interests", value)}
            />
          )}
          {step === 2 && (
            <List
              options={frequencies}
              selected={preferences.frequency}
              onPick={(value) => onSingle("frequency", value)}
            />
          )}
          {step === 3 && (
            <List
              options={times}
              selected={preferences.time}
              onPick={(value) => onSingle("time", value)}
            />
          )}
          {step === 4 && (
            <Choices
              options={motivations}
              selected={preferences.motivations}
              onPick={(value) => onToggle("motivations", value)}
            />
          )}
          {error && <span className="form-error">{error}</span>}
        </div>
        <button className="primary next" onClick={onNext}>
          {step === 4 ? "Create my plan" : "Continue"}
          <ArrowRight size={17} />
        </button>
      </section>
    </Shell>
  );
}

function Choices({
  options,
  selected,
  onPick,
}: {
  options: string[];
  selected: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="choices">
      {options.map((option) => (
        <button
          className={selected.includes(option) ? "selected" : ""}
          onClick={() => onPick(option)}
          aria-pressed={selected.includes(option)}
          key={option}
        >
          {option}
          {selected.includes(option) && <Check size={14} />}
        </button>
      ))}
    </div>
  );
}
function List({
  options,
  selected,
  onPick,
}: {
  options: string[];
  selected: string;
  onPick: (value: string) => void;
}) {
  return (
    <div className="choice-list">
      {options.map((option) => (
        <button
          className={selected === option ? "selected" : ""}
          onClick={() => onPick(option)}
          key={option}
        >
          {option}
          <span>{selected === option && <i />}</span>
        </button>
      ))}
    </div>
  );
}
