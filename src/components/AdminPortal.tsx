import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Calendar, 
  UserCheck, 
  DollarSign, 
  ShieldAlert, 
  Settings, 
  Download, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Star, 
  Check, 
  X, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Lock,
  UserPlus,
  Power,
  Search,
  AlertTriangle,
  BadgeCheck,
  Phone,
  Mail,
  UserX,
  Sparkles,
  Percent,
  CheckSquare,
  Layers,
  History,
  Printer,
  Clock,
  Share2,
  Upload,
  BarChart3,
  KeyRound,
  Terminal,
  Stamp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Property, Lead, Visit, Owner, Agent, CommercialOffer, ActivityLog } from '../types';
import { ContactsManager } from './crm/ContactsManager';
import { TasksManager } from './crm/TasksManager';
import { MandatesManager } from './crm/MandatesManager';
import { AgentCalendarView } from './crm/AgentCalendarView';
import { CommercialKanbanPipeline } from './crm/CommercialKanbanPipeline';
import { OffersAndNegotiations } from './crm/OffersAndNegotiations';
import { SalesTransactionsManager } from './crm/SalesTransactionsManager';
import { PropertyLifecycleModal } from './crm/PropertyLifecycleModal';
import { PrintableVisitVoucher } from './crm/PrintableVisitVoucher';
import { SyndicationManager } from './crm/SyndicationManager';
import { DataImportExportManager } from './crm/DataImportExportManager';
import { AdvancedStatsDashboard } from './crm/AdvancedStatsDashboard';
import { PermissionsMatrixManager } from './crm/PermissionsMatrixManager';
import { ApiExplorerModal } from './crm/ApiExplorerModal';
import { WatermarkStudio } from './crm/WatermarkStudio';
import { PrintableMandateContract } from './crm/PrintableMandateContract';
import { PrintablePurchaseOffer } from './crm/PrintablePurchaseOffer';

