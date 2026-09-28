import React from 'react';
import { X, Check, Shield, User, Briefcase, Key, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface RoleSwitcherModalProps {
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ onClose }) => {
  const { currentUser, switchRole } = useApp();

  const rolesList: {
    role: UserRole;
    name: string;
    title: string;
    description: string;
    badge: string;
    icon: any;
  }[] = [
    {
      role: 'visitor',
      name: 'Visiteur Public',
      title: 'Navigation générale & Recherche',
      description: 'Consultation des annonces, filtres avancés, mise en favoris, simulateur de crédit, demandes de visite et d\'information.',
      badge: 'Accès Public',
      icon: Compass
    },
    {
      role: 'client',
      name: 'Anis Gharbi (Client Acheteur)',
      title: 'Espace Client & Acquéreur',
      description: 'Suivi de ses demandes de visite en temps réel, alertes de recherche, offres d\'achat émises et messagerie directe.',
      badge: 'Portail Client',
      icon: User
    },
    {
      role: 'agent',
      name: 'Karim Ben Salah (Agent Senior)',
      title: 'Espace CRM & Négociateur Terrain',
      description: 'Pipeline commercial des prospects attribués, gestion et validation de ses visites, compte-rendus de visite, portefeuille sous mandat.',
      badge: 'Portail Agent CRM',
      icon: Briefcase
    },
    {
      role: 'admin',
      name: 'Sonia Trabelsi (Directrice des Opérations)',
      title: 'Back-office Administrateur Agence',
      description: 'Gestion globale des annonces (création, modification, publication), suivi de tous les prospects, affectation des agents, propriétaires.',
      badge: 'Back-Office Complet',
      icon: Shield
    },
    {
      role: 'superadmin',
      name: 'Direction Albayen Sousse',
      title: 'Super Administrateur & Audit',
      description: 'Contrôle absolu : journal d\'activité (audit log IP/dates), configuration générale, taux de change, sauvegarde & restauration JSON.',
      badge: 'Super Admin ERP',
      icon: Key
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-display font-bold text-stone-900">
              Changer de Profil Démonstration
            </h2>
            <p className="text-xs text-stone-500">
              Basculez instantanément pour tester tous les rôles du cahier des charges
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-4 sm:p-5 space-y-2.5 max-h-[75vh] overflow-y-auto">
          {rolesList.map(item => {
            const isSelected = currentUser.role === item.role;
            const IconComponent = item.icon;

            return (
              <div
                key={item.role}
                onClick={() => {
                  switchRole(item.role);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-xs">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-amber-900 block mt-0.5">
                        {item.title}
                      </span>
                      <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
          <p className="text-[11px] text-stone-500">
            Les données créées ou modifiées sont automatiquement synchronisées dans le stockage local du navigateur.
          </p>
        </div>

      </div>
    </div>
  );
};
