type ChartCardProps = {
  title: string;
  subtitle?: string;
  data: { month: string; income: number; expense: number }[];
};

// y-domain padded to max value, 4 ticks
function buildPath(values: number[], w: number, h: number, pad: number) {
  const max = Math.max(...values, 1);
  const top = pad;
  const bottom = h - pad;
  const range = bottom - top;
  const step = (w - pad * 2) / (values.length - 1);
  let d = `M${pad} ${bottom}`;
  values.forEach((v, i) => {
    const y = bottom - (v / max) * range;
    d += ` L${pad + i * step} ${y}`;
  });
  return { d, max };
}

export default function ChartCard({
  title,
  subtitle,
  data,
}: ChartCardProps) {
  const W = 736;
  const H = 200;
  const pad = 24;
  const inc = buildPath(data.map((d) => d.income), W, H, pad);
  const exp = buildPath(data.map((d) => d.expense), W, H, pad);
  const max = Math.max(inc.max, exp.max);
  const ticks = 4;
  const tickStep = max / ticks;

  return (
    <div className="bg-white rounded-xl p-6 border border-light shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-dark">{title}</h3>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-muted">Pemasukan</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-secondary"></span>
            <span className="text-muted">Pengeluaran</span>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="text-muted">
          {/* grid + y labels */}
          {Array.from({ length: ticks + 1 }).map((_, i) => {
            const y = H - pad - (i * (H - pad * 2)) / ticks;
            const val = Math.round(i * tickStep);
            return (
              <g key={i}>
                <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#e5e5e9" strokeWidth="1" />
                <text x={pad - 6} y={y + 4} textAnchor="end" fontSize="12">
                  {val.toLocaleString("id-ID")}
                </text>
              </g>
            );
          })}
          {/* x labels */}
          {data.map((d, i) => {
            const step = (W - pad * 2) / (data.length - 1);
            const x = pad + i * step;
            return (
              <text key={d.month} x={x} y={H - pad + 16} textAnchor="middle" fontSize="12">
                {d.month}
              </text>
            );
          })}
          {/* expense area gradient */}
          <defs>
            <linearGradient id="grad-exp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8686f8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#8686f8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad-inc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#aeaeae" stopOpacity="0.35" />
              <stop offset="1" stopColor="#aeaeae" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* expense area + line */}
          <path
            d={exp.d + ` L${W - pad} ${H - pad} L${pad} ${H - pad} Z`}
            fill="url(#grad-exp)"
          />
          <path d={exp.d} strokeWidth="2" stroke="#8686f8" fill="none" />
          {/* income area + line */}
          <path
            d={inc.d + ` L${W - pad} ${H - pad} L${pad} ${H - pad} Z`}
            fill="url(#grad-inc)"
          />
          <path d={inc.d} strokeWidth="2" stroke="#aeaeae" strokeDasharray="6 4" fill="none" />
        </svg>
      </div>
    </div>
  );
}
