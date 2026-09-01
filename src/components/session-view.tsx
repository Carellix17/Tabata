import { Pause, Play, SkipForward, X } from "lucide-react";
import { useEffect } from "react";
import { RingTimer } from "@/components/ring-timer";
import { Button } from "@/components/ui/button";
import { useTabata } from "@/lib/store";
import {
  formatClock,
  formatDuration,
  phaseLabel,
  remainingSessionMs,
} from "@/lib/tabata";
import { cn } from "@/lib/utils";

export function SessionView() {
  const phase = useTabata((s) => s.phase);
  const currentRound = useTabata((s) => s.currentRound);
  const rounds = useTabata((s) => s.rounds);
  const remainingMs = useTabata((s) => s.remainingMs);
  const phaseDurationMs = useTabata((s) => s.phaseDurationMs);
  const paused = useTabata((s) => s.paused);
  const workSeconds = useTabata((s) => s.workSeconds);
  const restSeconds = useTabata((s) => s.restSeconds);
  const tick = useTabata((s) => s.tick);
  const pause = useTabata((s) => s.pause);
  const resume = useTabata((s) => s.resume);
  const skip = useTabata((s) => s.skip);
  const stop = useTabata((s) => s.stop);

  useEffect(() => {
    let frame = 0;
    const loop = (now: number) => {
      tick(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [tick]);

  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = async () => {
      try {
        lock = await navigator.wakeLock?.request("screen");
      } catch {
        /* unsupported or denied */
      }
    };
    void request();
    const onVis = () => {
      if (document.visibilityState === "visible") void request();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      void lock?.release();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (paused) resume();
        else pause();
      } else if (e.key === "Escape") {
        stop();
      } else if (e.key === "ArrowRight") {
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paused, pause, resume, skip, stop]);

  const progress = phaseDurationMs > 0 ? remainingMs / phaseDurationMs : 0;
  const tone = phase === "rest" ? "rest" : phase === "countdown" ? "countdown" : "work";
  const remainingTotal = remainingSessionMs({
    phase,
    remainingMs,
    currentRound,
    rounds,
    workSeconds,
    restSeconds,
  });
  const nextHint =
    phase === "countdown"
      ? `Poi ${formatDuration(workSeconds)} di lavoro`
      : phase === "work"
        ? currentRound >= rounds
          ? "Ultima ripetizione"
          : restSeconds > 0
            ? `Poi pausa ${restSeconds}s`
            : "Poi la prossima"
        : `Poi ripetizione ${currentRound + 1}`;

  return (
    <div className="flex min-h-dvh w-full justify-center">
    <div className="flex min-h-dvh w-full max-w-md flex-col px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Termina sessione"
          onClick={stop}
        >
          <X />
        </Button>
        <p className="font-display text-xs font-medium tracking-brand text-muted-foreground uppercase">
          Tabata
        </p>
        <span className="size-11" aria-hidden="true" />
      </header>

      <div className="mt-6 flex flex-col items-center">
        <p
          className={cn(
            "font-display text-sm font-medium tracking-wide uppercase",
            phase === "rest" ? "text-rest" : "text-foreground",
          )}
        >
          {paused ? "In pausa" : phaseLabel(phase)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground tabular-nums">
          {phase === "countdown"
            ? "Partenza"
            : `Ripetizione ${currentRound} di ${rounds}`}
        </p>
      </div>

      <div className="flex flex-1 items-center py-6">
        <RingTimer progress={progress} tone={tone} paused={paused}>
          <span
            className={cn(
              "font-display text-timer leading-none font-medium tracking-tight text-foreground tabular-nums",
              remainingMs <= 3000 && remainingMs > 0 && !paused && "pulse-urgent",
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatClock(remainingMs)}
          </span>
          <span className="mt-3 text-xs tracking-wide text-subtle uppercase">
            {nextHint}
          </span>
        </RingTimer>
      </div>

      <div className="mb-6 flex justify-center gap-1.5" aria-hidden="true">
        {Array.from({ length: rounds }, (_, i) => {
          const n = i + 1;
          const done = n < currentRound || (n === currentRound && phase === "rest");
          const current = n === currentRound && phase !== "countdown";
          return (
            <span
              key={n}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                done || current ? "bg-foreground" : "bg-track",
                current && !paused && "opacity-100",
                current && paused && "opacity-50",
              )}
            />
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={paused ? resume : pause}
        >
          {paused ? <Play /> : <Pause />}
          {paused ? "Riprendi" : "Pausa"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={skip}
        >
          <SkipForward />
          Salta
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-subtle tabular-nums">
        Resta {formatDuration(Math.max(0, Math.ceil(remainingTotal / 1000)))}
      </p>
    </div>
    </div>
  );
}