interface AdminPortalProps {
  onSelectProperty: (property: Property) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onSelectProperty }) => {
  const { 
    currentUser, 
    properties, 
    leads, 
    visits, 
    owners, 
    agents, 
    offers, 
    activityLogs, 
    agencySettings, 
    updateAgencySettings, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    addOwner, 
    updateOwner,
    deleteOwner,
    toggleOwnerStatus,
    addAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    updateOfferStatus, 
    exportBackup, 
    resetToDefaultData, 
    formatPrice,
    unifiedContacts,
    mandates,
    crmTasks,
    fullOffers,
    salesTransactions
  } = useApp();

  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'properties' | 'contacts' | 'pipeline' | 'mandates' | 'calendar' | 'tasks' | 'commercial' | 'closing' | 'visits' | 'owners' | 'agents' | 'syndication' | 'import_export' | 'stats_bi' | 'permissions' | 'api_explorer' | 'watermark' | 'audit' | 'settings'
  >('dashboard');

  // Modals for Property Lifecycle, Printable Visit Voucher, Mandates & Offers
  const [activeLifecycleProperty, setActiveLifecycleProperty] = useState<Property | null>(null);
  const [activeVoucherVisit, setActiveVoucherVisit] = useState<Visit | null>(null);
  const [activePrintableMandate, setActivePrintableMandate] = useState<any | null>(null);
  const [activePrintableOffer, setActivePrintableOffer] = useState<any | null>(null);

  // Search & Filter in Admin Properties
  const [propSearch, setPropSearch] = useState('');
  const [propTypeFilter, setPropTypeFilter] = useState('all');

  // Add / Edit Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropId, setEditingPropId] = useState<string | null>(null);

  // Property Form State
  const [formRef, setFormRef] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<Property['type']>('appartement');
  const [formTransaction, setFormTransaction] = useState<Property['transactionType']>('sale');
  const [formPrice, setFormPrice] = useState<number>(450000);
  const [formSurface, setFormSurface] = useState<number>(140);
  const [formBedrooms, setFormBedrooms] = useState<number>(3);
  const [formBathrooms, setFormBathrooms] = useState<number>(2);
  const [formDistrict, setFormDistrict] = useState<string>('Sahloul');
  const [formCity, setFormCity] = useState<string>('Sousse');
  const [formCondition, setFormCondition] = useState<Property['condition']>('excellent');
  const [formStatus, setFormStatus] = useState<Property['status']>('disponible');
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(false);
  const [formMainImage, setFormMainImage] = useState<string>('/src/assets/images/property_kantaoui_apartment_1790605943306.jpg');

  // Owner Management State
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<string | null>(null);
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('Sousse');
  const [ownerCIN, setOwnerCIN] = useState('');
  const [ownerNotes, setOwnerNotes] = useState('');
  const [ownerStatus, setOwnerStatus] = useState<'actif' | 'inactif'>('actif');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [ownerStatusFilter, setOwnerStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [deletingOwnerId, setDeletingOwnerId] = useState<string | null>(null);

  // Agent Management State
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentSpecialty, setAgentSpecialty] = useState('Villas d\'exception & Port El Kantaoui');
  const [agentZones, setAgentZones] = useState('Port El Kantaoui, Hammam Sousse, Chott Mariem');
  const [agentAvatar, setAgentAvatar] = useState('/src/assets/images/agency_advisor_portrait_1790605967583.jpg');
  const [agentCommissionRate, setAgentCommissionRate] = useState<number>(2.5);
  const [agentLicenseNumber, setAgentLicenseNumber] = useState('');
  const [agentStatus, setAgentStatus] = useState<'actif' | 'inactif'>('actif');
  const [agentSearch, setAgentSearch] = useState('');
  const [agentStatusFilter, setAgentStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);

  // Executive Dashboard Computations
  const totalPortfolioValue = properties.reduce((acc, p) => acc + (p.transactionType === 'sale' ? p.price : 0), 0);
  const publishedCount = properties.filter(p => p.status === 'publie' || p.status === 'disponible').length;
  const underOptionCount = properties.filter(p => p.status === 'sous_option').length;
  const soldCount = properties.filter(p => p.status === 'vendu').length;
  const potentialCommissions = Math.round(totalPortfolioValue * 0.025); // 2.5% agency fee

  const openNewPropertyModal = () => {
    setEditingPropId(null);
    setFormRef(`AL-SO-${Math.floor(100 + Math.random() * 900)}`);
    setFormTitle('');
    setFormDescription('');
    setFormType('appartement');
    setFormTransaction('sale');
    setFormPrice(450000);
    setFormSurface(130);
    setFormBedrooms(2);
    setFormBathrooms(1);
    setFormDistrict('Sahloul');
    setFormCity('Sousse');
    setFormCondition('excellent');
    setFormStatus('disponible');
    setFormIsFeatured(false);
    setFormMainImage('/src/assets/images/property_kantaoui_apartment_1790605943306.jpg');
    setIsPropertyModalOpen(true);
  };

  const openEditPropertyModal = (p: Property) => {
    setEditingPropId(p.id);
    setFormRef(p.ref);
    setFormTitle(p.title);
    setFormDescription(p.description);
    setFormType(p.type);
    setFormTransaction(p.transactionType);
    setFormPrice(p.price);
    setFormSurface(p.surface);
    setFormBedrooms(p.bedrooms);
    setFormBathrooms(p.bathrooms);
    setFormDistrict(p.district);
    setFormCity(p.city);
    setFormCondition(p.condition);
    setFormStatus(p.status);
    setFormIsFeatured(p.isFeatured);
    setFormMainImage(p.mainImage);
    setIsPropertyModalOpen(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    if (editingPropId) {
      updateProperty(editingPropId, {
        title: formTitle,
        description: formDescription,
        type: formType,
        transactionType: formTransaction,
        price: formPrice,
        surface: formSurface,
        bedrooms: formBedrooms,
        bathrooms: formBathrooms,
        district: formDistrict,
        city: formCity,
        condition: formCondition,
        status: formStatus,
        isFeatured: formIsFeatured,
        mainImage: formMainImage
      });
    } else {
      addProperty({
        ref: formRef,
        title: formTitle,
        description: formDescription || 'Annonce rédigée et validée par l\'administration Albayen Immobilier Sousse.',
        type: formType,
        transactionType: formTransaction,
        price: formPrice,
        currency: 'TND',
        surface: formSurface,
        bedrooms: formBedrooms,
        bathrooms: formBathrooms,
        condition: formCondition,
        country: 'Tunisie',
        governorate: 'Sousse',
        city: formCity,
        district: formDistrict,
        address: `${formDistrict}, Sousse`,
        showExactAddress: false,
        latitude: 35.85,
        longitude: 10.60,
        features: ['Climatisation', 'Titre Bleu vérifié'],
        images: [formMainImage],
        mainImage: formMainImage,
        documents: [],
        status: formStatus,
        isFeatured: formIsFeatured,
        isNew: true,
        agentId: 'user-agent-1'
      });
    }

    setIsPropertyModalOpen(false);
  };

  // OWNER MODAL HANDLERS
  const openNewOwnerModal = () => {
    setEditingOwnerId(null);
    setOwnerFirstName('');
    setOwnerLastName('');
    setOwnerPhone('+216 ');
    setOwnerEmail('');
    setOwnerAddress('Sousse');
    setOwnerCIN('');
    setOwnerNotes('');
    setOwnerStatus('actif');
    setIsOwnerModalOpen(true);
  };

  const openEditOwnerModal = (ow: Owner) => {
    setEditingOwnerId(ow.id);
    setOwnerFirstName(ow.firstName);
    setOwnerLastName(ow.lastName);
    setOwnerPhone(ow.phone);
    setOwnerEmail(ow.email);
    setOwnerAddress(ow.address);
    setOwnerCIN(ow.idCardNumber || '');
    setOwnerNotes(ow.notes || '');
    setOwnerStatus(ow.status ?? 'actif');
    setIsOwnerModalOpen(true);
  };

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerFirstName || !ownerPhone) return;

    if (editingOwnerId) {
      updateOwner(editingOwnerId, {
        firstName: ownerFirstName,
        lastName: ownerLastName,
        phone: ownerPhone,
        email: ownerEmail || 'proprietaire@sousse-immo.tn',
        address: ownerAddress,
        idCardNumber: ownerCIN,
        notes: ownerNotes,
        status: ownerStatus
      });
    } else {
      addOwner({
        firstName: ownerFirstName,
        lastName: ownerLastName,
        phone: ownerPhone,
        email: ownerEmail || 'proprietaire@sousse-immo.tn',
        address: ownerAddress,
        idCardNumber: ownerCIN,
        notes: ownerNotes || 'Mandat enregistré depuis le back-office Albayen',
        status: ownerStatus
      });
    }

    setIsOwnerModalOpen(false);
  };

  // AGENT MODAL HANDLERS
  const openNewAgentModal = () => {
    setEditingAgentId(null);
    setAgentName('');
    setAgentEmail('');
    setAgentPhone('+216 ');
    setAgentSpecialty('Appartements Haut Standing & Penthouses');
    setAgentZones('Sahloul, Khezama, Corniche');
    setAgentAvatar('/src/assets/images/agency_advisor_portrait_1790605967583.jpg');
    setAgentCommissionRate(2.5);
    setAgentLicenseNumber(`TN-SO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setAgentStatus('actif');
    setIsAgentModalOpen(true);
  };

  const openEditAgentModal = (ag: Agent) => {
    setEditingAgentId(ag.id);
    setAgentName(ag.name);
    setAgentEmail(ag.email);
    setAgentPhone(ag.phone);
    setAgentSpecialty(ag.specialty);
    setAgentZones(ag.zones.join(', '));
    setAgentAvatar(ag.avatar);
    setAgentCommissionRate(ag.commissionRate ?? 2.5);
    setAgentLicenseNumber(ag.licenseNumber || `TN-SO-2024-001`);
    setAgentStatus(ag.status ?? 'actif');
    setIsAgentModalOpen(true);
  };

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !agentPhone) return;

    const zonesArray = agentZones.split(',').map(z => z.trim()).filter(Boolean);

    if (editingAgentId) {
      updateAgent(editingAgentId, {
        name: agentName,
        email: agentEmail,
        phone: agentPhone,
        specialty: agentSpecialty,
        zones: zonesArray,
        avatar: agentAvatar,
        commissionRate: agentCommissionRate,
        licenseNumber: agentLicenseNumber,
        status: agentStatus
      });
    } else {
      addAgent({
        name: agentName,
        email: agentEmail,
        phone: agentPhone,
        specialty: agentSpecialty,
        zones: zonesArray,
        avatar: agentAvatar,
        commissionRate: agentCommissionRate,
        licenseNumber: agentLicenseNumber,
        status: agentStatus
      });
    }

    setIsAgentModalOpen(false);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = `${p.ref} ${p.title} ${p.district}`.toLowerCase().includes(propSearch.toLowerCase());
    const matchesType = propTypeFilter === 'all' || p.type === propTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredAgents = agents.filter(ag => {
    const matchesSearch = `${ag.name} ${ag.email} ${ag.phone} ${ag.specialty} ${ag.zones.join(' ')}`.toLowerCase().includes(agentSearch.toLowerCase());
    const matchesStatus = agentStatusFilter === 'all' || (ag.status ?? 'actif') === agentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOwners = owners.filter(ow => {
    const matchesSearch = `${ow.firstName} ${ow.lastName} ${ow.phone} ${ow.email} ${ow.address} ${ow.idCardNumber || ''}`.toLowerCase().includes(ownerSearch.toLowerCase());
    const matchesStatus = ownerStatusFilter === 'all' || (ow.status ?? 'actif') === ownerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-full overflow-x-hidden">
      
      {/* Back-office Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 mb-8 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              ERP & Back-Office Central · Albayen Sousse
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            Administration Générale de l'Agence
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-light mt-1">
            Connecté sous : <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </p>

          {currentUser.role === 'superadmin' && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Droits Super Administrateur Actifs : Gestion des comptes agents, activation/désactivation, propriétaires, logs d'audit et sauvegarde ERP</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportBackup}
            className="px-3.5 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Télécharger une sauvegarde complète JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Sauvegarde JSON</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Voulez-vous réinitialiser les données aux valeurs par défaut certifiées de démonstration ?')) {
                resetToDefaultData();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            title="Réinitialiser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser Démo</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-stone-200 mb-8 text-xs sm:text-sm font-semibold no-scrollbar">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'dashboard' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('properties')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'properties' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Biens ({properties.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('contacts')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'contacts' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Contacts Unifiés ({unifiedContacts.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('pipeline')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'pipeline' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pipeline Kanban ({leads.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('mandates')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'mandates' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mandats ({mandates.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('calendar')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'calendar' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda & Conflits</span>
        </button>

        <button
          onClick={() => setCurrentTab('tasks')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'tasks' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tâches ({crmTasks.filter(t => t.status !== 'terminee').length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('commercial')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'commercial' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Offres & Négos ({fullOffers.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('closing')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'closing' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Closing / Compromis ({salesTransactions.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('visits')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'visits' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Visites ({visits.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('syndication')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'syndication' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Diffusion Portails</span>
        </button>

        <button
          onClick={() => setCurrentTab('import_export')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'import_export' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Import/Export (10 étapes)</span>
        </button>

        <button
          onClick={() => setCurrentTab('stats_bi')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'stats_bi' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>BI & Statistiques</span>
        </button>

        <button
          onClick={() => setCurrentTab('permissions')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'permissions' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Matrice RBAC</span>
        </button>

        <button
          onClick={() => setCurrentTab('api_explorer')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'api_explorer' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>API RESTful</span>
        </button>

        <button
          onClick={() => setCurrentTab('watermark')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'watermark' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Stamp className="w-4 h-4" />
          <span>Watermark Studio</span>
        </button>

        <button
          onClick={() => setCurrentTab('owners')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'owners' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Propriétaires ({owners.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('agents')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'agents' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Agents ({agents.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('audit')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'audit' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Journal d'Audit ({activityLogs.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'settings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres</span>
        </button>
      </div>

      {/* VIEW 1: EXECUTIVE DASHBOARD */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Top KPI Cards (Single elevation, tabular figures) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Valeur du Portefeuille</span>
              <span className="text-2xl font-bold font-display text-stone-900 tabular-nums block mt-1">
                {totalPortfolioValue.toLocaleString('fr-FR')} DT
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">8 biens exclusifs en vente</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Biens Publiés & Actifs</span>
              <span className="text-2xl font-bold font-display text-emerald-700 tabular-nums block mt-1">
                {publishedCount}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">{underOptionCount} sous option d'achat</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Prospects Qualifiés</span>
              <span className="text-2xl font-bold font-display text-amber-700 tabular-nums block mt-1">
                {leads.filter(l => l.status === 'qualifie' || l.status === 'visite_programmee').length}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">Sur {leads.length} leads enregistrés</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Commissions Estimées</span>
              <span className="text-2xl font-bold font-display text-stone-900 tabular-nums block mt-1">
                ~{potentialCommissions.toLocaleString('fr-FR')} DT
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">Base moyenne honoraires 2.5%</span>
            </div>
          </div>

          {/* Activity & Quick Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Leads */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Derniers Prospects Inscrits
                </h3>
                <button onClick={() => setCurrentTab('contacts')} className="text-xs font-semibold text-amber-800 hover:underline">
                  Voir tout CRM →
                </button>
              </div>

              <div className="space-y-3">
                {leads.slice(0, 4).map(ld => (
                  <div key={ld.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                    <div>
                      <span className="font-bold text-stone-900 block">{ld.firstName} {ld.lastName}</span>
                      <span className="text-stone-500">{ld.phone} · {ld.needType.toUpperCase()}</span>
                    </div>
                    <span className="font-semibold text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded-sm">
                      {ld.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Visits */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Prochaines Visites Planifiées
                </h3>
                <button onClick={() => setCurrentTab('visits')} className="text-xs font-semibold text-amber-800 hover:underline">
                  Voir planning →
                </button>
              </div>

              <div className="space-y-3">
                {visits.slice(0, 4).map(vs => (
                  <div key={vs.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                    <div>
                      <span className="font-bold text-stone-900 block">{vs.propertyTitle}</span>
                      <span className="text-stone-500">{vs.clientName} · {vs.date} à {vs.timeSlot}</span>
                    </div>
                    <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-sm">
                      {vs.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: PROPERTIES MANAGEMENT */}
      {currentTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-stone-900">
                Gestion Complète du Parc Immobilier ({properties.length} annonces)
              </h2>
              <p className="text-xs text-stone-500">
                Création, publication, modification des prix et archivage
              </p>
            </div>

            <button
              onClick={openNewPropertyModal}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Créer une Nouvelle Annonce</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
            <input
              type="text"
              placeholder="Rechercher par référence, titre, quartier..."
              value={propSearch}
              onChange={(e) => setPropSearch(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <select
              value={propTypeFilter}
              onChange={(e) => setPropTypeFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">Tous les types de biens</option>
              <option value="appartement">Appartements</option>
              <option value="villa">Villas</option>
              <option value="terrain">Terrains</option>
              <option value="maison">Maisons</option>
              <option value="bureau">Bureaux</option>
            </select>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Réf & Bien</th>
                    <th className="p-3.5">Zone Sousse</th>
                    <th className="p-3.5">Type / Trans.</th>
                    <th className="p-3.5">Prix</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProperties.map(prop => (
                    <tr key={prop.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={prop.mainImage} alt="" className="w-12 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-stone-900 block">{prop.ref}</span>
                            <span className="text-stone-500 truncate max-w-xs block font-normal">{prop.title}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium text-stone-700">
                        {prop.district}, {prop.city}
                      </td>

                      <td className="p-3.5 capitalize font-medium text-stone-700">
                        {prop.type} ({prop.transactionType})
                      </td>

                      <td className="p-3.5 font-bold text-stone-900 tabular-nums">
                        {formatPrice(prop.price)}
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-sm text-[11px] font-semibold ${
                          prop.status === 'disponible' || prop.status === 'publie'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}>
                          {prop.status}
                        </span>
                        {prop.isFeatured && (
                          <span className="ml-1 text-[10px] font-bold text-amber-700">★ Une</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setActiveLifecycleProperty(prop)}
                          className="p-1.5 text-amber-800 hover:text-amber-950 rounded-lg hover:bg-amber-100 transition-colors"
                          title="Cycle de vie & Historique commercial"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                          title="Voir fiche publique"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditPropertyModal(prop)}
                          className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-50"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Confirmez-vous la suppression du bien ${prop.ref} ?`)) {
                              deleteProperty(prop.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: UNIFIED CONTACTS (CRM) */}
      {currentTab === 'contacts' && (
        <ContactsManager onSelectProperty={onSelectProperty} />
      )}

      {/* VIEW: COMMERCIAL KANBAN PIPELINE */}
      {currentTab === 'pipeline' && (
        <CommercialKanbanPipeline />
      )}

      {/* VIEW: MANDATS IMMOBILIERS & ALERTES */}
      {currentTab === 'mandates' && (
        <MandatesManager onSelectProperty={onSelectProperty} />
      )}

      {/* VIEW: CALENDRIER DES AGENTS & CONFLITS */}
      {currentTab === 'calendar' && (
        <AgentCalendarView />
      )}

      {/* VIEW: TÂCHES & RELANCES AUTOMATIQUES */}
      {currentTab === 'tasks' && (
        <TasksManager />
      )}

      {/* VIEW: CLOSING / TRANSACTIONS / COMPROMIS */}
      {currentTab === 'closing' && (
        <SalesTransactionsManager />
      )}

      {/* VIEW 4: VISITS */}
      {currentTab === 'visits' && (
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold text-stone-900">
            Gestion Globale des Visites ({visits.length})
          </h2>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Bien</th>
                    <th className="p-3.5">Visiteur</th>
                    <th className="p-3.5">Date & Créneau</th>
                    <th className="p-3.5">Agent</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Bon de Visite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {visits.map(v => (
                    <tr key={v.id} className="hover:bg-stone-50/80">
                      <td className="p-3.5">
                        <span className="font-bold text-stone-900 block">{v.propertyRef}</span>
                        <span className="text-stone-500 truncate max-w-xs block">{v.propertyTitle}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-stone-900 block">{v.clientName}</span>
                        <span className="text-stone-500">{v.clientPhone}</span>
                      </td>
                      <td className="p-3.5 font-medium text-stone-800">
                        {v.date} à {v.timeSlot}
                      </td>
                      <td className="p-3.5 text-stone-700">
                        {agents.find(a => a.id === v.agentId)?.name || 'Karim Ben Salah'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-sm text-[11px] font-semibold bg-stone-100 text-stone-800">
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setActiveVoucherVisit(v)}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Générer / Imprimer le Bon de visite certifié"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-700" />
                          <span>Bon de visite</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DIFFUSION & PORTAILS EXTERNES (Section 2) */}
      {currentTab === 'syndication' && (
        <SyndicationManager onSelectProperty={onSelectProperty} />
      )}

      {/* VIEW: IMPORT & EXPORT DES DONNÉES EN 10 ÉTAPES (Section 3 & 4) */}
      {currentTab === 'import_export' && (
        <DataImportExportManager />
      )}

      {/* VIEW: BI & STATISTIQUES AVANCÉES (Section 24) */}
      {currentTab === 'stats_bi' && (
        <AdvancedStatsDashboard />
      )}

      {/* VIEW: MATRICE DES PERMISSIONS & RBAC (Section 22) */}
      {currentTab === 'permissions' && (
        <PermissionsMatrixManager />
      )}

      {/* VIEW: API RESTFUL EXPLORER & DOCS (Section 23) */}
      {currentTab === 'api_explorer' && (
        <div className="space-y-4">
          <ApiExplorerModal />
        </div>
      )}

      {/* VIEW: WATERMARK STUDIO (Section 13) */}
      {currentTab === 'watermark' && (
        <div className="space-y-4">
          <WatermarkStudio property={properties[0]} />
        </div>
      )}

      {/* VIEW 5: OWNERS */}
      {currentTab === 'owners' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-stone-900">
                  Fiches Propriétaires & Bailleurs ({owners.length})
                </h2>
                {currentUser.role === 'superadmin' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Contrôle Super Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Gestion des mandats, coordonnées, statut d'activation et dossiers juridiques
              </p>
            </div>
            
            <button
              onClick={openNewOwnerModal}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Nouveau Propriétaire</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Total Fiches</span>
              <span className="text-xl font-bold font-display text-stone-900 tabular-nums">{owners.length}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Propriétaires Actifs</span>
              <span className="text-xl font-bold font-display text-emerald-800 tabular-nums">
                {owners.filter(o => (o.status ?? 'actif') === 'actif').length}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Désactivés</span>
              <span className="text-xl font-bold font-display text-stone-600 tabular-nums">
                {owners.filter(o => o.status === 'inactif').length}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-amber-800 uppercase block">Biens sous Mandat</span>
              <span className="text-xl font-bold font-display text-amber-900 tabular-nums">
                {owners.reduce((acc, o) => acc + o.ownedPropertyIds.length, 0)}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, CIN, adresse..."
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <select
              value={ownerStatusFilter}
              onChange={(e) => setOwnerStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actifs uniquement</option>
              <option value="inactif">Désactivés uniquement</option>
            </select>
          </div>

          {/* Owners Cards */}
          {filteredOwners.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-stone-200 text-stone-500 text-xs">
              Aucun propriétaire ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOwners.map(ow => {
                const isActif = (ow.status ?? 'actif') === 'actif';

                return (
                  <div 
                    key={ow.id} 
                    className={`bg-white p-5 rounded-2xl border transition-shadow shadow-xs flex flex-col justify-between ${
                      isActif ? 'border-stone-200 hover:shadow-md' : 'border-stone-200 bg-stone-50/70 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs ${
                            isActif ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {ow.firstName.charAt(0)}{ow.lastName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-stone-900 leading-tight">
                              {ow.firstName} {ow.lastName}
                            </h3>
                            {ow.idCardNumber && (
                              <span className="text-[11px] text-stone-400 block font-mono">
                                CIN: {ow.idCardNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isActif 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActif ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                          {isActif ? 'Actif' : 'Désactivé'}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1.5 text-xs text-stone-600 mb-3 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-amber-700" />
                          <a href={`tel:${ow.phone}`} className="font-semibold text-stone-900 hover:underline">{ow.phone}</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-amber-700" />
                          <a href={`mailto:${ow.email}`} className="text-stone-600 hover:underline truncate">{ow.email}</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-amber-700" />
                          <span className="truncate">{ow.address}</span>
                        </div>
                      </div>

                      {/* Owned properties */}
                      <div className="mb-3">
                        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                          Biens Mandatés ({ow.ownedPropertyIds.length})
                        </span>
                        {ow.ownedPropertyIds.length === 0 ? (
                          <span className="text-xs text-stone-400 italic">Aucun bien rattaché pour le moment</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {ow.ownedPropertyIds.map(propId => {
                              const prop = properties.find(p => p.id === propId);
                              return (
                                <button
                                  key={propId}
                                  type="button"
                                  onClick={() => prop && onSelectProperty(prop)}
                                  className="text-[10px] font-semibold bg-stone-100 text-stone-800 hover:bg-amber-100 hover:text-amber-900 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{prop ? prop.ref : propId}</span>
                                  <ArrowUpRight className="w-2.5 h-2.5" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {ow.notes && (
                        <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100 italic line-clamp-2">
                          "{ow.notes}"
                        </p>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Titre vérifié</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditOwnerModal(ow)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Modifier les informations"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleOwnerStatus(ow.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActif 
                              ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-900' 
                              : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900'
                          }`}
                          title={isActif ? 'Désactiver le compte' : 'Réactiver le compte'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingOwnerId(ow.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer la fiche propriétaire"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 6: AGENTS TEAM */}
      {currentTab === 'agents' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-stone-900">
                  Équipe Commerciale & Négociateurs Albayen ({agents.length})
                </h2>
                {currentUser.role === 'superadmin' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Contrôle Super Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Gestion des accès des agents, commissions, attribution des secteurs et statut actif/inactif
              </p>
            </div>
            
            <button
              onClick={openNewAgentModal}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Ajouter un Conseiller</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Total Négociateurs</span>
              <span className="text-xl font-bold font-display text-stone-900 tabular-nums">{agents.length}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Conseillers Actifs</span>
              <span className="text-xl font-bold font-display text-emerald-800 tabular-nums">
                {agents.filter(a => (a.status ?? 'actif') === 'actif').length}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Conseillers Inactifs</span>
              <span className="text-xl font-bold font-display text-stone-600 tabular-nums">
                {agents.filter(a => a.status === 'inactif').length}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-amber-800 uppercase block">Mandats Actifs</span>
              <span className="text-xl font-bold font-display text-amber-900 tabular-nums">
                {agents.reduce((acc, a) => acc + a.activePropertiesCount, 0)}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, email, spécialité, secteur..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <select
              value={agentStatusFilter}
              onChange={(e) => setAgentStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actifs uniquement</option>
              <option value="inactif">Désactivés uniquement</option>
            </select>
          </div>

          {/* Agent Cards */}
          {filteredAgents.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-stone-200 text-stone-500 text-xs">
              Aucun agent négociateur ne correspond aux critères.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredAgents.map(ag => {
                const isActif = (ag.status ?? 'actif') === 'actif';

                return (
                  <div 
                    key={ag.id} 
                    className={`bg-white p-5 rounded-2xl border transition-shadow shadow-xs flex flex-col justify-between ${
                      isActif ? 'border-stone-200 hover:shadow-md' : 'border-stone-200 bg-stone-50/70 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Agent Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={ag.avatar} 
                            alt={ag.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" 
                          />
                          <div>
                            <h3 className="text-sm font-bold text-stone-900">{ag.name}</h3>
                            <span className="text-xs text-amber-800 font-semibold block">{ag.specialty}</span>
                            {ag.licenseNumber && (
                              <span className="text-[10px] text-stone-400 block font-mono">
                                Licence : {ag.licenseNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isActif 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActif ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                          {isActif ? 'Actif' : 'Inactif'}
                        </span>
                      </div>

                      {/* Contact & Commission */}
                      <div className="text-xs text-stone-600 space-y-1 mb-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <p className="flex items-center justify-between">
                          <span>Tél : <a href={`tel:${ag.phone}`} className="font-semibold text-stone-900 hover:underline">{ag.phone}</a></span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {ag.commissionRate ?? 2.5}% comm.
                          </span>
                        </p>
                        <p className="truncate">Email : <a href={`mailto:${ag.email}`} className="hover:underline">{ag.email}</a></p>
                        <p className="text-stone-700 text-[11px]">
                          <strong>Secteurs :</strong> {ag.zones.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div>
                      {/* Performance KPIs */}
                      <div className="pt-3 border-t border-stone-100 grid grid-cols-4 gap-1 text-center text-xs">
                        <div>
                          <span className="text-stone-400 block text-[10px]">Mandats</span>
                          <strong className="text-stone-900 tabular-nums">{ag.activePropertiesCount}</strong>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">Visites</span>
                          <strong className="text-stone-900 tabular-nums">{ag.completedVisitsCount}</strong>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">Ventes</span>
                          <strong className="text-stone-900 tabular-nums">{ag.salesCount}</strong>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">Note</span>
                          <strong className="text-amber-800 tabular-nums flex items-center justify-center gap-0.5">
                            <span>{ag.rating}</span>
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          </strong>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditAgentModal(ag)}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-stone-500" />
                          <span>Modifier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAgentStatus(ag.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                            isActif
                              ? 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                              : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{isActif ? 'Désactiver' : 'Activer'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingAgentId(ag.id)}
                          className="p-1 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer le négociateur"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 7: COMMERCIAL OFFERS & NEGOTIATIONS */}
      {currentTab === 'commercial' && (
        <OffersAndNegotiations onSelectProperty={onSelectProperty} />
      )}

      {/* VIEW 8: AUDIT TRAIL LOGS */}
      {currentTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-stone-900">
                Journal d'Activité & Traçabilité Sécurité (Audit Logs)
              </h2>
              <p className="text-xs text-stone-500">Conformité RGPD et conservation des actions administratives</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold font-sans">
                  <tr>
                    <th className="p-3.5">Horodatage</th>
                    <th className="p-3.5">Utilisateur</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Cible</th>
                    <th className="p-3.5">Détails</th>
                    <th className="p-3.5">Adresse IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {activityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-stone-50/80">
                      <td className="p-3.5 text-stone-500 text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="p-3.5 font-bold font-sans">
                        {log.userName} ({log.userRole})
                      </td>
                      <td className="p-3.5 text-amber-800 font-semibold">
                        {log.action}
                      </td>
                      <td className="p-3.5 font-medium">
                        {log.targetObject}
                      </td>
                      <td className="p-3.5 text-stone-600 font-sans text-xs">
                        {log.details}
                      </td>
                      <td className="p-3.5 text-stone-400 text-[11px]">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 9: AGENCY SETTINGS */}
      {currentTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-display font-bold text-stone-900">
              Paramètres Généraux de l'Agence Albayen Sousse
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Ces informations alimentent automatiquement le site public et les documents
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Nom commercial</label>
              <input
                type="text"
                value={agencySettings.agencyName}
                onChange={(e) => updateAgencySettings({ agencyName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Email officiel</label>
              <input
                type="email"
                value={agencySettings.email}
                onChange={(e) => updateAgencySettings({ email: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Téléphone agence</label>
              <input
                type="text"
                value={agencySettings.phone}
                onChange={(e) => updateAgencySettings({ phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">WhatsApp Direct</label>
              <input
                type="text"
                value={agencySettings.whatsapp}
                onChange={(e) => updateAgencySettings({ whatsapp: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Taux de Change EUR (1 EUR = X DT)</label>
              <input
                type="number"
                step={0.01}
                value={agencySettings.exchangeRateEUR}
                onChange={(e) => updateAgencySettings({ exchangeRateEUR: Number(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Taux de Change USD (1 USD = X DT)</label>
              <input
                type="number"
                step={0.01}
                value={agencySettings.exchangeRateUSD}
                onChange={(e) => updateAgencySettings({ exchangeRateUSD: Number(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Adresse physique à Sousse</label>
            <input
              type="text"
              value={agencySettings.address}
              onChange={(e) => updateAgencySettings({ address: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900"
            />
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
            ✓ Toutes les modifications de configuration sont automatiquement enregistrées et consignées dans le journal d'audit.
          </div>
        </div>
      )}

      {/* CREATE / EDIT PROPERTY MODAL */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-bold text-stone-900">
                {editingPropId ? `Modifier le Bien (${formRef})` : 'Ajouter un Nouveau Bien Immobilier'}
              </h3>
              <button onClick={() => setIsPropertyModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Référence Unique *</label>
                  <input
                    type="text"
                    required
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Titre de l'Annonce *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Villa contemporaine avec piscine"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Type de bien *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="terrain">Terrain</option>
                    <option value="maison">Maison</option>
                    <option value="bureau">Bureau</option>
                    <option value="local_commercial">Local commercial</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Transaction *</label>
                  <select
                    value={formTransaction}
                    onChange={(e) => setFormTransaction(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="sale">Vente</option>
                    <option value="rent">Location</option>
                    <option value="seasonal">Location vacances</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Prix (DT) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Surface (m²) *</label>
                  <input
                    type="number"
                    required
                    value={formSurface}
                    onChange={(e) => setFormSurface(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Chambres</label>
                  <input
                    type="number"
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Salles de bain</label>
                  <input
                    type="number"
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Quartier Sousse *</label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="Port El Kantaoui">Port El Kantaoui</option>
                    <option value="Sahloul">Sahloul</option>
                    <option value="Hammam Sousse">Hammam Sousse</option>
                    <option value="Corniche Boujaafar">Corniche Boujaafar</option>
                    <option value="Khezama">Khezama</option>
                    <option value="Chott Mariem">Chott Mariem</option>
                    <option value="Sousse Centre">Sousse Centre</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Statut *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="publie">Publié</option>
                    <option value="sous_option">Sous option</option>
                    <option value="vendu">Vendu</option>
                    <option value="loue">Loué</option>
                    <option value="brouillon">Brouillon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Description Détaillée</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="featuredCheck" className="text-xs font-semibold text-stone-800">
                  Mettre ce bien « À la une » (prioritaire sur la page d'accueil)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm"
                >
                  {editingPropId ? 'Mettre à jour' : 'Enregistrer et Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT OWNER MODAL */}
      {isOwnerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900">
                  {editingOwnerId ? 'Modifier la Fiche Propriétaire' : 'Nouveau Propriétaire / Mandant'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsOwnerModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOwner} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={ownerFirstName}
                    onChange={(e) => setOwnerFirstName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={ownerLastName}
                    onChange={(e) => setOwnerLastName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 98 ..."
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">N° CIN / Pièce d'Identité</label>
                  <input
                    type="text"
                    placeholder="Ex: 04899214"
                    value={ownerCIN}
                    onChange={(e) => setOwnerCIN(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Statut du compte</label>
                  <select
                    value={ownerStatus}
                    onChange={(e) => setOwnerStatus(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none"
                  >
                    <option value="actif">Actif (autorisé)</option>
                    <option value="inactif">Désactivé (suspendu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Adresse à Sousse / Sahel</label>
                <input
                  type="text"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Notes internes & Mandats</label>
                <textarea
                  rows={3}
                  placeholder="Notes sur les titres bleus, type de mandat (exclusif / simple)..."
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 resize-none focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsOwnerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm cursor-pointer"
                >
                  {editingOwnerId ? 'Mettre à jour' : 'Créer la fiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT AGENT MODAL */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900">
                  {editingAgentId ? 'Modifier le Conseiller Immobilier' : 'Ajouter un Conseiller Commercial'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsAgentModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgent} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Karim Ben Salah"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Email Professionnel *</label>
                  <input
                    type="email"
                    required
                    placeholder="k.nom@albayen-sousse.com"
                    value={agentEmail}
                    onChange={(e) => setAgentEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Téléphone Professionnel *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 98 440 ..."
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Spécialité *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Villas d'exception & Terrains"
                    value={agentSpecialty}
                    onChange={(e) => setAgentSpecialty(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Statut Négociateur</label>
                  <select
                    value={agentStatus}
                    onChange={(e) => setAgentStatus(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none"
                  >
                    <option value="actif">Actif (opérant sur le terrain)</option>
                    <option value="inactif">Désactivé (accès suspendu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Zones & Secteurs d'affectation (séparés par virgules) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Port El Kantaoui, Hammam Sousse, Chott Mariem"
                  value={agentZones}
                  onChange={(e) => setAgentZones(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Taux de Commission (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={agentCommissionRate}
                    onChange={(e) => setAgentCommissionRate(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">N° de Carte Pro / Licence</label>
                  <input
                    type="text"
                    placeholder="TN-SO-2024-XXX"
                    value={agentLicenseNumber}
                    onChange={(e) => setAgentLicenseNumber(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Photo / Avatar du conseiller</label>
                <div className="flex items-center gap-3">
                  <img src={agentAvatar} alt="Aperçu" className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                  <input
                    type="text"
                    value={agentAvatar}
                    onChange={(e) => setAgentAvatar(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                    placeholder="URL de l'image"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm cursor-pointer"
                >
                  {editingAgentId ? 'Enregistrer les modifications' : 'Créer le conseiller'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE OWNER MODAL */}
      {deletingOwnerId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 border border-stone-200 text-stone-900">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-sm">Supprimer ce Propriétaire ?</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer cette fiche propriétaire ? Cette action sera consignée dans le journal d'audit de sécurité.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingOwnerId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOwner(deletingOwnerId);
                  setDeletingOwnerId(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirmer suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE AGENT MODAL */}
      {deletingAgentId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 border border-stone-200 text-stone-900">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-sm">Supprimer ce Négociateur ?</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Êtes-vous certain de vouloir supprimer le compte de cet agent négociateur ? L'ensemble de ses mandats restera rattaché à l'agence.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingAgentId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAgent(deletingAgentId);
                  setDeletingAgentId(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirmer suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS: Property Lifecycle & Commercial History */}
      {activeLifecycleProperty && (
        <PropertyLifecycleModal
          property={activeLifecycleProperty}
          onClose={() => setActiveLifecycleProperty(null)}
        />
      )}

      {/* MODALS: Printable Official Visit Voucher (Bon de Visite) */}
      {activeVoucherVisit && (
        <PrintableVisitVoucher
          visit={activeVoucherVisit}
          onClose={() => setActiveVoucherVisit(null)}
        />
      )}

      {/* MODALS: Printable Official Mandate Contract */}
      {activePrintableMandate && (
        <PrintableMandateContract
          mandate={activePrintableMandate}
          onClose={() => setActivePrintableMandate(null)}
        />
      )}

      {/* MODALS: Printable Official Purchase Offer */}
      {activePrintableOffer && (
        <PrintablePurchaseOffer
          offer={activePrintableOffer}
          onClose={() => setActivePrintableOffer(null)}
        />
      )}

    </div>
  );
};
