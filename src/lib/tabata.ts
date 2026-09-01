export const LIMITS = {
  rounds: { min: 1, max: 10, default: 4 },
  work: { min: 5, max: 600, default: 20, step: 5 },
  rest: { min: 0, max: 30, default: 5, step: 1 },
} as const;

export const COUNTDOWN_MS = 3000;

export type Phase = "countdown" | "work" | "rest";

export type View = "setup" | "session" | "complete";

export type Settings = {
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  soundEnabled: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  rounds: LIMITS.rounds.default,
  workSeconds: LIMITS.work.default,
  restSeconds: LIMITS.rest.default,
  soundEnabled: true,
};

export type Preset = {
  id: string;
  label: string;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
};

export const PRESETS: Preset[] = [
  { id: "rapido", label: "Rapido", rounds: 4, workSeconds: 20, restSeconds: 5 },
  { id: "classico", label: "Classico", rounds: 8, workSeconds: 20, restSeconds: 10 },
  { id: "forza", label: "Forza", rounds: 6, workSeconds: 40, restSeconds: 15 },
  { id: "lungo", label: "Lungo", rounds: 4, workSeconds: 90, restSeconds: 20 },
];

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function snap(n: number, min: number, max: number, step: number) {
  const snapped = Math.round((n - min) / step) * step + min;
  return clamp(snapped, min, max);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`;
  return String(s);
}

export function workRestSeconds(rounds: number, work: number, rest: number) {
  const totalWork = rounds * work;
  const totalRest = Math.max(0, rounds - 1) * rest;
  return { totalWork, totalRest, total: totalWork + totalRest };
}

export function remainingSessionMs(opts: {
  phase: Phase;
  remainingMs: number;
  currentRound: number;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
}): number {
  const { phase, remainingMs, currentRound, rounds, workSeconds, restSeconds } =
    opts;
  let left = remainingMs;
  const workMs = workSeconds * 1000;
  const restMs = restSeconds * 1000;

  if (phase === "countdown") {
    left += rounds * workMs + Math.max(0, rounds - 1) * restMs;
    return left;
  }

  if (phase === "work") {
    const roundsAfter = rounds - currentRound;
    left += roundsAfter * workMs;
    const restsAfter =
      restSeconds > 0 ? rounds - currentRound : 0;
    left += restsAfter * restMs;
    return left;
  }

  const roundsAfter = rounds - currentRound;
  left += roundsAfter * workMs;
  left += Math.max(0, roundsAfter - 1) * restMs;
  return left;
}

export function phaseLabel(phase: Phase): string {
  if (phase === "countdown") return "Pronto";
  if (phase === "work") return "Lavoro";
  return "Recupero";
}

export function matchPreset(s: Settings): string | null {
  const found = PRESETS.find(
    (p) =>
      p.rounds === s.rounds &&
      p.workSeconds === s.workSeconds &&
      p.restSeconds === s.restSeconds,
  );
  return found?.id ?? null;
}
