import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property, TransactionType } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Eye, 
  Filter, 
  Maximize2, 
  Minimize2,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { SOUSSE_DISTRICTS_DATA } from '../data/sousseGeography';

interface InteractivePropertyMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  className?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const InteractivePropertyMap: React.FC<InteractivePropertyMapProps> = ({
  properties,
  onSelectProperty,
  className = '',
  isModal = false,
  onClose
}) => {
  const { currency, agencySettings } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Filter properties
  const filteredProperties = properties.filter(p => {
    if (selectedType !== 'all' && p.type !== selectedType) return false;
    if (selectedDistrict !== 'all' && !p.district.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
    return true;
  });

  const formatShortPrice = (price: number) => {
    if (currency === 'EUR') {
      const eur = Math.round(price * (agencySettings.exchangeRateEUR || 0.294));
      return `${Math.round(eur / 1000)}k €`;
    } else if (currency === 'USD') {
      const usd = Math.round(price * (agencySettings.exchangeRateUSD || 0.322));
      return `${Math.round(usd / 1000)}k $`;
    }
    return `${Math.round(price / 1000)}k DT`;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Sousse, Tunisia
      const map = L.map(mapContainerRef.current, {
        center: [35.8450, 10.6150],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Elegant OpenStreetMap Positron / CartoDB Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup handled if unmounted
    };
  }, []);

  // Update Markers when properties or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds = L.latLngBounds([]);

    filteredProperties.forEach((property) => {
      // Default to central Sousse coordinates if lat/lng missing or out of bounds
      const lat = property.latitude && property.latitude > 35 && property.latitude < 37 
        ? property.latitude 
        : 35.835 + (Math.random() * 0.05 - 0.025);
      const lng = property.longitude && property.longitude > 10 && property.longitude < 11 
        ? property.longitude 
        : 10.615 + (Math.random() * 0.05 - 0.025);

      const priceLabel = formatShortPrice(property.price);
      const isSale = property.transactionType === 'sale';

      // Custom HTML Pin with price pill
      const pinHtml = `
        <div class="custom-map-marker group relative cursor-pointer" style="transform: translate(-50%, -50%);">
          <div class="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-transform duration-200 hover:scale-110 flex items-center gap-1 border ${
            isSale 
              ? 'bg-amber-900 text-white border-amber-700 hover:bg-amber-800' 
              : 'bg-emerald-800 text-white border-emerald-600 hover:bg-emerald-700'
          }">
            <span class="w-1.5 h-1.5 rounded-full ${isSale ? 'bg-amber-400' : 'bg-emerald-300'} animate-pulse"></span>
            <span>${priceLabel}</span>
          </div>
          <div class="w-2 h-2 ${isSale ? 'bg-amber-900' : 'bg-emerald-800'} rotate-45 mx-auto -mt-1 shadow-sm"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-leaflet-pin',
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Interactive popup
      const popupHtml = `
        <div class="p-1 max-w-[240px] font-sans">
          <img src="${property.mainImage || property.images[0]}" class="w-full h-28 object-cover rounded-lg mb-2" alt="${property.title}" />
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-0.5">${property.district} · Sousse</div>
          <h4 class="text-xs font-bold text-stone-900 line-clamp-1 mb-1">${property.title}</h4>
          <div class="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
            <span class="text-xs font-bold text-stone-900">${property.price.toLocaleString('fr-FR')} DT</span>
            <span class="text-[10px] font-semibold text-amber-800 underline">Fiche détaillée →</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'albayen-custom-popup'
      });

      marker.on('click', () => {
        setHoveredProperty(property);
      });

      marker.addTo(markersGroup);
      bounds.extend([lat, lng]);
    });

    if (filteredProperties.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filteredProperties, currency]);

  return (
    <div className={`relative bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col ${
      isFullScreen ? 'fixed inset-0 z-50 rounded-none' : className || 'h-[600px] w-full'
    }`}>
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-stone-200 pointer-events-auto">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">Tous types ({properties.length})</option>
            <option value="appartement">Appartements</option>
            <option value="villa">Villas</option>
            <option value="terrain">Terrains</option>
            <option value="bureau">Bureaux</option>
            <option value="local_commercial">Commerces</option>
          </select>

          <div className="h-3 w-px bg-stone-200 mx-1" />

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="all">Tous quartiers de Sousse</option>
            {SOUSSE_DISTRICTS_DATA.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden sm:flex items-center gap-2 bg-stone-900/90 text-white px-3 py-1.5 rounded-xl shadow-md text-xs font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{filteredProperties.length} biens localisés</span>
          </div>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 bg-white/95 hover:bg-white text-stone-700 rounded-xl shadow-md border border-stone-200 transition-colors"
            title={isFullScreen ? "Réduire" : "Plein écran"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-white hover:bg-stone-100 text-stone-800 rounded-xl shadow-md border border-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Property Preview Card at bottom right */}
      {hoveredProperty && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-[1000] bg-white rounded-2xl p-3.5 shadow-2xl border border-stone-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex gap-3">
            <img 
              src={hoveredProperty.mainImage || hoveredProperty.images[0]} 
              alt={hoveredProperty.title}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm">
                  {hoveredProperty.district} · Sousse
                </span>
                <button 
                  onClick={() => setHoveredProperty(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-xs font-bold text-stone-900 truncate mb-1">
                {hoveredProperty.title}
              </h4>

              <div className="text-xs text-stone-500 mb-2">
                {hoveredProperty.surface} m² · {hoveredProperty.bedrooms} ch. · {hoveredProperty.condition}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                <span className="text-xs font-black text-amber-900">
                  {hoveredProperty.price.toLocaleString('fr-FR')} DT
                </span>
                <button
                  onClick={() => onSelectProperty(hoveredProperty)}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold rounded-lg transition-colors"
                >
                  Voir fiche complète
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
