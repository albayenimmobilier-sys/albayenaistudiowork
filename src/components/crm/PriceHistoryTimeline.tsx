import React, { useState } from 'react';
import { Property, PriceHistoryEntry } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  TrendingDown, 
  TrendingUp, 
  History, 
  Clock, 
  Plus, 
  Check, 
  Calendar, 
  User, 
  AlertCircle 
} from 'lucide-react';

interface PriceHistoryTimelineProps {
  property: Property;
  onPriceUpdated?: (newPrice: number) => void;
}

export const PriceHistoryTimeline: React.FC<PriceHistoryTimelineProps> = ({ property, onPriceUpdated }) => {
  const { currentUser, logActivity } = useApp();
  
  // Default mock price history if property doesn't have one
  const [history, setHistory] = useState<PriceHistoryEntry[]>(() => {
    if (property.priceHistory && property.priceHistory.length > 0) {
      return property.priceHistory;
    }
    const initialPrice = property.price + 25000;
    const diff = property.price - initialPrice;
    const pct = ((diff / initialPrice) * 100);
    return [
      {
        id: 'hist-1',
        propertyId: property.id,
        oldPrice: initialPrice,
        newPrice: property.price,
        changePercent: parseFloat(pct.toFixed(1)),
        date: '2026-08-15 11:30',
        authorId: currentUser.id,
        authorName: 'Karim Mansour',
        authorRole: 'agent',
        reason: 'Négociation vendeur acceptée pour dynamiser les visites'
      }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newPriceInput, setNewPriceInput] = useState<string>('');
  const [reasonInput, setReasonInput] = useState<string>('');

  const currentPrice = property.price;

  const handleAddPriceChange = () => {
    const newPrice = parseFloat(newPriceInput);
    if (isNaN(newPrice) || newPrice <= 0) return;

    const diff = newPrice - currentPrice;
    const pct = ((diff / currentPrice) * 100);

    const newEntry: PriceHistoryEntry = {
      id: `hist-${Date.now()}`,
      propertyId: property.id,
      oldPrice: currentPrice,
      newPrice: newPrice,
      changePercent: parseFloat(pct.toFixed(1)),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      reason: reasonInput || 'Ajustement de marché convenu avec le mandant'
    };

    setHistory(prev => [newEntry, ...prev]);
    setIsAdding(false);
    setNewPriceInput('');
    setReasonInput('');
    
    if (onPriceUpdated) onPriceUpdated(newPrice);
    logActivity('MODIFICATION_PRIX', `Bien ${property.ref}`, `Prix modifié de ${currentPrice} DT à ${newPrice} DT (${pct.toFixed(1)}%).`);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-800" />
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Historique & Évolution du Prix
          </h4>
        </div>

        {currentUser.role !== 'visitor' && currentUser.role !== 'client' && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enregistrer révision</span>
          </button>
        )}
      </div>

      {/* New Price Form */}
      {isAdding && (
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2.5 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Nouveau prix (DT)</label>
              <input
                type="number"
                value={newPriceInput}
                onChange={(e) => setNewPriceInput(e.target.value)}
                placeholder="Ex: 480000"
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Motif du changement</label>
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Ex: Contre-proposition vendeur..."
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-stone-500 hover:text-stone-700 font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleAddPriceChange}
              className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
        {history.map(item => {
          const isDrop = item.newPrice < item.oldPrice;

          return (
            <div key={item.id} className="relative flex items-start gap-3 pl-8 text-xs">
              <span className={`absolute left-1.5 top-1 w-4 h-4 rounded-full flex items-center justify-center text-white ring-4 ring-white ${
                isDrop ? 'bg-emerald-600' : 'bg-amber-700'
              }`}>
                {isDrop ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
              </span>

              <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900 font-sans">
                    {item.newPrice.toLocaleString('fr-FR')} DT
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                    isDrop ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                  </span>
                </div>

                <div className="text-[11px] text-stone-500 mb-1">
                  Prix précédent : <span className="line-through">{item.oldPrice.toLocaleString('fr-FR')} DT</span>
                </div>

                <p className="text-[11px] text-stone-700 italic mb-2">
                  "{item.reason}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.authorName} ({item.authorRole})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
