import React from 'react';
import { FileText, Printer, X, ShieldCheck, MapPin, Bed, Bath, Maximize2, Phone, Mail, CheckCircle2, Building, Calendar } from 'lucide-react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';

interface PrintableCommercialSheetProps {
  property: Property;
  onClose: () => void;
}

export const PrintableCommercialSheet: React.FC<PrintableCommercialSheetProps> = ({ property, onClose }) => {
  const { agencySettings, formatPrice, agents } = useApp();
  const agent = agents.find(a => a.id === property.agentId) || agents[0];

  const handlePrint = () => {
    window.print();
  };

  const eurPrice = Math.round(property.price / agencySettings.exchangeRateEUR);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[95vh] overflow-y-auto print:p-0 print:border-none print:shadow-none print:max-h-none">
        
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 print:hidden">
          <div className="flex items-center gap-2 text-stone-700">
            <FileText className="w-5 h-5 text-amber-800" />
            <h3 className="text-sm font-bold">Fiche Commerciale & Vitrine — {property.ref}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer Fiche A4</span>
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="space-y-6 text-stone-900 font-sans text-xs">
          
          {/* Header Agency */}
          <div className="flex items-start justify-between border-b-2 border-amber-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-800" />
                <h1 className="text-xl font-display font-black text-amber-900 tracking-tight">
                  {agencySettings.agencyName}
                </h1>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">{agencySettings.tagline}</p>
              <p className="text-[10px] text-stone-500 mt-1">
                {agencySettings.address} • {agencySettings.city}
              </p>
              <p className="text-[10px] text-stone-500">
                Tél : {agencySettings.phone} • WhatsApp : {agencySettings.whatsapp} • Email : {agencySettings.email}
              </p>
            </div>

            <div className="text-right">
              <div className="border border-stone-300 px-3 py-1.5 rounded-lg bg-stone-50">
                <span className="text-[10px] text-stone-400 block uppercase font-mono">Mandat & Fiche Réf.</span>
                <strong className="text-sm font-mono text-amber-900">{property.ref}</strong>
              </div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Titre Foncier (Titre Bleu) Vérifié
              </span>
            </div>
          </div>

          {/* Title and Price Banner */}
          <div className="bg-stone-900 text-white p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                {property.transactionType === 'sale' ? 'Propriété à Vendre' : 'Bien en Location'} • {property.district}, Sousse
              </span>
              <h2 className="text-lg font-display font-bold text-white mt-0.5">
                {property.title}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-display text-amber-400 tabular-nums">
                {formatPrice(property.price)}
              </div>
              <div className="text-[11px] text-stone-300">
                (~{eurPrice.toLocaleString('fr-FR')} EUR)
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={property.mainImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              {(property.images && property.images.length > 1 ? property.images.slice(1, 3) : [property.mainImage]).map((img, idx) => (
                <div key={idx} className="flex-1 aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-4 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Surface Habitable</span>
              <strong className="text-sm font-display text-stone-900">{property.surface} m²</strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Chambres</span>
              <strong className="text-sm font-display text-stone-900">{property.bedrooms} Pièces</strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Salles de Bain</span>
              <strong className="text-sm font-display text-stone-900">{property.bathrooms} SDB</strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Quartier</span>
              <strong className="text-sm font-display text-amber-900">{property.district}</strong>
            </div>
          </div>

          {/* Description & Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Description du Bien
              </h4>
              <p className="text-stone-700 leading-relaxed text-xs">
                {property.description}
              </p>

              <div className="pt-2">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Prestations & Équipements inclus :
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {property.features.map((feat, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-medium border border-stone-200">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial / Legal Info */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Garanties Juridiques
              </h4>
              <ul className="text-[10px] text-stone-600 space-y-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Titre de propriété individuel en règle</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Attestation de non-hypothèque</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Mandat exclusif Albayen Sousse</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Dossier technique de conformité</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-stone-200 mt-2">
                <span className="text-[9px] uppercase font-bold text-stone-400 block">Simulation Crédit (estimation)</span>
                <span className="text-xs font-bold text-stone-800 block mt-0.5">
                  Mensualité dès ~{Math.round((property.price * 0.8 * 0.009)).toLocaleString('fr-FR')} DT/mois
                </span>
                <span className="text-[9px] text-stone-500">Sous réserve d'accord bancaire (durée 20 ans)</span>
              </div>
            </div>
          </div>

          {/* Footer Agent & Agency Contact */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {agent?.avatar && (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
              )}
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Conseiller en charge :</span>
                <strong className="text-xs font-bold text-stone-900 block">{agent?.name || 'Agence Albayen Sousse'}</strong>
                <span className="text-[10px] text-stone-600">{agent?.phone || agencySettings.phone}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-700 block">Albayen Immobilier Sousse</span>
              <span className="text-[9px] text-stone-400 block">Sousse, Tunisie • www.albayen-immobilier-sousse.tn</span>
              <span className="text-[9px] text-stone-400 block">Document commercial non contractuel</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
