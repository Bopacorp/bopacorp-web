import { cn } from '@/lib/utils';

const CONTOUR_BASE =
  'M0,-170 C70,-170 130,-130 160,-70 C190,-10 170,60 110,90 ' +
  'C50,120 -40,120 -100,90 C-160,60 -180,-10 -150,-70 ' +
  'C-120,-130 -70,-170 0,-170 Z';
const CONTOUR_SCALES = [0.34, 0.5, 0.68, 0.88, 1.1, 1.34];

export function ContourMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      fill="none"
      className={cn('pointer-events-none select-none', className)}
    >
      <g transform="translate(300 300)">
        {CONTOUR_SCALES.map((scale, i) => (
          <path
            key={scale}
            d={CONTOUR_BASE}
            transform={`rotate(${scale * 6}) scale(${scale})`}
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity={0.9 - i * 0.13}
          />
        ))}
      </g>
    </svg>
  );
}

export function BlueprintGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('blueprint-grid pointer-events-none absolute inset-0', className)}
    />
  );
}

export function SignalDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('signal-dot size-1.5 rounded-full bg-primary text-primary', className)}
    />
  );
}
