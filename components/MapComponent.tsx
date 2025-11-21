import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import { DistrictData } from '../types';
import { MAP_CENTER, MAP_ZOOM } from '../constants';
import { LocateFixed } from 'lucide-react';

interface MapComponentProps {
  data: DistrictData[];
  selectedDistrictId: string | null;
  onSelectDistrict: (id: string) => void;
}

const GetColor = (rate: number) => {
  if (rate < 10) return '#10b981'; // Emerald 500
  if (rate < 14) return '#f59e0b'; // Amber 500
  return '#ef4444'; // Red 500
};

// Component to fly to location when selected
const MapUpdater = ({ center, zoom, selected }: { center: [number, number], zoom: number, selected: boolean }) => {
    const map = useMap();
    React.useEffect(() => {
        if (selected) {
            map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
        } else {
            map.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 1.2 });
        }
    }, [center, zoom, selected, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ data, selectedDistrictId, onSelectDistrict }) => {
  const selectedDistrict = data.find(d => d.id === selectedDistrictId);
  
  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 relative z-0 bg-slate-50">
      <MapContainer 
        center={MAP_CENTER} 
        zoom={MAP_ZOOM} 
        scrollWheelZoom={true} 
        className="h-full w-full outline-none"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        
        {/* CartoDB Positron - Cleaner, "Professional" Look */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater 
            center={selectedDistrict ? [selectedDistrict.lat, selectedDistrict.lng] : MAP_CENTER} 
            zoom={selectedDistrict ? 13 : MAP_ZOOM}
            selected={!!selectedDistrict}
        />

        {data.map((district) => {
            const isSelected = selectedDistrictId === district.id;
            return (
                <CircleMarker
                    key={district.id}
                    center={[district.lat, district.lng]}
                    pathOptions={{
                    fillColor: GetColor(district.povertyRate),
                    color: isSelected ? '#3b82f6' : '#ffffff',
                    weight: isSelected ? 4 : 2,
                    opacity: 1,
                    fillOpacity: 0.85,
                    }}
                    radius={isSelected ? 20 : 12}
                    eventHandlers={{
                        click: () => onSelectDistrict(district.id),
                        mouseover: (e) => e.target.openTooltip(),
                        mouseout: (e) => e.target.closeTooltip(),
                    }}
                >
                    <Tooltip direction="top" offset={[0, -20]} opacity={1} className="custom-tooltip">
                        <div className="text-center">
                            <span className="font-bold text-slate-800 text-sm">{district.name}</span>
                            <div className="text-xs text-slate-500 mt-1">
                                Kemiskinan: <span className={`font-bold ${district.povertyRate < 10 ? 'text-emerald-600' : district.povertyRate > 14 ? 'text-rose-600' : 'text-amber-600'}`}>{district.povertyRate}%</span>
                            </div>
                        </div>
                    </Tooltip>
                </CircleMarker>
            );
        })}

        {/* Legend Overlay */}
        <div className="leaflet-bottom leaflet-left mb-6 ml-4 pointer-events-none z-[1000]">
             <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 pointer-events-auto transform transition-all hover:scale-105">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">Peta Sebaran Kemiskinan</h4>
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span> &lt; 10% (Rendah)
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200"></span> 10-14% (Sedang)
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200"></span> &gt; 14% (Tinggi)
                </div>
             </div>
        </div>

        {/* Reset View Button */}
        <div className="leaflet-top leaflet-right mt-4 mr-4 pointer-events-none z-[1000]">
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectDistrict('');
                }}
                className={`pointer-events-auto bg-white text-slate-700 p-2 rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-all ${selectedDistrictId ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                title="Reset Peta"
             >
                <LocateFixed size={20} />
             </button>
        </div>
      </MapContainer>
    </div>
  );
};

export default MapComponent;