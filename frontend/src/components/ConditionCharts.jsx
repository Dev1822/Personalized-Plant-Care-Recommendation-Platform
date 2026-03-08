// components/ConditionCharts.jsx
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const LIGHT_MAP = { Low: 1, Medium: 2, High: 3 };

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-forest-900 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function ConditionCharts({ analysis }) {
  const { userConditions, idealConditions } = analysis;

  // Bar chart data: Temperature, Humidity, Watering
  const barData = [
    {
      name: 'Temp Min (°C)',
      Your: userConditions.temperature,
      'Ideal Min': parseFloat(idealConditions.temperature_min),
      'Ideal Max': parseFloat(idealConditions.temperature_max),
    },
    {
      name: 'Humidity (%)',
      Your: userConditions.humidity,
      Ideal: idealConditions.humidity,
    },
    {
      name: 'Water (days)',
      Your: userConditions.watering_habit,
      Ideal: idealConditions.watering_frequency,
    },
  ];

  // Separate charts for clarity
  const tempData = [
    { name: 'Your Temp', value: userConditions.temperature, fill: '#f97316' },
    { name: 'Ideal Min', value: parseFloat(idealConditions.temperature_min), fill: '#86efac' },
    { name: 'Ideal Max', value: parseFloat(idealConditions.temperature_max), fill: '#22c55e' },
  ];

  const humidData = [
    { name: 'Your Humidity', value: userConditions.humidity, fill: '#60a5fa' },
    { name: 'Ideal', value: idealConditions.humidity, fill: '#22c55e' },
  ];

  const waterData = [
    { name: 'Your Schedule', value: userConditions.watering_habit, fill: '#60a5fa' },
    { name: 'Ideal', value: idealConditions.watering_frequency, fill: '#22c55e' },
  ];

  // Radar chart: normalized 0-100 values for each condition
  const userLightNum = (LIGHT_MAP[userConditions.light] || 2) / 3 * 100;
  const idealLightNum = (LIGHT_MAP[idealConditions.light] || 2) / 3 * 100;

  const tempRange = idealConditions.temperature_max - idealConditions.temperature_min;
  const tempMid = (idealConditions.temperature_max + idealConditions.temperature_min) / 2;
  const userTempScore = Math.max(0, 100 - Math.abs(userConditions.temperature - tempMid) / (tempRange / 2) * 50);
  const idealTempScore = 100;

  const humidScore = (val) => Math.max(0, 100 - Math.abs(val - idealConditions.humidity) / idealConditions.humidity * 100);
  const waterScore = (val) => Math.max(0, 100 - Math.abs(val - idealConditions.watering_frequency) / idealConditions.watering_frequency * 100);

  const radarData = [
    { subject: 'Light', You: userLightNum, Ideal: idealLightNum, fullMark: 100 },
    { subject: 'Temperature', You: userTempScore, Ideal: idealTempScore, fullMark: 100 },
    { subject: 'Humidity', You: humidScore(userConditions.humidity), Ideal: 100, fullMark: 100 },
    { subject: 'Watering', You: waterScore(userConditions.watering_habit), Ideal: 100, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
      {/* Radar Overview */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-forest-100">
        <h3 className="font-display text-lg text-forest-900 mb-4 font-semibold">Condition Overview</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#bbf7d0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Ideal" dataKey="Ideal" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="You" dataKey="You" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
            <Legend
              iconType="circle"
              formatter={(val) => <span style={{ color: '#15803d', fontFamily: 'DM Sans', fontSize: 12 }}>{val}</span>}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature Chart */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-forest-100">
        <h3 className="font-display text-lg text-forest-900 mb-4 font-semibold">Temperature (°C)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={tempData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <YAxis tick={{ fontSize: 11, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {tempData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity Chart */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-forest-100">
        <h3 className="font-display text-lg text-forest-900 mb-4 font-semibold">Humidity (%)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={humidData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {humidData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Watering Chart */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-forest-100">
        <h3 className="font-display text-lg text-forest-900 mb-4 font-semibold">Watering Frequency (days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={waterData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <YAxis tick={{ fontSize: 11, fill: '#15803d', fontFamily: 'DM Sans' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {waterData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
