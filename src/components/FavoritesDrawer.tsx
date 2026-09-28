import React from 'react';
import { X, Heart, Trash2, Calendar, ArrowUpRight, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';

interface FavoritesDrawerProps {
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  onClose,
  onSelectProperty,
  onRequestVisit
}) => {
  const { properties, favorites, toggleFavorite, formatPrice } = useApp();

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-current" />
            <h2 className="text-base font-display font-bold text-stone-900">
              Mes Biens Favoris ({favoriteProperties.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteProperties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Heart className="w-12 h-12 stroke-1 mb-2 text-stone-300" />
              <p className="text-sm font-semibold text-stone-700">Aucun favori enregistré</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Cliquez sur le cœur d'une annonce pour la sauvegarder et la retrouver facilement lors de votre session.
              </p>
            </div>
          ) : (
            favoriteProperties.map(prop => (
              <div
                key={prop.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-2xs"
              >
                <img
                  src={prop.mainImage}
                  alt={prop.title}
                  className="w-20 h-16 rounded-lg object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onSelectProperty(prop);
                    onClose();
                  }}
                  referrerPolicy="no-referrer"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                      {prop.ref} · {prop.district}
                    </span>
                    <button
                      onClick={() => toggleFavorite(prop.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    className="text-xs font-semibold text-stone-900 truncate hover:text-amber-800 cursor-pointer mt-0.5"
                  >
                    {prop.title}
                  </h4>

                  <span className="text-xs font-bold text-stone-900 block mt-1 tabular-nums">
                    {formatPrice(prop.price)}
                  </span>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        onRequestVisit(prop);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Visiter</span>
                    </button>
                    <span className="text-stone-300">·</span>
                    <button
                      onClick={() => {
                        onSelectProperty(prop);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-stone-700 hover:underline flex items-center gap-0.5"
                    >
                      <span>Fiche complète</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoriteProperties.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Imprimer la sélection
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
