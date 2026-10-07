import { ArrowLeft, Leaf } from "lucide-react";

export function Shell({
  children,
  onBack,
  label,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  label?: string;
}) {
  return (
    <main className="shell">
      <header>
        {onBack && (
          <button className="back" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={17} />
            <span>Back</span>
          </button>
        )}
        <div className="brand">
          <span>
            <Leaf size={15} />
          </span>
          outside
        </div>
        {label && <small>{label}</small>}
      </header>
      {children}
    </main>
  );
}
