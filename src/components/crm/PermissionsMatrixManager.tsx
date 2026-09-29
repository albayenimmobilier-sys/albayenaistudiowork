import React, { useState } from 'react';
import { UserRole, RolePermissionsMatrix } from '../../types';
import { DEFAULT_PERMISSIONS_MATRIX } from '../../data/defaultPermissions';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Check, 
  X, 
  Save, 
  RotateCcw, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  KeyRound
} from 'lucide-react';

export const PermissionsMatrixManager: React.FC = () => {
  const [matrix, setMatrix] = useState<Record<UserRole, RolePermissionsMatrix>>(DEFAULT_PERMISSIONS_MATRIX);
  const [selectedRole, setSelectedRole] = useState<UserRole>('agent');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const rolesList: { id: UserRole; label: string; desc: string }[] = [
    { id: 'superadmin', label: 'Direction Générale (Super Admin)', desc: 'Accès sans restriction à l\'ensemble du parc, des finances et des audits.' },
    { id: 'admin', label: 'Responsable d\'Agence (Admin)', desc: 'Supervision de l\'agence de Sousse, validation des mandats et closing.' },
    { id: 'agent', label: 'Agent Négociateur', desc: 'Gestion de ses mandats, négociation d\'offres et visites clients.' },
    { id: 'client', label: 'Client / Acquéreur / Vendeur', desc: 'Portail client privé, suivi de ses offres et demandes de visite.' },
    { id: 'visitor', label: 'Visiteur Public', desc: 'Consultation du catalogue public et dépôt de requêtes d\'information.' }
  ];

  const currentRolePerms = matrix[selectedRole];

  const togglePropertyPerm = (key: keyof typeof currentRolePerms.properties) => {
    if (selectedRole === 'superadmin') return; // Cannot downgrade superadmin
    setMatrix(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        properties: {
          ...prev[selectedRole].properties,
          [key]: !prev[selectedRole].properties[key]
        }
      }
    }));
  };

  const toggleContactPerm = (key: keyof typeof currentRolePerms.contacts) => {
    if (selectedRole === 'superadmin') return;
    setMatrix(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        contacts: {
          ...prev[selectedRole].contacts,
          [key]: !prev[selectedRole].contacts[key]
        }
      }
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setMatrix(DEFAULT_PERMISSIONS_MATRIX);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-600/30 text-amber-400 border border-amber-500/40">
              <KeyRound className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Sécurité & Contrôle d'Accès (RBAC)
            </span>
          </div>
          <h2 className="text-xl font-display font-bold text-white">
            Matrice des Permissions & Niveaux de Confidentialité
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Régulez finement la visibilité des données publiques, internes (équipe) et hautement confidentielles (Titres Bleus, CIN, marges).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 border border-stone-700 hover:border-stone-500 text-stone-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer la politique</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 border-b border-emerald-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Politique de permissions RBAC mise à jour et appliquée immédiatement à toute l'agence.</span>
        </div>
      )}

      {/* Role Tabs */}
      <div className="p-6 border-b border-stone-200 bg-stone-50">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Sélectionnez le rôle à inspecter ou paramétrer :
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {rolesList.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === r.id 
                  ? 'bg-white border-amber-800 ring-2 ring-amber-800/20 shadow-xs' 
                  : 'bg-stone-100 border-stone-200 hover:bg-white text-stone-600'
              }`}
            >
              <div className="text-xs font-bold text-stone-900 truncate">{r.label.split('(')[0]}</div>
              <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Tables */}
      <div className="p-6 space-y-6">
        
        {/* Module 1: Parc Immobilier */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-stone-100 px-4 py-3 flex items-center justify-between border-b border-stone-200">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Module 1 : Biens & Fiches Immobilières
            </span>
            <span className="text-[11px] text-stone-500 font-medium">
              Rôle actif : <strong className="text-stone-800">{selectedRole.toUpperCase()}</strong>
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white text-xs">
            {[
              { key: 'viewPublic', label: 'Voir Données Publiques', desc: 'Titre, photos, prix affiché, quartier' },
              { key: 'viewInternal', label: 'Voir Données Internes', desc: 'Notes de négociation, marge, coordonnées vendeur' },
              { key: 'viewConfidential', label: 'Voir Confidentiel (Cadenas)', desc: 'Titre Foncier N°, CIN, Prix Plancher net vendeur' },
              { key: 'create', label: 'Créer de Nouveaux Biens', desc: 'Saisie et enregistrement de fiches' },
              { key: 'edit', label: 'Modifier les Fiches', desc: 'Mise à jour des prix, photos et statuts' },
              { key: 'delete', label: 'Supprimer Définitivement', desc: 'Effacement de bien du système' },
              { key: 'exportData', label: 'Exporter le Portefeuille', desc: 'Téléchargement CSV / Excel' }
            ].map(item => {
              const isAllowed = (currentRolePerms.properties as any)[item.key];
              return (
                <div 
                  key={item.key}
                  onClick={() => togglePropertyPerm(item.key as any)}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-2 cursor-pointer transition-colors ${
                    isAllowed ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-stone-50 opacity-60'
                  }`}
                >
                  <div>
                    <strong className={`block text-xs ${isAllowed ? 'text-emerald-950 font-bold' : 'text-stone-600'}`}>
                      {item.label}
                    </strong>
                    <span className="text-[10px] text-stone-500">{item.desc}</span>
                  </div>

                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white ${
                    isAllowed ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}>
                    {isAllowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module 2: CRM & Contacts */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-stone-100 px-4 py-3 flex items-center justify-between border-b border-stone-200">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Module 2 : CRM & Base Contacts
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white text-xs">
            {[
              { key: 'viewAllContacts', label: 'Voir TOUS les contacts agence', desc: 'Accès transversal au carnet d\'adresses' },
              { key: 'viewOwnerPhone', label: 'Voir Numéro Propriétaire', desc: 'Affichage en clair du téléphone vendeur' },
              { key: 'create', label: 'Créer de Nouveaux Contacts', desc: 'Ajout de prospects, acquéreurs et mandants' },
              { key: 'exportData', label: 'Exporter la Base Contacts', desc: 'Export de la clientèle pour mailing' }
            ].map(item => {
              const isAllowed = (currentRolePerms.contacts as any)[item.key];
              return (
                <div 
                  key={item.key}
                  onClick={() => toggleContactPerm(item.key as any)}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-2 cursor-pointer transition-colors ${
                    isAllowed ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-stone-50 opacity-60'
                  }`}
                >
                  <div>
                    <strong className={`block text-xs ${isAllowed ? 'text-emerald-950 font-bold' : 'text-stone-600'}`}>
                      {item.label}
                    </strong>
                    <span className="text-[10px] text-stone-500">{item.desc}</span>
                  </div>

                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white ${
                    isAllowed ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}>
                    {isAllowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module 3: Finances & Commissions */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-stone-100 px-4 py-3 flex items-center justify-between border-b border-stone-200">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Module 3 : Commissions & Finances de l'Agence
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white text-xs">
            <div className={`p-3 rounded-xl border ${currentRolePerms.financialStats.viewGlobalRevenue ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-stone-50 opacity-60'}`}>
              <strong className="block text-xs font-bold text-stone-900">Chiffre d'Affaires Global Agence</strong>
              <span className="text-[10px] text-stone-500">Volume total des honoraires encaissés</span>
            </div>
            <div className={`p-3 rounded-xl border ${currentRolePerms.financialStats.viewAgentCommissions ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-stone-50 opacity-60'}`}>
              <strong className="block text-xs font-bold text-stone-900">Commissions Individuelles</strong>
              <span className="text-[10px] text-stone-500">Montants dus au négociateur</span>
            </div>
            <div className={`p-3 rounded-xl border ${currentRolePerms.financialStats.viewAgencyMargin ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-stone-50 opacity-60'}`}>
              <strong className="block text-xs font-bold text-stone-900">Marge Nette Agence</strong>
              <span className="text-[10px] text-stone-500">Réservé exclusivement à la Direction</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
