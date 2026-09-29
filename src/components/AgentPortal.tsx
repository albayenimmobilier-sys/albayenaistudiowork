import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Building, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Eye, 
  Star,
  Check,
  X,
  Printer,
  ShieldCheck,
  History,
  CheckSquare,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lead, Visit, Property, LeadStatus } from '../types';
import { ContactsManager } from './crm/ContactsManager';
import { TasksManager } from './crm/TasksManager';
import { MandatesManager } from './crm/MandatesManager';
import { AgentCalendarView } from './crm/AgentCalendarView';
import { CommercialKanbanPipeline } from './crm/CommercialKanbanPipeline';
import { OffersAndNegotiations } from './crm/OffersAndNegotiations';
import { SalesTransactionsManager } from './crm/SalesTransactionsManager';
import { PropertyLifecycleModal } from './crm/PropertyLifecycleModal';
import { PrintableVisitVoucher } from './crm/PrintableVisitVoucher';
import { PrintableCommercialSheet } from './crm/PrintableCommercialSheet';

interface AgentPortalProps {
  onSelectProperty: (property: Property) => void;
}

export const AgentPortal: React.FC<AgentPortalProps> = ({ onSelectProperty }) => {
  const { 
    currentUser, 
    leads, 
    visits, 
    properties, 
    mandates,
    crmTasks,
    fullOffers,
    salesTransactions,
    updateLeadStatus, 
    addLeadNote, 
    addLeadInteraction, 
    updateVisitStatus, 
    formatPrice 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'contacts' | 'pipeline' | 'calendar' | 'tasks' | 'mandates' | 'offers' | 'closing' | 'visits' | 'portfolio'
  >('contacts');

  // Modals for Property Lifecycle, Printable Visit Voucher & Commercial Sheet
  const [activeLifecycleProperty, setActiveLifecycleProperty] = useState<Property | null>(null);
  const [activeVoucherVisit, setActiveVoucherVisit] = useState<Visit | null>(null);
  const [activeCommercialSheetProperty, setActiveCommercialSheetProperty] = useState<Property | null>(null);

  // Visit completion modal state
  const [activeVisitModal, setActiveVisitModal] = useState<Visit | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [agentVisitNotes, setAgentVisitNotes] = useState('');

  // Agent's assigned data
  const myLeads = leads.filter(l => 
    l.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const myVisits = visits.filter(v => 
    v.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const myProperties = properties.filter(p => 
    p.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const myMandates = mandates.filter(m => 
    m.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const handleCompleteVisitSubmit = () => {
    if (!activeVisitModal) return;
    updateVisitStatus(activeVisitModal.id, 'effectuee', {
      rating: feedbackRating,
      comment: feedbackComment,
      agentNotes: agentVisitNotes
    });
    setActiveVisitModal(null);
  };

  const tabsConfig = [
    { id: 'contacts', label: 'Contacts Unifiés', icon: Users, count: undefined },
    { id: 'pipeline', label: 'Pipeline Kanban', icon: Layers, count: myLeads.length },
    { id: 'calendar', label: 'Agenda & Conflits', icon: Calendar, count: undefined },
    { id: 'tasks', label: 'Tâches & Relances', icon: CheckSquare, count: crmTasks.filter(t => t.status !== 'terminee').length },
    { id: 'mandates', label: 'Mandats & Alertes', icon: FileText, count: myMandates.length },
    { id: 'offers', label: 'Offres & Négociations', icon: TrendingUp, count: fullOffers.length },
    { id: 'closing', label: 'Closing & Ventes', icon: ShieldCheck, count: salesTransactions.length },
    { id: 'visits', label: 'Visites Clients', icon: Clock, count: myVisits.length },
    { id: 'portfolio', label: 'Portefeuille Biens', icon: Building, count: myProperties.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-full overflow-x-hidden">
      
      {/* Agent Header & Key Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || '/src/assets/images/agency_advisor_portrait_1790605967583.jpg'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-xl object-cover border border-stone-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                  {currentUser.name}
                </h1>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                  {currentUser.agencyRoleTitle || 'Conseiller Commercial Albayen'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Zones d'intervention : Port El Kantaoui · Hammam Sousse · Sahloul · Corniche Sousse
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-medium">Disponibilité :</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Actif · Système CRM Opérationnel
            </span>
          </div>
        </div>

        {/* 4 Performance Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Prospects Actifs</span>
            <span className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {myLeads.filter(l => l.status !== 'perdu').length}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">Contacts unifiés qualifiés</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Visites du Mois</span>
            <span className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {myVisits.length}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Bons de visite certifiés</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Mandats Actifs</span>
            <span className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {myMandates.length}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Exclusivités & Simples</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Closing & Ventes</span>
            <span className="text-2xl font-display font-bold text-amber-800 tabular-nums flex items-center gap-1">
              <span>{salesTransactions.length}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Dossiers chez le Notaire</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {tabsConfig.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT ROUTER */}

      {/* TAB: CONTACTS UNIFIES */}
      {activeTab === 'contacts' && (
        <ContactsManager onSelectProperty={onSelectProperty} />
      )}

      {/* TAB: PIPELINE KANBAN */}
      {activeTab === 'pipeline' && (
        <CommercialKanbanPipeline />
      )}

      {/* TAB: CALENDRIER & CONFLITS */}
      {activeTab === 'calendar' && (
        <AgentCalendarView />
      )}

      {/* TAB: TACHES & RELANCES */}
      {activeTab === 'tasks' && (
        <TasksManager />
      )}

      {/* TAB: MANDATS */}
      {activeTab === 'mandates' && (
        <MandatesManager onSelectProperty={onSelectProperty} />
      )}

      {/* TAB: OFFRES & NEGOCIATIONS */}
      {activeTab === 'offers' && (
        <OffersAndNegotiations onSelectProperty={onSelectProperty} />
      )}

      {/* TAB: CLOSING / TRANSACTIONS */}
      {activeTab === 'closing' && (
        <SalesTransactionsManager />
      )}

      {/* TAB: VISITES CLIENTS */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-display font-bold text-stone-900">
              Agenda des Visites Clients & Bons de Visite
            </h2>
            <span className="text-xs text-stone-500">
              {myVisits.length} visites enregistrées
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myVisits.map(visit => {
              const targetProp = properties.find(p => p.id === visit.propertyId);

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={visit.propertyImage}
                      alt={visit.propertyTitle}
                      className="w-20 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => targetProp && onSelectProperty(targetProp)}
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {visit.propertyRef}
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <h3 className="text-xs sm:text-sm font-semibold text-stone-800 line-clamp-1">
                          {visit.propertyTitle}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                        <span className="font-semibold text-stone-900">{visit.clientName}</span>
                        <span>{visit.clientPhone}</span>
                        <span className="text-stone-400">·</span>
                        <span className="flex items-center gap-1 text-amber-800 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {visit.date} à {visit.timeSlot}
                        </span>
                      </div>

                      {visit.comment && (
                        <p className="text-xs text-stone-500 italic">
                          "{visit.comment}"
                        </p>
                      )}

                      {visit.status === 'effectuee' && visit.feedbackRating && (
                        <div className="flex items-center gap-2 text-xs pt-1 text-stone-700">
                          <span className="text-amber-500 font-bold">★ {visit.feedbackRating}/5</span>
                          <span className="text-stone-500">— {visit.feedbackComment || 'Visite complétée avec succès.'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Printable Visit Voucher button */}
                    <button
                      onClick={() => setActiveVoucherVisit(visit)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-800" />
                      <span>Bon de Visite</span>
                    </button>

                    {visit.status === 'demandee' && (
                      <button
                        onClick={() => updateVisitStatus(visit.id, 'confirmee')}
                        className="px-3.5 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors"
                      >
                        Confirmer Visite
                      </button>
                    )}

                    {visit.status === 'confirmee' && (
                      <button
                        onClick={() => {
                          setActiveVisitModal(visit);
                          setFeedbackRating(5);
                          setFeedbackComment('');
                          setAgentVisitNotes('');
                        }}
                        className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                      >
                        Clôturer (Effectuée)
                      </button>
                    )}

                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                      visit.status === 'effectuee' ? 'bg-emerald-100 text-emerald-800' :
                      visit.status === 'confirmee' ? 'bg-blue-100 text-blue-800' :
                      visit.status === 'annulee' ? 'bg-stone-200 text-stone-600' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {visit.status === 'effectuee' ? 'Visite Effectuée' :
                       visit.status === 'confirmee' ? 'Confirmée' :
                       visit.status === 'annulee' ? 'Annulée' : 'En attente'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: PORTEFEUILLE BIENS */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-display font-bold text-stone-900">
              Mes Biens Immobiliers en Portefeuille
            </h2>
            <span className="text-xs text-stone-500">{myProperties.length} mandats actifs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.map(prop => (
              <div key={prop.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3]">
                  <img src={prop.mainImage} alt={prop.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-stone-900 text-white text-xs px-2 py-0.5 rounded-sm font-semibold">
                    {prop.ref}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-sm capitalize">
                    {prop.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-stone-500 font-medium block">{prop.district}, {prop.city}</span>
                  <h3 className="text-sm font-semibold text-stone-900 truncate mt-1">{prop.title}</h3>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <span className="text-sm font-bold text-stone-900 tabular-nums">{formatPrice(prop.price)}</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCommercialSheetProperty(prop)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center transition-colors cursor-pointer"
                        title="Imprimer Fiche Vitrine / Commerciale A4"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-800" />
                      </button>

                      <button
                        onClick={() => setActiveLifecycleProperty(prop)}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Gérer le statut et consulter l'historique commercial"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Historique</span>
                      </button>

                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="text-xs font-semibold text-stone-700 hover:text-stone-900 hover:underline"
                      >
                        Détails →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {activeVisitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Compte-rendu de visite : {activeVisitModal.propertyRef}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Visiteur : {activeVisitModal.clientName} ({activeVisitModal.clientPhone})
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Note de satisfaction du visiteur (1 à 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFeedbackRating(st)}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                        feedbackRating === st ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Retour & Remarques du Visiteur
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Le client a beaucoup aimé la terrasse et souhaite faire une offre d'achat..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Notes internes pour l'agence (relance auto J+1 programmée)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes de négociation ou points à surveiller..."
                  value={agentVisitNotes}
                  onChange={(e) => setAgentVisitNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setActiveVisitModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCompleteVisitSubmit}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs"
                >
                  Valider la Visite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals: Property Lifecycle Modal & Printable Visit Voucher */}
      {activeLifecycleProperty && (
        <PropertyLifecycleModal
          property={activeLifecycleProperty}
          onClose={() => setActiveLifecycleProperty(null)}
        />
      )}

      {activeVoucherVisit && (
        <PrintableVisitVoucher
          visit={activeVoucherVisit}
          onClose={() => setActiveVoucherVisit(null)}
        />
      )}

      {activeCommercialSheetProperty && (
        <PrintableCommercialSheet
          property={activeCommercialSheetProperty}
          onClose={() => setActiveCommercialSheetProperty(null)}
        />
      )}

    </div>
  );
};
