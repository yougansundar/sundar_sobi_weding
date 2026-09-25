import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { ChevronLeft, ChevronRight, MapPin, Share2, Volume2, VolumeX, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { weddingConfig as config } from "@/lib/wedding-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${config.couple.bride} & ${config.couple.groom} — Wedding Invitation` },
      { name: "description", content: `${config.couple.bride} & ${config.couple.groom} invite you to their wedding on ${config.dateLabel}, ${config.placeLabel}.` },
      { property: "og:title", content: `${config.couple.bride} & ${config.couple.groom} — Wedding Invitation` },
      { property: "og:description", content: config.social.shareText },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

/* ---------- motion engine: scroll-driven CSS variables, written only when something changed ----------
   --g  : global journey progress 0..1 (only on elements marked [data-g], NOT on <html>)
   --mx/--my : smoothed pointer offset -1..1 (on <html>, desktop mouse only)
   --p  : pinned-scene progress 0..1   (on each [data-scene])
   --e  : in-view progress 0..1        (on each [data-scene])
   Scene positions are measured once (and on resize), so a scroll frame does no layout reads. */
function useWorldMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    type Scene = { el: HTMLElement; top: number; h: number; p: string; e: string };
    let scenes: Scene[] = [];
    let gEls: HTMLElement[] = [];
    let docMax = 1, lastG = -1, tx = 0, ty = 0, mx = 0, my = 0, raf = 0, queued = false;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const measure = () => {
      const y = window.scrollY;
      scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top + y, h: r.height, p: "", e: "" };
      });
      gEls = Array.from(document.querySelectorAll<HTMLElement>("[data-g]"));
      docMax = Math.max(1, root.scrollHeight - window.innerHeight);
    };

    const update = () => {
      queued = false;
      const y = window.scrollY, vh = window.innerHeight;
      // Keep scroll work strictly to compositor-friendly CSS variables.
      // No React state updates, layout writes, or DOM measurements happen here.
      const g = clamp01(y / docMax);
      if (Math.abs(g - lastG) > 0.0003) {
        lastG = g;
        const v = g.toFixed(4);
        gEls.forEach((el) => el.style.setProperty("--g", v));
      }
      for (const sc of scenes) {
        const top = sc.top - y;
        if (top + sc.h < -vh || top > vh * 2) continue;
        const p = clamp01(-top / Math.max(1, sc.h - vh)).toFixed(3);
        const e = clamp01((vh - top) / (vh + sc.h)).toFixed(3);
        if (p !== sc.p) { sc.p = p; sc.el.style.setProperty("--p", p); }
        if (e !== sc.e) { sc.e = e; sc.el.style.setProperty("--e", e); }
      }
      if (fine && !reduce && (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002)) {
        mx += (tx - mx) * 0.1; my += (ty - my) * 0.1;
        root.style.setProperty("--mx", mx.toFixed(3));
        root.style.setProperty("--my", my.toFixed(3));
        schedule(); // keep easing until the pointer offset settles, then stop
      }
    };
    const schedule = () => { if (!queued) { queued = true; raf = requestAnimationFrame(update); } };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      schedule();
    };
    let lastW = window.innerWidth, lastH = window.innerHeight;
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 24) return;
      lastW = w; lastH = h;
      measure();
      schedule();
    };

    root.style.setProperty("--mx", "0");
    root.style.setProperty("--my", "0");
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
}

const s = (o: Record<string, string | number | undefined>) => o as CSSProperties;
/** fades in over the first part of --e, out over the last part */
const inOut = (edge = 4, v = "--e") => `calc(clamp(0, var(${v}) * ${edge} - .35, 1) * clamp(0, (1 - var(${v})) * ${edge} - .35, 1))`;
/** 0→1 ramp of pinned progress between a and b */
const ramp = (a: number, b: number) => `clamp(0, (var(--p) - ${a}) / ${b - a}, 1)`;

/* ---------- ornaments ---------- */
function Arch({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 300 420" className={className} style={style} fill="none" aria-hidden>
      <path d="M10 420V190Q10 60 150 10Q290 60 290 190V420" stroke="var(--gold)" strokeWidth="2" />
      <path d="M30 420V196Q30 84 150 34Q270 84 270 196V420" stroke="var(--gold)" strokeWidth=".8" opacity=".7" />
      <path d="M150 10v-8M140 6l10-6 10 6" stroke="var(--gold)" strokeWidth="1.2" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={150 + Math.cos(Math.PI + (i * Math.PI) / 8) * 128} cy={196 + Math.sin(Math.PI + (i * Math.PI) / 8) * 150} r="2.4" fill="var(--gold)" opacity=".8" />
      ))}
    </svg>
  );
}

