import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Code2, 
  Send, 
  Copy, 
  Check, 
  Key, 
  Terminal, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  X,
  Server
} from 'lucide-react';

interface ApiExplorerModalProps {
  onClose?: () => void;
}

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({ onClose }) => {
  const { properties, unifiedContacts, agencySettings } = useApp();
  
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [apiKey, setApiKey] = useState('alb_live_sousse_987f6a2b89c34d1e');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const endpoints = [
    {
      id: 'get_properties',
      method: 'GET',
      path: '/api/v1/properties',
      description: 'Récupère la liste des biens immobiliers avec filtres géographiques (Sousse) et statut.',
      queryParams: '?district=Sahloul&type=appartement&status=publie',
      samplePayload: null,
      generateResponse: () => {
        return {
          status: 'success',
          count: properties.length,
          timestamp: new Date().toISOString(),
          data: properties.map(p => ({
            id: p.id,
            ref: p.ref,
            title: p.title,
            type: p.type,
            transaction: p.transactionType,
            price_tnd: p.price,
            surface_m2: p.surface,
            district: p.district,
            city: p.city,
            latitude: p.latitude,
            longitude: p.longitude,
            status: p.status,
            images: p.images
          }))
        };
      }
    },
    {
      id: 'get_property_detail',
      method: 'GET',
      path: '/api/v1/properties/AL-SO-101',
      description: 'Détail complet d\'un bien avec caractéristiques typées et données de publication.',
      queryParams: '',
      samplePayload: null,
      generateResponse: () => {
        const p = properties[0];
        return {
          status: 'success',
          data: {
            ref: p.ref,
            title: p.title,
            title_ar: p.titleAr,
            description: p.description,
            price: {
              amount: p.price,
              currency: 'TND',
              price_per_m2: Math.round(p.price / p.surface)
            },
            specifications: {
              type: p.type,
              surface: p.surface,
              bedrooms: p.bedrooms,
              condition: p.condition,
              residence: 'Résidence Les Palmiers Sahloul'
            },
            location: {
              country: 'Tunisia',
              governorate: 'Sousse',
              district: p.district,
              latitude: p.latitude,
              longitude: p.longitude
            },
            syndication: {
              mubawab_synced: true,
              tayara_synced: true
            }
          }
        };
      }
    },
    {
      id: 'post_sync_syndication',
      method: 'POST',
      path: '/api/v1/syndication/channels/mubawab/sync',
      description: 'Déclenche une synchronisation immédiate vers un portail externe ou un flux partenaire.',
      queryParams: '',
      samplePayload: {
        channel_id: 'mubawab',
        force_refresh: true,
        batch_size: 50
      },
      generateResponse: () => ({
        status: 'sync_initiated',
        job_id: 'JOB-SYNC-9921',
        channel: 'Mubawab Tunisie',
        synced_items_count: properties.filter(p => p.status === 'publie').length,
        duration_ms: 320,
        errors: []
      })
    },
    {
      id: 'post_leads_webhook',
      method: 'POST',
      path: '/api/v1/leads/webhook',
      description: 'Webhook de réception automatique de prospects (Leads) depuis Facebook Ads ou Mubawab.',
      queryParams: '',
      samplePayload: {
        source: 'mubawab',
        client_name: 'Karim Jaziri',
        phone: '+216 98 765 432',
        email: 'karim.jaziri@gmail.com',
        interested_property_ref: 'AL-SO-101',
        message: 'Je souhaite visiter cet appartement samedi prochain.'
      },
      generateResponse: () => ({
        status: 'lead_created',
        lead_id: 'LEAD-2026-489',
        assigned_agent: 'Karim Mansour (Spécialiste Sahloul)',
        notification_sent: true,
        whatsapp_alert_triggered: true
      })
    }
  ];

  const currentEndpoint = endpoints[activeEndpointIndex];

  const handleTestRequest = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const resp = currentEndpoint.generateResponse();
      setExecutionResult(JSON.stringify(resp, null, 2));
      setIsExecuting(false);
    }, 450);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyResponse = () => {
    if (executionResult) {
      navigator.clipboard.writeText(executionResult);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col h-[750px]">
      
      {/* Header */}
      <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              API RESTful Explorer & Console Développeur
            </h3>
            <p className="text-xs text-stone-400">
              Endpoints normalisés pour intégrations tierces, portails partenaires et synchronisation
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* API Key Bar */}
      <div className="px-6 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-stone-300">
          <Key className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">Clé d'authentification API :</span>
          <span className="font-mono bg-stone-900 px-2 py-0.5 rounded text-amber-300 border border-stone-800">
            {apiKey}
          </span>
        </div>

        <button
          onClick={handleCopyKey}
          className="text-stone-400 hover:text-white flex items-center gap-1 font-semibold"
        >
          {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey ? 'Copié' : 'Copier clé'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Endpoints List */}
        <div className="md:col-span-4 border-r border-stone-200 bg-stone-50 overflow-y-auto divide-y divide-stone-200">
          <div className="p-3 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Endpoints disponibles (v1)
          </div>

          {endpoints.map((ep, idx) => (
            <button
              key={ep.id}
              onClick={() => {
                setActiveEndpointIndex(idx);
                setExecutionResult(null);
              }}
              className={`w-full p-3.5 text-left transition-colors flex items-start gap-2.5 ${
                activeEndpointIndex === idx ? 'bg-white border-l-4 border-amber-800 shadow-xs' : 'hover:bg-stone-100/70'
              }`}
            >
              <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {ep.method}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-mono font-bold text-stone-900 truncate">
                  {ep.path}
                </div>
                <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                  {ep.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Console / Executor */}
        <div className="md:col-span-8 flex flex-col h-full overflow-hidden bg-white">
          <div className="p-5 border-b border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-black ${
                  currentEndpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentEndpoint.method}
                </span>
                <span className="font-mono text-xs font-bold text-stone-900">
                  {currentEndpoint.path}{currentEndpoint.queryParams}
                </span>
              </div>

              <button
                onClick={handleTestRequest}
                disabled={isExecuting}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isExecuting ? 'animate-ping' : ''}`} />
                <span>{isExecuting ? 'Exécution...' : 'Tester la requête'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600">
              {currentEndpoint.description}
            </p>

            {currentEndpoint.samplePayload && (
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Corps de la requête (Request Body JSON) :
                </span>
                <pre className="p-2.5 bg-stone-900 text-stone-300 rounded-lg text-xs font-mono overflow-x-auto max-h-24">
                  {JSON.stringify(currentEndpoint.samplePayload, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Response Viewer */}
          <div className="flex-1 bg-stone-950 p-4 flex flex-col overflow-hidden text-stone-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2 text-xs">
              <span className="text-stone-400 font-mono flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Réponse JSON HTTP 200 OK
              </span>

              {executionResult && (
                <button
                  onClick={handleCopyResponse}
                  className="text-stone-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedResponse ? 'Copié' : 'Copier JSON'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs text-emerald-400 leading-relaxed">
              {executionResult ? (
                <pre>{executionResult}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-stone-500 italic">
                  Cliquez sur "Tester la requête" pour générer la réponse en direct depuis la base de Sousse.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
