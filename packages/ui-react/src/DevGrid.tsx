import { useEffect, useState } from 'react';

export interface DevGridProps {
  /** Initial visibility; user can toggle with Alt+Shift+G. */
  enabled?: boolean;
  /** Overlay column count. @defaultValue 12 */
  columns?: number;
  /** Space between columns, in CSS pixels. */
  gutterPx?: number;
  containerPx?: number;
}

interface Breakpoint {
  name: string;
  min: number;
}

const BP: Breakpoint[] = [
  { name: '2xl', min: 1536 },
  { name: 'xl', min: 1280 },
  { name: 'lg', min: 1024 },
  { name: 'md', min: 768 },
  { name: 'sm', min: 640 },
];

const colors: Record<string, string> = {
  base: '#a3a3a3',
  sm: '#93c5fd',
  md: '#60a5fa',
  lg: '#34d399',
  xl: '#fbbf24',
  '2xl': '#fb7185',
};

function currentBP(w: number): string {
  for (const b of BP) {
    if (w >= b.min) return b.name;
  }
  return 'base';
}

/**
 * DevGrid component - Development grid overlay for visualizing Tailwind breakpoints
 * 
 * @example
 * ```tsx
 * <DevGrid enabled={true} columns={12} />
 * ```
 */
export function DevGrid({
  enabled = true,
  columns = 12,
  gutterPx = 0,
  containerPx = 0,
}: DevGridProps) {
  const [isVisible, setIsVisible] = useState(enabled);
  const [bp, setBp] = useState('base');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    // Load saved state from localStorage
    const saved = localStorage.getItem('devgrid:on');
    if (saved === '1') setIsVisible(true);
    if (saved === '0') setIsVisible(false);
  }, []);

  useEffect(() => {
    const paint = () => {
      const w = Math.round(window.innerWidth);
      const h = Math.round(window.innerHeight);
      const deviceDpr = window.devicePixelRatio || 1;
      const breakpoint = currentBP(w);

      setBp(breakpoint);
      setSize({ width: w, height: h });
      setDpr(deviceDpr);
    };

    paint();

    let raf: number;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const g = e.key.toLowerCase() === 'g';
      if (g && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsVisible((prev) => {
          const next = !prev;
          localStorage.setItem('devgrid:on', next ? '1' : '0');
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVisible((prev) => {
      const next = !prev;
      localStorage.setItem('devgrid:on', next ? '1' : '0');
      return next;
    });
  };

  const cols = Array.from({ length: columns }, (_, i) => i);

  return (
    <div
      className="dg-overlay"
      aria-hidden="true"
      style={{
        isolation: 'isolate',
        position: 'fixed', inset: 0, zIndex: 2147483600,
        pointerEvents: 'none', userSelect: 'none',
        display: isVisible ? 'block' : 'none',
        '--dg-color': '255 0 0',
        '--dg-border': 'rgba(var(--dg-color) / 0.35)',
        '--dg-fill': 'rgba(var(--dg-color) / 0.1)',
        '--dg-badge-bg': 'rgba(0 0 0 / 0.65)',
        '--dg-badge-fg': '#fff',
      } as React.CSSProperties}
    >
      {/* Optional container frame */}
      <div
        className="dg-container"
        style={{ position:'absolute', inset:0, height:'100%', marginInline:'auto', width:'100%', ...(containerPx > 0 ? { maxWidth: `${containerPx}px` } : {}) }}
      >
        <div
          className="dg-frame"
          style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column', minHeight:'100%',
            padding: 'max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left))',
          }}
        >
          {/* Top ruler */}
          <div
            className="dg-ruler"
            style={{
              width:'100%', height:24, marginBottom:8, borderRadius:4, flexShrink:0,
              background: 'repeating-linear-gradient(to right, rgba(255 255 255 / 0.15) 0 1px, transparent 1px 8px)',
            }}
          />

          {/* The grid */}
          <div
            className="dg-columns"
            style={{
              display:'grid', flex:1, minHeight:0,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: `${gutterPx}px`,
            }}
          >
            {cols.map((i) => (
              <div
                key={i}
                className="dg-col"
                style={{
                  position:'relative', outline: '1px solid var(--dg-border)',
                  backgroundImage: 'linear-gradient(to bottom, var(--dg-fill), transparent 55%)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                }}
              >
                <div className="dg-column-label" style={{position:"absolute",top:4,left:4,fontSize:10,color:"rgba(255,255,255,.7)"}}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corner badge */}
      <div
        className="dg-badge"
        style={{
          position:'fixed', zIndex:2147483601, pointerEvents:'auto',
          left: 'max(10px, env(safe-area-inset-left))',
          bottom: 'max(10px, env(safe-area-inset-bottom))',
        }}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="dg-toggle"
          style={{
            display:'inline-flex', alignItems:'center', gap:8, borderRadius:4, padding:'8px 12px', border:'1px solid rgba(255,255,255,.1)',
            font: '600 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            color: 'var(--dg-badge-fg)',
            background: 'var(--dg-badge-bg)',
            backdropFilter: 'blur(6px)',
          }}
          title="Alt + Shift + G to toggle"
        >
          <span
            className="dg-breakpoint-dot"
            style={{ width:8,height:8,borderRadius:'50%', background: colors[bp] || '#a3a3a3' }}
          />
          <span>{bp}</span>
          <span aria-hidden="true">•</span>
          <span>{size.width}×{size.height}</span>
          <span aria-hidden="true">•</span>
          <span>@{dpr.toFixed(2).replace(/\.00$/, '')}x</span>
        </button>
      </div>
    </div>
  );
}
