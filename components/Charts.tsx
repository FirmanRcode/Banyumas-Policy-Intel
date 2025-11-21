import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DistrictData } from '../types';

export const ForecastChart = ({ data }: { data: DistrictData }) => {
  // Simple projection logic for demo
  const lastYear = data.historicalPoverty[data.historicalPoverty.length - 1];
  const trend = (lastYear.rate - data.historicalPoverty[0].rate) / data.historicalPoverty.length;
  
  const forecast = [
      ...data.historicalPoverty,
      { year: 2024, rate: Number((lastYear.rate + trend).toFixed(2)), type: 'forecast' },
      { year: 2025, rate: Number((lastYear.rate + trend * 2).toFixed(2)), type: 'forecast' },
      { year: 2026, rate: Number((lastYear.rate + trend * 3).toFixed(2)), type: 'forecast' },
  ];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecast}>
            <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
            </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
          />
          <Area 
            type="monotone" 
            dataKey="rate" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRate)" 
            name="Kemiskinan (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
