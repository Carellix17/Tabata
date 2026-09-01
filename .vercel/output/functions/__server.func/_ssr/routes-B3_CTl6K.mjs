import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as SkipForward, c as Pause, l as Minus, n as VolumeX, o as Plus, r as Volume2, s as Play, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B3_CTl6K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,color,opacity,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
			outline: "border border-border bg-transparent text-foreground hover:bg-muted",
			ghost: "text-muted-foreground hover:bg-muted hover:text-foreground"
		},
		size: {
			default: "h-11 rounded-md px-5 text-sm",
			lg: "h-14 rounded-lg px-6 text-base",
			xl: "h-16 w-full rounded-lg px-8 text-base tracking-wide",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, static: isStatic = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size
		}), !isStatic && "active:not-disabled:scale-[0.96]", className),
		...props
	});
}
var ctx = null;
function getCtx() {
	if (typeof window === "undefined") return null;
	const Ctor = window.AudioContext || window.webkitAudioContext;
	if (!Ctor) return null;
	if (!ctx) ctx = new Ctor();
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function tone(frequency, duration, opts) {
	const audio = getCtx();
	if (!audio) return;
	const start = audio.currentTime + (opts?.delay ?? 0);
	const osc = audio.createOscillator();
	const gain = audio.createGain();
	osc.type = opts?.type ?? "sine";
	osc.frequency.setValueAtTime(frequency, start);
	const peak = opts?.gain ?? .12;
	gain.gain.setValueAtTime(1e-4, start);
	gain.gain.exponentialRampToValueAtTime(peak, start + .012);
	gain.gain.exponentialRampToValueAtTime(1e-4, start + duration);
	osc.connect(gain);
	gain.connect(audio.destination);
	osc.start(start);
	osc.stop(start + duration + .03);
}
function resumeAudio() {
	getCtx();
}
function playCue(kind) {
	switch (kind) {
		case "countdown":
			tone(880, .11, {
				type: "triangle",
				gain: .1
			});
			break;
		case "tick":
			tone(740, .07, {
				type: "triangle",
				gain: .08
			});
			break;
		case "work":
			tone(523, .12, {
				type: "sine",
				gain: .12
			});
			tone(784, .22, {
				type: "sine",
				gain: .14,
				delay: .09
			});
			break;
		case "rest":
			tone(392, .22, {
				type: "sine",
				gain: .1
			});
			break;
		case "done":
			tone(523, .16, { gain: .1 });
			tone(659, .18, {
				gain: .11,
				delay: .12
			});
			tone(784, .32, {
				gain: .13,
				delay: .26
			});
	}
}
function haptic(kind) {
	if (typeof navigator === "undefined" || !navigator.vibrate) return;
	if (kind === "work") navigator.vibrate([
		30,
		40,
		70
	]);
	else if (kind === "rest") navigator.vibrate(60);
	else if (kind === "tick") navigator.vibrate(20);
	else navigator.vibrate([
		40,
		50,
		40,
		50,
		120
	]);
}
var LIMITS = {
	rounds: {
		min: 1,
		max: 10,
		default: 4
	},
	work: {
		min: 5,
		max: 600,
		default: 20,
		step: 5
	},
	rest: {
		min: 0,
		max: 30,
		default: 5,
		step: 1
	}
};
var COUNTDOWN_MS = 3e3;
var DEFAULT_SETTINGS = {
	rounds: LIMITS.rounds.default,
	workSeconds: LIMITS.work.default,
	restSeconds: LIMITS.rest.default,
	soundEnabled: true
};
var PRESETS = [
	{
		id: "rapido",
		label: "Rapido",
		rounds: 4,
		workSeconds: 20,
		restSeconds: 5
	},
	{
		id: "classico",
		label: "Classico",
		rounds: 8,
		workSeconds: 20,
		restSeconds: 10
	},
	{
		id: "forza",
		label: "Forza",
		rounds: 6,
		workSeconds: 40,
		restSeconds: 15
	},
	{
		id: "lungo",
		label: "Lungo",
		rounds: 4,
		workSeconds: 90,
		restSeconds: 20
	}
];
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function snap(n, min, max, step) {
	return clamp(Math.round((n - min) / step) * step + min, min, max);
}
function formatDuration(seconds) {
	if (seconds < 60) return `${seconds}s`;
	return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}
function formatClock(ms) {
	const total = Math.max(0, Math.ceil(ms / 1e3));
	const m = Math.floor(total / 60);
	const s = total % 60;
	if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`;
	return String(s);
}
function workRestSeconds(rounds, work, rest) {
	const totalWork = rounds * work;
	const totalRest = Math.max(0, rounds - 1) * rest;
	return {
		totalWork,
		totalRest,
		total: totalWork + totalRest
	};
}
function remainingSessionMs(opts) {
	const { phase, remainingMs, currentRound, rounds, workSeconds, restSeconds } = opts;
	let left = remainingMs;
	const workMs = workSeconds * 1e3;
	const restMs = restSeconds * 1e3;
	if (phase === "countdown") {
		left += rounds * workMs + Math.max(0, rounds - 1) * restMs;
		return left;
	}
	if (phase === "work") {
		const roundsAfter = rounds - currentRound;
		left += roundsAfter * workMs;
		const restsAfter = restSeconds > 0 ? rounds - currentRound : 0;
		left += restsAfter * restMs;
		return left;
	}
	const roundsAfter = rounds - currentRound;
	left += roundsAfter * workMs;
	left += Math.max(0, roundsAfter - 1) * restMs;
	return left;
}
function phaseLabel(phase) {
	if (phase === "countdown") return "Pronto";
	if (phase === "work") return "Lavoro";
	return "Recupero";
}
function matchPreset(s) {
	return PRESETS.find((p) => p.rounds === s.rounds && p.workSeconds === s.workSeconds && p.restSeconds === s.restSeconds)?.id ?? null;
}
var STORAGE_KEY = "tabata-settings-v1";
function persistSettings(s) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			rounds: s.rounds,
			workSeconds: s.workSeconds,
			restSeconds: s.restSeconds,
			soundEnabled: s.soundEnabled
		}));
	} catch {}
}
function cue(enabled, kind) {
	if (!enabled) return;
	playCue(kind);
	if (kind !== "countdown") haptic(kind === "tick" ? "tick" : kind);
}
var useTabata = create((set, get) => {
	function beginPhase(phase, durationMs, round) {
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
			lastAnnouncedSec: Math.ceil(durationMs / 1e3)
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
				total: totals.total
			}
		});
	}
	function advance() {
		const { phase, currentRound, rounds, workSeconds, restSeconds } = get();
		if (phase === "countdown") {
			beginPhase("work", workSeconds * 1e3, 1);
			return;
		}
		if (phase === "work") {
			if (currentRound >= rounds) {
				complete();
				return;
			}
			if (restSeconds > 0) {
				beginPhase("rest", restSeconds * 1e3, currentRound);
				return;
			}
			beginPhase("work", workSeconds * 1e3, currentRound + 1);
			return;
		}
		beginPhase("work", workSeconds * 1e3, currentRound + 1);
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
				const parsed = JSON.parse(raw);
				set({
					rounds: clamp(parsed.rounds ?? DEFAULT_SETTINGS.rounds, LIMITS.rounds.min, LIMITS.rounds.max),
					workSeconds: snap(parsed.workSeconds ?? DEFAULT_SETTINGS.workSeconds, LIMITS.work.min, LIMITS.work.max, LIMITS.work.step),
					restSeconds: clamp(parsed.restSeconds ?? DEFAULT_SETTINGS.restSeconds, LIMITS.rest.min, LIMITS.rest.max),
					soundEnabled: parsed.soundEnabled ?? true
				});
			} catch {}
		},
		setRounds: (n) => {
			set({ rounds: clamp(Math.round(n), LIMITS.rounds.min, LIMITS.rounds.max) });
			persistSettings(get());
		},
		setWorkSeconds: (n) => {
			set({ workSeconds: snap(n, LIMITS.work.min, LIMITS.work.max, LIMITS.work.step) });
			persistSettings(get());
		},
		setRestSeconds: (n) => {
			set({ restSeconds: clamp(Math.round(n), LIMITS.rest.min, LIMITS.rest.max) });
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
				restSeconds: p.restSeconds
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
			set({
				paused: true,
				endAt: null,
				remainingMs
			});
		},
		resume: () => {
			const { paused, view, remainingMs } = get();
			if (!paused || view !== "session") return;
			resumeAudio();
			set({
				paused: false,
				endAt: performance.now() + remainingMs
			});
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
				phase: "countdown"
			});
		},
		resetToSetup: () => {
			set({
				view: "setup",
				paused: false,
				endAt: null,
				remainingMs: COUNTDOWN_MS,
				phase: "countdown"
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
			const sec = Math.ceil(remainingMs / 1e3);
			if (sec <= 3 && sec >= 1 && sec < lastAnnouncedSec) {
				cue(soundEnabled, sec === 3 && get().phase === "countdown" ? "countdown" : "tick");
				set({
					remainingMs,
					lastAnnouncedSec: sec
				});
			} else set({ remainingMs });
		}
	};
});
function CompleteView() {
	const lastSession = useTabata((s) => s.lastSession);
	const start = useTabata((s) => s.start);
	const resetToSetup = useTabata((s) => s.resetToSetup);
	const rounds = lastSession?.rounds ?? 0;
	const work = lastSession?.workSeconds ?? 0;
	const rest = lastSession?.restSeconds ?? 0;
	const totalWork = lastSession?.totalWork ?? 0;
	const totalRest = lastSession?.totalRest ?? 0;
	const total = lastSession?.total ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh w-full justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh w-full max-w-md flex-col px-5 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs font-medium tracking-brand text-muted-foreground uppercase",
					children: "Sessione"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl font-medium tracking-tight text-foreground",
					children: "Fatto."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground text-pretty",
					children: rounds === 1 ? "Una ripetizione completata. Recupera e, se vuoi, ripeti." : `${rounds} ripetizioni completate. Recupera e, se vuoi, ripeti.`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-10 divide-y divide-border rounded-2xl bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Ripetizioni",
							value: String(rounds)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lavoro",
							value: `${formatDuration(work)} × ${rounds}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Pausa",
							value: rest === 0 ? "Nessuna" : `${rest}s × ${Math.max(0, rounds - 1)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Tempo di lavoro",
							value: formatDuration(totalWork)
						}),
						totalRest > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Tempo di recupero",
							value: formatDuration(totalRest)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Durata totale",
							value: formatDuration(total)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex flex-col gap-3 pt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "xl",
						onClick: start,
						children: "Ripeti"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						size: "lg",
						className: "w-full",
						onClick: resetToSetup,
						children: "Modifica"
					})]
				})
			]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-display text-lg font-medium text-foreground tabular-nums",
			children: value
		})]
	});
}
var R = 46;
var C = 2 * Math.PI * R;
function RingTimer({ progress, tone, paused = false, children }) {
	const offset = C * (1 - Math.min(1, Math.max(0, progress)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative mx-auto aspect-square w-full max-w-72", paused && "opacity-70"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "size-full -rotate-90",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r: R,
				fill: "none",
				className: "stroke-track",
				strokeWidth: "2.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r: R,
				fill: "none",
				className: cn("transition-[stroke] duration-[var(--motion-fast)] ease-[var(--ease-out)]", tone === "rest" ? "stroke-rest" : "stroke-work"),
				strokeWidth: "2.4",
				strokeLinecap: "round",
				strokeDasharray: C,
				strokeDashoffset: offset
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center px-8",
			children
		})]
	});
}
function SessionView() {
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
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const loop = (now) => {
			tick(now);
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, [tick]);
	(0, import_react.useEffect)(() => {
		let lock = null;
		const request = async () => {
			try {
				lock = await navigator.wakeLock?.request("screen");
			} catch {}
		};
		request();
		const onVis = () => {
			if (document.visibilityState === "visible") request();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			document.removeEventListener("visibilitychange", onVis);
			lock?.release();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === " " || e.code === "Space") {
				e.preventDefault();
				if (paused) resume();
				else pause();
			} else if (e.key === "Escape") stop();
			else if (e.key === "ArrowRight") skip();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		paused,
		pause,
		resume,
		skip,
		stop
	]);
	const progress = phaseDurationMs > 0 ? remainingMs / phaseDurationMs : 0;
	const tone = phase === "rest" ? "rest" : phase === "countdown" ? "countdown" : "work";
	const remainingTotal = remainingSessionMs({
		phase,
		remainingMs,
		currentRound,
		rounds,
		workSeconds,
		restSeconds
	});
	const nextHint = phase === "countdown" ? `Poi ${formatDuration(workSeconds)} di lavoro` : phase === "work" ? currentRound >= rounds ? "Ultima ripetizione" : restSeconds > 0 ? `Poi pausa ${restSeconds}s` : "Poi la prossima" : `Poi ripetizione ${currentRound + 1}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh w-full justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh w-full max-w-md flex-col px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							"aria-label": "Termina sessione",
							onClick: stop,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs font-medium tracking-brand text-muted-foreground uppercase",
							children: "Tabata"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-11",
							"aria-hidden": "true"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("font-display text-sm font-medium tracking-wide uppercase", phase === "rest" ? "text-rest" : "text-foreground"),
						children: paused ? "In pausa" : phaseLabel(phase)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground tabular-nums",
						children: phase === "countdown" ? "Partenza" : `Ripetizione ${currentRound} di ${rounds}`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RingTimer, {
						progress,
						tone,
						paused,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("font-display text-timer leading-none font-medium tracking-tight text-foreground tabular-nums", remainingMs <= 3e3 && remainingMs > 0 && !paused && "pulse-urgent"),
							"aria-live": "polite",
							"aria-atomic": "true",
							children: formatClock(remainingMs)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-3 text-xs tracking-wide text-subtle uppercase",
							children: nextHint
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex justify-center gap-1.5",
					"aria-hidden": "true",
					children: Array.from({ length: rounds }, (_, i) => {
						const n = i + 1;
						const done = n < currentRound || n === currentRound && phase === "rest";
						const current = n === currentRound && phase !== "countdown";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-6 rounded-full transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]", done || current ? "bg-foreground" : "bg-track", current && !paused && "opacity-100", current && paused && "opacity-50") }, n);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						size: "lg",
						className: "flex-1",
						onClick: paused ? resume : pause,
						children: [paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), paused ? "Riprendi" : "Pausa"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "lg",
						className: "flex-1",
						onClick: skip,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, {}), "Salta"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-xs text-subtle tabular-nums",
					children: ["Resta ", formatDuration(Math.max(0, Math.ceil(remainingTotal / 1e3)))]
				})
			]
		})
	});
}
function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }) {
	const _values = import_react.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min], [
		value,
		defaultValue,
		min
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		"data-slot": "slider",
		defaultValue,
		value,
		min,
		max,
		className: cn("relative flex w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-2 w-full grow overflow-hidden rounded-full bg-track",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-foreground" })
		}), _values.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-6 shrink-0 rounded-full border-0 bg-foreground shadow-sm ring-ring/40 transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none" }, i))]
	});
}
function Stepper({ label, hint, value, min, max, step = 1, format = (n) => String(n), onChange, className }) {
	const onChangeRef = (0, import_react.useRef)(onChange);
	onChangeRef.current = onChange;
	const valueRef = (0, import_react.useRef)(value);
	valueRef.current = value;
	const nudge = (0, import_react.useCallback)((dir) => {
		const next = valueRef.current + dir * step;
		onChangeRef.current(Math.min(max, Math.max(min, next)));
	}, [
		min,
		max,
		step
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: label
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				children: hint
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
					label: `Diminuisci ${label}`,
					disabled: value <= min,
					onStep: () => nudge(-1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-20 text-center font-display text-4xl font-medium tracking-tight text-foreground tabular-nums",
					"aria-live": "polite",
					children: format(value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
					label: `Aumenta ${label}`,
					disabled: value >= max,
					onStep: () => nudge(1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
				})
			]
		})]
	});
}
function HoldButton({ label, disabled, onStep, children }) {
	const timer = (0, import_react.useRef)(null);
	const interval = (0, import_react.useRef)(null);
	const onStepRef = (0, import_react.useRef)(onStep);
	onStepRef.current = onStep;
	const clear = () => {
		if (timer.current != null) window.clearTimeout(timer.current);
		if (interval.current != null) window.clearInterval(interval.current);
		timer.current = null;
		interval.current = null;
	};
	(0, import_react.useEffect)(() => clear, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "outline",
		size: "icon",
		"aria-label": label,
		disabled,
		onPointerDown: (e) => {
			if (disabled) return;
			e.preventDefault();
			onStepRef.current();
			timer.current = window.setTimeout(() => {
				interval.current = window.setInterval(() => {
					onStepRef.current();
				}, 70);
			}, 360);
		},
		onPointerUp: clear,
		onPointerCancel: clear,
		onPointerLeave: clear,
		children
	});
}
function SetupView() {
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
	const sliderActive = (0, import_react.useRef)(false);
	const totals = workRestSeconds(rounds, workSeconds, restSeconds);
	const activePreset = matchPreset({
		rounds,
		workSeconds,
		restSeconds,
		soundEnabled
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh w-full lg:grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:max-w-lg lg:px-12 lg:pt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs font-medium tracking-brand text-muted-foreground uppercase",
						children: "Protocollo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-medium tracking-tight text-foreground",
						children: "Tabata"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": soundEnabled ? "Disattiva suono" : "Attiva suono",
						"aria-pressed": soundEnabled,
						onClick: toggleSound,
						children: soundEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground",
					children: "Imposta ripetizioni, lavoro e pausa. Poi inizia."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-2xl bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
								label: "Ripetizioni",
								hint: `max ${LIMITS.rounds.max}`,
								value: rounds,
								min: LIMITS.rounds.min,
								max: LIMITS.rounds.max,
								onChange: setRounds
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex gap-1.5",
								"aria-hidden": "true",
								children: Array.from({ length: LIMITS.rounds.max }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 flex-1 rounded-full transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]", i < rounds ? "bg-foreground" : "bg-track") }, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-2xl bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
								label: "Lavoro",
								hint: `max ${formatDuration(LIMITS.work.max)}`,
								value: workSeconds,
								min: LIMITS.work.min,
								max: LIMITS.work.max,
								step: LIMITS.work.step,
								format: formatDuration,
								onChange: setWorkSeconds
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: LIMITS.work.min,
									max: LIMITS.work.max,
									step: LIMITS.work.step,
									value: [workSeconds],
									onPointerDown: () => {
										sliderActive.current = true;
									},
									onValueChange: ([v]) => {
										if (sliderActive.current) setWorkSeconds(v);
									},
									onValueCommit: ([v]) => {
										if (sliderActive.current) setWorkSeconds(v);
										sliderActive.current = false;
									},
									"aria-label": "Durata del lavoro"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex justify-between text-xs text-subtle",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(LIMITS.work.min) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(LIMITS.work.max) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "rounded-2xl bg-card p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
								label: "Pausa",
								hint: `max ${LIMITS.rest.max}s`,
								value: restSeconds,
								min: LIMITS.rest.min,
								max: LIMITS.rest.max,
								step: LIMITS.rest.step,
								format: (n) => n === 0 ? "Off" : `${n}s`,
								onChange: setRestSeconds
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Preset"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: PRESETS.map((preset) => {
							const active = activePreset === preset.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => applyPreset(preset),
								className: cn("h-10 rounded-md px-3.5 text-sm font-medium transition-[background-color,color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96]", active ? "bg-primary text-primary-foreground" : "border border-border bg-transparent text-foreground"),
								children: preset.label
							}, preset.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto pt-8 lg:mt-10 lg:pt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "xl",
						onClick: start,
						children: "Inizia"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-center text-sm text-muted-foreground tabular-nums",
						children: [
							rounds,
							" × ",
							formatDuration(workSeconds),
							restSeconds > 0 ? ` · pausa ${restSeconds}s` : " · senza pausa",
							" · ",
							formatDuration(totals.total)
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden border-l border-border lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-8 font-display text-xs font-medium tracking-brand text-muted-foreground uppercase",
					children: "Anteprima"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RingTimer, {
					progress: 1,
					tone: "work",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-timer leading-none font-medium tracking-tight text-foreground tabular-nums",
						children: formatClock(workSeconds * 1e3)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 text-xs tracking-wide text-subtle uppercase",
						children: "Lavoro"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex gap-1.5",
					"aria-hidden": "true",
					children: Array.from({ length: rounds }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-6 rounded-full bg-foreground" }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted-foreground tabular-nums",
					children: [formatDuration(totals.total), " di sessione"]
				})
			]
		})]
	});
}
function Home() {
	const view = useTabata((s) => s.view);
	const hydrate = useTabata((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	if (view === "session") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionView, {});
	if (view === "complete") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteView, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupView, {});
}
//#endregion
export { Home as component };
