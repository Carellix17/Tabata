import { Volume2, VolumeX } from "lucide-react";
import { useRef } from "react";
import { RingTimer } from "@/components/ring-timer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Stepper } from "@/components/stepper";
import { useTabata } from "@/lib/store";
import {
  LIMITS,
  PRESETS,
  formatClock,
  formatDuration,
  matchPreset,
  workRestSeconds,
} from "@/lib/tabata";
import { cn } from "@/lib/utils";

export function SetupView() {
  const rounds = useTabata((s) => s.rounds);
  const workSeconds = useTabata((s) => s.workSeconds);
  const restSeconds = useTabata((s) => s.restSeconds);
  const soundEnabled = useTabata((s) => s.soundEnabled);
  const setRounds = useTabata((s) => s.setRounds);
  const setWorkSeconds = useTabata((s) => s.setWorkSeconds);
  const setRestSeconds = useTabata((s) => s.setRestSeconds);
  const toggleSound = useTabata((s) => s.toggleSound);
  const applyPreset = useTabata((s) => s.applyPreset);
  const start = useTabata((s) => s.start);
  const sliderActive = useRef(false);

  const totals = workRestSeconds(rounds, workSeconds, restSeconds);
  const activePreset = matchPreset({
    rounds,
    workSeconds,
    restSeconds,
    soundEnabled,
  });

  return (
    <div className="min-h-dvh w-full lg:grid lg:grid-cols-2">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:max-w-lg lg:px-12 lg:pt-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs font-medium tracking-brand text-muted-foreground uppercase">
              Protocollo
            </p>
            <h1 className="mt-1 font-display text-4xl font-medium tracking-tight text-foreground">
              Tabata
            </h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={soundEnabled ? "Disattiva suono" : "Attiva suono"}
            aria-pressed={soundEnabled}
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </Button>
        </header>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Imposta ripetizioni, lavoro e pausa. Poi inizia.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <section className="rounded-2xl bg-card p-5">
            <Stepper
              label="Ripetizioni"
              hint={`max ${LIMITS.rounds.max}`}
              value={rounds}
              min={LIMITS.rounds.min}
              max={LIMITS.rounds.max}
              onChange={setRounds}
            />
            <div className="mt-5 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: LIMITS.rounds.max }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                    i < rounds ? "bg-foreground" : "bg-track",
                  )}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-card p-5">
            <Stepper
              label="Lavoro"
              hint={`max ${formatDuration(LIMITS.work.max)}`}
              value={workSeconds}
              min={LIMITS.work.min}
              max={LIMITS.work.max}
              step={LIMITS.work.step}
              format={formatDuration}
              onChange={setWorkSeconds}
            />
            <div className="mt-5">
              <Slider
                min={LIMITS.work.min}
                max={LIMITS.work.max}
                step={LIMITS.work.step}
                value={[workSeconds]}
                onPointerDown={() => {
                  sliderActive.current = true;
                }}
                onValueChange={([v]) => {
                  if (sliderActive.current) setWorkSeconds(v);
                }}
                onValueCommit={([v]) => {
                  if (sliderActive.current) setWorkSeconds(v);
                  sliderActive.current = false;
                }}
                aria-label="Durata del lavoro"
              />
              <div className="mt-2 flex justify-between text-xs text-subtle">
                <span>{formatDuration(LIMITS.work.min)}</span>
                <span>{formatDuration(LIMITS.work.max)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-card p-5">
            <Stepper
              label="Pausa"
              hint={`max ${LIMITS.rest.max}s`}
              value={restSeconds}
              min={LIMITS.rest.min}
              max={LIMITS.rest.max}
              step={LIMITS.rest.step}
              format={(n) => (n === 0 ? "Off" : `${n}s`)}
              onChange={setRestSeconds}
            />
          </section>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Preset
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    "h-10 rounded-md px-3.5 text-sm font-medium transition-[background-color,color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96]",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-transparent text-foreground",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-8 lg:mt-10 lg:pt-0">
          <Button type="button" size="xl" onClick={start}>
            Inizia
          </Button>
          <p className="mt-3 text-center text-sm text-muted-foreground tabular-nums">
            {rounds} × {formatDuration(workSeconds)}
            {restSeconds > 0 ? ` · pausa ${restSeconds}s` : " · senza pausa"}
            {" · "}
            {formatDuration(totals.total)}
          </p>
        </div>
      </div>

      <aside className="hidden border-l border-border lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <p className="mb-8 font-display text-xs font-medium tracking-brand text-muted-foreground uppercase">
          Anteprima
        </p>
        <RingTimer progress={1} tone="work">
          <span className="font-display text-timer leading-none font-medium tracking-tight text-foreground tabular-nums">
            {formatClock(workSeconds * 1000)}
          </span>
          <span className="mt-3 text-xs tracking-wide text-subtle uppercase">
            Lavoro
          </span>
        </RingTimer>
        <div className="mt-8 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: rounds }, (_, i) => (
            <span key={i} className="h-1.5 w-6 rounded-full bg-foreground" />
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground tabular-nums">
          {formatDuration(totals.total)} di sessione
        </p>
      </aside>
    </div>
  );
}
