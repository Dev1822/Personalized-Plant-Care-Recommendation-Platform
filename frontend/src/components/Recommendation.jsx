// components/RecommendationCard.jsx
import HealthScoreRing from './HealthScoreRing';

const STATUS_STYLES = {
  good: 'bg-forest-50 border-forest-200 text-forest-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const STATUS_BADGE = {
  good: 'bg-forest-100 text-forest-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

function RecommendationItem({ rec, index }) {
  return (
    <div
      className={`border rounded-xl p-4 animate-slide-up ${STATUS_STYLES[rec.status]}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5 flex-shrink-0">{rec.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[rec.status]}`}>
              {rec.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[rec.status]}`}>
              {rec.status === 'good' ? '✓ Good' : rec.status === 'info' ? 'ℹ Info' : '⚠ Adjust'}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug">{rec.message}</p>
          <p className="text-xs opacity-75 mt-1 leading-relaxed">{rec.detail}</p>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationCard({ analysis, onSave, saving, saved }) {
  const { plant, recommendations, healthScore, healthLabel, idealConditions } = analysis;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Plant Header Card */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-forest-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌿</span>
              <span className="text-xs font-medium bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
                {plant.category}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                ${plant.care_difficulty === 'Easy' ? 'bg-forest-100 text-forest-700' :
                  plant.care_difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}`}>
                {plant.care_difficulty}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-forest-900">{plant.common_name || plant.name}</h2>
            <p className="text-sm text-forest-600 italic">{plant.name}</p>
            {plant.description && (
              <p className="text-sm text-forest-700 mt-2 max-w-md leading-relaxed">{plant.description}</p>
            )}
          </div>
          <HealthScoreRing score={healthScore} label={healthLabel} />
        </div>

        {/* Ideal Conditions Strip */}
        <div className="mt-4 pt-4 border-t border-forest-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { label: 'Light', value: idealConditions.light, icon: '☀️' },
            { label: 'Temp', value: `${idealConditions.temperature_min}–${idealConditions.temperature_max}°C`, icon: '🌡️' },
            { label: 'Humidity', value: `${idealConditions.humidity}%`, icon: '💧' },
            { label: 'Water', value: `Every ${idealConditions.watering_frequency}d`, icon: '🪣' },
          ].map((item) => (
            <div key={item.label} className="bg-forest-50 rounded-xl p-2">
              <div className="text-base">{item.icon}</div>
              <div className="text-xs text-forest-500 font-medium">{item.label}</div>
              <div className="text-sm font-semibold text-forest-800">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-forest-100">
        <h3 className="font-display text-xl font-semibold text-forest-900 mb-4">Care Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <RecommendationItem key={rec.category} rec={rec} index={i} />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={saving || saved}
        className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200
          ${saved
            ? 'bg-forest-100 text-forest-700 cursor-default'
            : saving
              ? 'bg-forest-300 text-white cursor-wait'
              : 'bg-forest-700 hover:bg-forest-800 text-white shadow-md hover:shadow-lg active:scale-98'
          }`}
      >
        {saved ? '✅ Saved to My Plants!' : saving ? '💾 Saving...' : '💾 Save This Care Plan'}
      </button>
    </div>
  );
}