// components/MyPlants.jsx
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

function ScoreBadge({ score }) {
  const color = score >= 85 ? 'bg-forest-100 text-forest-700' :
                score >= 70 ? 'bg-lime-100 text-lime-700' :
                score >= 50 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700';
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
      {score}/100
    </span>
  );
}

export default function MyPlants({ refreshTrigger }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await api.getUserPlants();
        setPlants(data.user_plants || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshTrigger]);

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-forest-400">
      <div className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Loading your plants...
      </div>
    </div>
  );

  if (error) return (
    <div className="glass-card rounded-2xl p-6 text-center border border-red-100 text-red-600">
      <p className="text-sm">⚠️ {error}</p>
      <p className="text-xs text-red-400 mt-1">Make sure the backend is running.</p>
    </div>
  );

  if (!plants.length) return (
    <div className="glass-card rounded-2xl p-12 text-center border border-forest-100">
      <div className="text-5xl mb-4">🌱</div>
      <h3 className="font-display text-xl text-forest-700 font-semibold">No plants saved yet</h3>
      <p className="text-sm text-forest-500 mt-2">Generate a care plan and save it to see your plants here.</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-forest-500">{plants.length} plant{plants.length !== 1 ? 's' : ''} saved</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plants.map((up, i) => (
          <div
            key={up.id}
            className="glass-card rounded-2xl p-5 border border-forest-100 shadow-sm animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h4 className="font-display font-semibold text-forest-900">{up.common_name || up.name}</h4>
                <p className="text-xs text-forest-500 italic">{up.name}</p>
              </div>
              <ScoreBadge score={up.health_score || 0} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Light', value: up.light, icon: '☀️' },
                { label: 'Temp', value: `${up.temperature}°C`, icon: '🌡️' },
                { label: 'Humidity', value: `${up.humidity}%`, icon: '💧' },
                { label: 'Watering', value: `Every ${up.watering_habit}d`, icon: '🪣' },
              ].map(item => (
                <div key={item.label} className="bg-forest-50 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  <div>
                    <div className="text-forest-400 text-xs leading-none">{item.label}</div>
                    <div className="text-forest-800 font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-forest-400">
              <span className={`px-2 py-0.5 rounded-full font-medium
                ${up.care_difficulty === 'Easy' ? 'bg-forest-100 text-forest-600' :
                  up.care_difficulty === 'Moderate' ? 'bg-amber-100 text-amber-600' :
                  'bg-red-100 text-red-600'}`}>
                {up.care_difficulty}
              </span>
              <span>{new Date(up.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
