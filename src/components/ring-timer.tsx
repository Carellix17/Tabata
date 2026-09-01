import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const R = 46;
const C = 2 * Math.PI * R;

type RingTimerProps = {
  progress: number;
  tone: "work" | "rest" | "countdown";
  paused?: boolean;
  children: ReactNode;
};

export function RingTimer({
  progress,
  tone,
  paused = false,
  children,
}: RingTimerProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = C * (1 - clamped);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-72",
        paused && "opacity-70",
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          className="stroke-track"
          strokeWidth="2.4"
        />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          className={cn(
            "transition-[stroke] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            tone === "rest" ? "stroke-rest" : "stroke-work",
          )}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        {children}
      </div>
    </div>
  );
}
