/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { VisitModal } from './components/VisitModal';
import { InfoModal } from './components/InfoModal';
import { DistrictsShowcase } from './components/DistrictsShowcase';
import { AgencyServices } from './components/AgencyServices';
import { ContactSection } from './components/ContactSection';
import { ClientPortal } from './components/ClientPortal';
import { AgentPortal } from './components/AgentPortal';
import { AdminPortal } from './components/AdminPortal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { Footer } from './components/Footer';
import { Property, TransactionType } from './types';
import { getTranslation } from './utils/translations';
import { SlidersHorizontal, ArrowUpDown, Quote, CheckCircle2, LayoutGrid, MapPin } from 'lucide-react';
import { SpotlightSearchModal } from './components/SpotlightSearchModal';
import { InteractivePropertyMap } from './components/InteractivePropertyMap';
import { matchPropertyGeography } from './data/sousseGeography';

const MainContent: React.FC = () => {
  const { 
    properties, 
    language, 
    activeView, 
    setActiveView 
  } = useApp();
  const t = getTranslation(language);

  // Modals & Drawers state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);
  const [infoProperty, setInfoProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'grid' | 'map'>('grid');

  // Search & Filter State
  const [transactionFilter, setTransactionFilter] = useState<TransactionType | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(4000000);
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('any');
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'surface'>('recent');

  const handleHeroSearch = (filters: {
    transactionType: TransactionType;
    propertyType: string;
    district: string;
    budgetMax: number;
    bedrooms: string;
  }) => {
    setTransactionFilter(filters.transactionType);
    setTypeFilter(filters.propertyType);
    setDistrictFilter(filters.district);
    setMaxBudget(filters.budgetMax);
    setBedroomsFilter(filters.bedrooms);
  };

  const handleSelectDistrict = (districtName: string) => {
    setDistrictFilter(districtName);
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Sort computation (Hierarchical Geographic Matching)
  const filteredAndSortedProperties = properties
    .filter(p => {
      if (transactionFilter !== 'all' && p.transactionType !== transactionFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (districtFilter !== 'all' && !matchPropertyGeography(p.district, p.city, districtFilter)) return false;
      if (p.price > maxBudget) return false;
      if (bedroomsFilter !== 'any' && p.bedrooms < parseInt(bedroomsFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'surface') return b.surface - a.surface;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const featuredProperties = properties.filter(p => p.isFeatured);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-full overflow-x-hidden">
      
      {/* Top Navbar */}
      <Navbar
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onToggleMap={() => setDisplayMode(prev => prev === 'grid' ? 'map' : 'grid')}
        isMapActive={displayMode === 'map'}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeView === 'public' && (
          <>
            {/* Cinematic Hero with Search Bar */}
            <HeroSection onSearch={handleHeroSearch} />

            {/* Properties Catalog Section */}
            <section id="properties-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 block mb-1">
                    Portefeuille Immobilier Albayen
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
                    Nos Biens Immobiliers Disponibles à Sousse
                  </h2>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  {/* Grid vs Map Toggle */}
                  <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                    <button
                      onClick={() => setDisplayMode('grid')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        displayMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Liste</span>
                    </button>
                    <button
                      onClick={() => setDisplayMode('map')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        displayMode === 'map' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Carte Sousse</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium bg-white px-3 py-2 rounded-lg border border-stone-200">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                    <span>Trier par :</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer"
                    >
                      <option value="recent">Plus récents</option>
                      <option value="price_asc">Prix croissant</option>
                      <option value="price_desc">Prix décroissant</option>
                      <option value="surface">Surface</option>
                    </select>
                  </div>

                  {(transactionFilter !== 'all' || typeFilter !== 'all' || districtFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setTransactionFilter('all');
                        setTypeFilter('all');
                        setDistrictFilter('all');
                        setMaxBudget(4000000);
                        setBedroomsFilter('any');
                      }}
                      className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
                    >
                      Réinitialiser filtres
                    </button>
                  )}
                </div>
              </div>

              {/* Segmented Filter Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                <button
                  onClick={() => setTransactionFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    transactionFilter === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Tous ({properties.length})
                </button>
                <button
                  onClick={() => setTransactionFilter('sale')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    transactionFilter === 'sale'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Vente
                </button>
                <button
                  onClick={() => setTransactionFilter('rent')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    transactionFilter === 'rent'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Location
                </button>
                <button
                  onClick={() => setTransactionFilter('seasonal')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    transactionFilter === 'seasonal'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Location Vacances
                </button>

                <div className="h-4 w-px bg-stone-300 mx-2 shrink-0" />

                {['appartement', 'villa', 'terrain', 'maison', 'bureau'].map((tType) => (
                  <button
                    key={tType}
                    onClick={() => setTypeFilter(typeFilter === tType ? 'all' : tType)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                      typeFilter === tType
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {tType}s
                  </button>
                ))}
              </div>

              {/* Properties Display (Grid or Interactive Map) */}
              {displayMode === 'map' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                    <span>Explorez les biens géolocalisés à Sousse et ses délégations. Cliquez sur un marqueur pour afficher la fiche rapide.</span>
                    <span className="font-bold text-amber-800">{filteredAndSortedProperties.length} biens affichés</span>
                  </div>
                  <InteractivePropertyMap
                    properties={filteredAndSortedProperties}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                    className="h-[650px] w-full"
                  />
                </div>
              ) : filteredAndSortedProperties.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-stone-200 shadow-xs">
                  <p className="text-base font-bold text-stone-900">Aucun bien ne correspond à ces critères</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    Essayez d'élargir votre recherche géographique ou d'ajuster le budget.
                  </p>
                  <button
                    onClick={() => {
                      setTransactionFilter('all');
                      setTypeFilter('all');
                      setDistrictFilter('all');
                      setMaxBudget(4000000);
                      setBedroomsFilter('any');
                    }}
                    className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
                  >
                    Afficher tous les biens
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredAndSortedProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(p) => setSelectedProperty(p)}
                      onRequestVisit={(p) => setVisitProperty(p)}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Sousse Districts Showcase */}
            <DistrictsShowcase onSelectDistrict={handleSelectDistrict} />

            {/* Agency Services */}
            <AgencyServices />

            {/* Real Testimonials (Claim-to-proof adjacency) */}
            <section className="py-16 sm:py-20 bg-stone-50 border-t border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 block mb-2">
                    Témoignages Clients
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight">
                    Ils Ont Concrétisé Leur Projet Immobilier avec Albayen Sousse
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <Quote className="w-8 h-8 text-amber-200 mb-3" />
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal mb-4">
                        "Résidant à Lyon, j'avais de nombreuses appréhensions concernant l'achat à distance d'une villa à Kantaoui. Karim a vérifié le Titre Bleu individuel en amont et m'a accompagné pas à pas jusqu'à la signature."
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-stone-900 block font-semibold">Dr. Mehdi Zouari</strong>
                        <span className="text-stone-400">Acquéreur TRE (France)</span>
                      </div>
                      <span className="text-amber-600 font-bold">5.0 ★</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <Quote className="w-8 h-8 text-amber-200 mb-3" />
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal mb-4">
                        "Nous avons vendu notre penthouse à Sahloul en moins de 3 semaines au juste prix du marché. Estimation rigoureuse, visites sélectionnées sans touristes, et négociation menée avec un grand professionnalisme."
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-stone-900 block font-semibold">Mme Leila Bouazizi</strong>
                        <span className="text-stone-400">Propriétaire Vendeuse</span>
                      </div>
                      <span className="text-amber-600 font-bold">5.0 ★</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <Quote className="w-8 h-8 text-amber-200 mb-3" />
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal mb-4">
                        "Pour l'implantation de notre cabinet médical à Sousse Centre, l'équipe Albayen a trouvé le local parfait conforme aux normes d'accessibilité PMR. Gestion du bail commercial irréprochable."
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-stone-900 block font-semibold">Dr. Skander Ben Amor</strong>
                        <span className="text-stone-400">Locataire Professionnel</span>
                      </div>
                      <span className="text-amber-600 font-bold">5.0 ★</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact & Map Section */}
            <ContactSection />
          </>
        )}

        {/* Portal 1: Client Portal */}
        {activeView === 'client-portal' && (
          <ClientPortal
            onSelectProperty={(p) => setSelectedProperty(p)}
            onRequestVisit={(p) => setVisitProperty(p)}
          />
        )}

        {/* Portal 2: Agent Portal */}
        {activeView === 'agent-portal' && (
          <AgentPortal
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}

        {/* Portal 3: Admin & SuperAdmin Portal */}
        {activeView === 'admin-portal' && (
          <AdminPortal
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view, sectionId) => {
          setActiveView(view);
          if (sectionId && view === 'public') {
            setTimeout(() => {
              const el = document.getElementById(sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
      />

      {/* Global Modals */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onRequestVisit={(p) => {
            setSelectedProperty(null);
            setVisitProperty(p);
          }}
          onRequestInfo={(p) => {
            setSelectedProperty(null);
            setInfoProperty(p);
          }}
        />
      )}

      {visitProperty && (
        <VisitModal
          property={visitProperty}
          onClose={() => setVisitProperty(null)}
        />
      )}

      {infoProperty && (
        <InfoModal
          property={infoProperty}
          onClose={() => setInfoProperty(null)}
        />
      )}

      {isFavoritesOpen && (
        <FavoritesDrawer
          onClose={() => setIsFavoritesOpen(false)}
          onSelectProperty={(p) => {
            setIsFavoritesOpen(false);
            setSelectedProperty(p);
          }}
          onRequestVisit={(p) => {
            setIsFavoritesOpen(false);
            setVisitProperty(p);
          }}
        />
      )}

      {isRoleSwitcherOpen && (
        <RoleSwitcherModal
          onClose={() => setIsRoleSwitcherOpen(false)}
        />
      )}

      {/* Global Spotlight Universal Search (Cmd+K) */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onSelectProperty={(p) => setSelectedProperty(p)}
        onSelectDistrict={(d) => handleSelectDistrict(d)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
