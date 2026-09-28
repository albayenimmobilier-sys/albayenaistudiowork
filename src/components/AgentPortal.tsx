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
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lead, Visit, Property, LeadStatus } from '../types';

interface AgentPortalProps {
  onSelectProperty: (property: Property) => void;
}

export const AgentPortal: React.FC<AgentPortalProps> = ({ onSelectProperty }) => {
  const { 
    currentUser, 
    leads, 
    visits, 
    properties, 
    updateLeadStatus, 
    addLeadNote, 
    addLeadInteraction, 
    updateVisitStatus, 
    formatPrice 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'visits' | 'portfolio' | 'interactions'>('pipeline');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Visit completion modal state
  const [activeVisitModal, setActiveVisitModal] = useState<Visit | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [agentVisitNotes, setAgentVisitNotes] = useState('');

  // New Note State
  const [newNoteText, setNewNoteText] = useState('');
  
  // New Interaction State
  const [interactionType, setInteractionType] = useState<'call' | 'whatsapp' | 'email' | 'meeting' | 'visit'>('call');
  const [interactionSummary, setInteractionSummary] = useState('');

  // Agent's assigned leads & properties
  const myLeads = leads.filter(l => 
    l.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const myVisits = visits.filter(v => 
    v.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const myProperties = properties.filter(p => 
    p.agentId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin' || true
  );

  const filteredLeads = myLeads.filter(l => {
    const matchesSearch = `${l.firstName} ${l.lastName} ${l.phone} ${l.ref}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const crmStages: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'nouveau', label: 'Nouveau', color: 'border-blue-400 bg-blue-50/50' },
    { id: 'contacte', label: 'Contacté', color: 'border-amber-400 bg-amber-50/50' },
    { id: 'qualifie', label: 'Qualifié', color: 'border-purple-400 bg-purple-50/50' },
    { id: 'visite_programmee', label: 'Visite Programmée', color: 'border-indigo-400 bg-indigo-50/50' },
    { id: 'en_negociation', label: 'En Négociation', color: 'border-orange-400 bg-orange-50/50' },
    { id: 'converti', label: 'Converti / Conclu', color: 'border-emerald-400 bg-emerald-50/50' },
    { id: 'perdu', label: 'Perdu / Classé', color: 'border-stone-300 bg-stone-50' }
  ];

  const handleAddNote = (leadId: string) => {
    if (!newNoteText.trim()) return;
    addLeadNote(leadId, newNoteText);
    setNewNoteText('');
  };

  const handleLogInteraction = (leadId: string) => {
    if (!interactionSummary.trim()) return;
    addLeadInteraction(leadId, interactionType, interactionSummary);
    setInteractionSummary('');
  };

  const handleCompleteVisitSubmit = () => {
    if (!activeVisitModal) return;
    updateVisitStatus(activeVisitModal.id, 'effectuee', {
      rating: feedbackRating,
      comment: feedbackComment,
      agentNotes: agentVisitNotes
    });
    setActiveVisitModal(null);
  };

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
                  Conseiller Immobilier Senior
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Secteur : Port El Kantaoui · Hammam Sousse · Chott Mariem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-medium">Statut Négociateur :</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Disponible / En Visite Terrain
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
            <span className="text-[11px] text-emerald-600 block mt-0.5">+3 cette semaine</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Visites du Mois</span>
            <span className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {myVisits.length}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">2 à confirmer aujourd'hui</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Biens sous Mandat</span>
            <span className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {myProperties.length}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Valeur : ~8.4M DT</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-xs text-stone-500 uppercase font-semibold block">Note Satisfaction</span>
            <span className="text-2xl font-display font-bold text-amber-700 tabular-nums flex items-center gap-1">
              <span>4.9</span>
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Sur 42 avis vérifiés</span>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-6 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pipeline'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pipeline Prospects CRM ({myLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'visits'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planning & Gestion des Visites ({myVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'portfolio'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Mon Portefeuille de Biens ({myProperties.length})</span>
        </button>
      </div>

      {/* TAB 1: CRM PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, référence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 font-medium focus:outline-none"
              >
                <option value="all">Toutes les étapes</option>
                {crmStages.map(st => (
                  <option key={st.id} value={st.id}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 no-scrollbar w-full max-w-full">
            {crmStages.slice(0, 4).map(stage => {
              const stageLeads = filteredLeads.filter(l => l.status === stage.id);

              return (
                <div key={stage.id} className="bg-stone-100/70 rounded-xl p-3 border border-stone-200/80 flex flex-col">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-stone-800">
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200 tabular-nums">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3 flex-1">
                    {stageLeads.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-lg">
                        Aucun prospect
                      </div>
                    ) : (
                      stageLeads.map(lead => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer text-left"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                              {lead.ref}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {lead.createdAt}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                            {lead.firstName} {lead.lastName}
                          </h4>

                          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{lead.phone}</span>
                          </p>

                          {lead.budgetMax > 0 && (
                            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                              <span className="text-stone-500">Budget max</span>
                              <strong className="text-stone-900 tabular-nums">{lead.budgetMax.toLocaleString('fr-FR')} DT</strong>
                            </div>
                          )}

                          {lead.interestedPropertyRef && (
                            <div className="mt-1.5 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-xs font-medium">
                              Cible : {lead.interestedPropertyRef}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Detailed Prospect Modal / Drawer */}
          {selectedLead && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        {selectedLead.ref}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <h3 className="text-base font-bold text-stone-900">
                        {selectedLead.firstName} {selectedLead.lastName}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-500">
                      Prospect enregistré le {selectedLead.createdAt} via {selectedLead.source}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
                  
                  {/* Status Changer */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Statut CRM du Prospect :
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {crmStages.map(st => (
                        <button
                          key={st.id}
                          onClick={() => updateLeadStatus(selectedLead.id, st.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                            selectedLead.status === st.id
                              ? 'bg-stone-900 text-white'
                              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact details & Needs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-xs">
                      <span className="font-semibold text-stone-400 uppercase tracking-wider block">Coordonnées</span>
                      <div className="flex items-center gap-2 text-stone-800">
                        <Phone className="w-3.5 h-3.5 text-amber-700" />
                        <a href={`tel:${selectedLead.phone}`} className="hover:underline font-semibold">{selectedLead.phone}</a>
                        <button
                          onClick={() => window.open(`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                          className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold hover:bg-emerald-100"
                        >
                          WhatsApp
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-stone-800">
                        <Mail className="w-3.5 h-3.5 text-amber-700" />
                        <span>{selectedLead.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-semibold text-stone-400 uppercase tracking-wider block">Critères de recherche</span>
                      <p className="text-stone-700">Type de besoin : <strong className="capitalize">{selectedLead.needType}</strong></p>
                      <p className="text-stone-700">Budget max : <strong className="tabular-nums">{selectedLead.budgetMax ? `${selectedLead.budgetMax.toLocaleString('fr-FR')} DT` : 'Non fixé'}</strong></p>
                      <p className="text-stone-700">Zones souhaitées : <strong>{selectedLead.targetAreas.join(', ')}</strong></p>
                    </div>
                  </div>

                  {/* Add Note & Interaction */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Ajouter une note ou consigner une interaction
                    </h4>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Client en attente de déblocage d'un prêt BIAT..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                      <button
                        onClick={() => handleAddNote(selectedLead.id)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Enregistrer note
                      </button>
                    </div>

                    {/* Interaction Logger */}
                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={interactionType}
                        onChange={(e) => setInteractionType(e.target.value as any)}
                        className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-2 text-xs font-medium text-stone-800 focus:outline-none"
                      >
                        <option value="call">Appel téléphonique</option>
                        <option value="whatsapp">Échange WhatsApp</option>
                        <option value="visit">Visite sur place</option>
                        <option value="meeting">Rendez-vous à l'agence</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Résumé de l'interaction..."
                        value={interactionSummary}
                        onChange={(e) => setInteractionSummary(e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                      <button
                        onClick={() => handleLogInteraction(selectedLead.id)}
                        className="px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap border border-stone-200"
                      >
                        Consigner
                      </button>
                    </div>
                  </div>

                  {/* Notes & Interaction Feed */}
                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <span className="text-xs font-semibold text-stone-500 block">Historique & Notes ({selectedLead.notes.length + selectedLead.interactions.length})</span>
                    
                    {selectedLead.notes.map(n => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-amber-900 font-semibold mb-1">
                          <span>Note de {n.author}</span>
                          <span className="text-stone-400">{n.date}</span>
                        </div>
                        <p className="text-stone-800">{n.text}</p>
                      </div>
                    ))}

                    {selectedLead.interactions.map(it => (
                      <div key={it.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-stone-600 font-semibold mb-1">
                          <span className="capitalize">{it.type} ({it.author})</span>
                          <span className="text-stone-400">{it.date}</span>
                        </div>
                        <p className="text-stone-800">{it.summary}</p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: VISITS MANAGEMENT */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-display font-bold text-stone-900">
              Agenda des Visites Clients
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

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-800">
                          {visit.propertyRef}
                        </span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-stone-100 text-stone-800">
                          {visit.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-stone-900">
                        {visit.propertyTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-2 font-medium">
                        <span>Client : <strong>{visit.clientName}</strong></span>
                        <a href={`tel:${visit.clientPhone}`} className="text-amber-800 font-semibold hover:underline">
                          {visit.clientPhone}
                        </a>
                        <span>Date : <strong>{visit.date} à {visit.timeSlot}</strong></span>
                      </div>

                      {visit.feedbackComment && (
                        <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg mt-2 font-medium">
                          Avis visiteur : "{visit.feedbackComment}" ({visit.feedbackRating}/5 ★)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for Agent */}
                  <div className="flex items-center gap-2 shrink-0">
                    {visit.status === 'demandee' && (
                      <button
                        onClick={() => updateVisitStatus(visit.id, 'confirmee')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmer visite</span>
                      </button>
                    )}

                    {visit.status === 'confirmee' && (
                      <button
                        onClick={() => setActiveVisitModal(visit)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Clôturer avec compte-rendu</span>
                      </button>
                    )}

                    <button
                      onClick={() => updateVisitStatus(visit.id, 'annulee')}
                      className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visit Completion Modal */}
          {activeVisitModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
                <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                  <h3 className="text-base font-bold text-stone-900">
                    Compte-rendu de Visite : {activeVisitModal.propertyRef}
                  </h3>
                  <button onClick={() => setActiveVisitModal(null)}>
                    <X className="w-5 h-5 text-stone-400" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
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
                          className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
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
                      Notes internes pour l'agence
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Notes pour l'administrateur ou suivi de négociation..."
                      value={agentVisitNotes}
                      onChange={(e) => setAgentVisitNotes(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setActiveVisitModal(null)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCompleteVisitSubmit}
                      className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg"
                    >
                      Enregistrer le compte-rendu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: AGENT PROPERTIES PORTFOLIO */}
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
              <div key={prop.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="relative aspect-[4/3]">
                  <img src={prop.mainImage} alt={prop.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-stone-900 text-white text-xs px-2 py-0.5 rounded-sm font-semibold">
                    {prop.ref}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-sm">
                    {prop.status}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-stone-500 font-medium block">{prop.district}, {prop.city}</span>
                  <h3 className="text-sm font-semibold text-stone-900 truncate mt-1">{prop.title}</h3>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <span className="text-sm font-bold text-stone-900 tabular-nums">{formatPrice(prop.price)}</span>
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="text-xs font-semibold text-amber-800 hover:underline"
                    >
                      Fiche complète →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
