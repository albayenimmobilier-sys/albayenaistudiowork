export type UserRole = 'visitor' | 'client' | 'agent' | 'admin' | 'superadmin';

export type ClientType = 'buyer' | 'tenant' | 'owner' | 'investor';

export type Language = 'fr' | 'ar' | 'en';

export type Currency = 'TND' | 'EUR' | 'USD';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  clientType?: ClientType;
  avatar?: string;
  agentSpecialty?: string;
  assignedZones?: string[];
  agencyRoleTitle?: string;
}

export type PropertyType = 
  | 'appartement' 
  | 'villa' 
  | 'maison' 
  | 'terrain' 
  | 'bureau' 
  | 'local_commercial' 
  | 'immeuble' 
  | 'entrepot' 
  | 'ferme' 
  | 'hotel'
  | 'autre';

export type TransactionType = 'sale' | 'rent' | 'seasonal';

export type PropertyCondition = 'neuf' | 'excellent' | 'bon_etat' | 'a_renover';

export type PropertyStatus = 
  | 'brouillon' 
  | 'publie' 
  | 'disponible' 
  | 'sous_option' 
  | 'vendu' 
  | 'loue' 
  | 'archive';

export interface PropertyDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  isPrivate: boolean; // Not accessible to public if true (e.g. Titre Bleu, taxe fonciere)
}

export interface NearbyAmenity {
  name: string;
  type: 'beach' | 'school' | 'hospital' | 'shopping' | 'transport' | 'marina' | 'restaurant';
  distance: string; // e.g. "300m", "5 min"
}

export interface Property {
  id: string;
  ref: string; // Unique reference e.g. AL-SO-101
  title: string;
  titleAr?: string;
  titleEn?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number; // in TND
  currency: string;
  surface: number; // in m²
  landSurface?: number; // in m² for villas/terrains
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  condition: PropertyCondition;
  
  // Location
  country: string;
  governorate: string; // Sousse
  city: string; // Sousse, Hammam Sousse, Port El Kantaoui, etc.
  district: string; // Sahloul, Khezama, Bouhsina, Corniche, Chott Mariem, Hergla...
  address: string;
  showExactAddress: boolean;
  latitude: number;
  longitude: number;
  nearbyAmenities?: NearbyAmenity[];

  // Features / Equipments
  features: string[]; // piscine, vue mer, ascenseur, parking, climatisation, suite parentale, cuisine equipee, jardin...
  
  // Media
  images: string[];
  mainImage: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  documents: PropertyDocument[];
  
  // Status & Management
  status: PropertyStatus;
  isFeatured: boolean;
  isNew: boolean;
  viewsCount: number;
  favoritesCount: number;
  ownerId?: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;

  // Prompt Complémentaire 2 Extensions
  priceHistory?: PriceHistoryEntry[];
  syndicationChannels?: PropertySyndicationChannel[];
  specificCharacteristics?: SpecificCharacteristics;
  categorizedPhotos?: CategorizedPhoto[];
  floorPlans?: PropertyDocument[];
  
  // Data Privacy Levels (Interne & Confidentiel)
  internalNotes?: string;
  confidentialNotes?: string;
  minNetOwnerPrice?: number; // Prix plancher net vendeur
  cadastralBlueTitleNumber?: string; // Titre Foncier n°
  ownerCinNumber?: string; // CIN / Registre de commerce
}

export type LeadStatus = 
  | 'nouveau' 
  | 'contacte' 
  | 'qualifie' 
  | 'visite_programmee' 
  | 'en_negociation' 
  | 'converti' 
  | 'perdu';

export type LeadSource = 
  | 'site_web' 
  | 'facebook' 
  | 'telephone' 
  | 'recommandation' 
  | 'passage_agence' 
  | 'whatsapp';

export interface LeadInteraction {
  id: string;
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'visit';
  summary: string;
  date: string;
  author: string;
}

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Lead {
  id: string;
  ref: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  needType: 'buy' | 'rent' | 'invest' | 'sell';
  propertyType: PropertyType;
  budgetMin: number;
  budgetMax: number;
  targetAreas: string[];
  source: LeadSource;
  status: LeadStatus;
  agentId?: string;
  interestedPropertyRef?: string;
  notes: LeadNote[];
  interactions: LeadInteraction[];
  createdAt: string;
  updatedAt: string;
}

