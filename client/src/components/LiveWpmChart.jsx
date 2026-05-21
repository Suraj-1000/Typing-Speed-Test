import React from 'react';

/**
 * LiveWpmChart Component
 * Draws a real-time, responsive area chart of WPM over time using pure SVG.
 * Ensures zero extra dependency footprint and maximum performance.
 */
const LiveWpmChart = ({ wpmHistory }) => {
  if (!wpmHistory || wpmHistory.length < 2) {
    return null;
  }

  const width = 600;
  const height = 80;
  const paddingX = 10;
  const paddingY = 15;

  const maxWpm = Math.max(...wpmHistory, 80); // Anchor max to at least 80 WPM
  const minWpm = Math.min(...wpmHistory, 0);

  const getX = (index) => {
    return paddingX + (index / (wpmHistory.length - 1)) * (width - 2 * paddingX);
  };

  const getY = (val) => {
    const range = maxWpm - minWpm || 1;
    return height - paddingY - ((val - minWpm) / range) * (height - 2 * paddingY);
  };

  // Construct SVG path points
  const points = wpmHistory.map((val, idx) => ({ x: getX(idx), y: getY(val) }));

  // Generate cubic bezier curve commands for smoothing
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    // Control points for smooth bezier curve
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
    const cpY2 = p1.y;
    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Path for gradient area fill below the line
  const fillPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="w-full bg-[#16161b]/30 rounded-xl border border-white/5 p-4 flex flex-col gap-2 select-none">
      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
        <span>Real-Time WPM Graph</span>
        <span className="text-primary font-bold">Live Pace</span>
      </div>
      <div className="relative h-20 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255, 255, 255, 0.03)" strokeDasharray="4 4" />
          
          {/* Shaded Area */}
          <path d={fillPath} fill="url(#chartGlow)" />
          
          {/* Stroke Line */}
          <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_6px_rgba(167,139,250,0.5)]" />

          {/* Current position pulsing dot */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="4"
              className="fill-primary stroke-background stroke-2 animate-ping"
              style={{ transformOrigin: `${points[points.length - 1].x}px ${points[points.length - 1].y}px` }}
            />
          )}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="4.5"
              className="fill-primary stroke-background stroke-2"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default LiveWpmChart;
