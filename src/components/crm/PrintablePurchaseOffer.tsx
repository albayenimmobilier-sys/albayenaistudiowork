import React, { useRef } from 'react';
import { FullCommercialOffer } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface PrintablePurchaseOfferProps {
  offer: FullCommercialOffer;
  onClose: () => void;
}

export const PrintablePurchaseOffer: React.FC<PrintablePurchaseOfferProps> = ({ offer, onClose }) => {
  const { agencySettings } = useApp();
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer l'Offre d'Achat (A4)</span>
        </button>

        <button
          onClick={onClose}
          className="p-2 bg-white hover:bg-stone-100 text-stone-700 rounded-xl shadow-lg border border-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* A4 Sheet */}
      <div 
        ref={printContainerRef}
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-stone-900 p-10 sm:p-14 shadow-2xl rounded-sm font-serif print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none text-xs leading-relaxed"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-stone-900 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xl">
              A
            </div>
            <div>
              <h1 className="text-base font-bold uppercase tracking-wider text-stone-900 font-sans">
                {agencySettings.agencyName}
              </h1>
              <p className="text-[10px] text-stone-600 font-sans">
                Cabinet d'Affaires Immobilières & Transactions · Sousse
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                Tél : {agencySettings.phone} · Email : {agencySettings.email}
              </p>
            </div>
          </div>

          <div className="text-right font-sans">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-900 text-[11px] font-bold rounded border border-emerald-200 uppercase">
              Offre d'Achat Formelle
            </span>
            <div className="text-[11px] font-mono font-bold text-stone-800 mt-1">
              Réf : {offer.ref}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-stone-900 font-sans">
            OFFRE D'ACHAT FERME ET CONDITIONS D'ACQUISITION
          </h2>
          <p className="text-[10px] text-stone-500 uppercase tracking-wider font-sans mt-0.5">
            Engagement sous seing privé avec conditions suspensives légales
          </p>
        </div>

        {/* Buyer Identity */}
        <div className="border border-stone-300 rounded-lg p-4 mb-5 bg-stone-50 font-sans space-y-2">
          <h3 className="text-[11px] font-bold text-stone-900 uppercase tracking-wide">
            1. IDENTIFICATION DU PROMETTANT-ACQUÉREUR :
          </h3>
          <p>
            Je soussigné(e) M./Mme <strong>{offer.contactName}</strong>, Téléphone : <strong>{offer.contactPhone}</strong>, Email : <strong>{offer.contactEmail}</strong>, déclare par la présente faire offre irrévocable d'achat pour le bien immobilier désigné ci-après.
          </p>
        </div>

        {/* Property Designation */}
        <div className="space-y-3 mb-5 font-sans">
          <h4 className="font-bold text-stone-900 uppercase text-xs">
            2. DÉSIGNATION DU BIEN IMMOBILIER
          </h4>
          <div className="bg-stone-50 p-3.5 rounded border border-stone-200 space-y-1.5 text-xs">
            <div>• <strong>Intitulé du bien :</strong> {offer.propertyTitle}</div>
            <div>• <strong>Référence Albayen :</strong> {offer.propertyRef}</div>
            <div>• <strong>Prix initial affiché en mandat :</strong> {offer.listedPrice.toLocaleString('fr-FR')} TND</div>
            <div>• <strong>Conseiller négociateur en charge :</strong> {offer.agentName}</div>
          </div>
        </div>

        {/* Offer Financial Terms */}
        <div className="space-y-3 mb-5">
          <h4 className="font-bold text-stone-900 uppercase font-sans text-xs">
            3. MONTANT DE L'OFFRE FINANCIÈRE ET MODALITÉS DE RÈGLEMENT
          </h4>
          <p className="text-justify">
            La présente offre est formulée pour le montant net vendeur ferme de :
          </p>
          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 font-sans text-center my-2">
            <span className="text-xs uppercase text-amber-900 font-bold block mb-1">Montant Offert (Dinars Tunisiens)</span>
            <span className="text-2xl font-black text-amber-950 font-sans tracking-tight">
              {offer.offeredAmount.toLocaleString('fr-FR')} DT
            </span>
            <div className="text-[11px] text-stone-500 mt-1">
              (Écart de négociation : {offer.offeredAmount < offer.listedPrice ? `-${((offer.listedPrice - offer.offeredAmount) / offer.listedPrice * 100).toFixed(1)}% par rapport au prix affiché` : 'Offre au prix'})
            </div>
          </div>
        </div>

        {/* Suspensive Conditions */}
        <div className="space-y-3 mb-5">
          <h4 className="font-bold text-stone-900 uppercase font-sans text-xs">
            4. CONDITIONS SUSPENSIVES DE VALIDITÉ
          </h4>
          <p className="text-justify">
            La présente offre d'achat ne deviendra définitive qu'après réalisation expresse des conditions suivantes :
          </p>
          <ul className="list-disc pl-5 space-y-1 font-sans text-stone-700">
            <li>Conformité légale et absence de charges hypothécaires grevant le Titre Bleu individuel auprès de la Conservation Foncière de Sousse.</li>
            <li>Accord formel d'acceptation par le propriétaire mandant avant la date limite du <strong>{offer.validityDate}</strong>.</li>
            {offer.suspensiveConditions && (
              <li><strong>Condition particulière :</strong> {offer.suspensiveConditions}</li>
            )}
          </ul>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-6 border-t-2 border-stone-300 font-sans">
          <div className="flex justify-between items-center mb-8 text-[11px] text-stone-600">
            <span>Fait à Sousse, le {offer.createdAt.substring(0, 10)}</span>
            <span>Date d'expiration de l'offre : {offer.validityDate}</span>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="border border-stone-300 rounded p-4 h-32 flex flex-col justify-between">
              <strong className="text-stone-900 block">L'ACQUÉREUR PROMETTANT</strong>
              <div className="text-[10px] text-stone-400 italic">Signature précédée de la mention « Bon pour offre d'achat »</div>
            </div>

            <div className="border border-stone-300 rounded p-4 h-32 flex flex-col justify-between bg-stone-50/50">
              <div>
                <strong className="text-stone-900 block">LE PROPRIÉTAIRE VENDEUR</strong>
                <span className="text-[10px] text-stone-500">Mention : « Offre acceptée » ou « Offre déclinée »</span>
              </div>
              <div className="text-[10px] text-stone-400 italic">Date et signature du vendeur</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[9px] text-stone-400 font-sans border-t border-stone-200 pt-3">
          Albayen Immobilier Sousse · Document officiel d'entremise · Offre {offer.ref}
        </div>

      </div>
    </div>
  );
};
