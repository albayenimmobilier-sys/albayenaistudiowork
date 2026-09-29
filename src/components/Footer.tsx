import React from 'react';
import { Building2, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

interface FooterProps {
  onNavigate: (view: 'public' | 'client-portal' | 'agent-portal' | 'admin-portal', sectionId?: string) => void;
  onOpenRoleSwitcher: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRoleSwitcher }) => {
  const { language, agencySettings } = useApp();
  const t = getTranslation(language);

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span>{t.agencyName}</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Agence immobilière de référence à Sousse. Vente, location, estimation vénale et expertise en droit foncier tunisien.
            </p>
            <div className="pt-2 text-[11px] text-stone-500">
              Agrément Ministère de l'Équipement & de l'Habitat · Titres Fonciers (CPF Sousse)
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider block text-xs mb-3 font-sans">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('public')} className="hover:text-white transition-colors cursor-pointer">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'properties-section')} className="hover:text-white transition-colors cursor-pointer">
                  Biens à Vendre & à Louer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'services-section')} className="hover:text-white transition-colors cursor-pointer">
                  Nos Services Immobiliers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'contact-section')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Localisation
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Accounts */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider block text-xs mb-3 font-sans">
              Espaces Sécurisés
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('client-portal')} className="hover:text-white transition-colors">
                  Espace Client & Acquéreur
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('agent-portal')} className="hover:text-white transition-colors">
                  Espace Agent Négociateur (CRM)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-portal')} className="hover:text-white transition-colors">
                  Back-Office Administration
                </button>
              </li>
              <li>
                <button onClick={onOpenRoleSwitcher} className="text-amber-400 hover:text-amber-300 font-medium">
                  Changer de Profil Démo →
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider block text-xs mb-3 font-sans">
              Bureau Sousse
            </span>
            <p className="text-stone-300">{agencySettings.address}</p>
            <p className="text-stone-300">{agencySettings.city}</p>
            <p className="text-stone-300">Tél : {agencySettings.phone}</p>
            <p className="text-stone-300">Email : {agencySettings.email}</p>
          </div>

        </div>

        {/* Quiet Bottom Legal */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Albayen Immobilier Sousse. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Mentions Légales</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-400 cursor-pointer">Protection des Données & RGPD</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-400 cursor-pointer">Barème d'Honoraires</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
