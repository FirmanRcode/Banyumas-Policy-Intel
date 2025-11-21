import React, { useEffect, useState } from 'react';
import { DistrictData, SimulationState } from '../types';
import { MODEL_COEFFICIENTS } from '../constants';
import { RefreshCw, Save, TrendingDown } from 'lucide-react';

interface SimulationPanelProps {
  district: DistrictData;
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
  onReset: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ 
  district, 
  simulationState, 
  setSimulationState, 
  onReset 
}) => {
  const [predictedPoverty, setPredictedPoverty] = useState(district.povertyRate);

  // Calculate prediction
  useEffect(() => {
    const { healthFacilities, schools, umkm, roadQuality } = simulationState;
    const base = MODEL_COEFFICIENTS.intercept;
    const impact = 
      (healthFacilities * MODEL_COEFFICIENTS.health) +
      (schools * MODEL_COEFFICIENTS.schools) +
      (umkm * MODEL_COEFFICIENTS.umkm) +
      (roadQuality * MODEL_COEFFICIENTS.road);
    
    let result = base + impact;
    result = Math.max(0, Math.min(100, result)); // Clamp 0-100
    setPredictedPoverty(result);
  }, [simulationState]);

  const handleSliderChange = (key: keyof SimulationState, value: number) => {
    setSimulationState(prev => ({ ...prev, [key]: value }));
  };

  const diff = (predictedPoverty - district.povertyRate).toFixed(2);
  const isImproved = parseFloat(diff) < 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Prediction Result Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown size={100} />
         </div>
         <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">Estimasi Angka Kemiskinan</h3>
         <div className="flex items-end gap-4 mt-2">
            <span className="text-5xl font-bold tracking-tight">{predictedPoverty.toFixed(2)}%</span>
            <span className={`text-lg font-medium mb-2 px-2 py-1 rounded ${isImproved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
               {isImproved ? '' : '+'}{diff}%
            </span>
         </div>
         <p className="text-slate-400 text-xs mt-4">
            *Model regresi linier berdasarkan data historis 2022.
         </p>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
         <ControlGroup 
            label="Fasilitas Kesehatan" 
            value={simulationState.healthFacilities} 
            base={district.healthFacilities}
            min={0} max={district.healthFacilities * 3} step={1}
            onChange={(v) => handleSliderChange('healthFacilities', v)}
            unit="Unit"
         />
         <ControlGroup 
            label="Sekolah (SD/SMP/SMA)" 
            value={simulationState.schools} 
            base={district.schools}
            min={0} max={district.schools * 2} step={1}
            onChange={(v) => handleSliderChange('schools', v)}
            unit="Unit"
         />
         <ControlGroup 
            label="UMKM Aktif" 
            value={simulationState.umkm} 
            base={district.umkm}
            min={0} max={district.umkm * 2} step={50}
            onChange={(v) => handleSliderChange('umkm', v)}
            unit="Unit"
         />
         <ControlGroup 
            label="Kualitas Jalan Baik" 
            value={simulationState.roadQuality} 
            base={district.roadQuality}
            min={0} max={100} step={1}
            onChange={(v) => handleSliderChange('roadQuality', v)}
            unit="%"
         />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button 
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
            <RefreshCw size={16} /> Reset
        </button>
        <button 
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md shadow-blue-200"
            onClick={() => alert("Skenario disimpan!")}
        >
            <Save size={16} /> Simpan Skenario
        </button>
      </div>
    </div>
  );
};

const ControlGroup = ({ label, value, base, min, max, step, onChange, unit }: any) => {
    const change = ((value - base) / base) * 100;
    
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{value} {unit}</span>
                    {change !== 0 && (
                        <span className={`text-xs ml-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>
            <input 
                type="range" 
                min={min} max={max} step={step} 
                value={value} 
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}

export default SimulationPanel;
