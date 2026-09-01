import { Button } from "@/components/ui/button";
import { useTabata } from "@/lib/store";
import { formatDuration } from "@/lib/tabata";

export function CompleteView() {
  const lastSession = useTabata((s) => s.lastSession);
  const start = useTabata((s) => s.start);
  const resetToSetup = useTabata((s) => s.resetToSetup);

  const rounds = lastSession?.rounds ?? 0;
  const work = lastSession?.workSeconds ?? 0;
  const rest = lastSession?.restSeconds ?? 0;
  const totalWork = lastSession?.totalWork ?? 0;
  const totalRest = lastSession?.totalRest ?? 0;
  const total = lastSession?.total ?? 0;

  return (
    <div className="flex min-h-dvh w-full justify-center">
    <div className="flex min-h-dvh w-full max-w-md flex-col px-5 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <p className="font-display text-xs font-medium tracking-brand text-muted-foreground uppercase">
        Sessione
      </p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight text-foreground">
        Fatto.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
        {rounds === 1
          ? "Una ripetizione completata. Recupera e, se vuoi, ripeti."
          : `${rounds} ripetizioni completate. Recupera e, se vuoi, ripeti.`}
      </p>

      <dl className="mt-10 divide-y divide-border rounded-2xl bg-card">
        <Stat label="Ripetizioni" value={String(rounds)} />
        <Stat label="Lavoro" value={`${formatDuration(work)} × ${rounds}`} />
        <Stat
          label="Pausa"
          value={rest === 0 ? "Nessuna" : `${rest}s × ${Math.max(0, rounds - 1)}`}
        />
        <Stat label="Tempo di lavoro" value={formatDuration(totalWork)} />
        {totalRest > 0 ? (
          <Stat label="Tempo di recupero" value={formatDuration(totalRest)} />
        ) : null}
        <Stat label="Durata totale" value={formatDuration(total)} />
      </dl>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <Button type="button" size="xl" onClick={start}>
          Ripeti
        </Button>
        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={resetToSetup}>
          Modifica
        </Button>
      </div>
    </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-display text-lg font-medium text-foreground tabular-nums">
        {value}
      </dd>
    </div>
  );
}
