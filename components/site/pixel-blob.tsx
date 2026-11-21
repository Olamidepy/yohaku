/**
 * A field of square "pixels" shaped like a soft blob, drawn as one SVG.
 * Deterministic (seeded), so server and client render the same thing.
 */
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function PixelBlob({
  cols = 14,
  rows = 12,
  seed = 7,
  fill = "#000",
  density = 0.55,
  centers = [[0.55, 0.5, 0.42]],
  animate = true,
  className,
}: {
  cols?: number;
  rows?: number;
  seed?: number;
  fill?: string;
  density?: number;
  /** Blob centres as [x, y, radius] in 0..1 units. */
  centers?: [number, number, number][];
  animate?: boolean;
  className?: string;
}) {
  const r = rand(seed);
  const cells: { x: number; y: number; d: number }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const u = (x + 0.5) / cols;
      const v = (y + 0.5) / rows;
      let f = 0;
      for (const [cx, cy, cr] of centers) {
        const dx = (u - cx) / cr;
        const dy = (v - cy) / cr;
        f = Math.max(f, 1 - Math.sqrt(dx * dx + dy * dy));
      }
      if (f + (r() - 0.5) * 0.45 > 1 - density) cells.push({ x, y, d: Math.round(r() * 900) });
    }
  }
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x}
          y={c.y}
          width={1.02}
          height={1.02}
          fill={fill}
          className={animate ? "px-cell" : undefined}
          style={animate ? ({ "--d": `${c.d}ms` } as React.CSSProperties) : undefined}
        />
      ))}
    </svg>
  );
}

/** A mosaic of greys, like an image zoomed until it breaks into blocks. */
export function PixelMosaic({ cols = 8, rows = 8, seed = 3, className }: { cols?: number; rows?: number; seed?: number; className?: string }) {
  const r = rand(seed);
  const tones = ["#000", "#000", "#ffffff", "#ffffff", "#ffffff", "#d9d9d9", "#a8a8a8", "#6e6e6e"];
  const cells = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) cells.push({ x, y, t: tones[Math.floor(r() * tones.length)], d: Math.round(r() * 800) });
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={1.02} height={1.02} fill={c.t} className="px-cell" style={{ "--d": `${c.d}ms` } as React.CSSProperties} />
      ))}
    </svg>
  );
}
