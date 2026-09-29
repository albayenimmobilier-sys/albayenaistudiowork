import React, { useRef } from 'react';
import { Mandate } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, Download, X, Building2, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

interface PrintableMandateContractProps {
  mandate: Mandate;
  onClose: () => void;
}

export const PrintableMandateContract: React.FC<PrintableMandateContractProps> = ({ mandate, onClose }) => {
  const { agencySettings } = useApp();
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Top Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer le Mandat Officiel (A4)</span>
        </button>

        <button
          onClick={onClose}
          className="p-2 bg-white hover:bg-stone-100 text-stone-700 rounded-xl shadow-lg border border-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* A4 Contract Container */}
      <div 
        ref={printContainerRef}
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-stone-900 p-10 sm:p-14 shadow-2xl rounded-sm font-serif print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none text-xs leading-relaxed"
      >
        {/* Agence Header */}
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
                Agence Immobilière Agréée · Sousse, République Tunisienne
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                Tél : {agencySettings.phone} · Email : {agencySettings.email} · Adresse : {agencySettings.address}
              </p>
            </div>
          </div>

          <div className="text-right font-sans">
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-900 text-[11px] font-bold rounded border border-amber-200 uppercase">
              Mandat {mandate.type.replace('_', ' ')}
            </span>
            <div className="text-[11px] font-mono font-bold text-stone-800 mt-1">
              Réf : {mandate.mandateNumber}
            </div>
          </div>
        </div>

        {/* Contract Title */}
        <div className="text-center my-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-stone-900 font-sans">
            MANDAT DE RECHERCHE ET D'ENTREMISE IMMOBILIÈRE
          </h2>
          <p className="text-[10px] text-stone-500 uppercase tracking-wider font-sans mt-0.5">
            Conforme à la législation et aux usages professionnels de l'immobilier en Tunisie
          </p>
        </div>

        {/* Parties Identification */}
        <div className="border border-stone-300 rounded-lg p-4 mb-5 bg-stone-50 font-sans space-y-2">
          <h3 className="text-[11px] font-bold text-stone-900 uppercase tracking-wide">
            ENTRE LES SOUSSIGNÉS :
          </h3>
          <p>
            <strong>1. LE MANDANT (Propriétaire / Vendeur) :</strong><br />
            M./Mme <strong>{mandate.ownerName}</strong>, titulaire de la Carte d'Identité Nationale ou Passeport, agissant en qualité de légitime propriétaire des lieux.
          </p>
          <p>
            <strong>2. LE MANDATAIRE (L'Agence) :</strong><br />
            La Société <strong>ALBAYEN IMMOBILIER SOUSSE</strong>, représentée par l'agent négociateur assermenté <strong>{mandate.agentName}</strong>.
          </p>
        </div>

        {/* Article 1: Objet du Mandat */}
        <div className="space-y-3 mb-5">
          <h4 className="font-bold text-stone-900 uppercase font-sans text-xs">
            ARTICLE 1 — OBJET DU MANDAT ET DÉSIGNATION DU BIEN
          </h4>
          <p className="text-justify">
            Le mandant confie par les présentes au mandataire, qui accepte, mandat {mandate.type === 'exclusif' ? 'EXCLUSIF' : 'NON-EXCLUSIF'} d'entremise pour la vente du bien immobilier suivant :
          </p>
          <div className="bg-stone-50 p-3 rounded border border-stone-200 font-sans space-y-1">
            <div>• <strong>Désignation :</strong> {mandate.propertyTitle} (Réf : {mandate.propertyRef})</div>
            <div>• <strong>Garantie Foncière :</strong> Titre Bleu individuel vérifié auprès de la Conservation Foncière de Sousse.</div>
            <div>• <strong>Prix demandé net vendeur :</strong> {mandate.askingPrice.toLocaleString('fr-FR')} Dinars Tunisiens (TND).</div>
            <div>• <strong>Prix de présentation commerciale :</strong> {mandate.marketingPrice.toLocaleString('fr-FR')} Dinars Tunisiens (TND).</div>
          </div>
        </div>

        {/* Article 2: Rémunération et Honoraires */}
        <div className="space-y-3 mb-5">
          <h4 className="font-bold text-stone-900 uppercase font-sans text-xs">
            ARTICLE 2 — HONORAIRES DE NÉGOCIATION ET COMMISSIONS
          </h4>
          <p className="text-justify">
            En rémunération de son entremise, de ses démarches publicitaires et de l'accompagnement jusqu'à l'acte authentique de vente, le mandataire percevra une commission convenue de <strong>{mandate.commissionRate}% HT</strong> du montant de la transaction finale, soit la somme estimée de <strong>{mandate.commissionAmount.toLocaleString('fr-FR')} TND</strong>. Cette rémunération deviendra exigible le jour de la signature de l'acte de vente notarié.
          </p>
        </div>

        {/* Article 3: Durée du Mandat */}
        <div className="space-y-3 mb-5">
          <h4 className="font-bold text-stone-900 uppercase font-sans text-xs">
            ARTICLE 3 — DURÉE ET VALIDITÉ
          </h4>
          <p className="text-justify">
            Le présent mandat prend effet le <strong>{mandate.startDate}</strong> pour se terminer le <strong>{mandate.endDate}</strong>. Sauf dénonciation expresse par lettre recommandée avec accusé de réception ou acte d'huissier notificateur au moins 15 jours avant terme, il se renouvellera par tacite reconduction par périodes de 3 mois.
          </p>
        </div>

        {/* Article 4: Conditions Particulières */}
        {mandate.specialConditions && (
          <div className="space-y-2 mb-5">
            <h4 className="font-bold text-stone-900 uppercase font-sans text-xs">
              ARTICLE 4 — CONDITIONS PARTICULIÈRES ET CLAUSES SPÉCIALES
            </h4>
            <p className="bg-stone-50 p-2.5 rounded border border-stone-200 italic">
              "{mandate.specialConditions}"
            </p>
          </div>
        )}

        {/* Signatures */}
        <div className="mt-12 pt-6 border-t-2 border-stone-300 font-sans">
          <div className="flex justify-between items-center mb-8 text-[11px] text-stone-600">
            <span>Fait à Sousse, en deux exemplaires originaux, le {mandate.startDate}</span>
            <span>Mention manuscrite obligatoire : « Lu et approuvé, bon pour mandat »</span>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="border border-stone-300 rounded p-4 h-32 flex flex-col justify-between">
              <strong className="text-stone-900 block">LE MANDANT (Propriétaire)</strong>
              <div className="text-[10px] text-stone-400 italic">Signature précédée de la mention manuscrite</div>
            </div>

            <div className="border border-stone-300 rounded p-4 h-32 flex flex-col justify-between bg-stone-50/50">
              <div>
                <strong className="text-stone-900 block">POUR L'AGENCE ALBAYEN IMMOBILIER</strong>
                <span className="text-[10px] text-stone-500">Cachet officiel et signature du négociateur</span>
              </div>
              <div className="text-[10px] text-amber-800 font-bold">Document certifié conforme</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-[9px] text-stone-400 font-sans border-t border-stone-200 pt-3">
          Albayen Immobilier Sousse · RC Sousse B0123452026 · Matricule Fiscal 1845920/B/A/M/000 · Mandat {mandate.mandateNumber}
        </div>

      </div>
    </div>
  );
};
