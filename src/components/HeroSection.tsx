import React, { useState } from 'react';
import { Search, MapPin, Home, Bed, Coins, Shield, Award, Users, CheckCircle2 } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { TransactionType } from '../types';

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
  const [budgetMax, setBudgetMax] = useState<number>(5000000);
  const [bedrooms, setBedrooms] = useState<string>('any');

  const filteredCount = properties.filter(p => {
    if (p.transactionType !== transactionType) return false;
    if (propertyType !== 'all' && p.type !== propertyType) return false;
    if (district !== 'all' && !p.district.toLowerCase().includes(district.toLowerCase()) && !p.city.toLowerCase().includes(district.toLowerCase())) return false;
    if (budgetMax && budgetMax < 5000000 && p.price > budgetMax) return false;
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
    <section className="relative overflow-hidden bg-stone-950 text-white min-h-[580px] lg:min-h-[640px] flex flex-col justify-center">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Immobilier d'exception à Sousse"
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/70 to-stone-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
        
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-3 bg-stone-950/60 backdrop-blur-md px-3 py-1 rounded-md border border-amber-500/30">
            <span>Agence Immobilière Agréée Sousse</span>
            <span aria-hidden="true" className="text-amber-500">·</span>
            <span>Titres Fonciers Vérifiés (CPF)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight">
            L'Immobilier de Référence à Sousse & sur la Côte Sahélienne
          </h1>

          <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-stone-200 leading-relaxed max-w-2xl font-light">
            Villas de prestige à Port El Kantaoui, penthouses avec vue à Sahloul, appartements pieds dans l'eau et investissements fonciers sécurisés.
          </p>
        </div>

        {/* Real Estate Search Console */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 text-stone-900 border border-white/40 max-w-5xl">
          
          {/* Segmented Transaction Control */}
          <div className="flex items-center gap-2 mb-4 border-b border-stone-200 pb-3">
            <button
              type="button"
              onClick={() => setTransactionType('sale')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
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
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
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
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                transactionType === 'seasonal'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.searchTabSeasonal}
            </button>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              
              {/* Type of Property */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.searchPropertyType}</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full h-10 bg-stone-50 border border-stone-300 rounded-lg px-3 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:bg-white focus:outline-none transition-colors"
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
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Zone / Quartier</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-10 bg-stone-50 border border-stone-300 rounded-lg px-3 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:bg-white focus:outline-none transition-colors"
                >
                  <option value="all">Toutes zones à Sousse</option>
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

              {/* Budget Max */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-700" />
                  <span>Budget Maximum</span>
                </label>
                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full h-10 bg-stone-50 border border-stone-300 rounded-lg px-3 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:bg-white focus:outline-none transition-colors"
                >
                  <option value="5000000">Indifférent</option>
                  <option value="250000">Jusqu'à 250 000 DT</option>
                  <option value="500000">Jusqu'à 500 000 DT</option>
                  <option value="800000">Jusqu'à 800 000 DT</option>
                  <option value="1500000">Jusqu'à 1 500 000 DT</option>
                  <option value="3000000">Jusqu'à 3 000 000 DT</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.searchBedrooms}</span>
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full h-10 bg-stone-50 border border-stone-300 rounded-lg px-3 text-xs sm:text-sm text-stone-800 font-medium focus:ring-2 focus:ring-amber-600 focus:bg-white focus:outline-none transition-colors"
                >
                  <option value="any">{t.anyBedrooms}</option>
                  <option value="1">1 chambre min (S+1)</option>
                  <option value="2">2 chambres min (S+2)</option>
                  <option value="3">3 chambres min (S+3)</option>
                  <option value="4">4 chambres et + (S+4+)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher ({filteredCount})</span>
                </button>
              </div>

            </div>
          </form>

        </div>

        {/* Adjacency Trust Metric Indicators */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-white">
          <div className="flex items-center gap-3 bg-stone-900/60 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Titres Bleus Vérifiés</p>
              <p className="text-[11px] text-stone-400">Sécurité foncière garantie</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/60 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">+15 Ans à Sousse</p>
              <p className="text-[11px] text-stone-400">Expertise locale Sahel</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/60 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Conseil TRE & Étrangers</p>
              <p className="text-[11px] text-stone-400">Accompagnement bancaire</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/60 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Visites Accompagnées 7j/7</p>
              <p className="text-[11px] text-stone-400">Prise en charge personnalisée</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
