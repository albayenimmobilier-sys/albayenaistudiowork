import React, { useState } from 'react';
import { Property, PropertySyndicationChannel, SyndicationChannelId } from '../../types';
import { useApp } from '../../context/AppContext';
import { EXTERNAL_CHANNELS_CONFIG } from '../../data/syndicationConfig';
import { 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Sliders, 
  Globe, 
  Radio, 
  Send,
  Check,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SyndicationManagerProps {
  onSelectProperty?: (property: Property) => void;
}

export const SyndicationManager: React.FC<SyndicationManagerProps> = ({ onSelectProperty }) => {
  const { properties, changePropertyStatus, logActivity } = useApp();
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [syncingChannel, setSyncingChannel] = useState<string | null>(null);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'listings' | 'channels_config'>('listings');

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  // Dynamic channels for selected property
  const [propertyChannels, setPropertyChannels] = useState<Record<string, PropertySyndicationChannel[]>>(() => {
    const initial: Record<string, PropertySyndicationChannel[]> = {};
    properties.forEach(p => {
      initial[p.id] = [
        {
          channelId: 'albayen_web',
          channelName: 'Site Officiel Albayen',
          enabled: true,
          status: 'publie',
          lastSyncDate: '2026-09-29 11:20',
          externalPropertyId: `ALB-${p.ref}`,
          lastUpdatedDate: '2026-09-29 11:20',
          autoSync: true
        },
        {
          channelId: 'mubawab',
          channelName: 'Mubawab Tunisie',
          enabled: true,
          status: 'publie',
          lastSyncDate: '2026-09-29 09:15',
          externalPropertyId: `MBW-${p.ref}`,
          lastUpdatedDate: '2026-09-28 18:30',
          autoSync: true
        },
        {
          channelId: 'tayara',
          channelName: 'Tayara Immo',
          enabled: p.price < 1000000,
          status: p.price < 1000000 ? 'publie' : 'non_publie',
          lastSyncDate: p.price < 1000000 ? '2026-09-28 14:00' : undefined,
          externalPropertyId: p.price < 1000000 ? `TYR-${p.ref}` : undefined,
          lastUpdatedDate: '2026-09-28 14:00',
          autoSync: false
        },
        {
          channelId: 'facebook_instagram',
          channelName: 'Meta Real Estate (FB/IG)',
          enabled: p.isFeatured,
          status: p.isFeatured ? 'publie' : 'non_publie',
          lastSyncDate: p.isFeatured ? '2026-09-29 02:00' : undefined,
          externalPropertyId: p.isFeatured ? `META-${p.ref}` : undefined,
          autoSync: false
        },
        {
          channelId: 'international_portals',
          channelName: 'Green-Acres / Diaspora TRE',
          enabled: p.price > 400000,
          status: p.price > 400000 ? 'publie' : 'non_publie',
          lastSyncDate: p.price > 400000 ? '2026-09-29 04:00' : undefined,
          externalPropertyId: p.price > 400000 ? `GA-${p.ref}` : undefined,
          autoSync: true
        }
      ];
    });
    return initial;
  });

  const currentChannels = propertyChannels[selectedProperty?.id] || [];

  const handleToggleChannel = (channelId: SyndicationChannelId) => {
    if (!selectedProperty) return;
    setPropertyChannels(prev => {
      const list = prev[selectedProperty.id] || [];
      const updated = list.map(c => {
        if (c.channelId === channelId) {
          const nextEnabled = !c.enabled;
          return {
            ...c,
            enabled: nextEnabled,
            status: nextEnabled ? 'en_attente' : 'desactive',
            lastUpdatedDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
          } as PropertySyndicationChannel;
        }
        return c;
      });
      return { ...prev, [selectedProperty.id]: updated };
    });
  };

  const handleSyncSingleChannel = (channelId: SyndicationChannelId) => {
    if (!selectedProperty) return;
    setSyncingChannel(channelId);
    setTimeout(() => {
      setPropertyChannels(prev => {
        const list = prev[selectedProperty.id] || [];
        const updated = list.map(c => {
          if (c.channelId === channelId) {
            return {
              ...c,
              status: 'publie',
              lastSyncDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              externalPropertyId: c.externalPropertyId || `${channelId.toUpperCase()}-${selectedProperty.ref}`
            } as PropertySyndicationChannel;
          }
          return c;
        });
        return { ...prev, [selectedProperty.id]: updated };
      });
      setSyncingChannel(null);
    }, 900);
  };

  const handleBatchSync = () => {
    setBatchSyncing(true);
    setTimeout(() => {
      setPropertyChannels(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pid => {
          next[pid] = next[pid].map(c => c.enabled ? {
            ...c,
            status: 'publie',
            lastSyncDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
          } : c);
        });
        return next;
      });
      setBatchSyncing(false);
    }, 1200);
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.ref.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.district.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Batch Action */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-100 text-amber-800">
              <Share2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Passerelle & Diffusion Multi-Canaux
            </span>
          </div>
          <h2 className="text-xl font-display font-bold text-stone-900">
            Syndication sur Plateformes & Portails Immobiliers
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Gérez en temps réel la publication de vos biens sur Mubawab, Tayara, Meta Catalog, portails TRE et le site officiel Albayen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'listings' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Par Bien Immobilier
            </button>
            <button
              onClick={() => setActiveTab('channels_config')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'channels_config' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Canaux & Flux XML / API
            </button>
          </div>

          <button
            onClick={handleBatchSync}
            disabled={batchSyncing}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${batchSyncing ? 'animate-spin' : ''}`} />
            <span>{batchSyncing ? 'Synchronisation en cours...' : 'Synchroniser tous les canaux'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Properties List Selector */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
            <div className="p-4 border-b border-stone-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Rechercher par référence, titre, quartier..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 bg-stone-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
              {filteredProperties.map(property => {
                const isSelected = property.id === selectedProperty?.id;
                const pChannels = propertyChannels[property.id] || [];
                const activeCount = pChannels.filter(c => c.status === 'publie').length;

                return (
                  <button
                    key={property.id}
                    onClick={() => setSelectedPropertyId(property.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start justify-between gap-3 ${
                      isSelected ? 'bg-amber-50/70 border-l-4 border-amber-800' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex gap-3 min-w-0">
                      <img
                        src={property.mainImage || property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                            {property.ref}
                          </span>
                          <span className="text-[10px] text-stone-400">·</span>
                          <span className="text-[10px] font-medium text-stone-500">
                            {property.district}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 truncate mb-1">
                          {property.title}
                        </h4>
                        <div className="text-xs font-semibold text-stone-800">
                          {property.price.toLocaleString('fr-FR')} DT
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        activeCount > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-500'
                      }`}>
                        <Radio className="w-2.5 h-2.5" />
                        {activeCount} / {pChannels.length} actifs
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Property Syndication Matrix */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col justify-between h-[650px] overflow-y-auto">
            <div>
              {/* Property Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm">
                      {selectedProperty.ref}
                    </span>
                    <span className="text-xs text-stone-400">|</span>
                    <span className="text-xs font-medium text-stone-600">
                      {selectedProperty.district} · Sousse
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {selectedProperty.title}
                  </h3>
                </div>

                {onSelectProperty && (
                  <button
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <span>Fiche complète</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Publication Status Summary Question */}
              <div className="p-3.5 bg-stone-900 text-white rounded-xl mb-6 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Question du système :</span>
                  <strong className="text-amber-400 font-bold">
                    Sur quels canaux ce bien est-il actuellement publié ?
                  </strong>
                </div>
                <div className="flex items-center gap-1.5">
                  {currentChannels.filter(c => c.status === 'publie').map(c => (
                    <span key={c.channelId} className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-semibold text-white border border-stone-700">
                      {c.channelName.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Channels List for this property */}
              <div className="space-y-3">
                {currentChannels.map(channel => {
                  const isSyncing = syncingChannel === channel.channelId;
                  const isPublished = channel.status === 'publie';

                  return (
                    <div 
                      key={channel.channelId}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={channel.enabled}
                          onChange={() => handleToggleChannel(channel.channelId)}
                          className="mt-1 rounded text-amber-800 focus:ring-amber-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">
                              {channel.channelName}
                            </span>
                            
                            {isPublished ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Publié
                              </span>
                            ) : channel.status === 'en_attente' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                En attente
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-200 text-stone-600">
                                Inactif
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-stone-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            {channel.externalPropertyId && (
                              <span>ID Externe : <strong className="text-stone-700 font-mono">{channel.externalPropertyId}</strong></span>
                            )}
                            {channel.lastSyncDate && (
                              <span>Dernière synchro : <strong>{channel.lastSyncDate}</strong></span>
                            )}
                            {channel.lastSyncError && (
                              <span className="text-red-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {channel.lastSyncError}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sync Button */}
                      <button
                        onClick={() => handleSyncSingleChannel(channel.channelId)}
                        disabled={!channel.enabled || isSyncing}
                        className="self-end sm:self-center px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:text-stone-900 hover:bg-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Envoi...' : 'Synchroniser'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Guaranteed Sync Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2 mt-4">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
              <span>
                Toute modification apportée au bien (prix, photos, statut) est automatiquement répercutée sur les canaux activés lors de la prochaine synchronisation.
              </span>
            </div>

          </div>

        </div>
      )}

      {/* Channels & Feeds Configuration Tab */}
      {activeTab === 'channels_config' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-stone-900 mb-1">
            Passerelles de diffusion & Flux Partenaires
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Points de terminaison API et flux XML/JSON normalisés utilisés pour diffuser le catalogue Albayen vers les plateformes externes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXTERNAL_CHANNELS_CONFIG.map(channel => (
              <div key={channel.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm">
                      {channel.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {channel.activeListingsCount} biens diffusés
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 mb-1">
                    {channel.name}
                  </h4>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                    {channel.description}
                  </p>

                  <div className="space-y-1.5 text-xs font-mono bg-white p-3 rounded-xl border border-stone-200 text-stone-600 mb-4 break-all">
                    <div><span className="text-stone-400 font-sans">Endpoint : </span>{channel.apiEndpoint}</div>
                    <div><span className="text-stone-400 font-sans">Flux Feed : </span>{channel.feedUrl}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200 text-xs">
                  <span className="text-stone-500">
                    Fréquence : toutes les {channel.syncFrequencyHours}h
                  </span>
                  <a
                    href={channel.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Portail externe</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
