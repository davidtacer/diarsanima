const COLORS = ["stroke-sage", "stroke-moss", "stroke-bark", "stroke-sage", "stroke-moss"];

/** Curki barve (motiv iz njenih olj). Deterministični, rastejo ob nalaganju. */
export default function Drips({ count = 7, seed = 3, className = "" }: { count?: number; seed?: number; className?: string }) {
  let s = seed;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const w = 220;
  const step = w / count;
  const lines = Array.from({ length: count }, (_, i) => {
    const x = 10 + i * step + r() * 6;
    const len = 18 + Math.pow(r(), 1.3) * 66;
    const cls = i === 3 ? "stroke-ochre" : COLORS[Math.floor(r() * COLORS.length)];
    return { x, len, cls, width: 1.4 + r() * 1.6, delay: r() * 0.8 };
  });
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x}
          y1={0}
          x2={l.x}
          y2={l.len}
          strokeWidth={l.width}
          strokeLinecap="round"
          strokeDasharray={200}
          className={`${l.cls} animate-drip`}
          style={{ animationDelay: `${l.delay}s` }}
        />
      ))}
    </svg>
  );
}
