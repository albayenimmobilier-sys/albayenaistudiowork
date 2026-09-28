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
  UserRole
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
  INITIAL_AGENCY_SETTINGS 
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
  
  activeView: 'public' | 'property-detail' | 'client-portal' | 'agent-portal' | 'admin-portal';
  setActiveView: (view: 'public' | 'property-detail' | 'client-portal' | 'agent-portal' | 'admin-portal') => void;
  selectedProperty: Property | null;
  setSelectedProperty: (p: Property | null) => void;
  
  // Actions
  addProperty: (p: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'favoritesCount'>) => void;
  updateProperty: (id: string, p: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
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
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          status,
          feedbackRating: feedback?.rating ?? v.feedbackRating,
          feedbackComment: feedback?.comment ?? v.feedbackComment,
          agentNotes: feedback?.agentNotes ?? v.agentNotes
        };
      }
      return v;
    }));
    logActivity('STATUT_VISITE', `Visite ID ${visitId}`, `Statut passé à "${status}"`);
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
    downloadAnchor.setAttribute('download', `albayen_immobilier_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const resetToDefaultData = () => {
    setProperties(INITIAL_PROPERTIES);
    setLeads(INITIAL_LEADS);
    setVisits(INITIAL_VISITS);
    setOwners(INITIAL_OWNERS);
    setAgents(INITIAL_AGENTS);
    setOffers(INITIAL_OFFERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setAgencySettings(INITIAL_AGENCY_SETTINGS);
    localStorage.clear();
    logActivity('RESTAURATION_DEFAUT', 'Base de données', 'Réinitialisation des données de démonstration certifiées');
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
        activeView,
        setActiveView,
        selectedProperty,
        setSelectedProperty,
        addProperty,
        updateProperty,
        deleteProperty,
        submitVisitRequest,
        updateVisitStatus,
        submitInfoRequest,
        addLead,
        updateLeadStatus,
        addLeadNote,
        addLeadInteraction,
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
