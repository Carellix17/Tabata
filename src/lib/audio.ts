let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  opts?: { type?: OscillatorType; gain?: number; delay?: number },
) {
  const audio = getCtx();
  if (!audio) return;
  const start = audio.currentTime + (opts?.delay ?? 0);
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = opts?.type ?? "sine";
  osc.frequency.setValueAtTime(frequency, start);
  const peak = opts?.gain ?? 0.12;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

export function resumeAudio() {
  getCtx();
}

export function playCue(
  kind: "countdown" | "tick" | "work" | "rest" | "done",
) {
  switch (kind) {
    case "countdown":
      tone(880, 0.11, { type: "triangle", gain: 0.1 });
      break;
    case "tick":
      tone(740, 0.07, { type: "triangle", gain: 0.08 });
      break;
    case "work":
      tone(523, 0.12, { type: "sine", gain: 0.12 });
      tone(784, 0.22, { type: "sine", gain: 0.14, delay: 0.09 });
      break;
    case "rest":
      tone(392, 0.22, { type: "sine", gain: 0.1 });
      break;
    case "done":
      tone(523, 0.16, { gain: 0.1 });
      tone(659, 0.18, { gain: 0.11, delay: 0.12 });
      tone(784, 0.32, { gain: 0.13, delay: 0.26 });
      break;
  }
}

export function haptic(kind: "work" | "rest" | "tick" | "done") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  if (kind === "work") navigator.vibrate([30, 40, 70]);
  else if (kind === "rest") navigator.vibrate(60);
  else if (kind === "tick") navigator.vibrate(20);
  else navigator.vibrate([40, 50, 40, 50, 120]);
}
