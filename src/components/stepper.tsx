import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StepperProps = {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (n: number) => string;
  onChange: (n: number) => void;
  className?: string;
};

export function Stepper({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  format = (n) => String(n),
  onChange,
  className,
}: StepperProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  const nudge = useCallback(
    (dir: -1 | 1) => {
      const next = valueRef.current + dir * step;
      onChangeRef.current(Math.min(max, Math.max(min, next)));
    },
    [min, max, step],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-subtle">{hint}</span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        <HoldButton
          label={`Diminuisci ${label}`}
          disabled={value <= min}
          onStep={() => nudge(-1)}
        >
          <Minus />
        </HoldButton>
        <div
          className="min-w-20 text-center font-display text-4xl font-medium tracking-tight text-foreground tabular-nums"
          aria-live="polite"
        >
          {format(value)}
        </div>
        <HoldButton
          label={`Aumenta ${label}`}
          disabled={value >= max}
          onStep={() => nudge(1)}
        >
          <Plus />
        </HoldButton>
      </div>
    </div>
  );
}

function HoldButton({
  label,
  disabled,
  onStep,
  children,
}: {
  label: string;
  disabled: boolean;
  onStep: () => void;
  children: ReactNode;
}) {
  const timer = useRef<number | null>(null);
  const interval = useRef<number | null>(null);
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const clear = () => {
    if (timer.current != null) window.clearTimeout(timer.current);
    if (interval.current != null) window.clearInterval(interval.current);
    timer.current = null;
    interval.current = null;
  };

  useEffect(() => clear, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      disabled={disabled}
      onPointerDown={(e) => {
        if (disabled) return;
        e.preventDefault();
        onStepRef.current();
        timer.current = window.setTimeout(() => {
          interval.current = window.setInterval(() => {
            onStepRef.current();
          }, 70);
        }, 360);
      }}
      onPointerUp={clear}
      onPointerCancel={clear}
      onPointerLeave={clear}
    >
      {children}
    </Button>
  );
}
