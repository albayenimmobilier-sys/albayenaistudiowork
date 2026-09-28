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
