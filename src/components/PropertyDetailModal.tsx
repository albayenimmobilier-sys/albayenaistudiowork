import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Calendar, 
  Share2, 
  Heart, 
  Phone, 
  MessageSquare, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Compass, 
  Building, 
  ShieldCheck, 
  Clock,
  Printer
} from 'lucide-react';
import { Property, Agent } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { PrintableCommercialSheet } from './crm/PrintableCommercialSheet';
import { PriceHistoryTimeline } from './crm/PriceHistoryTimeline';
import { SpecificSpecsViewer } from './crm/SpecificSpecsViewer';
import { WatermarkStudio } from './crm/WatermarkStudio';
import { 
  Stamp, 
  Lock, 
  Unlock, 
  Radio, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onRequestVisit: (property: Property) => void;
  onRequestInfo: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onRequestVisit,
  onRequestInfo
}) => {
  const { language, formatPrice, isFavorite, toggleFavorite, agents, agencySettings } = useApp();
  const t = getTranslation(language);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'history' | 'location' | 'credit' | 'docs' | 'confidential'>('details');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showCommercialSheet, setShowCommercialSheet] = useState(false);
  const [showWatermarkStudio, setShowWatermarkStudio] = useState(false);

  // Credit Simulator State (Tunisian Bank parameters)
  const [personalDownPayment, setPersonalDownPayment] = useState(Math.round(property.price * 0.2));
  const [loanDurationYears, setLoanDurationYears] = useState(20);
  const [interestRate, setInterestRate] = useState(10.25); // Tunisian standard TMM + bank margin

  const loanAmount = Math.max(0, property.price - personalDownPayment);
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanDurationYears * 12;
  const monthlyPayment = loanAmount > 0
    ? Math.round((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths)))
    : 0;

  const assignedAgent = agents.find(a => a.id === property.agentId) || agents[0];
  const favorited = isFavorite(property.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Bonjour Albayen Immobilier Sousse, je suis intéressé par le bien réf. ${property.ref} : "${property.title}" (${formatPrice(property.price)}). Pourriez-vous me renseigner ?`);
    window.open(`https://wa.me/${agencySettings.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const imagesList = property.images && property.images.length > 0 
    ? property.images 
    : [property.mainImage];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-sm">
              {property.ref}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {property.district}, {property.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCommercialSheet(true)}
              className="p-2 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium cursor-pointer"
              title="Générer la Fiche Commerciale / Vitrine A4"
            >
              <Printer className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">Fiche Vitrine</span>
            </button>

            <button
              onClick={() => setShowWatermarkStudio(true)}
              className="p-2 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium cursor-pointer border border-amber-200/60"
              title="Watermark Studio · Filigrane officiel des visuels"
            >
              <Stamp className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">Filigrane</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
              title="Partager le bien"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedShare ? 'Lien copié !' : 'Partager'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium ${
                favorited ? 'text-rose-600 bg-rose-50' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
              title="Favoris"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{favorited ? 'Enregistré' : 'Favoris'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Main Gallery Display */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full bg-stone-900 rounded-xl overflow-hidden group">
              <img
                src={imagesList[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Controls */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors opacity-90 group-hover:opacity-100"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors opacity-90 group-hover:opacity-100"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-sm">
                Photo {currentImageIndex + 1} / {imagesList.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      currentImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="miniature" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.address ? `${property.address}, ` : ''}{property.district}, {property.city}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-stone-900 leading-tight">
                {language === 'ar' && property.titleAr ? property.titleAr : property.title}
              </h1>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                {property.transactionType === 'rent' ? 'Loyer Mensuel' : 'Prix Net Vendeur'}
              </span>
              <span className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tabular-nums">
                {formatPrice(property.price)}
              </span>
              {property.transactionType === 'sale' && (
                <span className="text-[11px] text-stone-500 block">
                  ~{Math.round(property.price / property.surface).toLocaleString('fr-FR')} DT / m²
                </span>
              )}
            </div>
          </div>

          {/* Specification Bar (Tabular figures, unboxed) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 rounded-xl p-4 border border-stone-200 text-stone-700">
            <div>
              <span className="text-[11px] text-stone-500 block uppercase font-medium">Surface</span>
              <span className="text-sm font-semibold text-stone-900 tabular-nums">{property.surface} m²</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block uppercase font-medium">Chambres</span>
              <span className="text-sm font-semibold text-stone-900 tabular-nums">{property.bedrooms > 0 ? `${property.bedrooms} pièces` : 'Non spécifié'}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block uppercase font-medium">Salles de bain</span>
              <span className="text-sm font-semibold text-stone-900 tabular-nums">{property.bathrooms}</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block uppercase font-medium">Titre Juridique</span>
              <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Titre Bleu individuel</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-stone-200 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Description & Prestations
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Fiche Technique Typée
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Évolution du Prix
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'location'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Quartier & Commodités
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'credit'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Simulateur Crédit Bancaire
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Documents ({property.documents?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('confidential')}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'confidential'
                  ? 'border-amber-800 text-amber-900 bg-amber-50/50'
                  : 'border-transparent text-stone-500 hover:text-amber-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-800" />
              <span>Données Internes & Confidentielles</span>
            </button>
          </div>

          {/* Tab Content 1: Description & Prestations */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">Présentation</h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal whitespace-pre-line">
                  {language === 'ar' && property.descriptionAr ? property.descriptionAr : property.description}
                </p>
              </div>

              {/* Equipments list */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">Équipements & Atouts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {property.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Fiche Technique Typée */}
          {activeTab === 'specs' && (
            <SpecificSpecsViewer property={property} />
          )}

          {/* Tab Content: Historique des Prix */}
          {activeTab === 'history' && (
            <PriceHistoryTimeline property={property} />
          )}

          {/* Tab Content: Données Confidentielles (Section 8) */}
          {activeTab === 'confidential' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Niveaux de Visibilité & Données Sensibles (Section 8)
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Informations réservées à l'équipe commerciale et à la Direction d'Albayen Immobilier.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                    Niveau 1 · Public
                  </div>
                  <strong className="text-xs text-stone-900 block mb-1">Affichage Site & Portails</strong>
                  <p className="text-[11px] text-stone-600">
                    Titre, photos publiques filigranées, prix net vendeur, surface ({property.surface}m²), quartier ({property.district}).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">
                    Niveau 2 · Interne Équipe
                  </div>
                  <strong className="text-xs text-stone-900 block mb-1">Notes Commerciales & Marge</strong>
                  <p className="text-[11px] text-stone-600">
                    Commission négociée : <strong>3% HT</strong> · Marge de négociation acheteur estimée : <strong>~5% max</strong>.
                  </p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Propriétaire : <strong>{property.ownerId || 'M. Sihem Ben Romdhane'}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-700" />
                    Niveau 3 · Confidentiel
                  </div>
                  <strong className="text-xs text-stone-900 block mb-1">Conservation Foncière & CIN</strong>
                  <p className="text-[11px] text-stone-600">
                    N° Titre Bleu : <strong className="font-mono">{property.cadastralBlueTitleNumber || 'TB-SOUSSE-18942-INDIVIDUEL'}</strong>
                  </p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Prix Plancher Net Mandant : <strong>{((property.minNetOwnerPrice || property.price * 0.95)).toLocaleString('fr-FR')} DT</strong>
                  </p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    CIN Vendeur : <strong className="font-mono">{property.ownerCinNumber || '08459123'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Location & Proximité */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="bg-stone-100 rounded-xl p-4 border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span className="text-sm font-semibold text-stone-900">
                      Localisation : {property.district}, {property.city} (Gouvernorat de Sousse)
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    Lat: {property.latitude.toFixed(4)}, Lng: {property.longitude.toFixed(4)}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  {property.showExactAddress
                    ? `Adresse exacte : ${property.address}`
                    : "Pour des raisons de discrétion et de sécurité des propriétaires, l'adresse exacte est transmise lors de la confirmation du rendez-vous de visite."}
                </p>
              </div>

              {/* Nearby amenities in Sousse */}
              {property.nearbyAmenities && property.nearbyAmenities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">Points d'intérêt & Distance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.nearbyAmenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-white">
                        <span className="text-xs sm:text-sm font-medium text-stone-800">{amenity.name}</span>
                        <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          {amenity.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Credit Simulator */}
          {activeTab === 'credit' && (
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Simulateur de Financement Immobilier Tunisien</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Estimez vos mensualités indicatives de crédit bancaire (BIAT, Attijari, BH Bank, Zitouna, etc.)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Apport personnel (DT)</label>
                  <input
                    type="number"
                    value={personalDownPayment}
                    onChange={(e) => setPersonalDownPayment(Number(e.target.value))}
                    step={10000}
                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-400">
                    ({Math.round((personalDownPayment / property.price) * 100)}% du prix)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Durée du crédit (Années)</label>
                  <select
                    value={loanDurationYears}
                    onChange={(e) => setLoanDurationYears(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value={10}>10 ans (120 mois)</option>
                    <option value={15}>15 ans (180 mois)</option>
                    <option value={20}>20 ans (240 mois)</option>
                    <option value={25}>25 ans (300 mois)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Taux d'intérêt annuel (%)</label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step={0.25}
                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-400">Base TMM + Marge bancaire</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                <div>
                  <span className="text-xs text-stone-500 uppercase font-semibold block">Montant emprunté</span>
                  <span className="text-lg font-bold text-stone-900 tabular-nums">
                    {loanAmount.toLocaleString('fr-FR')} DT
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-amber-800 uppercase font-bold block">Mensualité estimée</span>
                  <span className="text-2xl font-bold text-amber-700 tabular-nums">
                    {monthlyPayment.toLocaleString('fr-FR')} DT <span className="text-xs font-normal text-stone-500">/ mois</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 italic">
                * Calcul donné à titre purement indicatif sans valeur contractuelle, hors assurance décès-invalidité et frais de dossier bancaire.
              </p>
            </div>
          )}

          {/* Tab Content 4: Documents */}
          {activeTab === 'docs' && (
            <div className="space-y-3">
              {property.documents && property.documents.length > 0 ? (
                property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-amber-700" />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-stone-900 block">{doc.name}</span>
                        <span className="text-[11px] text-stone-400">{doc.type} · {doc.size}</span>
                      </div>
                    </div>
                    {doc.isPrivate ? (
                      <span className="text-xs text-stone-500 bg-stone-200 px-2.5 py-1 rounded-md font-medium">
                        Sur demande certifiée
                      </span>
                    ) : (
                      <a
                        href={doc.url}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Téléchargement du document : ${doc.name}`);
                        }}
                        className="text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Télécharger
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-stone-500">
                  Aucun document public n'est rattaché à cette fiche. Vous pouvez en faire la demande auprès du conseiller.
                </div>
              )}
            </div>
          )}

          {/* Dedicated Advisor Card */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={assignedAgent.avatar}
                alt={assignedAgent.name}
                className="w-12 h-12 rounded-full object-cover border border-stone-200"
              />
              <div>
                <span className="text-xs text-stone-500 block">Conseiller dédié Albayen</span>
                <span className="text-sm font-bold text-stone-900 block">{assignedAgent.name}</span>
                <span className="text-xs text-amber-800 font-medium">{assignedAgent.specialty}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppContact}
                className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
              <a
                href={`tel:${assignedAgent.phone}`}
                className="px-3 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-stone-600" />
                <span>{assignedAgent.phone}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Modal Footer with Primary Conversion CTAs */}
        <div className="px-5 py-4 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">Réf. {property.ref}</span>
            <span className="text-lg font-bold text-stone-900 tabular-nums">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => onRequestInfo(property)}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Demander des informations
            </button>
            <button
              onClick={() => onRequestVisit(property)}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Demander une visite</span>
            </button>
          </div>
        </div>

      </div>

      {showCommercialSheet && (
        <PrintableCommercialSheet
          property={property}
          onClose={() => setShowCommercialSheet(false)}
        />
      )}

      {showWatermarkStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
          <WatermarkStudio
            property={property}
            onClose={() => setShowWatermarkStudio(false)}
          />
        </div>
      )}
    </div>
  );
};
