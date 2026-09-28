import React from 'react';
import { Heart, MapPin, Maximize2, Bed, Bath, ArrowUpRight, Eye, Calendar, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onSelect, 
  onRequestVisit 
}) => {
  const { language, formatPrice, isFavorite, toggleFavorite } = useApp();
  const t = getTranslation(language);

  const favorited = isFavorite(property.id);

  const formatTransaction = (type: Property['transactionType']) => {
    switch (type) {
      case 'sale': return 'Vente';
      case 'rent': return 'Location';
      case 'seasonal': return 'Vacances';
    }
  };

  const formatPropertyType = (type: Property['type']) => {
    switch (type) {
      case 'villa': return 'Villa';
      case 'appartement': return 'Appartement';
      case 'maison': return 'Maison';
      case 'terrain': return 'Terrain';
      case 'bureau': return 'Bureau';
      case 'local_commercial': return 'Local commercial';
      case 'immeuble': return 'Immeuble';
      default: return 'Bien immobilier';
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      
      {/* Media Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <img
          src={property.mainImage || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // CSS fallback container
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Minimalist Overlay Indicators */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-900 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-sm shadow-xs">
            {formatTransaction(property.transactionType)}
          </span>
          {property.isFeatured && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-100/90 backdrop-blur-xs px-2 py-1 rounded-sm border border-amber-300">
              À la une
            </span>
          )}
        </div>

        {/* Favorite Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            favorited 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label="Favoris"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom subtle bar on image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-sm">
          <span>Réf: {property.ref}</span>
          <span>{property.viewsCount} vues</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Location & Type (Clean unboxed metadata with separators) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">{property.district}, {property.city}</span>
            <span aria-hidden="true">·</span>
            <span>{formatPropertyType(property.type)}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="font-display font-semibold text-stone-900 text-base leading-snug line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
          >
            {language === 'ar' && property.titleAr ? property.titleAr : property.title}
          </h3>

          {/* Key Metrics (Unboxed inline metadata with tabular figures) */}
          <div className="flex items-center gap-3 text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100 font-medium">
            <div className="flex items-center gap-1" title="Surface habitable">
              <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
              <span className="tabular-nums">{property.surface} m²</span>
            </div>

            {property.bedrooms > 0 && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-1" title="Chambres">
                  <Bed className="w-3.5 h-3.5 text-stone-400" />
                  <span className="tabular-nums">{property.bedrooms} ch.</span>
                </div>
              </>
            )}

            {property.bathrooms > 0 && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-1" title="Salles de bain">
                  <Bath className="w-3.5 h-3.5 text-stone-400" />
                  <span className="tabular-nums">{property.bathrooms} sdb</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Footer: Price & Primary Action */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 block uppercase tracking-wider font-semibold">
              {property.transactionType === 'rent' ? 'Loyer mensuel' : 'Prix de vente'}
            </span>
            <span className="text-lg font-bold text-stone-900 tabular-nums">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRequestVisit(property)}
              className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors border border-stone-200"
              title="Demander une visite"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelect(property)}
              className="px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Détails</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
