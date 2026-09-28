import React from 'react';
import { MapPin, ArrowRight, Building, Palmtree, Waves, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DistrictsShowcaseProps {
  onSelectDistrict: (districtName: string) => void;
}

export const DistrictsShowcase: React.FC<DistrictsShowcaseProps> = ({ onSelectDistrict }) => {
  const { properties } = useApp();

  const districts = [
    {
      name: 'Port El Kantaoui',
      subtitle: 'Marina, Golf & Résidences de Prestige',
      description: 'Station balnéaire phare de Sousse, réputée pour sa marina de yachts, ses villas d\'architecte et son golf 36 trous.',
      image: '/src/assets/images/property_kantaoui_apartment_1790605943306.jpg',
      count: properties.filter(p => p.city.includes('Kantaoui') || p.district.includes('Kantaoui')).length,
      avgPriceM2: '4 800 DT'
    },
    {
      name: 'Sahloul',
      subtitle: 'Modernité, Santé & Cadre de Vie Idéal',
      description: 'Quartier résidentiel dynamique et prisé par les familles et professions libérales. Proximité hôpital universitaire et Mall of Sousse.',
      image: '/src/assets/images/property_sahloul_penthouse_1790605956179.jpg',
      count: properties.filter(p => p.district.includes('Sahloul')).length,
      avgPriceM2: '3 200 DT'
    },
    {
      name: 'Corniche Boujaafar',
      subtitle: 'Front de Mer Iconique & Cœur Urbain',
      description: 'L\'art de vivre les pieds dans l\'eau face à la Méditerranée, à quelques pas de la Médina historique de Sousse.',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
      count: properties.filter(p => p.district.includes('Corniche')).length,
      avgPriceM2: '4 200 DT'
    },
    {
      name: 'Chott Mariem',
      subtitle: 'Plages Sauvages & Terrains d\'Exception',
      description: 'La nouvelle destination pour les villas pieds dans l\'eau et les investissements fonciers calmes à 8 min de Kantaoui.',
      image: '/src/assets/images/hero_sousse_luxury_villa_1790605930412.jpg',
      count: properties.filter(p => p.city.includes('Chott Mariem')).length,
      avgPriceM2: '2 900 DT'
    }
  ];

  return (
    <section id="districts-section" className="py-16 sm:py-20 bg-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 block mb-2">
              Territoires & Emplacements Clés
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight text-balance">
              Explorez les Plus Beaux Quartiers de Sousse
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md font-light">
            Une connaissance chirurgicale du marché foncier du Sahel pour vous orienter vers l'investissement le plus rentable et valorisant.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {districts.map((d, index) => (
            <div
              key={index}
              onClick={() => onSelectDistrict(d.name)}
              className="group bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block">
                    {d.count} bien(s) en vente / location
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">
                    {d.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block mb-1">
                    {d.subtitle}
                  </span>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                    {d.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Prix moyen : <strong className="text-stone-800 tabular-nums">{d.avgPriceM2}</strong></span>
                  <span className="text-amber-800 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    <span>Explorer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
