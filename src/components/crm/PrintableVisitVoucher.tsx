import React from 'react';
import { FileText, Download, Printer, X, ShieldCheck } from 'lucide-react';
import { Visit } from '../../types';
import { useApp } from '../../context/AppContext';

interface PrintableVisitVoucherProps {
  visit: Visit;
  onClose: () => void;
}

export const PrintableVisitVoucher: React.FC<PrintableVisitVoucherProps> = ({ visit, onClose }) => {
  const { agencySettings, formatPrice, agents } = useApp();
  const agent = agents.find(a => a.id === visit.agentId) || { name: 'Conseiller Albayen', phone: agencySettings.mobile };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[95vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 print:hidden">
          <div className="flex items-center gap-2 text-stone-700">
            <FileText className="w-5 h-5 text-amber-800" />
            <h3 className="text-sm font-bold">Bon de Visite Officiel — Albayen Immobilier</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer / PDF
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="space-y-6 text-stone-900 font-sans text-xs">
          
          {/* Header Agency */}
          <div className="flex items-start justify-between border-b-2 border-amber-900 pb-4">
            <div>
              <h1 className="text-xl font-display font-black text-amber-900 tracking-tight">
                {agencySettings.agencyName}
              </h1>
              <p className="text-[11px] text-stone-600 mt-0.5">{agencySettings.tagline}</p>
              <p className="text-[10px] text-stone-500 mt-1">
                {agencySettings.address} • {agencySettings.city}
              </p>
              <p className="text-[10px] text-stone-500">
                Tél : {agencySettings.phone} • Port : {agencySettings.mobile} • Email : {agencySettings.email}
              </p>
            </div>

            <div className="text-right">
              <div className="border border-stone-300 px-3 py-1.5 rounded-lg bg-stone-50">
                <span className="text-[10px] text-stone-400 block uppercase font-mono">Document N°</span>
                <strong className="text-xs font-mono text-stone-900">BV-{visit.id.replace('visit-', '').substring(0, 8)}</strong>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Date d'édition : {new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          <div className="text-center py-2 bg-stone-100 rounded-lg">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Bon de Visite & Reconnaissance d'Intermédiation
            </h2>
          </div>

          {/* Client identification */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-2">
              1. Identité du Visiteur
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-stone-500">Nom & Prénom :</span>
                <strong className="text-stone-900 block">{visit.clientName}</strong>
              </div>
              <div>
                <span className="text-stone-500">Téléphone de contact :</span>
                <strong className="text-stone-900 block">{visit.clientPhone}</strong>
              </div>
              <div>
                <span className="text-stone-500">Adresse Email :</span>
                <strong className="text-stone-900 block">{visit.clientEmail || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-stone-500">Nombre de personnes accompagnantes :</span>
                <strong className="text-stone-900 block">{visit.visitorsCount || 1} personne(s)</strong>
              </div>
            </div>
          </div>

          {/* Property identification */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-2">
              2. Désignation du Bien Immobilier Visité
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-stone-500">Référence Mandat / Bien :</span>
                <strong className="text-amber-900 font-mono block">{visit.propertyRef}</strong>
              </div>
              <div>
                <span className="text-stone-500">Prix de commercialisation :</span>
                <strong className="text-stone-900 block">{formatPrice(visit.propertyPrice)}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500">Désignation du bien :</span>
                <strong className="text-stone-900 block">{visit.propertyTitle}</strong>
              </div>
              <div>
                <span className="text-stone-500">Date et heure de la visite :</span>
                <strong className="text-stone-900 block">{visit.date} à {visit.timeSlot}</strong>
              </div>
              <div>
                <span className="text-stone-500">Conseiller accompagnateur :</span>
                <strong className="text-stone-900 block">{agent.name} ({agent.phone})</strong>
              </div>
            </div>
          </div>

          {/* Legal commitment clause */}
          <div className="border border-stone-300 rounded-xl p-3.5 space-y-2 text-[10px] text-stone-600 leading-relaxed text-justify">
            <p className="font-bold text-stone-800 uppercase">
              Clause d'Engagement et de Non-Contournement :
            </p>
            <p>
              Le visiteur soussigné reconnaît expressément avoir visité ce jour le bien désigné ci-dessus par l'entremise exclusive du cabinet <strong>Albayen Immobilier Sousse</strong>. 
              En conséquence, le visiteur s'interdit formellement de traiter l'acquisition ou la location de ce bien, directement avec le propriétaire vendeur ou par l'intermédiaire d'un tiers, pendant une durée de 12 mois à compter de la présente date.
            </p>
            <p>
              Toute négociation ou conclusion d'accord sans le concours d'Albayen Immobilier engagera la responsabilité pleine et entière du visiteur quant au versement solidaire des honoraires d'agence convenus au mandat.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6">
            <div className="border border-stone-300 rounded-xl p-4 h-32 flex flex-col justify-between">
              <span className="font-bold text-stone-800 text-[11px]">Signature du Client Visiteur</span>
              <span className="text-[10px] text-stone-400 italic">Mention manuscrite "Bon pour accord" + Signature</span>
            </div>

            <div className="border border-stone-300 rounded-xl p-4 h-32 flex flex-col justify-between">
              <span className="font-bold text-stone-800 text-[11px]">Cachet & Signature Albayen Immobilier</span>
              <span className="text-[10px] text-stone-400 italic">Pour le cabinet Albayen Sousse</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