function Mandala({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} fill="none" stroke="var(--gold)" aria-hidden>
      <circle r="96" strokeWidth=".4" /><circle r="80" strokeWidth=".6" /><circle r="44" strokeWidth=".5" /><circle r="20" strokeWidth=".8" />
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={i} rx="9" ry="30" cy="-58" strokeWidth=".6" transform={`rotate(${i * 22.5})`} />
      ))}
      {Array.from({ length: 32 }).map((_, i) => (
        <circle key={`d${i}`} r="1.4" cy="-88" fill="var(--gold)" stroke="none" transform={`rotate(${i * 11.25})`} />
      ))}
    </svg>
  );
}

function Branch({ className, style, flip }: { className?: string; style?: CSSProperties; flip?: boolean }) {
  return (
    <svg viewBox="0 0 160 520" className={className} style={{ ...style, scale: flip ? "-1 1" : undefined }} fill="none" aria-hidden>
      <path d="M20 520C40 400 30 300 70 200S120 60 100 0" stroke="var(--leaf)" strokeWidth="2.4" strokeLinecap="round" />
      {[[52, 440, -30], [38, 360, 35], [66, 280, -40], [78, 200, 30], [96, 130, -25], [104, 60, 40]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="22" ry="8" fill="var(--leaf)" opacity={0.75 - i * 0.05} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {[[30, 400], [74, 240], [110, 100], [58, 320], [100, 30]].map(([x, y], i) => (
        <g key={`f${i}`} transform={`translate(${x} ${y})`}>
          {Array.from({ length: 5 }).map((_, k) => <ellipse key={k} rx="3" ry="7" cy="-6" fill="var(--background)" stroke="var(--gold)" strokeWidth=".5" transform={`rotate(${k * 72})`} />)}
          <circle r="2" fill="var(--gold)" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- the persistent world behind every scene ---------- */
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  layer: i % 3,
  mobile: i < 15,
  left: (i * 37) % 100,
  delay: -((i * 1.7) % 14),
  dur: 11 + ((i * 3) % 9),
  x: ((i % 5) - 2) * 40,
  hue: i % 4 === 0 ? "var(--wine)" : i % 4 === 1 ? "var(--gold)" : "var(--background)",
}));

function World() {
  return (
    <div data-g className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ perspective: "900px" }} aria-hidden>
      {/* atmospheric light that shifts colour along the journey */}
      <div className="paper-grain absolute inset-0" />
      <div className="absolute inset-0" style={s({ background: "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 65%)" })} />
      <div className="absolute inset-0" style={s({ opacity: "clamp(0, calc(1 - (var(--g) - .3) * (var(--g) - .3) * 40), .9)", willChange: "opacity", background: "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--wine) 22%, transparent), transparent 70%)" })} />
      <div className="absolute inset-0" style={s({ opacity: "clamp(0, calc(1 - (var(--g) - .62) * (var(--g) - .62) * 40), .8)", willChange: "opacity", background: "radial-gradient(ellipse at 30% 50%, color-mix(in oklab, var(--leaf) 20%, transparent), transparent 70%)" })} />
      <div className="absolute -inset-[30%] origin-top max-sm:hidden" style={s({ transform: "rotate(calc(-25deg + var(--g) * 50deg))", background: "linear-gradient(90deg, transparent 42%, color-mix(in oklab, var(--gold) 12%, transparent) 50%, transparent 58%)" })} />

      {/* far plane: the mandala that turns through the whole journey */}
      <Mandala className="absolute left-1/2 top-1/2 w-[130vmin] opacity-25" style={s({ transform: "translate(-50%,-50%) translate3d(calc(var(--mx) * -10px), calc(var(--my) * -10px), -400px) rotate(calc(var(--g) * 220deg)) scale(calc(1 + var(--g) * .4))", willChange: "transform" })} />

      {/* mid plane: jasmine branches that travel alongside the reader */}
      <Branch className="absolute -left-10 top-0 h-[80vh] opacity-80" style={s({ transform: "translate3d(calc(var(--mx) * 18px), calc(var(--g) * -30vh + 10vh), 60px) rotate(calc(-8deg + var(--g) * 16deg))", transformOrigin: "bottom left", willChange: "transform" })} />
      <Branch flip className="absolute -right-10 bottom-0 h-[70vh] opacity-80" style={s({ transform: "translate3d(calc(var(--mx) * 18px), calc(var(--g) * 30vh - 10vh), 60px) rotate(calc(8deg - var(--g) * 16deg))", transformOrigin: "bottom right", willChange: "transform" })} />

      {/* three depth layers of petals, each with its own scroll parallax */}
      {[0, 1, 2].map((layer) => (
        <div key={layer} className={`absolute inset-0 ${layer === 0 ? "sm:blur-[1.5px]" : layer === 2 ? "sm:blur-[.4px]" : ""}`} style={s({ transform: `translate3d(calc(var(--mx) * ${(layer + 1) * -14}px), calc(var(--g) * ${-(layer + 1) * 40}vh), ${layer * 120 - 150}px)`, willChange: "transform" })}>
          {PETALS.filter((p) => p.layer === layer).map((p, i) => (
            <span key={i} className={`petal-drift absolute top-0 block rounded-[60%_0_60%_0] sm:shadow-sm ${p.mobile ? "" : "max-sm:hidden"}`} style={s({ left: `${p.left}%`, width: 8 + layer * 6, height: 11 + layer * 8, background: p.hue, border: "1px solid color-mix(in oklab, var(--gold) 50%, transparent)", animationDelay: `${p.delay}s`, "--petal-duration": `${p.dur - layer * 2}s`, "--petal-x": `${p.x}px` })} />
          ))}
        </div>
      ))}
      <div className="absolute inset-0" style={s({ background: "radial-gradient(ellipse at center, transparent 55%, color-mix(in oklab, var(--wine) 10%, transparent))" })} />
    </div>
  );
}

/* ---------- small helpers ---------- */
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="flex items-center justify-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.4em] text-gold"><span className="h-px w-8 bg-gold/60" />{children}<span className="h-px w-8 bg-gold/60" /></p>;
}

/** a flowing (non-pinned) scene; children use --e for depth motion */
function Flow({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} data-scene className={`relative z-10 ${className}`} style={{ perspective: "1000px" }}>{children}</section>;
}

/** content drifting through depth as the scene passes the camera */
function Drift({ children, z = 0, speed = 120, tilt = 18, className = "" }: { children: ReactNode; z?: number; speed?: number; tilt?: number; className?: string }) {
  return (
    <div className={className} style={s({
      transform: `translate3d(calc(var(--mx) * ${z / 20}px), calc((var(--e) - .5) * ${-speed}px), calc(${z}px - (var(--e) - .5) * (var(--e) - .5) * 900px)) rotateX(calc((var(--e) - .5) * ${-tilt}deg))`,
      opacity: inOut(),
      willChange: "transform, opacity",
    })}>{children}</div>
  );
}

/* ---------- opening: temple doors that swing open in 3D ---------- */
function Opening({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const open = () => { setOpening(true); setTimeout(onOpen, 1300); };
  const door = "absolute top-0 h-full w-1/2 bg-wine paper-grain transition-transform duration-[1300ms] ease-[cubic-bezier(.7,0,.2,1)]";
  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-700 ${opening ? "pointer-events-none delay-700 opacity-0" : ""}`} style={{ perspective: "1400px" }}>
      <div className={`${door} left-0 origin-left border-r border-gold/40`} style={{ transform: opening ? "rotateY(-105deg)" : "none" }}>
        <Arch className="absolute right-0 top-1/2 h-[70%] -translate-y-1/2 translate-x-1/2 opacity-60" />
      </div>
      <div className={`${door} right-0 origin-right border-l border-gold/40`} style={{ transform: opening ? "rotateY(105deg)" : "none" }}>
        <Arch className="absolute left-0 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2 opacity-60" />
      </div>
      <div className={`absolute inset-0 grid place-items-center px-8 text-center transition-all duration-500 ${opening ? "scale-110 opacity-0" : ""}`}>
        <div>
          <Mandala className="mx-auto mb-6 h-28 w-28 animate-[spin_40s_linear_infinite] opacity-90" />
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-gold">You are invited</p>
          <h1 className="mt-4 font-display text-5xl text-primary-foreground sm:text-6xl">{config.couple.bride} <span className="text-gold">&</span> {config.couple.groom}</h1>
          <p className="mt-3 text-sm tracking-[0.3em] text-primary-foreground/80">{config.dateLabel}</p>
          <Button variant="invitation" size="lg" className="mt-10 bg-gold text-foreground hover:bg-gold/90" onClick={open}>Open the invitation</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- scene 1: hero, pinned, three depth planes ---------- */
function Hero() {
  const { bride, groom, invitationLine } = config.couple;
  return (
    <section id="home" data-scene className="relative z-10 h-[190vh] sm:h-[260vh]">
      <div className="sticky top-0 h-svh overflow-hidden" style={{ perspective: "900px" }}>
        <div className="preserve-3d absolute inset-0" style={s({ transform: "rotateY(calc(var(--mx) * 5deg)) rotateX(calc(var(--my) * -4deg))" })}>
          {/* background plane — the arch & portrait we fly through */}
          <div className="preserve-3d absolute left-1/2 top-1/2 w-[min(78vw,380px)]" style={s({ transform: "translate(-50%,-50%) translate3d(0, calc(var(--p) * -6vh), calc(-260px + var(--p) * 900px))", opacity: "calc(1 - clamp(0, (var(--p) - .45) * 3, 1))" })}>
            <div className="relative aspect-[3/4.2]">
              <img src={config.images.hero} alt={`${bride} and ${groom}`} className="absolute inset-[7%] h-[93%] w-[86%] rounded-t-full object-cover shadow-[var(--shadow-invitation)]" style={s({ filter: "saturate(.9) sepia(.12)" })} />
              <Arch className="absolute inset-0 h-full w-full" />
            </div>
          </div>
          {/* mid plane — names floating at different depths */}
          <div className="preserve-3d absolute inset-0 grid place-items-center text-center">
            <div className="preserve-3d" style={s({ opacity: "calc(1 - clamp(0, (var(--p) - .35) * 3.5, 1))" })}>
              <p className="mb-[42vh] text-[0.65rem] uppercase tracking-[0.5em] text-primary" style={s({ transform: "translate3d(0, calc(var(--p) * -30vh), 80px)" })}>The wedding of</p>
              <h1 className="font-display text-[clamp(3.6rem,17vw,9rem)] leading-[.85] text-primary drop-shadow-[0_4px_20px_var(--background)]">
                <span className="block" style={s({ transform: "translate3d(calc(var(--p) * -60vw + var(--mx) * -12px), 0, calc(160px + var(--p) * 300px)) rotateY(calc(var(--p) * 30deg))" })}>{bride}</span>
                <span className="block text-gold" style={s({ transform: "translate3d(0,0,240px) rotate(calc(var(--p) * 180deg))" })}>&</span>
                <span className="block" style={s({ transform: "translate3d(calc(var(--p) * 60vw + var(--mx) * 12px), 0, calc(120px + var(--p) * 300px)) rotateY(calc(var(--p) * -30deg))" })}>{groom}</span>
              </h1>
              <p className="mt-6 text-sm tracking-[0.35em] text-foreground/80" style={s({ transform: "translate3d(0, calc(var(--p) * 30vh), 60px)" })}>{config.dateLabel} · {config.placeLabel}</p>
            </div>
          </div>
          {/* the invitation line emerges from the depth as the arch passes */}
          <div className="absolute inset-0 grid place-items-center px-8 text-center" style={s({ opacity: `calc(${ramp(0.5, 0.72)} * (1 - ${ramp(0.9, 1)}))`, transform: `translate3d(0,0,calc(-500px + ${ramp(0.5, 0.85)} * 500px))` })}>
            <div className="max-w-md">
              <Mandala className="mx-auto mb-6 h-16 w-16" />
              <p className="font-display text-3xl leading-snug text-primary sm:text-4xl">{invitationLine}</p>
            </div>
          </div>
          {/* foreground plane — ornaments rushing past the camera */}
          {[["left-[4%] top-[8%]", -1], ["right-[4%] top-[14%]", 1], ["left-[10%] bottom-[10%]", 1], ["right-[8%] bottom-[6%]", -1]].map(([pos, d], i) => (
            <div key={i} className={`absolute ${pos}`} style={s({ transform: `translate3d(calc(var(--p) * ${Number(d) * 50}vw + var(--mx) * ${-30}px), calc(var(--p) * -90vh), calc(300px + var(--p) * 400px))` })}>
              <Mandala className="ornament-float h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
            </div>
          ))}
          <p className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.4em] text-primary/70" style={s({ opacity: "calc(1 - var(--p) * 8)" })}>Scroll to enter</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- scene 2: the couple & families ---------- */
function Couple() {
  const { families } = config;
  return (
    <Flow id="couple" className="-mt-[30vh] min-h-[120vh] px-6 py-[20vh] sm:-mt-[40vh] sm:min-h-[150vh] sm:py-[30vh]">
      <div className="preserve-3d relative mx-auto max-w-4xl">
        <Drift z={40}><Eyebrow>Two families, one celebration</Eyebrow></Drift>
        <div className="preserve-3d mt-14 grid gap-16 sm:grid-cols-2 sm:gap-10">
          {[{ img: config.images.couple, name: config.couple.bride, line: families.bride, z: 60, r: -6 }, { img: config.images.detail, name: config.couple.groom, line: families.groom, z: -40, r: 6 }].map((p, i) => (
            <Drift key={i} z={p.z} speed={i ? 260 : 120} tilt={24} className={i ? "sm:mt-40" : ""}>
              <figure className="text-center" style={s({ transform: `rotate(calc(${p.r}deg * (1 - var(--e))))` })}>
                <img src={p.img} alt={p.name} loading="lazy" className="mx-auto aspect-[3/4] w-[min(70vw,300px)] rounded-t-full border-4 border-background object-cover shadow-[var(--shadow-invitation)]" />
                <figcaption className="mt-5 font-display text-5xl text-primary">{p.name}</figcaption>
                <p className="mt-2 text-sm text-muted-foreground">{p.line}</p>
              </figure>
            </Drift>
          ))}
        </div>
        <Drift z={80} speed={60} className="mx-auto mt-24 max-w-xl text-center">
          <p className="font-display text-2xl leading-relaxed text-foreground sm:text-3xl">{config.blessing}</p>
          <p className="mt-6 text-sm italic text-leaf">{config.tamilBlessing}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gold">{families.message}</p>
        </Drift>
      </div>
    </Flow>
  );
}

/* ---------- scene 3: story, a gold thread drawn by scrolling ---------- */
function Story() {
  return (
    <Flow id="story" className="min-h-[120vh] px-6 py-[14vh] sm:min-h-[140vh] sm:py-[20vh]">
      <svg className="pointer-events-none absolute left-1/2 top-0 h-full w-24 -translate-x-1/2" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden>
        <path d="M50 0C90 150 10 300 50 500S90 850 50 1000" fill="none" stroke="var(--gold)" strokeWidth="1.5" pathLength={1} strokeDasharray="1" style={s({ strokeDashoffset: "calc(1 - clamp(0, var(--e) * 1.6 - .2, 1))" })} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="preserve-3d relative mx-auto max-w-3xl">
        <Drift><Eyebrow>Our story</Eyebrow></Drift>
        {config.story.map((m, i) => (
          <Drift key={m.year} z={i % 2 ? -60 : 60} speed={100 + i * 80} tilt={10} className={`mt-24 max-w-xs ${i % 2 ? "ml-auto text-right" : ""}`}>
            <p className="font-display text-6xl text-gold/70">{m.year}</p>
            <h3 className="mt-2 font-display text-3xl text-primary">{m.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
          </Drift>
        ))}
      </div>
    </Flow>
  );
}

/* ---------- scene 4: events — an invitation card that rotates in and turns ---------- */
function Events() {
  const n = config.events.length;
  const step = 360 / n;
  return (
    <section id="events" data-scene className="relative z-10 h-[300vh] sm:h-[420vh]">
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden" style={{ perspective: "1100px" }}>
        <div className="absolute top-[9vh] text-center" style={s({ opacity: `calc(${ramp(0.02, 0.15)} * (1 - ${ramp(0.9, 1)}))` })}><Eyebrow>The celebrations</Eyebrow></div>
        {/* the card flies in from deep space, flattens, turns through each event, then lifts away */}
        <div className="preserve-3d relative h-[min(62vh,480px)] w-[min(78vw,330px)]" style={s({
          transform: `translate3d(calc(var(--mx) * 10px), calc(${ramp(0.9, 1)} * -70vh), calc(-900px + ${ramp(0, 0.18)} * 900px)) rotateX(calc((1 - ${ramp(0, 0.18)}) * 70deg + var(--my) * -6deg)) rotateY(calc(${ramp(0.2, 0.86)} * ${-(n - 1) * step}deg + var(--mx) * 8deg))`,
          opacity: ramp(0, 0.08),
        })}>
          {config.events.map((ev, i) => {
            const wine = i === n - 1;
            return (
              <article key={ev.type} className={`paper-grain absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-t-[160px] border px-7 text-center shadow-[var(--shadow-invitation)] [backface-visibility:hidden] ${wine ? "border-gold bg-wine text-primary-foreground" : "border-gold/60 bg-background"}`} style={{ transform: `rotateY(${i * step}deg) translateZ(min(26vw, 110px))` }}>
                <Arch className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] opacity-70" />
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-gold">{ev.label}</p>
                <h3 className={`mt-4 font-display text-4xl leading-tight ${wine ? "" : "text-primary"}`}>{ev.type}</h3>
                <p className="mt-6 text-sm tracking-[0.2em]">{ev.date}</p>
                <p className="mt-1 font-display text-3xl text-gold">{ev.time}</p>
                <p className="mt-5 text-sm font-medium">{ev.venue}</p>
                <p className={`mt-2 text-xs ${wine ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{ev.note}</p>
              </article>
            );
          })}
        </div>
        <div className="absolute bottom-[8vh] flex gap-3" style={s({ opacity: `calc(${ramp(0.15, 0.22)} * (1 - ${ramp(0.88, 0.95)}))` })}>
          {config.events.map((ev, i) => {
            const c = n === 1 ? 0.53 : 0.2 + (0.66 * i) / (n - 1);
            return <span key={ev.label} className="text-[0.6rem] uppercase tracking-[0.3em] text-primary" style={s({ opacity: `clamp(.3, calc(1 - (var(--p) - ${c}) * (var(--p) - ${c}) * 60), 1)` })}>{ev.label}</span>;
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- scene 5: venue window with countdown numerals floating around it ---------- */
function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(config.weddingDate).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const v = left ?? 0;
  return [["Days", Math.floor(v / 864e5)], ["Hours", Math.floor(v / 36e5) % 24], ["Minutes", Math.floor(v / 6e4) % 60], ["Seconds", Math.floor(v / 1e3) % 60]] as const;
}

function Venue() {
  const units = useCountdown();
  const spots = ["-left-4 top-[6%] sm:-left-40", "-right-4 top-[22%] sm:-right-40", "-left-2 bottom-[18%] sm:-left-44", "-right-2 bottom-[4%] sm:-right-36"];
  return (
    <Flow id="venue" className="min-h-[130vh] px-6 py-[16vh] sm:min-h-[160vh] sm:py-[25vh]">
      <div className="preserve-3d relative mx-auto max-w-md">
        <Drift><Eyebrow>Where hearts meet</Eyebrow></Drift>
        <div className="preserve-3d relative mx-auto mt-10 w-[min(72vw,340px)]">
          <Drift z={-80} speed={60} tilt={30}>
            <div className="relative aspect-[3/4.2]">
              <img src={config.images.venue} alt={config.venue.name} loading="lazy" className="absolute inset-[7%] h-[93%] w-[86%] rounded-t-full object-cover" style={s({ transform: "scale(calc(1.25 - var(--e) * .25))" })} />
              <Arch className="absolute inset-0 h-full w-full" />
            </div>
          </Drift>
          {units.map(([label, val], i) => (
            <div key={label} className={`absolute ${spots[i]}`}>
              <Drift z={120 + i * 50} speed={200 + i * 90} tilt={0}>
                <div className="rounded-full border border-gold/50 bg-background/90 px-4 py-3 text-center shadow-[var(--shadow-invitation)] sm:bg-background/80 sm:backdrop-blur-sm">
                  <p className="font-display text-3xl tabular-nums text-primary sm:text-4xl">{String(val).padStart(2, "0")}</p>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
                </div>
              </Drift>
            </div>
          ))}
        </div>
        <Drift z={60} speed={40} className="mt-12 text-center">
          <h3 className="font-display text-4xl text-primary">{config.venue.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{config.venue.address}</p>
          <Button asChild variant="invitationOutline" className="mt-6"><a href={config.venue.mapUrl} target="_blank" rel="noreferrer"><MapPin /> Open in maps</a></Button>
        </Drift>
      </div>
    </Flow>
  );
}

/* ---------- scene 6: gallery — flying through photographs in space ---------- */
const SHOTS = [
  { x: -22, y: -8, z: 0, r: -8 }, { x: 24, y: 10, z: -700, r: 7 }, { x: -18, y: 14, z: -1400, r: 5 },
  { x: 20, y: -12, z: -2100, r: -6 }, { x: -4, y: 2, z: -2800, r: 3 }, { x: 22, y: 8, z: -3500, r: -4 },
];
const TRAVEL = 3900;

function Gallery({ onOpen }: { onOpen: (i: number) => void }) {
  const imgs = config.images.gallery;
  return (
    <section id="gallery" data-scene className="relative z-10 h-[320vh] sm:h-[450vh]">
      <div className="sticky top-0 h-svh overflow-hidden" style={{ perspective: "700px" }}>
        <div className="absolute inset-x-0 top-[8vh] z-10 text-center" style={s({ opacity: `calc(${ramp(0, 0.08)} * (1 - ${ramp(0.9, 1)}))` })}><Eyebrow>Moments</Eyebrow></div>
        <div className="preserve-3d absolute inset-0" style={s({ transform: `translate3d(calc(var(--mx) * -30px), calc(var(--my) * -20px), calc(var(--p) * ${TRAVEL}px))` })}>
          {SHOTS.map((sh, i) => {
            const depth = `(${sh.z} + var(--p) * ${TRAVEL})`;
            return (
              <button key={i} type="button" onClick={() => onOpen(i % imgs.length)} aria-label={`Open photograph ${i + 1}`}
                className="absolute left-1/2 top-1/2 w-[min(52vw,260px)] bg-background p-2 pb-8 shadow-[var(--shadow-invitation)] transition-[filter] hover:brightness-105"
                style={s({ transform: `translate(-50%,-50%) translate3d(${sh.x}vw, ${sh.y}vh, ${sh.z}px) rotate(${sh.r}deg) rotateY(calc(var(--mx) * ${sh.r * 2}deg))`, opacity: `calc(clamp(0, (${depth} + 2600) / 900, 1) * clamp(0, (560 - ${depth}) / 240, 1))` })}>
                <img src={imgs[i % imgs.length]} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </button>
            );
          })}
        </div>
        <p className="absolute bottom-8 w-full text-center text-[0.6rem] uppercase tracking-[0.4em] text-primary/60">Tap a photograph</p>
      </div>
    </section>
  );
}

function Lightbox({ index, onClose, onNav }: { index: number | null; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onNav(1); if (e.key === "ArrowLeft") onNav(-1); };
    window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [index, onClose, onNav]);
  if (index === null) return null;
  const imgs = config.images.gallery;
  return (
    <div role="dialog" aria-modal="true" aria-label="Photograph viewer" className="fixed inset-0 z-[60] grid animate-fade-in place-items-center bg-foreground/90 p-4 sm:backdrop-blur" onClick={onClose}>
      <img key={index} src={imgs[index]} alt={`Photograph ${index + 1}`} className="max-h-[82vh] max-w-full animate-scale-in border-8 border-background object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <Button variant="invitationOutline" size="icon" className="absolute right-4 top-4" onClick={onClose} aria-label="Close"><X /></Button>
      <Button variant="invitationOutline" size="icon" className="absolute left-4 top-1/2" onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Previous"><ChevronLeft /></Button>
      <Button variant="invitationOutline" size="icon" className="absolute right-4 top-1/2" onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Next"><ChevronRight /></Button>
      <p className="absolute bottom-6 text-xs tracking-[0.3em] text-background">{index + 1} / {imgs.length}</p>
    </div>
  );
}

/* ---------- scene 7: RSVP and farewell under the returning arch ---------- */
function Finale({ onShare }: { onShare: () => void }) {
  return (
    <Flow id="rsvp" className="min-h-[110vh] px-6 pb-24 pt-[16vh] sm:min-h-[130vh] sm:pt-[25vh]">
      <div className="preserve-3d relative mx-auto max-w-md text-center">
        <Drift z={-120} speed={40} tilt={0} className="pointer-events-none absolute left-1/2 top-0 w-[min(90vw,420px)] -translate-x-1/2">
          <Arch className="w-full opacity-60" />
        </Drift>
        <div className="relative pt-24">
          <Drift z={40}><Eyebrow>Will you join us?</Eyebrow></Drift>
          <Drift z={80} speed={80}>
            <h2 className="mt-6 font-display text-5xl text-primary sm:text-6xl">Bless us with your presence</h2>
            <p className="mt-4 text-sm text-muted-foreground">{config.rsvp.deadline}</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button asChild variant="invitation" size="lg"><a href={config.rsvp.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /> RSVP on WhatsApp</a></Button>
              <Button variant="invitationOutline" onClick={onShare}><Share2 /> Share invitation</Button>
            </div>
          </Drift>
          <Drift z={20} speed={20} tilt={6} className="mt-28">
            <Mandala className="mx-auto h-20 w-20" />
            <p className="mt-6 font-display text-4xl text-primary">Thank you</p>
            <p className="mt-2 text-sm text-muted-foreground">With love, {config.couple.bride} & {config.couple.groom}</p>
          </Drift>
        </div>
      </div>
    </Flow>
  );
}

/* ---------- floating controls & progress ---------- */
const NAV = [["home", "Welcome"], ["couple", "Couple"], ["story", "Story"], ["events", "Events"], ["venue", "Venue"], ["gallery", "Gallery"], ["rsvp", "RSVP"]] as const;

function Controls({ onShare, audioRef }: { onShare: () => void; audioRef: RefObject<HTMLAudioElement | null> }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.volume = 0.72;

    // Browsers may block audible autoplay. Try it first; if blocked, the
    // opening invitation tap below starts the same audio immediately.
    a.play().then(() => setOn(true)).catch(() => undefined);
  }, [audioRef]);

  const toggle = async () => {
    const a = audioRef.current; if (!a) return;
    if (!a.paused) { a.pause(); setOn(false); }
    else { await a.play().then(() => setOn(true)).catch(() => undefined); }
  };
  return (
    <>
      <div data-g className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-gradient-to-r from-gold via-primary to-gold" style={s({ transform: "scaleX(var(--g))" })} aria-hidden />
      <nav aria-label="Invitation chapters" className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-label={label} className="group flex items-center justify-end gap-2">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-primary opacity-0 transition-opacity group-hover:opacity-100">{label}</span>
            <span className="h-2 w-2 rotate-45 border border-gold transition-colors group-hover:bg-gold" />
          </a>
        ))}
      </nav>
      <div className="fixed left-3 top-3 z-40 flex gap-2">
        <Button variant="invitationOutline" size="icon" onClick={toggle} aria-label={on ? "Mute music" : "Play music"} aria-pressed={on}>{on ? <Volume2 /> : <VolumeX />}</Button>
        <Button variant="invitationOutline" size="icon" onClick={onShare} aria-label="Share invitation"><Share2 /></Button>
      </div>
      <Button asChild variant="invitation" className="fixed bottom-5 right-4 z-40 shadow-[var(--shadow-invitation)] active:scale-95"><a href="#rsvp">RSVP</a></Button>
      <audio ref={audioRef} loop preload="auto" autoPlay playsInline src="/wedding-song.mp3" />
    </>
  );
}

function Invitation() {
  useWorldMotion();
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [photo, setPhoto] = useState<number | null>(null);
  const n = config.images.gallery.length;

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  const share = async () => {
    const data = { title: config.social.shareTitle, text: config.social.shareText, url: window.location.href };
    if (navigator.share) await navigator.share(data).catch(() => undefined);
    else await navigator.clipboard?.writeText(data.url);
  };

  return (
    <main className="relative bg-background text-foreground">
      <World />
      {!opened && <Opening onOpen={() => {
        setOpened(true);
        // The opening button is a user gesture, so this also satisfies
        // mobile browser autoplay policies when they block initial autoplay.
        const a = audioRef.current;
        if (a) { a.currentTime = 0; a.play().catch(() => undefined); }
      }} />}
      <Controls onShare={share} audioRef={audioRef} />
      <Hero />
      <Couple />
      <Story />
      <Events />
      <Venue />
      <Gallery onOpen={setPhoto} />
      <Finale onShare={share} />
      <Lightbox index={photo} onClose={() => setPhoto(null)} onNav={(d) => setPhoto((p) => (p === null ? p : (p + d + n) % n))} />
    </main>
  );
}
