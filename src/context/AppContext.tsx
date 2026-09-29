import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Property, 
  Lead, 
  Visit, 
  Owner, 
  Agent, 
  CommercialOffer, 
  Notification, 
  ActivityLog, 
  AgencySettings, 
  Language, 
  Currency,
  UserRole,
  UnifiedContact,
  CRMInteraction,
  CRMTask,
  Mandate,
  FullCommercialOffer,
  SalesTransaction,
  PropertyHistoryEvent,
  AgentUnavailability,
  DuplicateMatchResult,
  NegotiationStep
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PROPERTIES, 
  INITIAL_LEADS, 
  INITIAL_VISITS, 
  INITIAL_OWNERS, 
  INITIAL_AGENTS, 
  INITIAL_OFFERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_AGENCY_SETTINGS,
  INITIAL_UNIFIED_CONTACTS,
  INITIAL_CRM_INTERACTIONS,
  INITIAL_CRM_TASKS,
  INITIAL_MANDATES,
  INITIAL_FULL_OFFERS,
  INITIAL_SALES_TRANSACTIONS,
  INITIAL_PROPERTY_HISTORY,
  INITIAL_AGENT_UNAVAILABILITIES
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (u: User) => void;
  switchRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInTnd: number) => string;
  
  properties: Property[];
  favorites: string[];
  toggleFavorite: (propId: string) => void;
  isFavorite: (propId: string) => boolean;
  
  leads: Lead[];
  visits: Visit[];
  owners: Owner[];
  agents: Agent[];
  offers: CommercialOffer[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  agencySettings: AgencySettings;
  updateAgencySettings: (settings: Partial<AgencySettings>) => void;

  // Complementary CRM state
  unifiedContacts: UnifiedContact[];
  crmInteractions: CRMInteraction[];
  crmTasks: CRMTask[];
  mandates: Mandate[];
  fullOffers: FullCommercialOffer[];
  salesTransactions: SalesTransaction[];
  propertyHistory: PropertyHistoryEvent[];
  agentUnavailabilities: AgentUnavailability[];
  
  activeView: 'public' | 'property-detail' | 'client-portal' | 'agent-portal' | 'admin-portal';
  setActiveView: (view: 'public' | 'property-detail' | 'client-portal' | 'agent-portal' | 'admin-portal') => void;
  selectedProperty: Property | null;
  setSelectedProperty: (p: Property | null) => void;
  
  // Actions
  addProperty: (p: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'favoritesCount'>) => void;
  updateProperty: (id: string, p: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  // Property Lifecycle & Transitions
  changePropertyStatus: (propertyId: string, newStatus: Property['status'], reason?: string) => { success: boolean; error?: string };
  changePropertyPrice: (propertyId: string, newPrice: number, reason?: string) => void;
  detectDuplicateProperties: (candidate: { title?: string; district?: string; surface?: number; price?: number; id?: string }) => DuplicateMatchResult<Property>[];
  
  submitVisitRequest: (visitData: {
    propertyId: string;
    propertyRef: string;
    propertyTitle: string;
    propertyImage: string;
    propertyPrice: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    agentId: string;
    date: string;
    timeSlot: string;
    visitorsCount: number;
    comment?: string;
  }) => void;
  updateVisitStatus: (visitId: string, status: Visit['status'], feedback?: { rating?: number; comment?: string; agentNotes?: string }) => void;
  
  submitInfoRequest: (inquiry: {
    propertyRef: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    preference: string;
  }) => void;
  
  addLead: (lead: Omit<Lead, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'notes' | 'interactions'>) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLeadNote: (leadId: string, text: string) => void;
  addLeadInteraction: (leadId: string, type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'visit', summary: string) => void;

  // Unified Contacts Management & Duplicates
  addUnifiedContact: (contact: Omit<UnifiedContact, 'id' | 'ref' | 'createdAt' | 'updatedAt'>) => UnifiedContact;
  updateUnifiedContact: (contactId: string, updates: Partial<UnifiedContact>) => void;
  deleteUnifiedContact: (contactId: string) => void;
  detectDuplicateContacts: (candidate: { firstName?: string; lastName?: string; phone?: string; email?: string; id?: string }) => DuplicateMatchResult<UnifiedContact>[];
  mergeContacts: (targetContactId: string, sourceContactId: string) => void;

  // CRM Interactions (Timeline)
  addCRMInteraction: (interaction: Omit<CRMInteraction, 'id' | 'date' | 'authorId' | 'authorName' | 'authorRole'> & { date?: string }) => void;

  // CRM Tasks & Auto-relances
  addCRMTask: (task: Omit<CRMTask, 'id' | 'createdAt'>) => void;
  updateCRMTaskStatus: (taskId: string, status: CRMTask['status']) => void;
  deleteCRMTask: (taskId: string) => void;

  // Mandates Management
  addMandate: (mandate: Omit<Mandate, 'id' | 'mandateNumber' | 'createdAt' | 'updatedAt'>) => Mandate;
  updateMandate: (mandateId: string, updates: Partial<Mandate>) => void;

  // Offers & Step-by-Step Negotiation History
  addFullOffer: (offer: Omit<FullCommercialOffer, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'negotiationHistory'> & { initialOfferComment?: string }) => FullCommercialOffer;
  addNegotiationStep: (offerId: string, step: { amount: number; authorRole: 'acquereur' | 'proprietaire' | 'agence'; authorName: string; type: NegotiationStep['type']; comment: string }) => void;
  updateFullOfferStatus: (offerId: string, status: FullCommercialOffer['status']) => void;

  // Sales Transactions (Closing Dossiers)
  createSalesTransaction: (transaction: Omit<SalesTransaction, 'id' | 'ref' | 'createdAt' | 'updatedAt'>) => SalesTransaction;
  updateSalesTransaction: (transactionId: string, updates: Partial<SalesTransaction>) => void;
  finalizeSalesTransaction: (transactionId: string) => void;

  // Calendar & Scheduling Conflicts
  checkAgentConflict: (agentId: string, date: string, timeSlot: string) => { hasConflict: boolean; reason?: string };
  addAgentUnavailability: (unavail: Omit<AgentUnavailability, 'id'>) => void;
  removeAgentUnavailability: (id: string) => void;

  // Matching Engine
  matchContactWithProperties: (contact: UnifiedContact) => { property: Property; score: number; matchReasons: string[] }[];
  matchPropertyWithContacts: (property: Property) => { contact: UnifiedContact; score: number; matchReasons: string[] }[];
  
  submitCommercialOffer: (offer: {
    propertyId: string;
    propertyRef: string;
    propertyTitle: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    offeredAmount: number;
    listedPrice: number;
    agentId: string;
    commissionRate: number;
    notes: string;
  }) => void;
  updateOfferStatus: (offerId: string, status: CommercialOffer['status']) => void;
  
  // Owners Management
  addOwner: (owner: Omit<Owner, 'id' | 'createdAt' | 'documentsCount' | 'ownedPropertyIds'>) => void;
  updateOwner: (ownerId: string, updated: Partial<Owner>) => void;
  deleteOwner: (ownerId: string) => void;
  toggleOwnerStatus: (ownerId: string) => void;

  // Agents Management
  addAgent: (agent: Omit<Agent, 'id' | 'activePropertiesCount' | 'completedVisitsCount' | 'salesCount' | 'rating'>) => void;
  updateAgent: (agentId: string, updated: Partial<Agent>) => void;
  deleteAgent: (agentId: string) => void;
  toggleAgentStatus: (agentId: string) => void;

  markNotificationRead: (id: string) => void;
  logActivity: (action: string, targetObject: string, details: string) => void;
  
  exportBackup: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved data or fallback to defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('albayen_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to visitor
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('albayen_lang') as Language) || 'fr';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('albayen_currency') as Currency) || 'TND';
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('albayen_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('albayen_favorites');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('albayen_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [visits, setVisits] = useState<Visit[]>(() => {
    const saved = localStorage.getItem('albayen_visits');
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
  });

  const [owners, setOwners] = useState<Owner[]>(() => {
    const saved = localStorage.getItem('albayen_owners');
    return saved ? JSON.parse(saved) : INITIAL_OWNERS;
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('albayen_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [offers, setOffers] = useState<CommercialOffer[]>(() => {
    const saved = localStorage.getItem('albayen_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('albayen_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('albayen_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [agencySettings, setAgencySettings] = useState<AgencySettings>(() => {
    const saved = localStorage.getItem('albayen_settings');
    return saved ? JSON.parse(saved) : INITIAL_AGENCY_SETTINGS;
  });

  // Complementary CRM State
  const [unifiedContacts, setUnifiedContacts] = useState<UnifiedContact[]>(() => {
    const saved = localStorage.getItem('albayen_unified_contacts');
    return saved ? JSON.parse(saved) : INITIAL_UNIFIED_CONTACTS;
  });

  const [crmInteractions, setCrmInteractions] = useState<CRMInteraction[]>(() => {
    const saved = localStorage.getItem('albayen_crm_interactions');
    return saved ? JSON.parse(saved) : INITIAL_CRM_INTERACTIONS;
  });

  const [crmTasks, setCrmTasks] = useState<CRMTask[]>(() => {
    const saved = localStorage.getItem('albayen_crm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_CRM_TASKS;
  });

  const [mandates, setMandates] = useState<Mandate[]>(() => {
    const saved = localStorage.getItem('albayen_mandates');
    return saved ? JSON.parse(saved) : INITIAL_MANDATES;
  });

  const [fullOffers, setFullOffers] = useState<FullCommercialOffer[]>(() => {
    const saved = localStorage.getItem('albayen_full_offers');
    return saved ? JSON.parse(saved) : INITIAL_FULL_OFFERS;
  });

  const [salesTransactions, setSalesTransactions] = useState<SalesTransaction[]>(() => {
    const saved = localStorage.getItem('albayen_sales_transactions');
    return saved ? JSON.parse(saved) : INITIAL_SALES_TRANSACTIONS;
  });

  const [propertyHistory, setPropertyHistory] = useState<PropertyHistoryEvent[]>(() => {
    const saved = localStorage.getItem('albayen_prop_history');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTY_HISTORY;
  });

  const [agentUnavailabilities, setAgentUnavailabilities] = useState<AgentUnavailability[]>(() => {
    const saved = localStorage.getItem('albayen_unavailabilities');
    return saved ? JSON.parse(saved) : INITIAL_AGENT_UNAVAILABILITIES;
  });

  const [activeView, setActiveView] = useState<'public' | 'property-detail' | 'client-portal' | 'agent-portal' | 'admin-portal'>('public');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sync language with document direction
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('albayen_lang', lang);
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  };

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('albayen_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('albayen_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('albayen_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('albayen_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('albayen_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem('albayen_owners', JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    localStorage.setItem('albayen_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('albayen_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('albayen_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('albayen_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('albayen_settings', JSON.stringify(agencySettings));
  }, [agencySettings]);

  useEffect(() => {
    localStorage.setItem('albayen_unified_contacts', JSON.stringify(unifiedContacts));
  }, [unifiedContacts]);

  useEffect(() => {
    localStorage.setItem('albayen_crm_interactions', JSON.stringify(crmInteractions));
  }, [crmInteractions]);

  useEffect(() => {
    localStorage.setItem('albayen_crm_tasks', JSON.stringify(crmTasks));
  }, [crmTasks]);

  useEffect(() => {
    localStorage.setItem('albayen_mandates', JSON.stringify(mandates));
  }, [mandates]);

  useEffect(() => {
    localStorage.setItem('albayen_full_offers', JSON.stringify(fullOffers));
  }, [fullOffers]);

  useEffect(() => {
    localStorage.setItem('albayen_sales_transactions', JSON.stringify(salesTransactions));
  }, [salesTransactions]);

  useEffect(() => {
    localStorage.setItem('albayen_prop_history', JSON.stringify(propertyHistory));
  }, [propertyHistory]);

  useEffect(() => {
    localStorage.setItem('albayen_unavailabilities', JSON.stringify(agentUnavailabilities));
  }, [agentUnavailabilities]);

  // Helper: Log Activity
  const logActivity = (action: string, targetObject: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      targetObject,
      details,
      ipAddress: '197.14.182.20',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Switch role seamlessly
  const switchRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role) || {
      id: `user-${role}`,
      name: role === 'visitor' ? 'Visiteur Public' : `Utilisateur ${role.toUpperCase()}`,
      email: `${role}@albayen-sousse.com`,
      phone: '+216 73 224 880',
      role: role
    };
    setCurrentUser(targetUser);
    logActivity('CHANGEMENT_ROLE', `Rôle ${role.toUpperCase()}`, `L'utilisateur a basculé vers le profil ${targetUser.name}`);
    
    // Auto redirect view if needed
    if (role === 'visitor') {
      setActiveView('public');
    } else if (role === 'client') {
      setActiveView('client-portal');
    } else if (role === 'agent') {
      setActiveView('agent-portal');
    } else if (role === 'admin' || role === 'superadmin') {
      setActiveView('admin-portal');
    }
  };

  // Format Price in TND, EUR, USD
  const formatPrice = (priceInTnd: number): string => {
    if (currency === 'EUR') {
      const val = Math.round(priceInTnd / agencySettings.exchangeRateEUR);
      return `${val.toLocaleString('fr-FR')} €`;
    }
    if (currency === 'USD') {
      const val = Math.round(priceInTnd / agencySettings.exchangeRateUSD);
      return `$${val.toLocaleString('en-US')}`;
    }
    return `${priceInTnd.toLocaleString('fr-FR')} DT`;
  };

  // Favorites
  const toggleFavorite = (propId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(propId);
      const next = exists ? prev.filter(id => id !== propId) : [...prev, propId];
      // update property favorites count
      setProperties(props => props.map(p => {
        if (p.id === propId) {
          return { ...p, favoritesCount: Math.max(0, p.favoritesCount + (exists ? -1 : 1)) };
        }
        return p;
      }));
      return next;
    });
  };

  const isFavorite = (propId: string) => favorites.includes(propId);

  // Property CRUD
  const addProperty = (newP: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'favoritesCount'>) => {
    const id = `prop-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const created: Property = {
      ...newP,
      id,
      createdAt: now,
      updatedAt: now,
      viewsCount: 1,
      favoritesCount: 0
    };
    setProperties(prev => [created, ...prev]);
    logActivity('AJOUT_BIEN', `Bien ${created.ref}`, `Création de l'annonce "${created.title}" par ${currentUser.name}`);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    const now = new Date().toISOString().split('T')[0];
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates, updatedAt: now };
      }
      return p;
    }));
    logActivity('MODIFICATION_BIEN', `Bien ID ${id}`, `Mise à jour des informations du bien par ${currentUser.name}`);
  };

  const deleteProperty = (id: string) => {
    const target = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));
    logActivity('SUPPRESSION_BIEN', `Bien ${target?.ref || id}`, `Suppression du bien "${target?.title || id}"`);
  };

  // Submit Visit Request
  const submitVisitRequest = (visitData: {
    propertyId: string;
    propertyRef: string;
    propertyTitle: string;
    propertyImage: string;
    propertyPrice: number;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    agentId: string;
    date: string;
    timeSlot: string;
    visitorsCount: number;
    comment?: string;
  }) => {
    const id = `visit-${Date.now()}`;
    const newVisit: Visit = {
      ...visitData,
      id,
      clientUserId: currentUser.role === 'client' ? currentUser.id : undefined,
      status: 'demandee',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVisits(prev => [newVisit, ...prev]);

    // Create a new CRM Lead automatically if not exists
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ref: `CRM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      firstName: visitData.clientName.split(' ')[0] || visitData.clientName,
      lastName: visitData.clientName.split(' ').slice(1).join(' ') || '',
      phone: visitData.clientPhone,
      email: visitData.clientEmail,
      needType: 'buy',
      propertyType: 'appartement',
      budgetMin: Math.round(visitData.propertyPrice * 0.9),
      budgetMax: visitData.propertyPrice,
      targetAreas: ['Sousse'],
      source: 'site_web',
      status: 'visite_programmee',
      agentId: visitData.agentId || 'user-agent-1',
      interestedPropertyRef: visitData.propertyRef,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Système Albayen',
          text: `Demande de visite pour le ${visitData.date} à ${visitData.timeSlot}. Commentaire: "${visitData.comment || 'Aucun'}"`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ],
      interactions: [
        {
          id: `int-${Date.now()}`,
          type: 'visit',
          summary: `Demande de visite enregistrée via le site web (${visitData.propertyRef})`,
          date: new Date().toISOString().split('T')[0],
          author: 'Portail Web'
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);

    // Notification for agent and admin
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: visitData.agentId || 'user-agent-1',
      title: 'Nouvelle demande de visite',
      message: `${visitData.clientName} a demandé une visite pour ${visitData.propertyRef} le ${visitData.date} à ${visitData.timeSlot}.`,
      type: 'visit',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    logActivity('NOUVELLE_VISITE', `Bien ${visitData.propertyRef}`, `Visite demandée par ${visitData.clientName} (${visitData.clientPhone})`);
  };

  const updateVisitStatus = (visitId: string, status: Visit['status'], feedback?: { rating?: number; comment?: string; agentNotes?: string }) => {
    let completedVisit: Visit | undefined;
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        completedVisit = {
          ...v,
          status,
          feedbackRating: feedback?.rating ?? v.feedbackRating,
          feedbackComment: feedback?.comment ?? v.feedbackComment,
          agentNotes: feedback?.agentNotes ?? v.agentNotes
        };
        return completedVisit;
      }
      return v;
    }));
    logActivity('STATUT_VISITE', `Visite ID ${visitId}`, `Statut passé à "${status}"`);

    // Relance automatique J+1 quand la visite est effectuée
    if (status === 'effectuee' && completedVisit) {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const autoTask: CRMTask = {
        id: `task-auto-${Date.now()}`,
        title: `Relance débriefing : ${completedVisit.clientName}`,
        description: `Recueillir le ressenti du client 24h après la visite du bien ${completedVisit.propertyRef} (${completedVisit.propertyTitle}). Vérifier s'il souhaite formuler une offre.`,
        type: 'relance',
        priority: 'urgente',
        status: 'a_faire',
        assignedAgentId: completedVisit.agentId || 'user-agent-1',
        assignedAgentName: 'Karim Ben Salah',
        dueDate: tomorrow,
        dueTime: '11:00',
        contactName: completedVisit.clientName,
        propertyId: completedVisit.propertyId,
        propertyRef: completedVisit.propertyRef,
        isAutoGenerated: true,
        autoTriggerReason: 'Visite effectuée (Règle automatique J+1 débriefing)',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCrmTasks(prev => [autoTask, ...prev]);

      // Enregistrer une interaction CRM automatique
      const newInt: CRMInteraction = {
        id: `int-auto-${Date.now()}`,
        contactId: completedVisit.clientUserId || 'contact-visit',
        contactName: completedVisit.clientName,
        propertyId: completedVisit.propertyId,
        propertyRef: completedVisit.propertyRef,
        propertyTitle: completedVisit.propertyTitle,
        type: 'visite',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: `Visite effectuée. ${feedback?.comment ? `Commentaire: "${feedback.comment}".` : ''} ${feedback?.agentNotes ? `Notes agent: "${feedback.agentNotes}".` : ''}`,
        result: feedback?.rating ? `Évaluation: ${feedback.rating}/5` : 'Visite complétée',
        nextAction: 'Relancer le client à J+1 pour débriefing approfondi',
        nextActionDate: tomorrow
      };
      setCrmInteractions(prev => [newInt, ...prev]);
    }
  };

  // Submit Info Request
  const submitInfoRequest = (inquiry: {
    propertyRef: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    preference: string;
  }) => {
    // Add lead to CRM
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ref: `CRM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      firstName: inquiry.name.split(' ')[0] || inquiry.name,
      lastName: inquiry.name.split(' ').slice(1).join(' ') || '',
      phone: inquiry.phone,
      email: inquiry.email,
      needType: 'buy',
      propertyType: 'appartement',
      budgetMin: 0,
      budgetMax: 0,
      targetAreas: ['Sousse'],
      source: 'site_web',
      status: 'nouveau',
      agentId: 'user-agent-1',
      interestedPropertyRef: inquiry.propertyRef,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Formulaire d\'information',
          text: `Message: "${inquiry.message}". Canal préféré: ${inquiry.preference}.`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ],
      interactions: [
        {
          id: `int-${Date.now()}`,
          type: 'email',
          summary: `Demande d'information envoyée pour ${inquiry.propertyRef}`,
          date: new Date().toISOString().split('T')[0],
          author: 'Site Web'
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);

    // Notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-agent-1',
      title: 'Nouvelle demande d\'information',
      message: `${inquiry.name} souhaite des infos sur ${inquiry.propertyRef}. Tél : ${inquiry.phone}`,
      type: 'lead',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    logActivity('DEMANDE_INFORMATION', `Bien ${inquiry.propertyRef}`, `Message envoyé par ${inquiry.name}`);
  };

  // CRM Lead actions
  const addLead = (lead: Omit<Lead, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'notes' | 'interactions'>) => {
    const id = `lead-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const created: Lead = {
      ...lead,
      id,
      ref: `CRM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      notes: [],
      interactions: [],
      createdAt: now,
      updatedAt: now
    };
    setLeads(prev => [created, ...prev]);
    logActivity('NOUVEAU_PROSPECT', `Prospect ${created.firstName} ${created.lastName}`, `Création de prospect par ${currentUser.name}`);
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    const now = new Date().toISOString().split('T')[0];
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status, updatedAt: now };
      }
      return l;
    }));
    logActivity('STATUT_PROSPECT', `Prospect ID ${leadId}`, `Étape CRM changée vers: ${status}`);
  };

  const addLeadNote = (leadId: string, text: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      text,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, notes: [newNote, ...l.notes] };
      }
      return l;
    }));
  };

  const addLeadInteraction = (leadId: string, type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'visit', summary: string) => {
    const newInt = {
      id: `int-${Date.now()}`,
      type,
      summary,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name
    };
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, interactions: [newInt, ...l.interactions] };
      }
      return l;
    }));
  };

  // Commercial Offers
  const submitCommercialOffer = (offer: {
    propertyId: string;
    propertyRef: string;
    propertyTitle: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    offeredAmount: number;
    listedPrice: number;
    agentId: string;
    commissionRate: number;
    notes: string;
  }) => {
    const id = `offer-${Date.now()}`;
    const estimatedCommission = Math.round((offer.offeredAmount * offer.commissionRate) / 100);
    const created: CommercialOffer = {
      ...offer,
      id,
      ref: `OFF-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      estimatedCommission,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOffers(prev => [created, ...prev]);
    logActivity('NOUVELLE_OFFRE', `Offre ${created.ref}`, `Proposition de ${offer.offeredAmount} DT sur ${offer.propertyRef}`);
  };

  const updateOfferStatus = (offerId: string, status: CommercialOffer['status']) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o));
    logActivity('STATUT_OFFRE', `Offre ID ${offerId}`, `Nouveau statut: ${status}`);
  };

  // Owners Management
  const addOwner = (owner: Omit<Owner, 'id' | 'createdAt' | 'documentsCount' | 'ownedPropertyIds'>) => {
    const created: Owner = {
      ...owner,
      id: `owner-${Date.now()}`,
      status: owner.status || 'actif',
      ownedPropertyIds: [],
      documentsCount: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOwners(prev => [created, ...prev]);
    logActivity('NOUVEAU_PROPRIETAIRE', `${owner.firstName} ${owner.lastName}`, `Création de fiche propriétaire par ${currentUser.name}`);
  };

  const updateOwner = (ownerId: string, updated: Partial<Owner>) => {
    setOwners(prev => prev.map(o => o.id === ownerId ? { ...o, ...updated } : o));
    logActivity('MODIFICATION_PROPRIETAIRE', `Propriétaire ID ${ownerId}`, `Mise à jour des coordonnées et informations`);
  };

  const deleteOwner = (ownerId: string) => {
    const target = owners.find(o => o.id === ownerId);
    setOwners(prev => prev.filter(o => o.id !== ownerId));
    logActivity('SUPPRESSION_PROPRIETAIRE', target ? `${target.firstName} ${target.lastName}` : `ID ${ownerId}`, `Suppression de la fiche propriétaire`);
  };

  const toggleOwnerStatus = (ownerId: string) => {
    let nextStatus: 'actif' | 'inactif' = 'inactif';
    setOwners(prev => prev.map(o => {
      if (o.id === ownerId) {
        nextStatus = o.status === 'inactif' ? 'actif' : 'inactif';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
    logActivity('STATUT_PROPRIETAIRE', `Propriétaire ID ${ownerId}`, `Statut basculé vers "${nextStatus}"`);
  };

  // Agents Management
  const addAgent = (agent: Omit<Agent, 'id' | 'activePropertiesCount' | 'completedVisitsCount' | 'salesCount' | 'rating'>) => {
    const created: Agent = {
      ...agent,
      id: `agent-${Date.now()}`,
      status: agent.status || 'actif',
      commissionRate: agent.commissionRate ?? 2.5,
      activePropertiesCount: 0,
      completedVisitsCount: 0,
      salesCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAgents(prev => [created, ...prev]);
    logActivity('NOUVEL_AGENT', agent.name, `Enregistrement d'un nouvel agent négociateur (${agent.specialty})`);
  };

  const updateAgent = (agentId: string, updated: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updated } : a));
    logActivity('MODIFICATION_AGENT', `Agent ID ${agentId}`, `Mise à jour des informations de l'agent`);
  };

  const deleteAgent = (agentId: string) => {
    const target = agents.find(a => a.id === agentId);
    setAgents(prev => prev.filter(a => a.id !== agentId));
    logActivity('SUPPRESSION_AGENT', target ? target.name : `ID ${agentId}`, `Suppression du compte agent négociateur`);
  };

  const toggleAgentStatus = (agentId: string) => {
    let nextStatus: 'actif' | 'inactif' = 'inactif';
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        nextStatus = a.status === 'inactif' ? 'actif' : 'inactif';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
    logActivity('STATUT_AGENT', `Agent ID ${agentId}`, `Statut agent basculé vers "${nextStatus}"`);
  };

  // -------------------------------------------------------------
  // CRM ACTIONS & BUSINESS LOGIC
  // -------------------------------------------------------------

  // Property Lifecycle & Permitted Transitions
  const changePropertyStatus = (propertyId: string, newStatus: Property['status'], reason?: string): { success: boolean; error?: string } => {
    const target = properties.find(p => p.id === propertyId);
    if (!target) return { success: false, error: 'Bien introuvable' };

    // Check permissions
    if (currentUser.role === 'visitor' || currentUser.role === 'client') {
      return { success: false, error: 'Permissions insuffisantes pour modifier le statut du bien' };
    }
    if ((newStatus === 'archive' || target.status === 'archive') && currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
      return { success: false, error: 'Seule la direction / administration peut archiver ou réactiver un bien' };
    }

    const oldStatus = target.status;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Determine history event type
    let eventType: PropertyHistoryEvent['eventType'] = 'status_change';
    if (newStatus === 'publie') eventType = 'publication';
    else if (oldStatus === 'publie' && newStatus === 'disponible') eventType = 'depublication';
    else if (newStatus === 'sous_option') eventType = 'option_taken';
    else if (oldStatus === 'sous_option' && newStatus === 'disponible') eventType = 'option_cancelled';
    else if (newStatus === 'vendu') eventType = 'sold';
    else if (newStatus === 'loue') eventType = 'rented';
    else if (newStatus === 'archive') eventType = 'archived';
    else if (oldStatus === 'archive') eventType = 'reactivated';

    // Record property history
    const historyEvent: PropertyHistoryEvent = {
      id: `p-hist-${Date.now()}`,
      propertyId: target.id,
      propertyRef: target.ref,
      eventType,
      oldValue: oldStatus,
      newValue: newStatus,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      date: now,
      notes: reason || `Transition de statut de "${oldStatus}" vers "${newStatus}"`
    };
    setPropertyHistory(prev => [historyEvent, ...prev]);

    // Update Property
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: newStatus, updatedAt: now.split(' ')[0] } : p));
    logActivity('TRANSITION_STATUT_BIEN', `Bien ${target.ref}`, `Passage de "${oldStatus}" à "${newStatus}". Motif: ${reason || 'N/A'}`);
    return { success: true };
  };

  const changePropertyPrice = (propertyId: string, newPrice: number, reason?: string) => {
    const target = properties.find(p => p.id === propertyId);
    if (!target) return;
    const oldPriceStr = `${target.price.toLocaleString('fr-FR')} DT`;
    const newPriceStr = `${newPrice.toLocaleString('fr-FR')} DT`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const historyEvent: PropertyHistoryEvent = {
      id: `p-hist-${Date.now()}`,
      propertyId: target.id,
      propertyRef: target.ref,
      eventType: 'price_change',
      oldValue: oldPriceStr,
      newValue: newPriceStr,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      date: now,
      notes: reason || 'Ajustement commercial du prix'
    };
    setPropertyHistory(prev => [historyEvent, ...prev]);

    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, price: newPrice, updatedAt: now.split(' ')[0] } : p));
    logActivity('MODIFICATION_PRIX', `Bien ${target.ref}`, `Prix modifié de ${oldPriceStr} à ${newPriceStr}. Motif: ${reason || 'N/A'}`);
  };

  const detectDuplicateProperties = (candidate: { title?: string; district?: string; surface?: number; price?: number; id?: string }): DuplicateMatchResult<Property>[] => {
    const results: DuplicateMatchResult<Property>[] = [];
    properties.forEach(existing => {
      if (candidate.id && existing.id === candidate.id) return;
      const reasons: string[] = [];
      let score = 0;

      if (candidate.title && existing.title.toLowerCase().trim() === candidate.title.toLowerCase().trim()) {
        score += 60;
        reasons.push(`Titre identique ("${existing.title}")`);
      }

      if (candidate.district && existing.district.toLowerCase() === candidate.district.toLowerCase()) {
        if (candidate.surface && Math.abs(existing.surface - candidate.surface) <= Math.max(5, existing.surface * 0.05)) {
          score += 35;
          reasons.push(`Même secteur (${existing.district}) et superficie semblable (${existing.surface} m²)`);
        }
        if (candidate.price && Math.abs(existing.price - candidate.price) <= Math.max(1000, existing.price * 0.05)) {
          score += 35;
          reasons.push(`Même secteur et prix équivalent (${existing.price.toLocaleString('fr-FR')} DT)`);
        }
      }

      if (score >= 40) {
        results.push({
          target: candidate as any,
          matchedWith: existing,
          matchScore: Math.min(100, score),
          matchReasons: reasons
        });
      }
    });
    return results.sort((a, b) => b.matchScore - a.matchScore);
  };

  // Unified Contacts Management
  const addUnifiedContact = (contact: Omit<UnifiedContact, 'id' | 'ref' | 'createdAt' | 'updatedAt'>): UnifiedContact => {
    const now = new Date().toISOString().split('T')[0];
    const created: UnifiedContact = {
      ...contact,
      id: `cnt-${Date.now()}`,
      ref: `CNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: now,
      updatedAt: now
    };
    setUnifiedContacts(prev => [created, ...prev]);

    // Create an immediate first contact task
    const task: CRMTask = {
      id: `task-contact-${Date.now()}`,
      title: `Premier contact : ${created.firstName} ${created.lastName}`,
      description: `Qualifier les attentes et présenter le portefeuille Albayen Sousse. Source: ${created.source}`,
      type: 'appel',
      priority: 'normale',
      status: 'a_faire',
      assignedAgentId: created.agentId || currentUser.id,
      assignedAgentName: currentUser.name,
      dueDate: now,
      dueTime: '17:00',
      contactId: created.id,
      contactName: `${created.firstName} ${created.lastName}`,
      isAutoGenerated: true,
      autoTriggerReason: 'Nouveau contact unifié créé',
      createdAt: now
    };
    setCrmTasks(prev => [task, ...prev]);

    logActivity('NOUVEAU_CONTACT', `${created.firstName} ${created.lastName}`, `Création de contact unifié avec les rôles: ${created.roles.join(', ')}`);
    return created;
  };

  const updateUnifiedContact = (contactId: string, updates: Partial<UnifiedContact>) => {
    const now = new Date().toISOString().split('T')[0];
    setUnifiedContacts(prev => prev.map(c => c.id === contactId ? { ...c, ...updates, updatedAt: now } : c));
    logActivity('MODIFICATION_CONTACT', `Contact ID ${contactId}`, `Mise à jour des informations contact`);
  };

  const deleteUnifiedContact = (contactId: string) => {
    const target = unifiedContacts.find(c => c.id === contactId);
    setUnifiedContacts(prev => prev.filter(c => c.id !== contactId));
    logActivity('SUPPRESSION_CONTACT', target ? `${target.firstName} ${target.lastName}` : `ID ${contactId}`, `Suppression définitive du contact unifié`);
  };

  const detectDuplicateContacts = (candidate: { firstName?: string; lastName?: string; phone?: string; email?: string; id?: string }): DuplicateMatchResult<UnifiedContact>[] => {
    const results: DuplicateMatchResult<UnifiedContact>[] = [];
    const cleanPhone = (p?: string) => (p || '').replace(/[\s\-\+\(\)]/g, '').slice(-8);
    const candPhone = cleanPhone(candidate.phone);
    const candEmail = (candidate.email || '').trim().toLowerCase();
    const candFullName = `${(candidate.firstName || '').trim()} ${(candidate.lastName || '').trim()}`.toLowerCase();

    unifiedContacts.forEach(existing => {
      if (candidate.id && existing.id === candidate.id) return;
      const reasons: string[] = [];
      let score = 0;

      const existPhone = cleanPhone(existing.phone);
      const existSecondary = (existing.secondaryPhones || []).some(sp => cleanPhone(sp) === candPhone && candPhone.length > 5);

      if (candPhone && candPhone.length >= 6 && (existPhone === candPhone || existSecondary)) {
        score += 60;
        reasons.push(`Numéro de téléphone identique (${existing.phone})`);
      }

      if (candEmail && existing.email && existing.email.toLowerCase().trim() === candEmail) {
        score += 50;
        reasons.push(`Adresse email identique (${existing.email})`);
      }

      const existFullName = `${existing.firstName} ${existing.lastName}`.trim().toLowerCase();
      if (candFullName && candFullName.length > 4 && existFullName === candFullName) {
        score += 40;
        reasons.push(`Nom et prénom identiques (${existing.firstName} ${existing.lastName})`);
      }

      if (score >= 40) {
        results.push({
          target: candidate as any,
          matchedWith: existing,
          matchScore: Math.min(100, score),
          matchReasons: reasons
        });
      }
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  };

  const mergeContacts = (targetContactId: string, sourceContactId: string) => {
    const target = unifiedContacts.find(c => c.id === targetContactId);
    const source = unifiedContacts.find(c => c.id === sourceContactId);
    if (!target || !source) return;

    // Merge roles without duplicates
    const combinedRoles = Array.from(new Set([...target.roles, ...source.roles]));

    // Merge phones
    const combinedPhones = Array.from(
      new Set([
        ...(target.secondaryPhones || []),
        source.phone,
        ...(source.secondaryPhones || [])
      ].filter(p => p && p !== target.phone))
    );

    // Merge owned properties
    const combinedProperties = Array.from(
      new Set([...(target.ownedPropertyIds || []), ...(source.ownedPropertyIds || [])])
    );

    // Combine notes
    const combinedNotes = [target.notes, source.notes ? `[Info fusionnée de ${source.firstName} ${source.lastName}] : ${source.notes}` : '']
      .filter(Boolean)
      .join('\n\n');

    // Update target contact
    const updatedTarget: UnifiedContact = {
      ...target,
      roles: combinedRoles,
      secondaryPhones: combinedPhones,
      ownedPropertyIds: combinedProperties,
      notes: combinedNotes,
      searchCriteria: target.searchCriteria || source.searchCriteria,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Reassign interactions and tasks
    setCrmInteractions(prev => prev.map(int => int.contactId === sourceContactId ? { ...int, contactId: targetContactId, contactName: `${target.firstName} ${target.lastName}` } : int));
    setCrmTasks(prev => prev.map(tsk => tsk.contactId === sourceContactId ? { ...tsk, contactId: targetContactId, contactName: `${target.firstName} ${target.lastName}` } : tsk));
    setFullOffers(prev => prev.map(off => off.contactId === sourceContactId ? { ...off, contactId: targetContactId, contactName: `${target.firstName} ${target.lastName}` } : off));

    // Remove source and save target
    setUnifiedContacts(prev => prev.filter(c => c.id !== sourceContactId).map(c => c.id === targetContactId ? updatedTarget : c));
    logActivity('FUSION_CONTACTS', `${target.firstName} ${target.lastName}`, `Fusion réussie avec la fiche de ${source.firstName} ${source.lastName} (${source.ref})`);
  };

  // CRM Interactions (Timeline)
  const addCRMInteraction = (interaction: Omit<CRMInteraction, 'id' | 'date' | 'authorId' | 'authorName' | 'authorRole'> & { date?: string }) => {
    const now = interaction.date || new Date().toISOString().replace('T', ' ').substring(0, 16);
    const created: CRMInteraction = {
      ...interaction,
      id: `int-${Date.now()}`,
      date: now,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role
    };
    setCrmInteractions(prev => [created, ...prev]);

    // If next action is specified, create a task automatically
    if (interaction.nextAction && interaction.nextActionDate) {
      const autoTask: CRMTask = {
        id: `task-next-${Date.now()}`,
        title: interaction.nextAction,
        description: `Action découlant de l'interaction (${interaction.type}) avec ${interaction.contactName}. Résultat précédent: ${interaction.result || 'N/A'}`,
        type: interaction.type === 'visite' ? 'visite' : interaction.type === 'rendez_vous' ? 'rendez_vous' : 'appel',
        priority: 'haute',
        status: 'a_faire',
        assignedAgentId: currentUser.id,
        assignedAgentName: currentUser.name,
        dueDate: interaction.nextActionDate,
        contactId: interaction.contactId,
        contactName: interaction.contactName,
        propertyId: interaction.propertyId,
        propertyRef: interaction.propertyRef,
        isAutoGenerated: true,
        autoTriggerReason: `Planifiée suite à l'interaction du ${now.split(' ')[0]}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCrmTasks(prev => [autoTask, ...prev]);
    }

    logActivity('INTERACTION_CRM', `${interaction.contactName}`, `${interaction.type.toUpperCase()} : "${interaction.content.substring(0, 60)}..."`);
  };

  // CRM Tasks
  const addCRMTask = (task: Omit<CRMTask, 'id' | 'createdAt'>) => {
    const created: CRMTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCrmTasks(prev => [created, ...prev]);
    logActivity('NOUVELLE_TACHE', task.title, `Tâche assignée à ${task.assignedAgentName} pour le ${task.dueDate}`);
  };

  const updateCRMTaskStatus = (taskId: string, status: CRMTask['status']) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setCrmTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          completedAt: status === 'terminee' ? now : t.completedAt
        };
      }
      return t;
    }));
    logActivity('STATUT_TACHE', `Tâche ID ${taskId}`, `Statut passé à "${status}"`);
  };

  const deleteCRMTask = (taskId: string) => {
    setCrmTasks(prev => prev.filter(t => t.id !== taskId));
    logActivity('SUPPRESSION_TACHE', `Tâche ID ${taskId}`, `Tâche supprimée`);
  };

  // Mandates Management
  const addMandate = (mandate: Omit<Mandate, 'id' | 'mandateNumber' | 'createdAt' | 'updatedAt'>): Mandate => {
    const now = new Date().toISOString().split('T')[0];
    const commissionAmount = mandate.commissionAmount || Math.round((mandate.marketingPrice * mandate.commissionRate) / 100);
    const created: Mandate = {
      ...mandate,
      id: `mnd-${Date.now()}`,
      mandateNumber: `MND-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      commissionAmount,
      createdAt: now,
      updatedAt: now
    };
    setMandates(prev => [created, ...prev]);

    // Record mandate in property history
    const historyEvent: PropertyHistoryEvent = {
      id: `p-hist-${Date.now()}`,
      propertyId: mandate.propertyId,
      propertyRef: mandate.propertyRef,
      eventType: 'mandate_change',
      newValue: `Mandat ${created.mandateNumber} (${created.type}) actif jusqu'au ${created.endDate}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: `Honoraires agence : ${created.commissionRate}% (${created.commissionAmount.toLocaleString('fr-FR')} DT)`
    };
    setPropertyHistory(prev => [historyEvent, ...prev]);

    // Check expiration alert
    const daysUntilEnd = Math.ceil((new Date(created.endDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    if (daysUntilEnd <= created.alertDays && daysUntilEnd > 0) {
      const alertTask: CRMTask = {
        id: `task-mandate-${Date.now()}`,
        title: `Renouvellement Mandat ${created.mandateNumber}`,
        description: `Le mandat de ${created.ownerName} pour ${created.propertyRef} expire dans ${daysUntilEnd} jours. Prendre RDV pour bilan.`,
        type: 'mandat',
        priority: 'haute',
        status: 'a_faire',
        assignedAgentId: created.agentId,
        assignedAgentName: created.agentName,
        dueDate: now,
        dueTime: '10:00',
        contactName: created.ownerName,
        propertyId: created.propertyId,
        propertyRef: created.propertyRef,
        isAutoGenerated: true,
        autoTriggerReason: `Alerte mandat automatique (${daysUntilEnd} jours restants)`,
        createdAt: now
      };
      setCrmTasks(prev => [alertTask, ...prev]);
    }

    logActivity('NOUVEAU_MANDAT', created.mandateNumber, `Mandat ${created.type} pour le bien ${created.propertyRef}`);
    return created;
  };

  const updateMandate = (mandateId: string, updates: Partial<Mandate>) => {
    const now = new Date().toISOString().split('T')[0];
    setMandates(prev => prev.map(m => m.id === mandateId ? { ...m, ...updates, updatedAt: now } : m));
    logActivity('MODIFICATION_MANDAT', `Mandat ID ${mandateId}`, `Mise à jour du mandat commercial`);
  };

  // Offers & Step-by-Step Negotiation History
  const addFullOffer = (offer: Omit<FullCommercialOffer, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'negotiationHistory'> & { initialOfferComment?: string }): FullCommercialOffer => {
    const now = new Date().toISOString().split('T')[0];
    const initialStep: NegotiationStep = {
      id: `neg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      amount: offer.offeredAmount,
      authorRole: 'acquereur',
      authorName: offer.contactName,
      type: 'offre_initiale',
      comment: offer.initialOfferComment || 'Première offre formalisée par le client'
    };

    const created: FullCommercialOffer = {
      ...offer,
      id: `off-${Date.now()}`,
      ref: `OFF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      negotiationHistory: [initialStep],
      status: offer.status || 'soumise',
      createdAt: now,
      updatedAt: now
    };

    setFullOffers(prev => [created, ...prev]);

    // Create a follow-up task for the agent
    const followUpDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
    const autoTask: CRMTask = {
      id: `task-offer-${Date.now()}`,
      title: `Suivi offre ${created.ref} : ${created.propertyRef}`,
      description: `Présenter l'offre de ${created.offeredAmount.toLocaleString('fr-FR')} DT de ${created.contactName} au propriétaire vendeur et recueillir son accord ou contre-offre.`,
      type: 'appel',
      priority: 'urgente',
      status: 'a_faire',
      assignedAgentId: created.agentId,
      assignedAgentName: created.agentName,
      dueDate: followUpDate,
      dueTime: '11:00',
      contactId: created.contactId,
      contactName: created.contactName,
      propertyId: created.propertyId,
      propertyRef: created.propertyRef,
      isAutoGenerated: true,
      autoTriggerReason: 'Nouvelle offre d\'achat enregistrée',
      createdAt: now
    };
    setCrmTasks(prev => [autoTask, ...prev]);

    logActivity('NOUVELLE_OFFRE_ACHAT', created.ref, `Offre de ${created.offeredAmount.toLocaleString('fr-FR')} DT sur ${created.propertyRef}`);
    return created;
  };

  const addNegotiationStep = (offerId: string, step: { amount: number; authorRole: 'acquereur' | 'proprietaire' | 'agence'; authorName: string; type: NegotiationStep['type']; comment: string }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newStep: NegotiationStep = {
      id: `neg-${Date.now()}`,
      date: now,
      amount: step.amount,
      authorRole: step.authorRole,
      authorName: step.authorName,
      type: step.type,
      comment: step.comment
    };

    setFullOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        let newStatus = o.status;
        if (step.type === 'accord') newStatus = 'acceptee';
        else if (step.type === 'refus') newStatus = 'refusee';
        else newStatus = 'en_cours';

        return {
          ...o,
          offeredAmount: step.amount,
          status: newStatus,
          negotiationHistory: [...o.negotiationHistory, newStep],
          updatedAt: now.split(' ')[0]
        };
      }
      return o;
    }));

    // If agreement reached, place property under option!
    if (step.type === 'accord') {
      const targetOffer = fullOffers.find(o => o.id === offerId);
      if (targetOffer) {
        changePropertyStatus(targetOffer.propertyId, 'sous_option', `Offre acceptée à ${step.amount.toLocaleString('fr-FR')} DT (${step.comment})`);
      }
    }

    logActivity('ETAPE_NEGOCIATION', `Offre ID ${offerId}`, `${step.type.toUpperCase()} : ${step.amount.toLocaleString('fr-FR')} DT par ${step.authorName}`);
  };

  const updateFullOfferStatus = (offerId: string, status: FullCommercialOffer['status']) => {
    const now = new Date().toISOString().split('T')[0];
    setFullOffers(prev => prev.map(o => o.id === offerId ? { ...o, status, updatedAt: now } : o));

    const targetOffer = fullOffers.find(o => o.id === offerId);
    if (targetOffer && status === 'acceptee') {
      changePropertyStatus(targetOffer.propertyId, 'sous_option', `Offre ${targetOffer.ref} acceptée`);
    } else if (targetOffer && (status === 'refusee' || status === 'retiree') && targetOffer.status === 'acceptee') {
      changePropertyStatus(targetOffer.propertyId, 'disponible', `Annulation de l'option - Offre ${targetOffer.ref} ${status}`);
    }

    logActivity('STATUT_OFFRE_ACHAT', `Offre ID ${offerId}`, `Nouveau statut: ${status}`);
  };

  // Sales Transactions (Closing Dossiers)
  const createSalesTransaction = (transaction: Omit<SalesTransaction, 'id' | 'ref' | 'createdAt' | 'updatedAt'>): SalesTransaction => {
    const now = new Date().toISOString().split('T')[0];
    const created: SalesTransaction = {
      ...transaction,
      id: `trx-${Date.now()}`,
      ref: `TRX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: now,
      updatedAt: now
    };
    setSalesTransactions(prev => [created, ...prev]);

    // Place property under option
    changePropertyStatus(created.propertyId, 'sous_option', `Dossier de compromis ${created.ref} initié`);

    logActivity('NOUVELLE_TRANSACTION', created.ref, `Dossier de vente ouvert pour ${created.propertyRef} (${created.finalPrice.toLocaleString('fr-FR')} DT)`);
    return created;
  };

  const updateSalesTransaction = (transactionId: string, updates: Partial<SalesTransaction>) => {
    const now = new Date().toISOString().split('T')[0];
    setSalesTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, ...updates, updatedAt: now } : t));
    logActivity('MODIFICATION_TRANSACTION', `Transaction ID ${transactionId}`, `Mise à jour du dossier de vente`);
  };

  const finalizeSalesTransaction = (transactionId: string) => {
    const target = salesTransactions.find(t => t.id === transactionId);
    if (!target) return;
    const now = new Date().toISOString().split('T')[0];

    setSalesTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      status: 'cloturee',
      commissionPaid: true,
      actualDeedDate: now,
      updatedAt: now
    } : t));

    // Mark property as sold!
    changePropertyStatus(target.propertyId, 'vendu', `Acte authentique signé chez ${target.notaryName}. Transaction ${target.ref} clôturée.`);

    logActivity('CLOTURE_TRANSACTION', target.ref, `Vente conclue définitivement chez le Notaire pour ${target.propertyRef}`);
  };

  // Calendar & Scheduling Conflicts
  const checkAgentConflict = (agentId: string, date: string, timeSlot: string): { hasConflict: boolean; reason?: string } => {
    // Check overlapping visits
    const conflictingVisit = visits.find(v => 
      v.agentId === agentId && 
      v.date === date && 
      v.status !== 'annulee' && 
      v.timeSlot === timeSlot
    );

    if (conflictingVisit) {
      return {
        hasConflict: true,
        reason: `L'agent a déjà une visite planifiée à ${timeSlot} (${conflictingVisit.propertyRef} - Client: ${conflictingVisit.clientName}).`
      };
    }

    // Check agent unavailabilities
    const conflictingUnavail = agentUnavailabilities.find(u => {
      if (u.agentId !== agentId || u.date !== date) return false;
      return timeSlot >= u.startTime && timeSlot < u.endTime;
    });

    if (conflictingUnavail) {
      return {
        hasConflict: true,
        reason: `L'agent est indisponible de ${conflictingUnavail.startTime} à ${conflictingUnavail.endTime} : "${conflictingUnavail.reason}".`
      };
    }

    return { hasConflict: false };
  };

  const addAgentUnavailability = (unavail: Omit<AgentUnavailability, 'id'>) => {
    const created: AgentUnavailability = {
      ...unavail,
      id: `unav-${Date.now()}`
    };
    setAgentUnavailabilities(prev => [created, ...prev]);
    logActivity('INDISPONIBILITE_AGENT', `Agent ID ${unavail.agentId}`, `${unavail.date} (${unavail.startTime}-${unavail.endTime}) : ${unavail.reason}`);
  };

  const removeAgentUnavailability = (id: string) => {
    setAgentUnavailabilities(prev => prev.filter(u => u.id !== id));
  };

  // Automatic Matching Engine
  const matchContactWithProperties = (contact: UnifiedContact) => {
    const criteria = contact.searchCriteria;
    if (!criteria) return [];

    const matches = properties
      .filter(p => p.status === 'disponible' || p.status === 'publie')
      .map(p => {
        let score = 0;
        const reasons: string[] = [];

        if (p.transactionType === criteria.transactionType) {
          score += 25;
          reasons.push(`Type de transaction (${p.transactionType === 'sale' ? 'Vente' : 'Location'})`);
        }

        if (criteria.propertyTypes.length === 0 || criteria.propertyTypes.includes(p.type)) {
          score += 25;
          reasons.push(`Type de bien ciblé (${p.type})`);
        }

        if (criteria.budgetMax > 0) {
          if (p.price >= criteria.budgetMin && p.price <= criteria.budgetMax) {
            score += 25;
            reasons.push(`Budget parfaitement aligné (${p.price.toLocaleString('fr-FR')} DT)`);
          } else if (p.price <= criteria.budgetMax * 1.15) {
            score += 15;
            reasons.push(`Prix dans une marge négociable (+15% max)`);
          }
        }

        if (criteria.targetDistricts.length === 0 || criteria.targetDistricts.some(d => p.district.toLowerCase().includes(d.toLowerCase()) || p.city.toLowerCase().includes(d.toLowerCase()))) {
          score += 15;
          reasons.push(`Quartier de recherche (${p.district})`);
        }

        if (criteria.minBedrooms && p.bedrooms >= criteria.minBedrooms) {
          score += 10;
          reasons.push(`Chambres suffisantes (${p.bedrooms} ch.)`);
        }

        return {
          property: p,
          score: Math.min(100, score),
          matchReasons: reasons
        };
      })
      .filter(m => m.score >= 40)
      .sort((a, b) => b.score - a.score);

    return matches;
  };

  const matchPropertyWithContacts = (property: Property) => {
    const matches = unifiedContacts
      .filter(c => c.roles.includes('acquereur') || c.roles.includes('investisseur') || c.roles.includes('prospect'))
      .map(contact => {
        const criteria = contact.searchCriteria;
        if (!criteria) {
          return { contact, score: 0, matchReasons: [] };
        }
        let score = 0;
        const reasons: string[] = [];

        if (property.transactionType === criteria.transactionType) {
          score += 25;
          reasons.push(`Type de transaction (${property.transactionType === 'sale' ? 'Vente' : 'Location'})`);
        }

        if (criteria.propertyTypes.length === 0 || criteria.propertyTypes.includes(property.type)) {
          score += 25;
          reasons.push(`Recherche active de ${property.type}`);
        }

        if (criteria.budgetMax > 0) {
          if (property.price >= criteria.budgetMin && property.price <= criteria.budgetMax) {
            score += 25;
            reasons.push(`Budget compatible (${property.price.toLocaleString('fr-FR')} DT)`);
          } else if (property.price <= criteria.budgetMax * 1.15) {
            score += 15;
            reasons.push(`Proche du budget maximum`);
          }
        }

        if (criteria.targetDistricts.length === 0 || criteria.targetDistricts.some(d => property.district.toLowerCase().includes(d.toLowerCase()) || property.city.toLowerCase().includes(d.toLowerCase()))) {
          score += 15;
          reasons.push(`Secteur souhaité (${property.district})`);
        }

        if (criteria.minBedrooms && property.bedrooms >= criteria.minBedrooms) {
          score += 10;
          reasons.push(`Nombre de pièces adéquat`);
        }

        return {
          contact,
          score: Math.min(100, score),
          matchReasons: reasons
        };
      })
      .filter(m => m.score >= 40)
      .sort((a, b) => b.score - a.score);

    return matches;
  };

  // Agency Settings
  const updateAgencySettings = (settings: Partial<AgencySettings>) => {
    setAgencySettings(prev => ({ ...prev, ...settings }));
    logActivity('PARAMETRES_AGENCE', 'Configuration générale', 'Mise à jour des coordonnées et taux de change');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Export full JSON backup
  const exportBackup = () => {
    const data = {
      exportDate: new Date().toISOString(),
      agency: agencySettings,
      properties,
      propertyHistory,
      unifiedContacts,
      crmInteractions,
      crmTasks,
      mandates,
      fullOffers,
      salesTransactions,
      agentUnavailabilities,
      leads,
      visits,
      owners,
      agents,
      offers,
      activityLogs
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `albayen_immobilier_crm_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const resetToDefaultData = () => {
    setProperties(INITIAL_PROPERTIES);
    setPropertyHistory(INITIAL_PROPERTY_HISTORY);
    setUnifiedContacts(INITIAL_UNIFIED_CONTACTS);
    setCrmInteractions(INITIAL_CRM_INTERACTIONS);
    setCrmTasks(INITIAL_CRM_TASKS);
    setMandates(INITIAL_MANDATES);
    setFullOffers(INITIAL_FULL_OFFERS);
    setSalesTransactions(INITIAL_SALES_TRANSACTIONS);
    setAgentUnavailabilities(INITIAL_AGENT_UNAVAILABILITIES);
    setLeads(INITIAL_LEADS);
    setVisits(INITIAL_VISITS);
    setOwners(INITIAL_OWNERS);
    setAgents(INITIAL_AGENTS);
    setOffers(INITIAL_OFFERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setAgencySettings(INITIAL_AGENCY_SETTINGS);
    localStorage.clear();
    logActivity('RESTAURATION_DEFAUT', 'Base de données', 'Réinitialisation complète des données métier et CRM');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        properties,
        favorites,
        toggleFavorite,
        isFavorite,
        leads,
        visits,
        owners,
        agents,
        offers,
        notifications,
        activityLogs,
        agencySettings,
        updateAgencySettings,
        unifiedContacts,
        crmInteractions,
        crmTasks,
        mandates,
        fullOffers,
        salesTransactions,
        propertyHistory,
        agentUnavailabilities,
        activeView,
        setActiveView,
        selectedProperty,
        setSelectedProperty,
        addProperty,
        updateProperty,
        deleteProperty,
        changePropertyStatus,
        changePropertyPrice,
        detectDuplicateProperties,
        submitVisitRequest,
        updateVisitStatus,
        submitInfoRequest,
        addLead,
        updateLeadStatus,
        addLeadNote,
        addLeadInteraction,
        addUnifiedContact,
        updateUnifiedContact,
        deleteUnifiedContact,
        detectDuplicateContacts,
        mergeContacts,
        addCRMInteraction,
        addCRMTask,
        updateCRMTaskStatus,
        deleteCRMTask,
        addMandate,
        updateMandate,
        addFullOffer,
        addNegotiationStep,
        updateFullOfferStatus,
        createSalesTransaction,
        updateSalesTransaction,
        finalizeSalesTransaction,
        checkAgentConflict,
        addAgentUnavailability,
        removeAgentUnavailability,
        matchContactWithProperties,
        matchPropertyWithContacts,
        submitCommercialOffer,
        updateOfferStatus,
        addOwner,
        updateOwner,
        deleteOwner,
        toggleOwnerStatus,
        addAgent,
        updateAgent,
        deleteAgent,
        toggleAgentStatus,
        markNotificationRead,
        logActivity,
        exportBackup,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
