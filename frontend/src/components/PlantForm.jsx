// components/PlantForm.jsx
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Succulent', 'Cactus', 'Tropical', 'Fern', 'Palm', 'Herb', 'Orchid', 'Air Plant', 'Vine', 'Bromeliad', 'Carnivorous', 'Flowering', 'Other'];

export default function PlantForm({ plants, onSubmit, loading }) {
  const [selectedPlant, setSelectedPlant] = useState('');
  const [light, setLight] = useState('Medium');
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(50);
  const [wateringHabit, setWateringHabit] = useState(7);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Filter plants by search and category
  const filteredPlants = useMemo(() => {
    return plants.filter(p => {
      const matchSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.common_name && p.common_name.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === 'All' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [plants, search, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlant) return;
    onSubmit({
      plant_id: parseInt(selectedPlant),
      light,
      temperature: parseFloat(temperature),
      humidity: parseInt(humidity),
      watering_habit: parseInt(wateringHabit),
    });
  };

  const selectedPlantData = plants.find(p => p.id === parseInt(selectedPlant));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plant Selection */}
      <div className="glass-card rounded-2xl p-6 border border-forest-100 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-forest-900 mb-4 flex items-center gap-2">
          <span>🪴</span> Select Your Plant
        </h3>

        {/* Search + Filter row */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text"
              placeholder="Search plants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="select-wrapper w-36">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="select-field pr-8"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Plant Dropdown */}
        <div className="select-wrapper">
          <select
            value={selectedPlant}
            onChange={e => setSelectedPlant(e.target.value)}
            className="select-field pr-8"
            required
          >
            <option value="">— Choose a plant ({filteredPlants.length} available) —</option>
            {filteredPlants.map(p => (
              <option key={p.id} value={p.id}>
                {p.common_name || p.name} {p.common_name ? `(${p.name})` : ''} · {p.category}
              </option>
            ))}
          </select>
        </div>

        {/* Selected plant preview */}
        {selectedPlantData && (
          <div className="mt-3 p-3 bg-forest-50 rounded-xl border border-forest-100 animate-fade-in">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-forest-200 text-forest-800 px-2 py-0.5 rounded-full font-medium">
                {selectedPlantData.category}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${selectedPlantData.care_difficulty === 'Easy' ? 'bg-forest-100 text-forest-700' :
                  selectedPlantData.care_difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}`}>
                {selectedPlantData.care_difficulty}
              </span>
            </div>
            {selectedPlantData.description && (
              <p className="text-xs text-forest-600 mt-1 leading-relaxed">{selectedPlantData.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Environmental Conditions */}
      <div className="glass-card rounded-2xl p-6 border border-forest-100 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-forest-900 mb-5 flex items-center gap-2">
          <span>🌤️</span> Your Environment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Light Level */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              ☀️ Light Level
            </label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setLight(level)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all duration-150
                    ${light === level
                      ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                      : 'bg-white text-forest-700 border-forest-200 hover:bg-forest-50'
                    }`}
                >
                  {level === 'Low' ? '🌑' : level === 'Medium' ? '🌤️' : '☀️'} {level}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              🌡️ Temperature: <span className="font-bold text-forest-900">{temperature}°C</span>
            </label>
            <input
              type="range"
              min={-5} max={45} step={0.5}
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
              className="w-full accent-forest-600"
            />
            <div className="flex justify-between text-xs text-forest-400 mt-1">
              <span>-5°C</span><span>45°C</span>
            </div>
            <input
              type="number" min={-5} max={45} step={0.5}
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
              className="input-field mt-2 text-sm"
              placeholder="Enter °C"
            />
          </div>

          {/* Humidity */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              💧 Humidity: <span className="font-bold text-forest-900">{humidity}%</span>
            </label>
            <input
              type="range"
              min={10} max={100} step={1}
              value={humidity}
              onChange={e => setHumidity(e.target.value)}
              className="w-full accent-forest-600"
            />
            <div className="flex justify-between text-xs text-forest-400 mt-1">
              <span>10%</span><span>100%</span>
            </div>
            <input
              type="number" min={10} max={100}
              value={humidity}
              onChange={e => setHumidity(e.target.value)}
              className="input-field mt-2 text-sm"
              placeholder="Enter %"
            />
          </div>

          {/* Watering Habit */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              🪣 Watering: every <span className="font-bold text-forest-900">{wateringHabit}</span> day{wateringHabit > 1 ? 's' : ''}
            </label>
            <input
              type="range"
              min={1} max={60} step={1}
              value={wateringHabit}
              onChange={e => setWateringHabit(e.target.value)}
              className="w-full accent-forest-600"
            />
            <div className="flex justify-between text-xs text-forest-400 mt-1">
              <span>Daily</span><span>Every 60 days</span>
            </div>
            <input
              type="number" min={1} max={60}
              value={wateringHabit}
              onChange={e => setWateringHabit(e.target.value)}
              className="input-field mt-2 text-sm"
              placeholder="Days between watering"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !selectedPlant}
        className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200
          ${loading
            ? 'bg-forest-300 text-white cursor-wait'
            : !selectedPlant
              ? 'bg-forest-100 text-forest-400 cursor-not-allowed'
              : 'bg-forest-700 hover:bg-forest-800 text-white shadow-md hover:shadow-lg active:scale-98'
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Analyzing...
          </span>
        ) : '🌱 Generate Care Plan'}
      </button>
    </form>
  );
}
