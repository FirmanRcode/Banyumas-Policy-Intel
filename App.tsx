import React, { useState, useEffect } from 'react';
import { DATASET } from './constants';
import { DistrictData, SimulationState, TabView } from './types';
import MapComponent from './components/MapComponent';
import SimulationPanel from './components/SimulationPanel';
import ComparisonPanel from './components/ComparisonPanel';
import { ForecastChart } from './components/Charts';
import { generateStrategicAnalysis, getBudgetRecommendation, chatWithAI } from './services/geminiService';
import { 
    LayoutDashboard, 
    TrendingUp, 
    Scale, 
    FileText, 
    Bot, 
    ChevronRight, 
    MapPin,
    Send,
    X,
    Banknote,
    ArrowRightLeft,
    Download
} from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

function App() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.SIMULATION);
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  
  // AI States
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  
  // Budget Modal
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(10); // Miliar
  const [budgetGoal, setBudgetGoal] = useState("Penurunan Kemiskinan Agresif");
  const [budgetResult, setBudgetResult] = useState<any>(null);
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);

  const selectedDistrict = DATASET.find(d => d.id === selectedDistrictId);

  useEffect(() => {
    if (selectedDistrict) {
      setSimulationState({
        healthFacilities: selectedDistrict.healthFacilities,
        schools: selectedDistrict.schools,
        umkm: selectedDistrict.umkm,
        roadQuality: selectedDistrict.roadQuality,
      });
      setAiAnalysis(""); 
      setBudgetResult(null);
      // Reset tab to simulation when selecting a new district unless we are in comparison mode, 
      // but generally good UX to reset or keep. Let's keep current tab if valid, else reset.
      if (activeTab === TabView.DETAILS && !aiAnalysis) {
          // optional: could reset tab
      }
    }
  }, [selectedDistrictId]);

  const handleResetSimulation = () => {
    if (selectedDistrict) {
      setSimulationState({
        healthFacilities: selectedDistrict.healthFacilities,
        schools: selectedDistrict.schools,
        umkm: selectedDistrict.umkm,
        roadQuality: selectedDistrict.roadQuality,
      });
    }
  };

  const handleExportCSV = () => {
    if (!selectedDistrict) return;

    // Flatten historical poverty for CSV columns
    const historicalHeaders = selectedDistrict.historicalPoverty.map(h => `Poverty ${h.year} (%)`).join(',');
    const historicalValues = selectedDistrict.historicalPoverty.map(h => h.rate).join(',');

    const headers = `ID,Name,Population,Poverty Rate (%),Health Facilities,Schools,UMKM,Road Quality (%),${historicalHeaders}`;
    const values = `${selectedDistrict.id},"${selectedDistrict.name}",${selectedDistrict.population},${selectedDistrict.povertyRate},${selectedDistrict.healthFacilities},${selectedDistrict.schools},${selectedDistrict.umkm},${selectedDistrict.roadQuality},${historicalValues}`;

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + "\n" + values);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${selectedDistrict.name}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runAnalysis = async () => {
    if (!selectedDistrict) return;
    setIsAnalyzing(true);
    const result = await generateStrategicAnalysis(selectedDistrict);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const runBudgetCalc = async () => {
    if (!selectedDistrict) return;
    setIsBudgetLoading(true);
    const result = await getBudgetRecommendation(selectedDistrict, budgetAmount * 1000000000, budgetGoal);
    setBudgetResult(result);
    setIsBudgetLoading(false);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', parts: [{ text: chatInput }] };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput("");
    setIsChatting(true);

    try {
        const stream = await chatWithAI(newHistory, chatInput);
        let fullText = "";
        const modelMsgIndex = newHistory.length; 
        // Optimistic update
        setChatHistory([...newHistory, { role: 'model', parts: [{ text: "..." }] }]);

        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                fullText += c.text;
                setChatHistory(prev => {
                    const updated = [...prev];
                    updated[modelMsgIndex] = { role: 'model', parts: [{ text: fullText }] };
                    return updated;
                });
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsChatting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-20 px-4 md:px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-none">Banyumas Policy Intel</h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">Platform Intelijen Kebijakan Berbasis Data & AI</p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${showChat ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                <Bot size={16} />
                <span className="hidden md:inline">{showChat ? 'Tutup Asisten' : 'Asisten AI'}</span>
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Panel: Map */}
        <div className={`relative transition-all duration-500 ease-in-out ${selectedDistrict ? 'lg:w-7/12 h-[40vh] lg:h-full' : 'w-full h-full'}`}>
          <MapComponent 
            data={DATASET} 
            selectedDistrictId={selectedDistrictId} 
            onSelectDistrict={setSelectedDistrictId} 
          />
          {!selectedDistrict && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none z-[400]">
                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50 animate-bounce-slow">
                    <MapPin className="text-blue-500" />
                    <span className="text-slate-700 font-medium">Pilih kecamatan pada peta untuk memulai analisis</span>
                </div>
             </div>
          )}
        </div>

        {/* Right Panel: Dashboard */}
        {selectedDistrict && simulationState && (
          <div className="flex-1 lg:w-5/12 h-full bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-2xl z-10 animate-slide-in-right">
             {/* Panel Header */}
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedDistrict.name}</h2>
                    <div className="flex gap-4 text-xs md:text-sm text-slate-500 mt-1">
                        <span>Pop: {(selectedDistrict.population / 1000).toFixed(1)}k</span>
                        <span className="w-px h-4 bg-slate-300"></span>
                        <span>Kemiskinan: <span className="font-semibold text-slate-800">{selectedDistrict.povertyRate}%</span></span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleExportCSV} 
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors" 
                        title="Export Data CSV"
                    >
                        <Download size={20} />
                    </button>
                    <button onClick={() => setSelectedDistrictId(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
             </div>

             {/* Tabs */}
             <div className="flex border-b border-slate-200 px-6 gap-4 md:gap-6 shrink-0 overflow-x-auto">
                <TabButton active={activeTab === TabView.SIMULATION} onClick={() => setActiveTab(TabView.SIMULATION)} label="Simulasi" icon={<Scale size={16} />} />
                <TabButton active={activeTab === TabView.FORECAST} onClick={() => setActiveTab(TabView.FORECAST)} label="Peramalan" icon={<TrendingUp size={16} />} />
                <TabButton active={activeTab === TabView.COMPARISON} onClick={() => setActiveTab(TabView.COMPARISON)} label="Bandingkan" icon={<ArrowRightLeft size={16} />} />
                <TabButton active={activeTab === TabView.DETAILS} onClick={() => setActiveTab(TabView.DETAILS)} label="Analisis AI" icon={<FileText size={16} />} />
             </div>

             {/* Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                
                {/* Content: Simulation */}
                {activeTab === TabView.SIMULATION && (
                    <div className="space-y-6">
                        <SimulationPanel 
                            district={selectedDistrict} 
                            simulationState={simulationState} 
                            setSimulationState={setSimulationState}
                            onReset={handleResetSimulation}
                        />
                        <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-violet-900">Asisten Anggaran</h4>
                                    <p className="text-xs text-violet-600">Dapatkan rekomendasi alokasi optimal dari AI</p>
                                </div>
                                <button 
                                    onClick={() => setShowBudgetModal(true)}
                                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex gap-2 items-center shadow-sm shadow-violet-200"
                                >
                                    <Banknote size={16} /> Optimalkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content: Forecast */}
                {activeTab === TabView.FORECAST && (
                    <div className="animate-fade-in">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Tren Kemiskinan</h3>
                        <p className="text-sm text-slate-500 mb-4">Proyeksi 3 tahun ke depan berdasarkan data historis (tanpa intervensi).</p>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <ForecastChart data={selectedDistrict} />
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
                            <span className="font-bold block mb-1">Insight:</span>
                            Kecamatan ini menunjukkan tren {selectedDistrict.historicalPoverty[selectedDistrict.historicalPoverty.length-1].rate < selectedDistrict.historicalPoverty[0].rate ? 'penurunan' : 'kenaikan'} kemiskinan sebesar {Math.abs(selectedDistrict.historicalPoverty[selectedDistrict.historicalPoverty.length-1].rate - selectedDistrict.historicalPoverty[0].rate).toFixed(1)}% dalam 5 tahun terakhir.
                        </div>
                    </div>
                )}

                {/* Content: Comparison */}
                {activeTab === TabView.COMPARISON && (
                    <ComparisonPanel 
                        baseDistrict={selectedDistrict} 
                        allDistricts={DATASET} 
                    />
                )}

                {/* Content: AI Analysis */}
                {activeTab === TabView.DETAILS && (
                    <div className="animate-fade-in space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Analisis Strategis</h3>
                            <button 
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="text-sm bg-rose-500 text-white px-3 py-1.5 rounded-md hover:bg-rose-600 disabled:opacity-50 shadow-sm"
                            >
                                {isAnalyzing ? 'Menganalisis...' : 'Generate Analisis Baru'}
                            </button>
                        </div>
                        
                        {aiAnalysis ? (
                            <div className="prose prose-sm max-w-none prose-slate bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                <Bot className="mx-auto text-slate-300 mb-2" size={48} />
                                <p className="text-slate-500 text-sm">Klik tombol di atas untuk meminta AI menganalisis data kecamatan ini.</p>
                            </div>
                        )}
                    </div>
                )}
             </div>
          </div>
        )}
      </main>

      {/* Chat Overlay */}
      {showChat && (
          <div className="fixed bottom-4 right-4 w-[90vw] md:w-96 h-[60vh] md:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 z-50 animate-slide-up">
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-4 rounded-t-2xl flex justify-between items-center text-white shrink-0">
                  <div className="flex items-center gap-2">
                      <Bot size={20} />
                      <span className="font-bold">Asisten Kebijakan</span>
                  </div>
                  <button onClick={() => setShowChat(false)} className="hover:bg-white/20 rounded-full p-1"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  <div className="flex gap-2">
                      <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-sm shadow-sm text-slate-700 max-w-[85%]">
                        Halo! Saya siap membantu menganalisis data Banyumas. Tanyakan tentang perbandingan kecamatan atau tren data.
                      </div>
                  </div>
                  {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          <div className={`p-3 rounded-2xl text-sm shadow-sm max-w-[85%] ${
                              msg.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                          }`}>
                              {msg.parts[0].text}
                          </div>
                      </div>
                  ))}
              </div>
              <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl shrink-0">
                  <div className="flex gap-2">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Ketik pertanyaan..."
                        className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                      <button 
                        onClick={handleSendChat}
                        disabled={isChatting}
                        className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 disabled:opacity-50"
                      >
                          <Send size={18} />
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-slate-100 shrink-0">
                      <h3 className="text-xl font-bold text-slate-800">Optimasi Anggaran AI</h3>
                      <p className="text-sm text-slate-500">Biarkan AI menghitung alokasi terbaik untuk {selectedDistrict?.name}</p>
                  </div>
                  <div className="p-6 space-y-4 overflow-y-auto">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Total Anggaran (Miliar Rp)</label>
                          <input 
                             type="number" 
                             value={budgetAmount} 
                             onChange={(e) => setBudgetAmount(Number(e.target.value))}
                             className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Tujuan Utama</label>
                          <select 
                            value={budgetGoal}
                            onChange={(e) => setBudgetGoal(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                          >
                              <option>Penurunan Kemiskinan Agresif</option>
                              <option>Peningkatan Kualitas Kesehatan & Pendidikan</option>
                              <option>Penguatan Ekonomi Mikro (UMKM)</option>
                              <option>Perbaikan Infrastruktur Masif</option>
                          </select>
                      </div>
                      
                      {budgetResult && (
                          <div className="mt-4 bg-violet-50 p-4 rounded-xl border border-violet-100 text-sm animate-fade-in">
                              <h4 className="font-bold text-violet-800 mb-2">Rekomendasi Alokasi:</h4>
                              <ul className="space-y-1 text-violet-700 mb-3">
                                  <li>🏥 +{budgetResult.faskes} Faskes Baru</li>
                                  <li>🏫 +{budgetResult.sekolah} Sekolah Baru</li>
                                  <li>🏪 +{budgetResult.umkm} Stimulus UMKM</li>
                                  <li>🛣️ +{budgetResult.jalan_baik}% Perbaikan Jalan</li>
                              </ul>
                              <p className="italic text-slate-600 text-xs border-t border-violet-200 pt-2">
                                  "{budgetResult.justification}"
                              </p>
                          </div>
                      )}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                      <button 
                        onClick={() => setShowBudgetModal(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
                      >
                          Tutup
                      </button>
                      <button 
                        onClick={runBudgetCalc}
                        disabled={isBudgetLoading}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-70"
                      >
                          {isBudgetLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Bot size={18} />}
                          Hitung Alokasi
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

const TabButton = ({ active, onClick, label, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 py-4 border-b-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
            active 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
    >
        {icon}
        {label}
    </button>
);

export default App;