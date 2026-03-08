// components/HealthScoreRing.jsx
import { useEffect, useRef } from 'react';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score) {
  if (score >= 85) return { stroke: '#16a34a', text: '#14532d', bg: '#dcfce7' };
  if (score >= 70) return { stroke: '#65a30d', text: '#365314', bg: '#ecfccb' };
  if (score >= 50) return { stroke: '#d97706', text: '#78350f', bg: '#fef3c7' };
  return { stroke: '#dc2626', text: '#7f1d1d', bg: '#fee2e2' };
}

export default function HealthScoreRing({ score, label }) {
  const progressRef = useRef(null);
  const colors = getScoreColor(score);
  const targetOffset = CIRCUMFERENCE * (1 - score / 100);

  useEffect(() => {
    if (!progressRef.current) return;
    // Start from full (empty) then animate to target
    progressRef.current.style.strokeDashoffset = CIRCUMFERENCE;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressRef.current.style.strokeDashoffset = targetOffset;
      });
    });
  }, [score, targetOffset]);

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="#e5f5e5"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <circle
            ref={progressRef}
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            transform="rotate(-90 50 50)"
            className="score-ring-progress"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
          {/* Score text */}
          <text
            x="50" y="46"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.text}
            fontSize="20"
            fontWeight="700"
            fontFamily="'DM Sans', sans-serif"
          >
            {score}
          </text>
          <text
            x="50" y="62"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.text}
            fontSize="8"
            fontFamily="'DM Sans', sans-serif"
            opacity="0.7"
          >
            / 100
          </text>
        </svg>
      </div>
      <div
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {label}
      </div>
    </div>
  );
}
