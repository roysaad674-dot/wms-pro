/* global React */
// Lightweight inline-SVG chart components (sparkline, area, donut, bar)

function Sparkline({ data, width = 96, height = 28, color = 'var(--brand)', fill = true }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - 2 - ((v - min) / range) * (height - 4)]);
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = path + ` L ${width},${height} L 0,${height} Z`;
  const gid = 'sg' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="spark">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AreaChart({ series, height = 240, colors = ['var(--brand)', 'var(--c-info)'], labels = [], xLabels = [] }) {
  // series: [[..],[..]]
  const padL = 38, padR = 10, padT = 16, padB = 26;
  const ref = React.useRef(null);
  const [w, setW] = React.useState(640);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(en => setW(en[0].contentRect.width));
    ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  const innerW = w - padL - padR, innerH = height - padT - padB;
  const all = series.flat();
  const max = Math.max(...all) * 1.15;
  const min = 0;
  const range = max - min || 1;
  const n = series[0]?.length || 0;
  const xStep = innerW / (n - 1);

  const ticks = 4;
  const gridY = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);

  const mkPath = arr => arr.map((v, i) => {
    const x = padL + i * xStep, y = padT + innerH - ((v - min) / range) * innerH;
    return (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  const mkArea = arr => mkPath(arr) + ` L ${padL + (n - 1) * xStep},${padT + innerH} L ${padL},${padT + innerH} Z`;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={height}>
        <defs>
          {series.map((_, i) => (
            <linearGradient key={i} id={'ag' + i} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[i]} stopOpacity="0.18" />
              <stop offset="100%" stopColor={colors[i]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {gridY.map((g, i) => {
          const y = padT + innerH - (g / range) * innerH;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
              <text x={padL - 8} y={y + 3} fontSize="10" textAnchor="end" fill="var(--text-3)" fontVariant="tabular-nums">
                ${g >= 1000 ? (g / 1000).toFixed(0) + 'k' : g.toFixed(0)}
              </text>
            </g>
          );
        })}
        {xLabels.map((lbl, i) => {
          if (i % Math.ceil(n / 8) !== 0) return null;
          const x = padL + i * xStep;
          return <text key={i} x={x} y={height - 8} fontSize="10" textAnchor="middle" fill="var(--text-3)">{lbl}</text>;
        })}
        {series.map((s, i) => (
          <g key={i}>
            <path d={mkArea(s)} fill={`url(#ag${i})`} />
            <path d={mkPath(s)} fill="none" stroke={colors[i]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      {labels.length > 0 && (
        <div className="row gap-3" style={{ marginTop: 4, paddingLeft: padL, flexWrap: 'wrap' }}>
          {labels.map((l, i) => (
            <div key={i} className="row gap-2" style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: colors[i] }} />
              <span>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Donut({ data, size = 160, thickness = 26 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  let acc = 0;
  return (
    <div className="row gap-4" style={{ alignItems: 'center' }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} stroke="var(--bg-sub)" strokeWidth={thickness} fill="none" />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = 2 * Math.PI * r;
          const off = dash * (1 - frac);
          const rot = (acc / total) * 360 - 90;
          acc += d.value;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              stroke={d.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={`${dash * frac} ${dash}`}
              transform={`rotate(${rot} ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          );
        })}
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text)" fontVariant="tabular-nums" letterSpacing="-0.02em">
          {total}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--text-3)">in stock</text>
      </svg>
      <div className="col gap-2" style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} className="row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
            <div className="row gap-2">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
              <span style={{ color: 'var(--text-2)' }}>{d.cat}</span>
            </div>
            <span style={{ color: 'var(--text)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, height = 220 }) {
  // data: [{label, value}]
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  return (
    <div className="col gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="row gap-3" style={{ alignItems: 'center' }}>
          <div style={{ width: 130, fontSize: 12, color: 'var(--text-2)', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</div>
          <div style={{ flex: 1, height: 16, background: 'var(--bg-sub)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: ((d.value / max) * 100) + '%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--brand), color-mix(in oklch, var(--brand), var(--c-violet) 50%))',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ width: 80, fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
            ${(d.value).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

window.Sparkline = Sparkline;
window.AreaChart = AreaChart;
window.Donut = Donut;
window.BarChart = BarChart;
