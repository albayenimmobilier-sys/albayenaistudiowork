import React from 'react';
import { Property, PropertyType } from '../../types';
import { 
  Building2, 
  Home, 
  Trees, 
  Store, 
  Briefcase, 
  Warehouse, 
  CheckCircle2, 
  XCircle,
  Maximize2,
  ShieldCheck,
  Zap,
  Droplets,
  Wifi,
  Flame,
  Car
} from 'lucide-react';

interface SpecificSpecsViewerProps {
  property: Property;
}

export const SpecificSpecsViewer: React.FC<SpecificSpecsViewerProps> = ({ property }) => {
  const type = property.type;

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          {type === 'appartement' && <Building2 className="w-4 h-4 text-amber-800" />}
          {(type === 'villa' || type === 'maison') && <Home className="w-4 h-4 text-amber-800" />}
          {type === 'terrain' && <Trees className="w-4 h-4 text-amber-800" />}
          {type === 'local_commercial' && <Store className="w-4 h-4 text-amber-800" />}
          {type === 'bureau' && <Briefcase className="w-4 h-4 text-amber-800" />}
          {type === 'entrepot' && <Warehouse className="w-4 h-4 text-amber-800" />}
          
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Caractéristiques Techniques Typées ({type})
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
          Fiche Certifiée Albayen
        </span>
      </div>

      {/* APPARTEMENT */}
      {type === 'appartement' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Étage & Immeuble</span>
            <strong className="text-stone-900">{property.floor || 3}ème étage / {property.totalFloors || 6}</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Ascenseur Otis HD</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Inclus (Double cabine)
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Parking Réservé</span>
            <strong className="text-stone-900">1 Place en Sous-sol sécurisé</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Extérieurs</span>
            <strong className="text-stone-900">Balcon + Terrasse vue dégagée</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Résidence & Syndic</span>
            <strong className="text-stone-900">Gardée 24/7 · 75 DT/mois charges</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Menuiserie & Finition</span>
            <strong className="text-stone-900">Aluminium double vitrage TPR</strong>
          </div>
        </div>
      )}

      {/* VILLA */}
      {(type === 'villa' || type === 'maison') && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Jardin Paysager</span>
            <strong className="text-stone-900">Arboré {property.landSurface ? property.landSurface - property.surface : 280} m²</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Piscine Privée</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 8x4m à débordement
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Garage Fermé</span>
            <strong className="text-stone-900">2 Véhicules + Porte motorisée</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Niveaux / Architecture</span>
            <strong className="text-stone-900">RDC + R+1 indépendant</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Dépendances</span>
            <strong className="text-stone-900">Logement gardien + Studio invité</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Vue & Exposition</span>
            <strong className="text-stone-900">Plein Sud · Aperçu Mer Kantaoui</strong>
          </div>
        </div>
      )}

      {/* TERRAIN */}
      {type === 'terrain' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Vocation Urbanistique</span>
            <strong className="text-stone-900">R+2 Résidentiel & Villas</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Constructibilité (COS / CES)</span>
            <strong className="text-stone-900">COS : 0.5 · CES : 1.8</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Façade Linéaire</span>
            <strong className="text-stone-900">22 Mètres sur voie goudronnée 12m</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Viabilisation Réseaux</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <Zap className="w-3 h-3" /> STEG · <Droplets className="w-3 h-3" /> SONEDE · ONAS
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Statut Juridique Foncier</span>
            <strong className="text-emerald-700 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Titre Bleu Individuel
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Topographie</span>
            <strong className="text-stone-900">Terrain plat, prêt à bâtir</strong>
          </div>
        </div>
      )}

      {/* LOCAL COMMERCIAL */}
      {type === 'local_commercial' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Vitrine Linéaire</span>
            <strong className="text-stone-900">12 Mètres linéaires sur artère passante</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Extraction Fumée</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Conduit d'extraction aux normes
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Réserve & Stockage</span>
            <strong className="text-stone-900">35 m² avec accès livraison indépendant</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Activités Autorisées</span>
            <strong className="text-stone-900">Tous commerces / Restauration / Services</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Accessibilité PMR</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Conforme de plain-pied
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Électricité</span>
            <strong className="text-stone-900">Compteur Force Triphasé 380V</strong>
          </div>
        </div>
      )}

      {/* BUREAU */}
      {type === 'bureau' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Distribution des Espaces</span>
            <strong className="text-stone-900">Open space 60m² + 3 Bureaux fermés</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Salle de Réunion</span>
            <strong className="text-stone-900">Équipée 12 personnes avec baie vitrée</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Réseau & Télécom</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> Câblage RJ45 Cat6 + Fibre dédiée
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Espace Accueil</span>
            <strong className="text-stone-900">Banque d'accueil & Salle d'attente</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Stationnement</span>
            <strong className="text-stone-900">3 Places nominatives en sous-sol</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Climatisation</span>
            <strong className="text-stone-900">Système centralisé réversible VRV</strong>
          </div>
        </div>
      )}

      {/* ENTREPOT */}
      {type === 'entrepot' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Hauteur Sous Plafond</span>
            <strong className="text-stone-900">8.50 Mètres utiles</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Accès Poids Lourds</span>
            <strong className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accès semi-remorque 40T
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Quais de Déchargement</span>
            <strong className="text-stone-900">2 Quais avec niveleurs hydrauliques</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Résistance Dallage</span>
            <strong className="text-stone-900">5 Tonnes / m² traitement quartz</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Bureaux Intégrés</span>
            <strong className="text-stone-900">65 m² administratifs climatisés</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <span className="text-[10px] text-stone-400 block font-medium">Sécurité Incendie</span>
            <strong className="text-stone-900">Réseau RIA + Trappes désenfumage</strong>
          </div>
        </div>
      )}

    </div>
  );
};
