// App.jsx - PlantPal main application
import { useState, useEffect } from 'react';
import PlantForm from './components/PlantForm';
import RecommendationCard from './components/RecommendationCard';
import ConditionCharts from './components/ConditionCharts';
import MyPlants from './components/MyPlants';
import { api } from './utils/api';

const TABS = [
  { id: 'analyze', label: 'Analyze', icon: '🔍' },
  { id: 'myplants', label: 'My Plants', icon: '🪴' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);
  const [refreshMyPlants, setRefreshMyPlants] = useState(0);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'ok' | 'error' | 'checking'

  // Load plants and check backend health on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [plantsData] = await Promise.all([
          api.getPlants(),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/health`).then(r => r.ok ? 'ok' : 'error').catch(() => 'error')
        ]);
        setPlants(plantsData.plants || []);
        setBackendStatus('ok');
      } catch (err) {
        setPlantsError(err.message);
        setBackendStatus('error');
      } finally {
        setPlantsLoading(false);
      }
    };
    init();
  }, []);

  const handleAnalyze = async (formData) => {
    setAnalyzing(true);
    setAnalyzeError(null);
    setAnalysis(null);
    setSaved(false);
    setSavedPayload(formData);

    try {
      const data = await api.analyze(formData);
      setAnalysis(data.analysis);
      // Scroll to results
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setAnalyzeError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!savedPayload || saving || saved) return;
    setSaving(true);
    try {
      await api.saveUserPlant(savedPayload);
      setSaved(true);
      setRefreshMyPlants(n => n + 1);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-forest-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center text-lg shadow-sm">
              🌿
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-forest-900 leading-tight">PlantPal</h1>
              <p className="text-xs text-forest-500 leading-tight hidden sm:block">Personalized Plant Care</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex gap-1 bg-forest-50 rounded-xl p-1 border border-forest-100">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${activeTab === tab.id
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'text-forest-600 hover:text-forest-800 hover:bg-white'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Backend status */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              backendStatus === 'ok' ? 'bg-forest-400 animate-pulse-slow' :
              backendStatus === 'error' ? 'bg-red-400' : 'bg-amber-300 animate-pulse'
            }`} />
            <span className="text-forest-400 hidden sm:inline">
              {backendStatus === 'ok' ? 'Connected' : backendStatus === 'error' ? 'Offline' : '...'}
            </span>
          </div>
        </div>
      </header>

      {/* Backend Error Banner */}
      {backendStatus === 'error' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
          ⚠️ Backend not connected. Start the server: <code className="bg-amber-100 px-1 rounded font-mono">cd backend && node server.js</code>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
            {/* Left: Form */}
            <div>
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold text-forest-900">
                  Find Your Plant's<br />
                  <span className="text-forest-600 italic">Perfect Care Routine</span>
                </h2>
                <p className="text-sm text-forest-600 mt-2 leading-relaxed">
                  Tell us about your plant and environment — we'll generate personalized recommendations and a health score.
                </p>
              </div>

              {plantsLoading ? (
                <div className="glass-card rounded-2xl p-12 text-center border border-forest-100">
                  <div className="flex items-center justify-center gap-2 text-forest-500">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Loading plant database...
                  </div>
                </div>
              ) : plantsError ? (
                <div className="glass-card rounded-2xl p-8 text-center border border-red-100">
                  <div className="text-4xl mb-3">🚫</div>
                  <p className="text-red-600 font-medium">Failed to load plants</p>
                  <p className="text-sm text-red-400 mt-1">{plantsError}</p>
                  <p className="text-xs text-forest-500 mt-3">Make sure your backend is running on port 3001.</p>
                </div>
              ) : (
                <PlantForm
                  plants={plants}
                  onSubmit={handleAnalyze}
                  loading={analyzing}
                />
              )}

              {analyzeError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fade-in">
                  ⚠️ {analyzeError}
                </div>
              )}
            </div>

            {/* Right: Results */}
            <div id="results">
              {!analysis && !analyzing && (
                <div className="glass-card rounded-2xl p-12 text-center border border-forest-100 border-dashed">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="font-display text-xl text-forest-700 font-semibold mb-2">
                    Your care plan will appear here
                  </h3>
                  <p className="text-sm text-forest-500 leading-relaxed max-w-xs mx-auto">
                    Select a plant, enter your conditions, and generate a personalized recommendation.
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    {[
                      { icon: '💯', label: 'Health Score' },
                      { icon: '📊', label: 'Visual Charts' },
                      { icon: '🎯', label: 'Care Tips' },
                    ].map(f => (
                      <div key={f.label} className="bg-forest-50 rounded-xl p-3 border border-forest-100">
                        <div className="text-2xl mb-1">{f.icon}</div>
                        <div className="text-xs text-forest-600 font-medium">{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="glass-card rounded-2xl p-12 text-center border border-forest-100 animate-pulse-slow">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-forest-600 font-medium">Analyzing conditions...</p>
                  <p className="text-sm text-forest-400 mt-1">Comparing with ideal care data</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  <RecommendationCard
                    analysis={analysis}
                    onSave={handleSave}
                    saving={saving}
                    saved={saved}
                  />
                  <ConditionCharts analysis={analysis} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Plants Tab */}
        {activeTab === 'myplants' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-3xl font-bold text-forest-900">My Plant Collection</h2>
              <p className="text-sm text-forest-600 mt-1">All your saved care plans in one place.</p>
            </div>
            <MyPlants refreshTrigger={refreshMyPlants} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-forest-100 py-6 text-center text-xs text-forest-400">
        <p>🌿 PlantPal · Powered by a database of 200+ plant species</p>
        <p className="mt-1 font-mono text-forest-300">
          Frontend: Vite + React + Tailwind · Backend: Node.js + Express · DB: MySQL
        </p>
      </footer>
    </div>
  );
}
