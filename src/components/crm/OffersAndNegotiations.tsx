import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building, 
  User, 
  FileText, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FullCommercialOffer, NegotiationStep, Property } from '../../types';

interface OffersAndNegotiationsProps {
  onSelectProperty?: (property: Property) => void;
  onInitiateTransaction?: (offer: FullCommercialOffer) => void;
}

export const OffersAndNegotiations: React.FC<OffersAndNegotiationsProps> = ({ 
  onSelectProperty,
  onInitiateTransaction 
}) => {
  const { 
    fullOffers, 
    addNegotiationStep, 
    updateFullOfferStatus, 
    createSalesTransaction,
    properties, 
    unifiedContacts,
    agents,
    formatPrice,
    currentUser 
  } = useApp();

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(
    fullOffers.length > 0 ? fullOffers[0].id : null
  );

  // New counter-offer step state
  const [newStepAmount, setNewStepAmount] = useState<number>(1750000);
  const [newStepAuthorRole, setNewStepAuthorRole] = useState<'acquereur' | 'proprietaire' | 'agence'>('proprietaire');
  const [newStepAuthorName, setNewStepAuthorName] = useState('');
  const [newStepType, setNewStepType] = useState<NegotiationStep['type']>('contre_offre');
  const [newStepComment, setNewStepComment] = useState('');

  // Convert to Compromis modal state
  const [isCompromisModalOpen, setIsCompromisModalOpen] = useState(false);
  const [targetOfferForCompromis, setTargetOfferForCompromis] = useState<FullCommercialOffer | null>(null);
  const [notaryName, setNotaryName] = useState('Maître Hédi Ben Amor (Notaire à Sousse)');
  const [notaryPhone, setNotaryPhone] = useState('+216 73 225 900');
  const [depositAmount, setDepositAmount] = useState<number>(84000);
  const [compromiseDate, setCompromiseDate] = useState(new Date().toISOString().split('T')[0]);
  const [deedTargetDate, setDeedTargetDate] = useState(
    new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]
  );

  const selectedOffer = fullOffers.find(o => o.id === selectedOfferId) || fullOffers[0];

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    addNegotiationStep(selectedOffer.id, {
      amount: newStepAmount,
      authorRole: newStepAuthorRole,
      authorName: newStepAuthorName.trim() || (newStepAuthorRole === 'acquereur' ? selectedOffer.contactName : newStepAuthorRole === 'agence' ? currentUser.name : 'Propriétaire Vendeur'),
      type: newStepType,
      comment: newStepComment
    });

    setNewStepComment('');
  };

  const handleOpenCompromisModal = (offer: FullCommercialOffer) => {
    setTargetOfferForCompromis(offer);
    setDepositAmount(Math.round(offer.offeredAmount * 0.1)); // 10% séquestre standard
    setIsCompromisModalOpen(true);
  };

  const handleFinalizeCompromisCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOfferForCompromis) return;

    const prop = properties.find(p => p.id === targetOfferForCompromis.propertyId);
    const buyer = unifiedContacts.find(c => c.id === targetOfferForCompromis.contactId) || {
      id: 'cnt-buyer',
      firstName: targetOfferForCompromis.contactName,
      lastName: '',
      phone: targetOfferForCompromis.contactPhone
    };

    createSalesTransaction({
      offerId: targetOfferForCompromis.id,
      propertyId: targetOfferForCompromis.propertyId,
      propertyRef: targetOfferForCompromis.propertyRef,
      propertyTitle: targetOfferForCompromis.propertyTitle,
      propertyImage: targetOfferForCompromis.propertyImage,
      buyerId: buyer.id,
      buyerName: targetOfferForCompromis.contactName,
      buyerPhone: targetOfferForCompromis.contactPhone,
      sellerId: prop?.ownerId || 'cnt-seller',
      sellerName: 'Propriétaire Mandant',
      sellerPhone: '+216 73 224 880',
      agentId: targetOfferForCompromis.agentId,
      agentName: targetOfferForCompromis.agentName,
      finalPrice: targetOfferForCompromis.offeredAmount,
      depositAmount: depositAmount,
      notaryName,
      notaryPhone,
      compromiseDate,
      deedTargetDate,
      bankFinancingRequired: Boolean(targetOfferForCompromis.suspensiveConditions?.toLowerCase().includes('crédit') || targetOfferForCompromis.suspensiveConditions?.toLowerCase().includes('banque')),
      titleDeedStatus: 'titre_bleu_individuel',
      agencyCommission: targetOfferForCompromis.estimatedCommission,
      commissionPaid: false,
      status: 'compromis_en_cours',
      notes: `Transaction initiée suite à l'accord sur l'offre ${targetOfferForCompromis.ref}.`
    });

    updateFullOfferStatus(targetOfferForCompromis.id, 'acceptee');
    setIsCompromisModalOpen(false);
    alert('🎉 Dossier de vente et compromis créé avec succès ! Le bien est désormais sous option.');
  };

  const statusBadges: Record<FullCommercialOffer['status'], { label: string; color: string }> = {
    brouillon: { label: 'Brouillon', color: 'bg-stone-100 text-stone-700' },
    soumise: { label: 'Soumise au vendeur', color: 'bg-blue-100 text-blue-800' },
    en_cours: { label: 'En Négociation Active', color: 'bg-amber-100 text-amber-800' },
    acceptee: { label: 'Offre Acceptée / Accord', color: 'bg-emerald-100 text-emerald-800 font-bold' },
    refusee: { label: 'Refusée', color: 'bg-red-100 text-red-800' },
    expiree: { label: 'Expirée', color: 'bg-stone-200 text-stone-600' },
    retiree: { label: 'Retirée par le client', color: 'bg-stone-100 text-stone-500' }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-800" />
            Gestion des Offres Commerciales & Historique des Négociations
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Traçabilité intégrale de chaque échange financier : offre initiale, contre-proposition, écarts et accord final.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-stone-50 px-3 py-2 rounded-lg border border-stone-200">
            Total Offres : <strong className="text-stone-900">{fullOffers.length}</strong>
          </div>
          <div className="bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 text-emerald-800 font-semibold">
            Acceptées : {fullOffers.filter(o => o.status === 'acceptee').length}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Offers List / Right Negotiation Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Offers List (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            Offres Enregistrées
          </h4>

          {fullOffers.map(offer => {
            const spread = offer.offeredAmount - offer.listedPrice;
            const spreadPercent = Math.round((spread / offer.listedPrice) * 100);
            const isSelected = selectedOffer?.id === offer.id;

            return (
              <div
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected 
                    ? 'border-amber-800 ring-2 ring-amber-800/15 shadow-sm' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 block">{offer.ref}</span>
                    <h5 className="text-sm font-bold text-stone-900 leading-tight">
                      {offer.contactName}
                    </h5>
                    <p className="text-[11px] text-stone-500 truncate max-w-xs mt-0.5">
                      {offer.propertyRef} - {offer.propertyTitle}
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadges[offer.status]?.color}`}>
                    {statusBadges[offer.status]?.label}
                  </span>
                </div>

                {/* Financial Spread */}
                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-lg text-xs mt-2 border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Prix Affiché</span>
                    <span className="font-semibold text-stone-700">{formatPrice(offer.listedPrice)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Dernière Offre</span>
                    <span className="font-bold text-amber-800">{formatPrice(offer.offeredAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2.5 pt-2 border-t border-stone-100">
                  <span>Écart : <strong className={spread < 0 ? 'text-red-700' : 'text-emerald-700'}>{spread > 0 ? '+' : ''}{spreadPercent}%</strong></span>
                  <span>{offer.negotiationHistory.length} étape(s)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Selected Offer Negotiation History & Actions (7 cols) */}
        {selectedOffer && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
            
            {/* Header Selected Offer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900 font-display">
                    Négociation {selectedOffer.ref}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusBadges[selectedOffer.status]?.color}`}>
                    {statusBadges[selectedOffer.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Bien : <strong className="text-stone-800">{selectedOffer.propertyRef} - {selectedOffer.propertyTitle}</strong>
                </p>
                <p className="text-xs text-stone-500">
                  Acquéreur : <strong className="text-stone-800">{selectedOffer.contactName}</strong> ({selectedOffer.contactPhone})
                </p>
              </div>

              {/* Action: Convert to Compromis if accepted or in progress */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenCompromisModal(selectedOffer)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dossier Compromis de Vente</span>
                </button>
              </div>
            </div>

            {/* Suspensive Conditions */}
            {selectedOffer.suspensiveConditions && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900">
                <span className="font-bold block mb-0.5">Conditions Suspensives Spécifiées :</span>
                <p className="text-stone-700">{selectedOffer.suspensiveConditions}</p>
              </div>
            )}

            {/* Negotiation Steps Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Historique Chronologique de la Négociation
              </h4>

              <div className="space-y-3 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 pl-7">
                {selectedOffer.negotiationHistory.map((step, idx) => {
                  const isAgreement = step.type === 'accord';
                  const isRefusal = step.type === 'refus';

                  return (
                    <div key={step.id} className="relative">
                      <div className={`absolute -left-7 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isAgreement ? 'bg-emerald-600' : isRefusal ? 'bg-red-600' : 'bg-amber-800'
                      }`} />

                      <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isAgreement ? 'bg-emerald-50/50 border-emerald-200' : 
                        isRefusal ? 'bg-red-50/50 border-red-200' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                            Étape {idx + 1} • {step.type.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">{step.date}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-stone-900">
                            Montant : {formatPrice(step.amount)}
                          </span>
                          <span className="text-stone-500 font-medium">
                            Auteur : {step.authorName} ({step.authorRole})
                          </span>
                        </div>

                        <p className="text-stone-600 italic">
                          "{step.comment}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Next Negotiation Step Form */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-800" />
                Enregistrer une Contre-Proposition ou Clôturer la Négociation
              </h4>

              <form onSubmit={handleAddStep} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Type d'action</label>
                    <select
                      value={newStepType}
                      onChange={(e) => setNewStepType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-stone-200 rounded-lg font-medium"
                    >
                      <option value="contre_offre">Contre-Proposition Vendeur</option>
                      <option value="nouvelle_offre">Nouvelle Offre Acquéreur</option>
                      <option value="accord">✅ Accord Définitif Trouvé</option>
                      <option value="refus">❌ Refus Définitif</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Montant Proposé (DT)</label>
                    <input
                      type="number"
                      required
                      value={newStepAmount}
                      onChange={(e) => setNewStepAmount(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-stone-200 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Auteur de l'action</label>
                    <select
                      value={newStepAuthorRole}
                      onChange={(e) => setNewStepAuthorRole(e.target.value as any)}
                      className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                    >
                      <option value="proprietaire">Propriétaire Vendeur</option>
                      <option value="acquereur">Acquéreur</option>
                      <option value="agence">Cabinet Albayen (Médiation)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Argumentaire & Conditions</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Contre-proposition avec maintien de la cuisine équipée et acompte de 10%..."
                    value={newStepComment}
                    onChange={(e) => setNewStepComment(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Valider l'Étape de Négociation
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* Modal: Initialiser Compromis de Vente */}
      {isCompromisModalOpen && targetOfferForCompromis && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Ouverture Dossier Compromis de Vente
                </h3>
              </div>
              <button onClick={() => setIsCompromisModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              La création du dossier de compromis va automatiquement basculer le bien <strong>{targetOfferForCompromis.propertyRef}</strong> en statut <strong>Sous option</strong> et inscrire l'opération au closing commercial.
            </p>

            <form onSubmit={handleFinalizeCompromisCreation} className="space-y-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Bien :</span>
                  <strong className="text-stone-900">{targetOfferForCompromis.propertyTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Prix convenu :</span>
                  <strong className="text-emerald-700">{formatPrice(targetOfferForCompromis.offeredAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Acquéreur :</span>
                  <strong className="text-stone-900">{targetOfferForCompromis.contactName}</strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Montant Acompte / Séquestre (DT) *</label>
                <input
                  type="number"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Étude Notariale à Sousse *</label>
                <input
                  type="text"
                  required
                  value={notaryName}
                  onChange={(e) => setNotaryName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date Signature Compromis</label>
                  <input
                    type="date"
                    required
                    value={compromiseDate}
                    onChange={(e) => setCompromiseDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date Cible Acte Authentique</label>
                  <input
                    type="date"
                    required
                    value={deedTargetDate}
                    onChange={(e) => setDeedTargetDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCompromisModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Créer le Compromis & Mettre sous Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
