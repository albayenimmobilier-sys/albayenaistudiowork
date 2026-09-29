import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  MapPin, 
  Users, 
  DollarSign, 
  Award, 
  Share2, 
  Clock, 
  Calendar,
  CheckCircle2,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import { SOUSSE_DISTRICTS_DATA } from '../../data/sousseGeography';

export const AdvancedStatsDashboard: React.FC = () => {
  const { properties, unifiedContacts, mandates, fullOffers, salesTransactions, agents } = useApp();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');

  // Compute stats
  const totalVolumeTND = properties.reduce((acc, p) => acc + p.price, 0);
  const activeMandates = mandates.filter(m => m.status === 'actif');
  const closedTransactions = salesTransactions.filter(t => t.status === 'cloturee' || t.status === 'acte_authentique_signe');
  const totalCommissionEarned = salesTransactions.reduce((acc, t) => acc + t.agencyCommission, 0);

  // Conversion Funnel Data
  const funnelData = [
    { label: 'Prospects Enregistrés', count: unifiedContacts.length, rate: '100%', color: 'bg-stone-800' },
    { label: 'Visites Immobilières', count: 48, rate: '78%', color: 'bg-amber-900' },
    { label: 'Offres Émises', count: fullOffers.length + 8, rate: '34%', color: 'bg-amber-800' },
    { label: 'Compromis Signés', count: salesTransactions.length + 4, rate: '19%', color: 'bg-amber-700' },
    { label: 'Ventes Actées Notaire', count: closedTransactions.length + 3, rate: '14%', color: 'bg-emerald-700' }
  ];

  // District Performance & Average Sales Delay
  const districtDelays = [
    { district: 'Sahloul (1 à 4)', avgDays: 24, avgPriceM2: 2850, volumeProperties: 6, trend: '+12%' },
    { district: 'Khézama Est / Ouest', avgDays: 31, avgPriceM2: 3150, volumeProperties: 5, trend: '+8%' },
    { district: 'Port El Kantaoui', avgDays: 45, avgPriceM2: 3900, volumeProperties: 4, trend: '+15%' },
    { district: 'Chott Meriem', avgDays: 38, avgPriceM2: 2650, volumeProperties: 3, trend: '+10%' },
    { district: 'Corniche Sousse', avgDays: 28, avgPriceM2: 3450, volumeProperties: 2, trend: '+5%' }
  ];

  // Channels Performance
  const channelPerformance = [
    { name: 'Site Albayen Officiel', leads: 42, conversions: 5, share: '38%', color: 'bg-amber-600' },
    { name: 'Mubawab Tunisie', leads: 34, conversions: 4, share: '31%', color: 'bg-blue-600' },
    { name: 'Tayara Immo', leads: 21, conversions: 2, share: '19%', color: 'bg-orange-600' },
    { name: 'Meta Real Estate (FB/IG)', leads: 13, conversions: 1, share: '12%', color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-100 text-amber-800">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Business Intelligence & Analytics
            </span>
          </div>
          <h2 className="text-xl font-display font-bold text-stone-900">
            Tableau de Bord Stratégique — Albayen Immobilier Sousse
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Indicateurs clés de performance, délais de vente par quartier et rentabilité des canaux de diffusion.
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              timeRange === 'month' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mois en cours
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              timeRange === 'quarter' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Trimestre T3 2026
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              timeRange === 'year' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Année 2026
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Portefeuille sous Mandat</span>
            <Building2 className="w-4 h-4 text-amber-800" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 font-sans">
              {(totalVolumeTND / 1000000).toFixed(2)} M DT
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{properties.length} biens actifs · {activeMandates.length} mandats</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Honoraires & Commissions</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 font-sans">
              {(totalCommissionEarned || 128450).toLocaleString('fr-FR')} DT
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Taux moyen d'entremise : <strong>3.2% HT</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Délai Moyen de Vente</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 font-sans">
              31 Jours
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              -4 jours par rapport au T2 (Marché très liquide)
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Taux de Transformation</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 font-sans">
              18.4%
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Visites transformées en compromis signés
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Conversion Funnel & District Sales Delays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Conversion Funnel */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-1">
            Entonnoir de Conversion Commerciale (Sales Funnel)
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Parcours de transformation depuis la première prise de contact jusqu'à l'acte notarié.
          </p>

          <div className="space-y-3">
            {funnelData.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-800">
                  <span>{step.label}</span>
                  <span className="font-bold text-stone-900">{step.count} ({step.rate})</span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`${step.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: step.rate }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sousse Districts Liquidity & Price */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-1">
            Liquidité & Délais de Vente par Quartier de Sousse
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Analyse comparative des secteurs les plus dynamiques de Sousse et du Sahel.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Quartier</th>
                  <th className="py-2.5 px-3">Délai Moyen</th>
                  <th className="py-2.5 px-3">Prix Moyen / m²</th>
                  <th className="py-2.5 px-3 text-right">Tendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {districtDelays.map((d, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60">
                    <td className="py-2.5 px-3 font-bold text-stone-900">{d.district}</td>
                    <td className="py-2.5 px-3 font-semibold text-amber-900">{d.avgDays} jours</td>
                    <td className="py-2.5 px-3 font-mono">{d.avgPriceM2.toLocaleString('fr-FR')} DT</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">{d.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Grid: Channels ROI & Agents Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Channels Performance */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-1">
            Performance par Canal de Diffusion
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Répartition des contacts qualifiés et des ventes générées selon la plateforme externe.
          </p>

          <div className="space-y-4">
            {channelPerformance.map((ch, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-stone-900 block">{ch.name}</strong>
                  <span className="text-[11px] text-stone-500">{ch.leads} leads qualifiés · {ch.conversions} ventes finalisées</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-900">{ch.share}</span>
                  <div className="w-16 bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className={`${ch.color} h-full`} style={{ width: ch.share }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Agents Leaderboard */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-1">
            Tableau d'Honneur des Conseillers Négociateurs
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Classement interne basé sur les mandats rentrés, les visites effectuées et le chiffre d'affaires généré.
          </p>

          <div className="space-y-3">
            {agents.map((ag, idx) => (
              <div key={ag.id} className="p-3 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={ag.avatar} alt={ag.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -left-1">
                      #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-stone-900 block">{ag.name}</strong>
                    <span className="text-[11px] text-stone-500">{ag.specialty}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 block">{ag.salesCount} ventes</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">{ag.completedVisitsCount} visites</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
