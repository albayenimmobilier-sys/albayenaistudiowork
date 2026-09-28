import React from 'react';
import { ShieldCheck, TrendingUp, Key, FileCheck, PhoneCall, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AgencyServices: React.FC = () => {
  const { agencySettings } = useApp();

  const services = [
    {
      num: '01',
      title: 'Commercialisation & Vente Immobilière',
      description: 'Mise en valeur haut de gamme de vos villas, appartements et terrains. Photographies professionnelles, diffusion multi-canal, qualification des acquéreurs et négociation transparente.',
      features: ['Dossier commercial complet', 'Sélection rigoureuse des acquéreurs', 'Accompagnement jusqu\'à la signature notariée']
    },
    {
      num: '02',
      title: 'Gestion Locative & Conciergerie',
      description: 'Gestion sereine de votre patrimoine locatif à l\'année ou en saisonnier à Sousse et Kantaoui. Recherche de locataires solvables, rédaction des baux conformes et encaissement.',
      features: ['Recherche et scoring locataires', 'États des lieux minutieux', 'Gestion des loyers et entretien']
    },
    {
      num: '03',
      title: 'Expertise & Estimation Vénale',
      description: 'Évaluation objective basée sur les transactions réelles enregistrées au Sahel tunisien. Définition du prix optimal pour vendre dans les meilleurs délais sans déprécier votre bien.',
      features: ['Analyse comparative de marché', 'Avis de valeur écrit sous 48h', 'Recommandations de valorisation']
    },
    {
      num: '04',
      title: 'Audit Juridique & Sécurité Foncière (Titre Bleu)',
      description: 'Vérification méticuleuse auprès de la Conservation de la Propriété Foncière (CPF de Sousse). Titre individuel, servitudes, autorisations administratives et assistance aux Tunisiens Résidant à l\'Étranger (TRE).',
      features: ['Contrôle du Titre Foncier (Titre Bleu)', 'Conformité urbanistique & cadastre', 'Accompagnement bilingue dédié']
    }
  ];

  return (
    <section id="services-section" className="py-16 sm:py-20 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 block mb-2">
            Notre Métier & Engagements
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
            Des Services Immobiliers d'Excellence Conçus pour Sécuriser Vos Projets
          </h2>
          <p className="mt-3 text-sm text-stone-600 font-light leading-relaxed">
            {agencySettings.aboutDescription}
          </p>
        </div>

        {/* Services Grid with Clean Editorial Numbering */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-stone-50 border border-stone-200/90 hover:border-stone-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-2xl font-bold text-amber-800 tabular-nums">
                    {srv.num}.
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Albayen Sousse
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal mb-5">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/60 space-y-2">
                {srv.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-700">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
