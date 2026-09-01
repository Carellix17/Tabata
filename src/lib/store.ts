import { create } from "zustand";
import { playCue, resumeAudio, haptic } from "@/lib/audio";
import {
  COUNTDOWN_MS,
  DEFAULT_SETTINGS,
  LIMITS,
  clamp,
  snap,
  type Phase,
  type Settings,
  type View,
  workRestSeconds,
} from "@/lib/tabata";

const STORAGE_KEY = "tabata-settings-v1";

export type LastSession = {
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  totalWork: number;
  totalRest: number;
  total: number;
};

type TabataState = Settings & {
  view: View;
  phase: Phase;
  currentRound: number;
  remainingMs: number;
  phaseDurationMs: number;
  paused: boolean;
  endAt: number | null;
  lastAnnouncedSec: number;
  lastSession: LastSession | null;
  hydrate: () => void;
  setRounds: (n: number) => void;
  setWorkSeconds: (n: number) => void;
  setRestSeconds: (n: number) => void;
  toggleSound: () => void;
  applyPreset: (p: { rounds: number; workSeconds: number; restSeconds: number }) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  stop: () => void;
  resetToSetup: () => void;
  tick: (now: number) => void;
};

function persistSettings(s: Settings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rounds: s.rounds,
        workSeconds: s.workSeconds,
        restSeconds: s.restSeconds,
        soundEnabled: s.soundEnabled,
      }),
    );
  } catch {
    /* ignore quota */
  }
}

function cue(enabled: boolean, kind: "countdown" | "tick" | "work" | "rest" | "done") {
  if (!enabled) return;
  playCue(kind);
  if (kind !== "countdown") haptic(kind === "tick" ? "tick" : kind);
}

export const useTabata = create<TabataState>((set, get) => {
  function beginPhase(phase: Phase, durationMs: number, round: number) {
    const now = performance.now();
    const sound = get().soundEnabled;
    if (phase === "countdown") cue(sound, "countdown");
    else if (phase === "work") cue(sound, "work");
    else cue(sound, "rest");
    set({
      view: "session",
      phase,
      currentRound: round,
      remainingMs: durationMs,
      phaseDurationMs: durationMs,
      paused: false,
      endAt: now + durationMs,
      lastAnnouncedSec: Math.ceil(durationMs / 1000),
    });
  }

  function complete() {
    const { rounds, workSeconds, restSeconds, soundEnabled } = get();
    const totals = workRestSeconds(rounds, workSeconds, restSeconds);
    cue(soundEnabled, "done");
    set({
      view: "complete",
      paused: false,
      endAt: null,
      remainingMs: 0,
      lastSession: {
        rounds,
        workSeconds,
        restSeconds,
        totalWork: totals.totalWork,
        totalRest: totals.totalRest,
        total: totals.total,
      },
    });
  }

  function advance() {
    const { phase, currentRound, rounds, workSeconds, restSeconds } = get();
    if (phase === "countdown") {
      beginPhase("work", workSeconds * 1000, 1);
      return;
    }
    if (phase === "work") {
      if (currentRound >= rounds) {
        complete();
        return;
      }
      if (restSeconds > 0) {
        beginPhase("rest", restSeconds * 1000, currentRound);
        return;
      }
      beginPhase("work", workSeconds * 1000, currentRound + 1);
      return;
    }
    beginPhase("work", workSeconds * 1000, currentRound + 1);
  }

  return {
    ...DEFAULT_SETTINGS,
    view: "setup",
    phase: "countdown",
    currentRound: 1,
    remainingMs: COUNTDOWN_MS,
    phaseDurationMs: COUNTDOWN_MS,
    paused: false,
    endAt: null,
    lastAnnouncedSec: 3,
    lastSession: null,

    hydrate: () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<Settings>;
        set({
          rounds: clamp(
            parsed.rounds ?? DEFAULT_SETTINGS.rounds,
            LIMITS.rounds.min,
            LIMITS.rounds.max,
          ),
          workSeconds: snap(
            parsed.workSeconds ?? DEFAULT_SETTINGS.workSeconds,
            LIMITS.work.min,
            LIMITS.work.max,
            LIMITS.work.step,
          ),
          restSeconds: clamp(
            parsed.restSeconds ?? DEFAULT_SETTINGS.restSeconds,
            LIMITS.rest.min,
            LIMITS.rest.max,
          ),
          soundEnabled: parsed.soundEnabled ?? true,
        });
      } catch {
        /* ignore */
      }
    },

    setRounds: (n) => {
      const rounds = clamp(Math.round(n), LIMITS.rounds.min, LIMITS.rounds.max);
      set({ rounds });
      persistSettings(get());
    },
    setWorkSeconds: (n) => {
      const workSeconds = snap(n, LIMITS.work.min, LIMITS.work.max, LIMITS.work.step);
      set({ workSeconds });
      persistSettings(get());
    },
    setRestSeconds: (n) => {
      const restSeconds = clamp(Math.round(n), LIMITS.rest.min, LIMITS.rest.max);
      set({ restSeconds });
      persistSettings(get());
    },
    toggleSound: () => {
      const soundEnabled = !get().soundEnabled;
      set({ soundEnabled });
      persistSettings(get());
      if (soundEnabled) {
        resumeAudio();
        playCue("tick");
      }
    },
    applyPreset: (p) => {
      set({
        rounds: p.rounds,
        workSeconds: p.workSeconds,
        restSeconds: p.restSeconds,
      });
      persistSettings(get());
    },

    start: () => {
      resumeAudio();
      beginPhase("countdown", COUNTDOWN_MS, 1);
    },
    pause: () => {
      const { paused, view, remainingMs } = get();
      if (paused || view !== "session") return;
      set({ paused: true, endAt: null, remainingMs });
    },
    resume: () => {
      const { paused, view, remainingMs } = get();
      if (!paused || view !== "session") return;
      resumeAudio();
      set({ paused: false, endAt: performance.now() + remainingMs });
    },
    skip: () => {
      if (get().view !== "session") return;
      advance();
    },
    stop: () => {
      set({
        view: "setup",
        paused: false,
        endAt: null,
        remainingMs: COUNTDOWN_MS,
        phase: "countdown",
      });
    },
    resetToSetup: () => {
      set({
        view: "setup",
        paused: false,
        endAt: null,
        remainingMs: COUNTDOWN_MS,
        phase: "countdown",
      });
    },
    tick: (now) => {
      const { view, paused, endAt, lastAnnouncedSec, soundEnabled } = get();
      if (view !== "session" || paused || endAt == null) return;
      const remainingMs = Math.max(0, endAt - now);
      if (remainingMs <= 0) {
        advance();
        return;
      }
      const sec = Math.ceil(remainingMs / 1000);
      if (sec <= 3 && sec >= 1 && sec < lastAnnouncedSec) {
        cue(soundEnabled, sec === 3 && get().phase === "countdown" ? "countdown" : "tick");
        set({ remainingMs, lastAnnouncedSec: sec });
      } else {
        set({ remainingMs });
      }
    },
  };
});
