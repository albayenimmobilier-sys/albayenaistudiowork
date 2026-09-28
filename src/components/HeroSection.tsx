import React, { useState } from 'react';
import { Search, MapPin, Home, Bed, Filter, SlidersHorizontal, ArrowRight, Shield, Award, Users } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { PropertyType, TransactionType } from '../types';

interface HeroSectionProps {
  onSearch: (filters: {
    transactionType: TransactionType;
    propertyType: string;
    district: string;
    budgetMax: number;
    bedrooms: string;
  }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { language, properties, formatPrice } = useApp();
  const t = getTranslation(language);

  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [district, setDistrict] = useState<string>('all');
  const [budgetMax, setBudgetMax] = useState<number>(3500000);
  const [bedrooms, setBedrooms] = useState<string>('any');

  const filteredCount = properties.filter(p => {
    if (p.transactionType !== transactionType) return false;
    if (propertyType !== 'all' && p.type !== propertyType) return false;
    if (district !== 'all' && !p.district.toLowerCase().includes(district.toLowerCase()) && !p.city.toLowerCase().includes(district.toLowerCase())) return false;
    if (budgetMax && p.price > budgetMax) return false;
    if (bedrooms !== 'any' && p.bedrooms < parseInt(bedrooms)) return false;
    return true;
  }).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      transactionType,
      propertyType,
      district,
      budgetMax,
      bedrooms
    });
    const el = document.getElementById('properties-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white min-h-[580px] lg:min-h-[640px] flex flex-col justify-center">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Villa d'exception à Sousse"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-sm border border-amber-400/30">
            <span>Agence Immobilière Agréée Sousse</span>
            <span aria-hidden="true">·</span>
            <span>Titre Foncier Garanti</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight text-balance">
            L'Immobilier de Référence à Sousse & sur la Côte Sahélienne
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl font-light">
            Villas de prestige à Port El Kantaoui, penthouses avec vue à Sahloul, appartements pieds dans l'eau et investissements fonciers sécurisés.
          </p>
        </div>

        {/* Real Estate Search Console */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 text-stone-900 border border-white/20 max-w-5xl">
          
          {/* Segmented Transaction Control */}
          <div className="flex items-center gap-2 mb-5 border-b border-stone-200 pb-3">
            <button
              type="button"
              onClick={() => setTransactionType('sale')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                transactionType === 'sale'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.searchTabBuy}
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('rent')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                transactionType === 'rent'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.searchTabRent}
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('seasonal')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                transactionType === 'seasonal'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.searchTabSeasonal}
            </button>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Type of Property */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.searchPropertyType}</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none"
                >
                  <option value="all">{t.allTypes}</option>
                  <option value="appartement">Appartement (S+1, S+2, S+3, Duplex)</option>
                  <option value="villa">Villa de prestige</option>
                  <option value="maison">Maison traditionnelle / Ville</option>
                  <option value="terrain">Terrain constructible / Agricole</option>
                  <option value="bureau">Bureau / Local professionnel</option>
                  <option value="local_commercial">Local commercial / Boutique</option>
                  <option value="immeuble">Immeuble de rapport</option>
                </select>
              </div>

              {/* District in Sousse */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.searchDistrict}</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none"
                >
                  <option value="all">{t.allDistricts}</option>
                  <option value="Kantaoui">Port El Kantaoui</option>
                  <option value="Sahloul">Sahloul 1, 2, 3 & 4</option>
                  <option value="Hammam Sousse">Hammam Sousse & Menchia</option>
                  <option value="Corniche">Corniche Boujaafar</option>
                  <option value="Khezama">Khezama Est & Ouest</option>
                  <option value="Chott Mariem">Chott Mariem (Front de mer)</option>
                  <option value="Hergla">Hergla</option>
                  <option value="Bouhsina">Bouhsina & Cité Erriadh</option>
                  <option value="Sousse Centre">Sousse Centre Ville</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.searchBedrooms}</span>
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none"
                >
                  <option value="any">{t.anyBedrooms}</option>
                  <option value="1">1 chambre minimum (S+1)</option>
                  <option value="2">2 chambres minimum (S+2)</option>
                  <option value="3">3 chambres minimum (S+3)</option>
                  <option value="4">4 chambres et plus (S+4+)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.searchBtn} ({filteredCount})</span>
                </button>
              </div>

            </div>
          </form>

        </div>

        {/* Adjacency Trust Metric Indicators */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-white/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">Titres Bleus Vérifiés</p>
              <p className="text-[11px] text-stone-400">Sécurité foncière garantie</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">+15 Ans à Sousse</p>
              <p className="text-[11px] text-stone-400">Expertise locale Sahel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">Conseil aux Tunisiens (TRE)</p>
              <p className="text-[11px] text-stone-400">Accompagnement à distance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">Visites 7j/7</p>
              <p className="text-[11px] text-stone-400">Prise en charge personnalisée</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