export type VisitStatus = 
  | 'demandee' 
  | 'confirmee' 
  | 'reprogrammee' 
  | 'effectuee' 
  | 'annulee';

export interface Visit {
  id: string;
  propertyId: string;
  propertyRef: string;
  propertyTitle: string;
  propertyImage: string;
  propertyPrice: number;
  clientUserId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  agentId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  visitorsCount: number;
  comment?: string;
  status: VisitStatus;
  feedbackRating?: number; // 1 to 5
  feedbackComment?: string;
  agentNotes?: string;
  createdAt: string;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  idCardNumber?: string;
  ownedPropertyIds: string[];
  documentsCount: number;
  notes?: string;
  status?: 'actif' | 'inactif';
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialty: string;
  zones: string[];
  activePropertiesCount: number;
  completedVisitsCount: number;
  salesCount: number;
  rating: number;
  status?: 'actif' | 'inactif';
  commissionRate?: number;
  licenseNumber?: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'visit' | 'lead' | 'property' | 'offer' | 'system';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'countered' | 'rejected';

export interface CommercialOffer {
  id: string;
  ref: string;
  propertyId: string;
  propertyRef: string;
  propertyTitle: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  offeredAmount: number; // in TND
  listedPrice: number; // in TND
  agentId: string;
  commissionRate: number; // e.g. 2% or 5%
  estimatedCommission: number; // in TND
  status: OfferStatus;
  notes: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetObject: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AgencySettings {
  agencyName: string;
  tagline: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  exchangeRateEUR: number; // 1 EUR = ~3.40 TND
  exchangeRateUSD: number; // 1 USD = ~3.10 TND
  aboutDescription: string;
}

// -------------------------------------------------------------
// CRM & BUSINESS MANAGEMENT COMPLEMENTARY TYPES
// -------------------------------------------------------------

export type PropertyHistoryEventType = 
  | 'creation' 
  | 'status_change' 
  | 'price_change' 
  | 'agent_assignment' 
  | 'owner_assignment'
  | 'mandate_change' 
  | 'publication' 
  | 'depublication' 
  | 'option_taken' 
  | 'option_cancelled' 
  | 'sold' 
  | 'rented' 
  | 'archived' 
  | 'reactivated';

export interface PropertyHistoryEvent {
  id: string;
  propertyId: string;
  propertyRef: string;
  eventType: PropertyHistoryEventType;
  oldValue?: string;
  newValue: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  date: string; // YYYY-MM-DD HH:mm
  notes?: string;
}

export type ContactRole = 
  | 'proprietaire' 
  | 'acquereur' 
  | 'locataire' 
  | 'investisseur' 
  | 'prospect' 
  | 'ancien_client';

export type ContactType = 'particulier' | 'professionnel' | 'promoteur' | 'institutionnel';

export type ContactStatus = 'actif' | 'chaud' | 'tiede' | 'froid' | 'inactif' | 'archive';

export interface ContactSearchCriteria {
  transactionType: TransactionType;
  propertyTypes: PropertyType[];
  budgetMin: number;
  budgetMax: number;
  targetDistricts: string[];
  minBedrooms?: number;
  minSurface?: number;
  desiredFeatures?: string[];
}

export interface UnifiedContact {
  id: string;
  ref: string; // CNT-2026-001
  firstName: string;
  lastName: string;
  phone: string;
  secondaryPhones?: string[];
  email: string;
  address?: string;
  city?: string;
  country?: string;
  preferredLanguage: Language;
  type: ContactType;
  roles: ContactRole[];
  source: LeadSource;
  agentId?: string;
  status: ContactStatus;
  notes?: string;
  searchCriteria?: ContactSearchCriteria;
  ownedPropertyIds?: string[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type CRMInteractionType = 
  | 'appel' 
  | 'email' 
  | 'sms' 
  | 'whatsapp' 
  | 'message_interne' 
  | 'rendez_vous' 
  | 'visite' 
  | 'demande_info' 
  | 'offre' 
  | 'note' 
  | 'changement_statut';

export interface CRMInteraction {
  id: string;
  contactId: string;
  contactName: string;
  propertyId?: string;
  propertyRef?: string;
  propertyTitle?: string;
  type: CRMInteractionType;
  date: string; // YYYY-MM-DD HH:mm
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  result?: string;
  nextAction?: string;
  nextActionDate?: string;
}

export type TaskType = 
  | 'appel' 
  | 'relance' 
  | 'email' 
  | 'rendez_vous' 
  | 'visite' 
  | 'administratif' 
  | 'mandat'
  | 'autre';

export type TaskPriority = 'basse' | 'normale' | 'haute' | 'urgente';

export type TaskStatus = 'a_faire' | 'en_cours' | 'terminee' | 'annulee';

export interface CRMTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedAgentId: string;
  assignedAgentName: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  contactId?: string;
  contactName?: string;
  propertyId?: string;
  propertyRef?: string;
  isAutoGenerated?: boolean;
  autoTriggerReason?: string;
  completedAt?: string;
  createdAt: string;
}

export type MandateType = 
  | 'exclusif' 
  | 'non_exclusif' 
  | 'semi_exclusif' 
  | 'gestion_locative';

export type MandateStatus = 
  | 'brouillon' 
  | 'actif' 
  | 'expirant_proche' 
  | 'expire' 
  | 'resilie' 
  | 'termine';

export interface Mandate {
  id: string;
  mandateNumber: string; // MND-2026-042
  propertyId: string;
  propertyRef: string;
  propertyTitle: string;
  ownerId: string;
  ownerName: string;
  agentId: string;
  agentName: string;
  type: MandateType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  askingPrice: number; // in TND
  marketingPrice: number; // in TND
  commissionRate: number; // percentage e.g. 3%
  commissionAmount: number; // in TND
  specialConditions?: string;
  notes?: string;
  documentName?: string;
  documentUrl?: string;
  status: MandateStatus;
  alertDays: number; // Days before expiration to notify (e.g. 30)
  createdAt: string;
  updatedAt: string;
}

export interface NegotiationStep {
  id: string;
  date: string;
  amount: number;
  authorRole: 'acquereur' | 'proprietaire' | 'agence';
  authorName: string;
  type: 'offre_initiale' | 'contre_offre' | 'nouvelle_offre' | 'accord' | 'refus';
  comment: string;
}

export interface FullCommercialOffer {
  id: string;
  ref: string; // OFF-2026-015
  propertyId: string;
  propertyRef: string;
  propertyTitle: string;
  propertyImage?: string;
  listedPrice: number;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  offeredAmount: number;
  agentId: string;
  agentName: string;
  commissionRate: number;
  estimatedCommission: number;
  status: 'brouillon' | 'soumise' | 'en_cours' | 'acceptee' | 'refusee' | 'expiree' | 'retiree';
  suspensiveConditions?: string;
  validityDate: string;
  negotiationHistory: NegotiationStep[];
  notes?: string;
  documentName?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 
  | 'compromis_en_cours' 
  | 'conditions_suspensives' 
  | 'pret_bancaire_valide' 
  | 'titre_bleu_conforme' 
  | 'acte_authentique_signe' 
  | 'cloturee' 
  | 'annulee';

export interface SalesTransaction {
  id: string;
  ref: string; // TRX-2026-009
  offerId?: string;
  propertyId: string;
  propertyRef: string;
  propertyTitle: string;
  propertyImage?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  agentId: string;
  agentName: string;
  finalPrice: number; // in TND
  depositAmount: number; // Séquestre / acompte in TND
  notaryName: string;
  notaryPhone: string;
  compromiseDate: string; // YYYY-MM-DD
  deedTargetDate: string; // YYYY-MM-DD
  actualDeedDate?: string;
  bankFinancingRequired: boolean;
  titleDeedStatus: 'titre_bleu_individuel' | 'titre_arabi' | 'en_cours_immatriculation';
  agencyCommission: number; // in TND
  commissionPaid: boolean;
  status: TransactionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentUnavailability {
  id: string;
  agentId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reason: string;
}

export interface DuplicateMatchResult<T> {
  target: T;
  matchedWith: T;
  matchScore: number;
  matchReasons: string[];
}

// -------------------------------------------------------------
// PROMPT COMPLÉMENTAIRE 2 ADVANCED TYPES & ARCHITECTURE
// -------------------------------------------------------------

// Specific Characteristics by Property Type
export interface ApartmentSpecs {
  floorNumber: number;
  totalBuildingFloors: number;
  hasElevator: boolean;
  hasBalcony: boolean;
  hasTerrace: boolean;
  terraceSurface?: number;
  undergroundParkingSpaces: number;
  residenceName: string;
  isGatedResidence: boolean;
  syndicateExists: boolean;
  monthlySyndicChargesTND?: number;
}

export interface VillaSpecs {
  gardenSurface: number;
  poolType: 'sans_piscine' | 'debordement' | 'skimmer' | 'chauffee' | 'couverte';
  garageCapacity: number;
  levelsCount: number; // RDC, R+1, R+2
  totalLandSurface: number;
  viewType: 'vue_mer' | 'vue_degagee' | 'vue_jardin' | 'urbaine';
  outbuildings: string[]; // e.g. "logement_gardien", "studio_invite", "cuisine_exterieure"
}

export interface LandSpecs {
  zoning: 'r_plus_2' | 'r_plus_3' | 'r_plus_4' | 'r_plus_high' | 'villa_isolee' | 'commercial' | 'touristique' | 'agricole' | 'industriel';
  buildabilityRatioCOS?: number; // Coefficient d'Occupation du Sol (ex: 0.5)
  buildabilityRatioCES?: number; // Coefficient d'Emprise au Sol (ex: 1.8)
  maxBuildingHeightMeters?: number;
  frontageLinearMeters: number;
  utilitiesStegElectricity: boolean;
  utilitiesSonedeWater: boolean;
  utilitiesOnasSanitation: boolean;
  utilitiesFiberOptic: boolean;
  roadAccessWidthMeters: number;
  titleDeedType: 'titre_bleu_individuel' | 'titre_arabi' | 'titre_indivis' | 'requisition_en_cours';
}

export interface CommercialSpecs {
  linearShowcaseMeters: number;
  facadeLengthMeters: number;
  storageRoomSurface: number;
  hasSmokeExtraction: boolean; // Extraction de fumée aux normes
  authorizedActivities: string[]; // "restauration", "pret_a_porter", "services", "clinique", "tous_commerces"
  disabledAccessPMR: boolean;
  has380vHighPower: boolean;
}

export interface OfficeSpecs {
  openSpaceSurface: number;
  individualOfficesCount: number;
  meetingRoomsCount: number;
  receptionArea: boolean;
  fiberOpticWiring: boolean;
  networkRJ45Points: number;
  designatedParkingSpaces: number;
  airConditioningCentral: boolean;
}

export interface WarehouseSpecs {
  ceilingHeightMeters: number;
  semiTrailerAccess: boolean;
  loadingDocksCount: number;
  storageSurface: number;
  officeSurface: number;
  floorLoadCapacityTonPerM2: number;
  fireSafetySystemRIA: boolean;
}

export type SpecificCharacteristics = 
  | { type: 'appartement'; specs: ApartmentSpecs }
  | { type: 'villa' | 'maison'; specs: VillaSpecs }
  | { type: 'terrain'; specs: LandSpecs }
  | { type: 'local_commercial'; specs: CommercialSpecs }
  | { type: 'bureau'; specs: OfficeSpecs }
  | { type: 'entrepot'; specs: WarehouseSpecs }
  | { type: 'autre'; specs: Record<string, any> };

// Price History Tracking
export interface PriceHistoryEntry {
  id: string;
  propertyId: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number; // e.g. -4.5
  date: string; // YYYY-MM-DD HH:mm
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  reason: string;
}

// External Channel Syndication
export type SyndicationChannelId = 
  | 'albayen_web' 
  | 'mubawab' 
  | 'tayara' 
  | 'facebook_instagram' 
  | 'international_portals';

export type SyndicationChannelStatus = 
  | 'non_publie' 
  | 'en_attente' 
  | 'publie' 
  | 'erreur' 
  | 'desactive';

export interface PropertySyndicationChannel {
  channelId: SyndicationChannelId;
  channelName: string;
  enabled: boolean;
  status: SyndicationChannelStatus;
  lastSyncDate?: string;
  lastSyncError?: string;
  externalPropertyId?: string;
  lastUpdatedDate?: string;
  autoSync: boolean;
}

// Media & Categorized Photos
export type PhotoCategory = 
  | 'exterieur' 
  | 'salon' 
  | 'cuisine' 
  | 'chambre' 
  | 'salle_de_bains' 
  | 'terrasse' 
  | 'jardin' 
  | 'piscine' 
  | 'garage' 
  | 'vue' 
  | 'plan' 
  | 'autre';

export interface CategorizedPhoto {
  id: string;
  url: string;
  category: PhotoCategory;
  caption?: string;
  captionAr?: string;
  captionEn?: string;
  order: number;
  isMain: boolean;
  isPublic: boolean;
}

// Watermark Configuration
export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  position: 'bottom-right' | 'bottom-left' | 'center' | 'diagonal';
  fontSize: 'small' | 'medium' | 'large';
  opacity: number; // 0.1 to 1.0
  includeAgencyLogo: boolean;
}

// Granular Role & Permissions Matrix (RBAC)
export interface ModulePermissions {
  viewPublic: boolean;
  viewInternal: boolean;
  viewConfidential: boolean; // Titre foncier, CIN, prix plancher net vendeur
  create: boolean;
  edit: boolean;
  delete: boolean;
  exportData: boolean;
}

export interface RolePermissionsMatrix {
  properties: ModulePermissions;
  contacts: ModulePermissions & { viewAllContacts: boolean; viewOwnerPhone: boolean };
  mandates: { view: boolean; create: boolean; editConditions: boolean; close: boolean; export: boolean };
  offers: { view: boolean; createOffer: boolean; counterOffer: boolean; acceptDeed: boolean };
  closing: { view: boolean; manageNotary: boolean; viewCommissions: boolean };
  financialStats: { viewGlobalRevenue: boolean; viewAgentCommissions: boolean; viewAgencyMargin: boolean };
  auditLogs: { viewLogs: boolean; purgeLogs: boolean };
  apiAndSyndication: { manageChannels: boolean; generateApiKeys: boolean; triggerBatchSync: boolean };
}

// Data Import & Export Types
export type ImportEntityType = 'properties' | 'contacts' | 'mandates';

export interface FieldMapping {
  fileColumn: string;
  targetField: string;
  required: boolean;
  detectedType: 'string' | 'number' | 'date' | 'boolean' | 'email' | 'phone';
}

export interface ImportPreviewRow {
  rowNumber: number;
  data: Record<string, any>;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  isPotentialDuplicate: boolean;
  duplicateMatchedRef?: string;
}

export interface ImportJobReport {
  id: string;
  entityType: ImportEntityType;
  fileName: string;
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  createdCount: number;
  updatedCount: number;
  duplicatesHandledCount: number;
  executedAt: string;
  executedBy: string;
  status: 'success' | 'partial' | 'failed';
  errorLog: { row: number; error: string }[];
}

export interface ExportFilterOptions {
  entityType: ImportEntityType;
  format: 'csv' | 'json' | 'excel';
  statusFilter?: string;
  districtFilter?: string;
  dateFrom?: string;
  dateTo?: string;
  includeConfidentialData: boolean;
}

// Currency Exchange Rates
export interface CurrencyExchangeRates {
  TND: number; // Base currency = 1
  EUR: number; // e.g. 0.294 (1 EUR = 3.40 TND)
  USD: number; // e.g. 0.322 (1 USD = 3.10 TND)
  GBP: number; // e.g. 0.250 (1 GBP = 4.00 TND)
  CAD: number; // e.g. 0.435 (1 CAD = 2.30 TND)
  lastUpdated: string;
}
