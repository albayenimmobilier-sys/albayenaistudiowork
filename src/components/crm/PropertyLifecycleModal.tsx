import React, { useState } from 'react';
import { 
  Building, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  AlertTriangle, 
  CheckCircle, 
  Edit, 
  X,
  Copy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyStatus, PropertyHistoryEvent } from '../../types';

interface PropertyLifecycleModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyLifecycleModal: React.FC<PropertyLifecycleModalProps> = ({ property, onClose }) => {
  const { 
    propertyHistory, 
    changePropertyStatus, 
    changePropertyPrice, 
    detectDuplicateProperties,
    formatPrice,
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'status' | 'price' | 'duplicates'>('history');

  // Status Change State
  const [newStatus, setNewStatus] = useState<PropertyStatus>(property.status);
  const [statusReason, setStatusReason] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  // Price Change State
  const [newPrice, setNewPrice] = useState<number>(property.price);
  const [priceReason, setPriceReason] = useState('');
  const [priceFeedback, setPriceFeedback] = useState<string | null>(null);

  // Property History for this specific property
  const propLogs = propertyHistory.filter(h => h.propertyId === property.id || h.propertyRef === property.ref);

  // Property duplicate check
  const duplicateResults = detectDuplicateProperties({
    id: property.id,
    title: property.title,
    district: property.district,
    surface: property.surface,
    price: property.price
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changePropertyStatus(property.id, newStatus, statusReason);
    if (res.success) {
      setStatusFeedback({ success: true, msg: 'Statut du bien mis à jour avec traçabilité dans l\'historique.' });
      setStatusReason('');
    } else {
      setStatusFeedback({ success: false, msg: res.error || 'Erreur lors de la modification du statut.' });
    }
  };

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrice <= 0) return;
    changePropertyPrice(property.id, newPrice, priceReason);
    setPriceFeedback(`Prix réajusté à ${formatPrice(newPrice)}. Événement horodaté dans l'audit commercial.`);
    setPriceReason('');
  };

  const statusDescriptions: Record<PropertyStatus, string> = {
    brouillon: 'Bien en cours de création, non visible du public.',
    disponible: 'Bien validé et prêt à être commercialisé.',
    publie: 'Bien affiché en ligne sur le portail public Albayen.',
    sous_option: 'Offre d\'achat acceptée ou compromis de vente en cours.',
    vendu: 'Transaction définitive conclue chez le Notaire.',
    loue: 'Bail de location signé.',
    archive: 'Bien retiré du marché (résilié ou suspendu).'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <img
              src={property.mainImage}
              alt={property.title}
              className="w-14 h-14 rounded-xl object-cover border border-stone-200"
            />
            <div>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                {property.ref}
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-0.5">
                {property.title}
              </h3>
              <p className="text-xs text-stone-500">
                {property.district}, {property.city} • Prix actuel : <strong className="text-amber-800">{formatPrice(property.price)}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Historique Métier ({propLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'status' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Cycle de Vie & Statut
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'price' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Modifier Prix
          </button>
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'duplicates' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Doublons ({duplicateResults.length})
          </button>
        </div>

        {/* TAB 1: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <History className="w-4 h-4" />
              Traçabilité Commerciale & Historique des Évolutions
            </h4>

            {propLogs.length === 0 ? (
              <p className="text-xs text-stone-400 italic">Aucune modification historisée pour ce bien.</p>
            ) : (
              <div className="space-y-3 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 pl-7 text-xs">
                {propLogs.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-7 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-800 border-2 border-white" />
                    
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider text-amber-800">
                          {log.eventType.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">{log.date}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-800">
                          {log.oldValue ? `${log.oldValue} → ` : ''}<strong>{log.newValue}</strong>
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          Par {log.authorName} ({log.authorRole})
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-stone-600 italic text-[11px]">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CYCLE DE VIE & STATUS TRANSITION */}
        {activeTab === 'status' && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Statut Actuel : <strong className="text-amber-800 uppercase">{property.status}</strong>
              </label>
              <p className="text-stone-500 mb-3">
                {statusDescriptions[property.status]}
              </p>
            </div>

            {statusFeedback && (
              <div className={`p-3 rounded-lg text-xs font-medium ${
                statusFeedback.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {statusFeedback.msg}
              </div>
            )}

            <div>
              <label className="font-semibold text-stone-700 block mb-1.5">
                Sélectionner le Nouveau Statut :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['brouillon', 'disponible', 'publie', 'sous_option', 'vendu', 'loue', 'archive'] as PropertyStatus[]).map(st => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setNewStatus(st)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col transition-colors cursor-pointer ${
                      newStatus === st 
                        ? 'border-amber-800 bg-amber-50 text-amber-900 font-bold' 
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="capitalize">{st.replace('_', ' ')}</span>
                    <span className="text-[10px] font-normal text-stone-500 mt-0.5 line-clamp-1">
                      {statusDescriptions[st]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Motif du changement (historisé obligatoirement)</label>
              <input
                type="text"
                required
                placeholder="ex: Accord propriétaire, option levée, compromis signé..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Appliquer la Transition & Enregistrer l'Historique
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: PRICE MODIFICATION */}
        {activeTab === 'price' && (
          <form onSubmit={handleUpdatePrice} className="space-y-4 text-xs">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex justify-between items-center">
              <span className="text-stone-500">Prix Actuel :</span>
              <strong className="text-sm font-bold text-stone-900">{formatPrice(property.price)}</strong>
            </div>

            {priceFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
                {priceFeedback}
              </div>
            )}

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Nouveau Prix Catalogue (DT) *</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Motif de l'ajustement tarifaire *</label>
              <input
                type="text"
                required
                placeholder="ex: Avenant au mandat suite à négociation avec le propriétaire..."
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Valider le Nouveau Prix
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: DUPLICATE DETECTION */}
        {activeTab === 'duplicates' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Copy className="w-4 h-4 text-amber-800" />
              Détection de Doublons Immobiliers dans le Portefeuille
            </h4>

            {duplicateResults.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Aucun bien doublon détecté pour cette annonce. La fiche est unique.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-amber-800 font-medium">
                  {duplicateResults.length} bien(s) présentent des similitudes fortes :
                </p>

                {duplicateResults.map(({ matchedWith, matchScore, matchReasons }) => (
                  <div key={matchedWith.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{matchedWith.ref} - {matchedWith.title}</span>
                      <span className="text-amber-800">{matchScore}% similitude</span>
                    </div>
                    <p className="text-stone-500">{matchedWith.district} • {formatPrice(matchedWith.price)} • {matchedWith.surface} m²</p>
                    <ul className="list-disc pl-4 text-[11px] text-amber-900">
                      {matchReasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
