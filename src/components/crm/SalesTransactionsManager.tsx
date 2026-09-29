import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Building, 
  User, 
  FileText, 
  AlertCircle, 
  DollarSign, 
  Download,
  Calendar,
  Lock,
  Sparkles,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SalesTransaction, TransactionStatus } from '../../types';

export const SalesTransactionsManager: React.FC = () => {
  const { 
    salesTransactions, 
    finalizeSalesTransaction, 
    updateSalesTransaction, 
    formatPrice,
    properties 
  } = useApp();

  const [selectedTxId, setSelectedTxId] = useState<string | null>(
    salesTransactions.length > 0 ? salesTransactions[0].id : null
  );

  const selectedTx = salesTransactions.find(t => t.id === selectedTxId) || salesTransactions[0];

  const statusLabels: Record<TransactionStatus, { label: string; color: string }> = {
    compromis_en_cours: { label: 'Compromis en Cours', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    conditions_suspensives: { label: 'Levée Conditions Suspensives', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    pret_bancaire_valide: { label: 'Financement Bancaire Validé', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    titre_bleu_conforme: { label: 'Titre Bleu Vérifié Conforme', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    acte_authentique_signe: { label: 'Acte Authentique Signé', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' },
    cloturee: { label: 'Vente Clôturée & Encaissée', color: 'bg-emerald-200 text-emerald-900 border-emerald-400 font-bold' },
    annulee: { label: 'Transaction Annulée', color: 'bg-stone-200 text-stone-700 border-stone-300' }
  };

  const handleToggleCondition = (txId: string, currentStatus: TransactionStatus) => {
    let next: TransactionStatus = 'conditions_suspensives';
    if (currentStatus === 'compromis_en_cours') next = 'conditions_suspensives';
    else if (currentStatus === 'conditions_suspensives') next = 'titre_bleu_conforme';
    else if (currentStatus === 'titre_bleu_conforme') next = 'pret_bancaire_valide';
    else next = 'acte_authentique_signe';

    updateSalesTransaction(txId, { status: next });
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Dossiers de Vente, Compromis & Closing Notarié
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Gestion juridique et financière de la promesse de vente jusqu'à l'acte authentique chez le Notaire à Sousse.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
            {salesTransactions.length} dossier(s) de clôture
          </span>
        </div>
      </div>

      {salesTransactions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-stone-200">
          <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-stone-700">Aucun dossier de vente en cours</h4>
          <p className="text-xs text-stone-400 mt-1">Les dossiers sont générés dès qu'une offre d'achat est validée et acceptée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left list of transactions */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Dossiers Actifs
            </h4>

            {salesTransactions.map(tx => {
              const isSelected = selectedTx?.id === tx.id;
              const isClosed = tx.status === 'cloturee' || tx.status === 'acte_authentique_signe';

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected 
                      ? 'border-emerald-700 ring-2 ring-emerald-700/15 shadow-sm' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 block">{tx.ref}</span>
                      <h5 className="text-sm font-bold text-stone-900 leading-tight">
                        {tx.propertyTitle}
                      </h5>
                      <p className="text-[11px] font-mono text-stone-500 mt-0.5">
                        Réf: {tx.propertyRef}
                      </p>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusLabels[tx.status]?.color}`}>
                      {statusLabels[tx.status]?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-lg text-xs mt-2 border border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Prix Conclu</span>
                      <span className="font-bold text-stone-900">{formatPrice(tx.finalPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Acompte Séquestré</span>
                      <span className="font-semibold text-emerald-700">{formatPrice(tx.depositAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2.5 pt-2 border-t border-stone-100">
                    <span>Acquéreur : <strong>{tx.buyerName}</strong></span>
                    <span>Date cible : {tx.deedTargetDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right transaction detail & closing checklist */}
          {selectedTx && (
            <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
              
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900 font-display">
                      Closing Dossier {selectedTx.ref}
                    </h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusLabels[selectedTx.status]?.color}`}>
                      {statusLabels[selectedTx.status]?.label}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Compromis signé le {selectedTx.compromiseDate} • Échéance Acte : <strong className="text-stone-800">{selectedTx.deedTargetDate}</strong>
                  </p>
                </div>

                {selectedTx.status !== 'cloturee' && selectedTx.status !== 'acte_authentique_signe' && (
                  <button
                    onClick={() => {
                      if (confirm(`Confirmer la signature définitive de l'acte authentique pour ${selectedTx.propertyRef} ? Le bien sera déclaré VENDU.`)) {
                        finalizeSalesTransaction(selectedTx.id);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Clôturer Vente Définitive</span>
                  </button>
                )}
              </div>

              {/* Stakeholders card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 block mb-0.5 uppercase tracking-wider font-semibold">Acquéreur</span>
                  <strong className="text-stone-900 text-sm block">{selectedTx.buyerName}</strong>
                  <span className="text-stone-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {selectedTx.buyerPhone}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 block mb-0.5 uppercase tracking-wider font-semibold">Propriétaire Vendeur</span>
                  <strong className="text-stone-900 text-sm block">{selectedTx.sellerName}</strong>
                  <span className="text-stone-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {selectedTx.sellerPhone}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 block mb-0.5 uppercase tracking-wider font-semibold">Étude Notariale</span>
                  <strong className="text-stone-900 text-sm block">{selectedTx.notaryName}</strong>
                  <span className="text-stone-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {selectedTx.notaryPhone}
                  </span>
                </div>
              </div>

              {/* Financial & Commission breakdown */}
              <div className="grid grid-cols-3 gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80 text-xs">
                <div>
                  <span className="text-stone-500 block">Prix Net Vente</span>
                  <strong className="text-sm font-bold text-stone-900">{formatPrice(selectedTx.finalPrice)}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Séquestre Versé (10%)</span>
                  <strong className="text-sm font-bold text-emerald-800">{formatPrice(selectedTx.depositAmount)}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Honoraires Agence Albayen</span>
                  <strong className="text-sm font-bold text-amber-900">{formatPrice(selectedTx.agencyCommission)}</strong>
                  <span className="text-[10px] text-stone-500 block">{selectedTx.commissionPaid ? '✅ Encaissée' : '⏳ À percevoir à l\'acte'}</span>
                </div>
              </div>

              {/* Checklist Conditions & Titre Foncier */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Contrôle des Conditions Suspensives & Droit Foncier Tunisien
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-white">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-stone-900">Vérification Titre Bleu Individuel</p>
                        <p className="text-[11px] text-stone-500">Conservation Foncière de Sousse : Aucune hypothèque ni inscription bloquante.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Conforme
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-white">
                    <div className="flex items-center gap-2.5">
                      {selectedTx.bankFinancingRequired ? (
                        <Clock className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                      <div>
                        <p className="font-semibold text-stone-900">Financement & Paiement des Fonds</p>
                        <p className="text-[11px] text-stone-500">
                          {selectedTx.bankFinancingRequired ? 'Crédit bancaire en cours d\'instruction' : 'Paiement comptant en devises certifiées (TRE / Expat)'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedTx.bankFinancingRequired ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {selectedTx.bankFinancingRequired ? 'En cours' : 'Validé Comptant'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-white">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-stone-900">Compromis de Vente et Séquestre</p>
                        <p className="text-[11px] text-stone-500">Signatures enregistrées et dépôt de garantie déposé à l'étude notariale.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Séquestré
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <button
                    onClick={() => handleToggleCondition(selectedTx.id, selectedTx.status)}
                    className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
                  >
                    Avancer l'état d'avancement juridique →
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger Dossier Closing
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
