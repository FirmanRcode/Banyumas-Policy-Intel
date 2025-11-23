import React, { useState } from 'react';
import { DistrictData } from '../types';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ComparisonPanelProps {
  baseDistrict: DistrictData;
  allDistricts: DistrictData[];
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ baseDistrict, allDistricts }) => {
  // Default to the first district that isn't the base one
  const [targetId, setTargetId] = useState<string>(
    allDistricts.find(d => d.id !== baseDistrict.id)?.id || ''
  );

  const targetDistrict = allDistricts.find(d => d.id === targetId);

  const metrics = [
    { label: 'Tingkat Kemiskinan', key: 'povertyRate', unit: '%', inverse: true }, // Inverse: Lower is better
    { label: 'Populasi', key: 'population', unit: ' Jiwa', format: (v: number) => (v/1000).toFixed(1) + 'k', inverse: false },
    { label: 'Fasilitas Kesehatan', key: 'healthFacilities', unit: ' Unit', inverse: false },
    { label: 'Sekolah', key: 'schools', unit: ' Unit', inverse: false },
    { label: 'UMKM', key: 'umkm', unit: ' Unit', inverse: false },
    { label: 'Kualitas Jalan', key: 'roadQuality', unit: '%', inverse: false },
  ];

  if (!targetDistrict) return <div className="p-4">Data tidak tersedia untuk perbandingan.</div>;

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Selector Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Bandingkan {baseDistrict.name} dengan:
        </label>
        <select 
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          {allDistricts
            .filter(d => d.id !== baseDistrict.id)
            .map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))
          }
        </select>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 gap-3">
        {metrics.map((metric) => {
          // @ts-ignore
          const baseVal = baseDistrict[metric.key];
          // @ts-ignore
          const targetVal = targetDistrict[metric.key];
          const diff = baseVal - targetVal;
          
          // Determine status color for the Base district (is it better or worse than target?)
          // If inverse (like poverty), lower is better (Green). If not inverse, higher is better (Green).
          let isBetter = metric.inverse ? diff < 0 : diff > 0;
          let isNeutral = diff === 0;
          
          const colorClass = isNeutral 
            ? 'text-slate-500 bg-slate-100' 
            : isBetter 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-rose-600 bg-rose-50';

          return (
            <div key={metric.key} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
              
              {/* Base District (Left) */}
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-400 mb-1">{baseDistrict.name}</div>
                <div className="text-lg font-bold text-slate-800">
                  {metric.format ? metric.format(baseVal) : baseVal}
                  <span className="text-xs font-normal text-slate-500">{metric.unit}</span>
                </div>
              </div>

              {/* Indicator (Center) */}
              <div className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg ${colorClass} min-w-[80px]`}>
                <div className="text-xs font-bold mb-0.5">{metric.label}</div>
                <div className="flex items-center gap-1">
                    {isNeutral ? <Minus size={14} /> : isBetter ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span className="text-xs font-bold">
                        {Math.abs(diff).toFixed(metric.key === 'population' ? 0 : 1)}
                        {metric.unit.trim()}
                    </span>
                </div>
              </div>

              {/* Target District (Right) */}
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-400 mb-1">{targetDistrict.name}</div>
                <div className="text-lg font-bold text-slate-800">
                  {metric.format ? metric.format(targetVal) : targetVal}
                  <span className="text-xs font-normal text-slate-500">{metric.unit}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
        <p>
          <strong>Analisis Singkat: </strong>
          {baseDistrict.povertyRate < targetDistrict.povertyRate 
            ? `${baseDistrict.name} memiliki tingkat kemiskinan lebih rendah dibanding ${targetDistrict.name}. `
            : `${baseDistrict.name} memiliki tingkat kemiskinan lebih tinggi dibanding ${targetDistrict.name}. `
          }
          Perbedaan fasilitas kesehatan adalah {Math.abs(baseDistrict.healthFacilities - targetDistrict.healthFacilities)} unit.
        </p>
      </div>
    </div>
  );
};

export default ComparisonPanel;