import { 
  Property, 
  User, 
  Agent, 
  Lead, 
  Visit, 
  Owner, 
  CommercialOffer, 
  ActivityLog, 
  Notification, 
  AgencySettings 
} from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_sousse_luxury_villa_1790605930412.jpg';
export const KANTAOUI_APT_IMAGE = '/src/assets/images/property_kantaoui_apartment_1790605943306.jpg';
export const SAHLOUL_PENTHOUSE_IMAGE = '/src/assets/images/property_sahloul_penthouse_1790605956179.jpg';
export const ADVISOR_PORTRAIT = '/src/assets/images/agency_advisor_portrait_1790605967583.jpg';

export const INITIAL_AGENCY_SETTINGS: AgencySettings = {
  agencyName: 'Albayen Immobilier Sousse',
  tagline: 'Excellence & Confiance Immobilière au Cœur du Sahel',
  phone: '+216 73 224 880',
  mobile: '+216 98 440 220',
  whatsapp: '+21698440220',
  email: 'albayenimmobilier@gmail.com',
  address: 'Boulevard 14 Janvier, Immeuble Le Palmier, 4ème étage',
  city: '4000 Sousse, Tunisie',
  workingHours: 'Lun - Sam : 08h30 - 18h30 (Dimanche sur RDV)',
  exchangeRateEUR: 3.42,
  exchangeRateUSD: 3.12,
  aboutDescription: 'Fondée à Sousse, Albayen Immobilier est le partenaire de référence pour l\'acquisition, la location, la valorisation et la gestion de biens d\'exception en Tunisie. Forte d\'une parfaite maîtrise du droit foncier tunisien et du marché du Sahel, notre équipe vous accompagne avec rigueur, transparence et dévouement.'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-visitor',
    name: 'Visiteur Public',
    email: 'visiteur@gmail.com',
    phone: '',
    role: 'visitor',
  },
  {
    id: 'user-client-1',
    name: 'Anis Gharbi',
    email: 'anis.gharbi@gmail.com',
    phone: '+216 98 710 405',
    role: 'client',
    clientType: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-agent-1',
    name: 'Karim Ben Salah',
    email: 'k.bensalah@albayen-sousse.com',
    phone: '+216 98 440 221',
    role: 'agent',
    avatar: ADVISOR_PORTRAIT,
    agentSpecialty: 'Villas d\'exception & Terrains Prestige',
    assignedZones: ['Port El Kantaoui', 'Hammam Sousse', 'Chott Mariem'],
    agencyRoleTitle: 'Conseiller Commercial Senior'
  },
  {
    id: 'user-admin-1',
    name: 'Sonia Trabelsi',
    email: 's.trabelsi@albayen-sousse.com',
    phone: '+216 73 224 880',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    agencyRoleTitle: 'Directrice des Opérations'
  },
  {
    id: 'user-superadmin-1',
    name: 'Direction Générale Albayen',
    email: 'albayenimmobilier@gmail.com',
    phone: '+216 98 440 220',
    role: 'superadmin',
    avatar: ADVISOR_PORTRAIT,
    agencyRoleTitle: 'Super Administrateur & Fondateur'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'user-agent-1',
    name: 'Karim Ben Salah',
    email: 'k.bensalah@albayen-sousse.com',
    phone: '+216 98 440 221',
    avatar: ADVISOR_PORTRAIT,
    specialty: 'Villas d\'exception & Port El Kantaoui',
    zones: ['Port El Kantaoui', 'Hammam Sousse', 'Chott Mariem'],
    activePropertiesCount: 8,
    completedVisitsCount: 42,
    salesCount: 14,
    rating: 4.9,
    status: 'actif',
    commissionRate: 2.5,
    licenseNumber: 'TN-SO-2021-089',
    createdAt: '2024-03-15'
  },
  {
    id: 'agent-2',
    name: 'Inès Masmoudi',
    email: 'i.masmoudi@albayen-sousse.com',
    phone: '+216 98 440 225',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    specialty: 'Appartements Haut Standing & Penthouses',
    zones: ['Sahloul', 'Bouhsina', 'Khezama'],
    activePropertiesCount: 11,
    completedVisitsCount: 56,
    salesCount: 19,
    rating: 4.8,
    status: 'actif',
    commissionRate: 2.5,
    licenseNumber: 'TN-SO-2022-142',
    createdAt: '2024-07-01'
  },
  {
    id: 'agent-3',
    name: 'Mehdi Chebil',
    email: 'm.chebil@albayen-sousse.com',
    phone: '+216 98 440 229',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Immobilier d\'Entreprise & Terrains Promoteurs',
    zones: ['Sousse Centre', 'Kalaa Kebira', 'Zone Industrielle Akouda'],
    activePropertiesCount: 6,
    completedVisitsCount: 28,
    salesCount: 8,
    rating: 4.7,
    status: 'actif',
    commissionRate: 3.0,
    licenseNumber: 'TN-SO-2023-205',
    createdAt: '2025-01-10'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    ref: 'AL-KT-001',
    title: 'Somptueuse Villa Contemporaine Front de Mer',
    titleAr: 'فيلا فاخرة عصرية مطلة على البحر',
    titleEn: 'Sumptuous Contemporary Seafront Villa',
    description: 'Située dans l\'enclave la plus prestigieuse de Port El Kantaoui, cette villa d\'architecte neuve offre 650 m² habitables sur un terrain paysager de 1 200 m². Finitions de marbre Thala impérial, piscine à débordement chauffée, salon cathédrale avec vue mer panoramique, 5 suites royales, domotique intégrale et sous-sol aménagé avec salle de sport et cave.',
    descriptionAr: 'تقع هذه الفيلا الفاخرة في أرقى أحياء القنطاوي سوسة، بمساحة مغطاة 650 م² على أرض 1200 م²، مع مسبح خاص وإطلالة خلابة على البحر الأبيض المتوسط.',
    descriptionEn: 'Located in the most prestigious area of Port El Kantaoui, this 650 sqm architect-designed luxury villa features 5 royal suites, an infinity pool and direct sea views.',
    type: 'villa',
    transactionType: 'sale',
    price: 3200000,
    currency: 'TND',
    surface: 650,
    landSurface: 1200,
    bedrooms: 5,
    bathrooms: 6,
    floor: 0,
    totalFloors: 2,
    yearBuilt: 2024,
    condition: 'neuf',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Port El Kantaoui',
    district: 'Quartier Résidentiel Marina',
    address: 'Avenue de la Marina, Port El Kantaoui',
    showExactAddress: false,
    latitude: 35.8942,
    longitude: 10.5985,
    nearbyAmenities: [
      { name: 'Marina & Port de Plaisance', type: 'marina', distance: '350 m' },
      { name: 'Kantaoui Golf Club (36 trous)', type: 'shopping', distance: '800 m' },
      { name: 'Plage Privée de Kantaoui', type: 'beach', distance: '150 m' },
      { name: 'Clinique Internationale Les Oliviers', type: 'hospital', distance: '3.5 km' }
    ],
    features: [
      'Piscine à débordement',
      'Vue Mer Panoramique',
      'Jardin arboré avec arrosage automatique',
      'Domotique intégrée',
      'Garage fermé 3 voitures',
      'Suites avec dressings sur mesure',
      'Chauffage central au sol',
      'Climatisation réversible gainée',
      'Titre foncier individuel (Titre Bleu)'
    ],
    images: [
      HERO_IMAGE,
      KANTAOUI_APT_IMAGE,
      SAHLOUL_PENTHOUSE_IMAGE
    ],
    mainImage: HERO_IMAGE,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample',
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    documents: [
      { id: 'doc-1', name: 'Titre Foncier (Titre Bleu N° 45892/Sousse)', type: 'PDF', size: '2.4 MB', url: '#', isPrivate: true },
      { id: 'doc-2', name: 'Brochure Commerciale Albayen', type: 'PDF', size: '4.8 MB', url: '#', isPrivate: false },
      { id: 'doc-3', name: 'Plan d\'Architecte et Coupes', type: 'PDF', size: '8.1 MB', url: '#', isPrivate: false }
    ],
    status: 'disponible',
    isFeatured: true,
    isNew: true,
    viewsCount: 1420,
    favoritesCount: 68,
    ownerId: 'owner-1',
    agentId: 'user-agent-1',
    createdAt: '2026-08-15',
    updatedAt: '2026-09-20'
  },
  {
    id: 'prop-2',
    ref: 'AL-KT-002',
    title: 'Appartement S+3 Haut Standing Marina Kantaoui',
    titleAr: 'شقة فاخرة س+3 بإطلالة بحرية بميناء القنطاوي',
    titleEn: 'Luxury 3-Bedroom Apartment at Kantaoui Marina',
    description: 'En première ligne de la marina de Port El Kantaoui, magnifique appartement S+3 de 175 m² rénové avec des matériaux nobles. Salon lumineux s\'ouvrant sur une vaste terrasse avec vue imprenable sur les yachts et la Méditerranée. Cuisine américaine équipée en électroménager allemand, 3 chambres dont une suite parentale avec dressing et jacuzzi.',
    descriptionAr: 'شقة راقية جداً في قلب مارينا القنطاوي بسوسة مع تراس واسع يطل مباشرة على اليخوت والبحر.',
    descriptionEn: 'Prime waterfront 3-bedroom apartment of 175 sqm overlooking Port El Kantaoui marina, complete with designer terrace and luxury amenities.',
    type: 'appartement',
    transactionType: 'sale',
    price: 880000,
    currency: 'TND',
    surface: 175,
    bedrooms: 3,
    bathrooms: 2,
    floor: 2,
    totalFloors: 3,
    yearBuilt: 2022,
    condition: 'excellent',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Port El Kantaoui',
    district: 'Marina Kantaoui',
    address: 'Quai des Navigateurs',
    showExactAddress: true,
    latitude: 35.8925,
    longitude: 10.5992,
    nearbyAmenities: [
      { name: 'Restaurants & Cafés Marina', type: 'restaurant', distance: '50 m' },
      { name: 'Plage Kantaoui', type: 'beach', distance: '200 m' },
      { name: 'Pharmacie & Banques', type: 'shopping', distance: '150 m' }
    ],
    features: [
      'Vue directe sur la Marina',
      'Terrasse aménagée 30 m²',
      'Ascenseur sécurisé avec code',
      'Place de parking en sous-sol titrée',
      'Cuisine entièrement équipée',
      'Climatisation split dans toutes les pièces',
      'Gardiennage 24/7 avec caméras'
    ],
    images: [
      KANTAOUI_APT_IMAGE,
      HERO_IMAGE,
      SAHLOUL_PENTHOUSE_IMAGE
    ],
    mainImage: KANTAOUI_APT_IMAGE,
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    documents: [
      { id: 'doc-4', name: 'Fiche descriptive détaillée', type: 'PDF', size: '1.2 MB', url: '#', isPrivate: false },
      { id: 'doc-5', name: 'Règlement de copropriété', type: 'PDF', size: '3.1 MB', url: '#', isPrivate: true }
    ],
    status: 'disponible',
    isFeatured: true,
    isNew: false,
    viewsCount: 2310,
    favoritesCount: 114,
    ownerId: 'owner-2',
    agentId: 'user-agent-1',
    createdAt: '2026-07-10',
    updatedAt: '2026-09-22'
  },
  {
    id: 'prop-3',
    ref: 'AL-SH-003',
    title: 'Penthouse d\'Exception avec Rooftop Privatif & Plunge Pool',
    titleAr: 'بنتهاوس استثنائي مع روف توب ومسبح خاص في سهلول',
    titleEn: 'Exceptional Penthouse with Private Rooftop & Plunge Pool',
    description: 'Au cœur de Sahloul 4 dans une résidence de standing ultra-sécurisée, ce penthouse de 290 m² habitable plus 140 m² de rooftop privatif offre une vue spectaculaire à 360° sur Sousse. Piscine privée chauffée sur le toit, salon de réception avec baie vitrée 8 mètres, suite parentale de 50 m², finitions sur mesure signées par un cabinet de design tunisois.',
    descriptionAr: 'بنتهاوس فاخر في سهلول 4 مع مسبح خاص فوق السطح وإطلالة بانورامية رائعة على كامل مدينة سوسة.',
    descriptionEn: 'Ultra-exclusive 290 sqm penthouse in Sahloul 4 with a 140 sqm private rooftop terrace and plunge pool.',
    type: 'appartement',
    transactionType: 'sale',
    price: 1150000,
    currency: 'TND',
    surface: 290,
    bedrooms: 4,
    bathrooms: 3,
    floor: 6,
    totalFloors: 6,
    yearBuilt: 2025,
    condition: 'neuf',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Sousse',
    district: 'Sahloul 4',
    address: 'Boulevard Yasser Arafat, Sahloul',
    showExactAddress: false,
    latitude: 35.8365,
    longitude: 10.6012,
    nearbyAmenities: [
      { name: 'Hôpital Universitaire Sahloul', type: 'hospital', distance: '600 m' },
      { name: 'Mall of Sousse (Centre Commercial)', type: 'shopping', distance: '2.5 km' },
      { name: 'Lycée Pilote de Sousse', type: 'school', distance: '1.2 km' }
    ],
    features: [
      'Rooftop privatif 140 m²',
      'Piscine privée sur terrasse',
      'Accès ascenseur direct par clé privée',
      'Double place de parking sous-sol',
      'Cellier privé 15 m²',
      'Cheminée à l\'éthanol contemporaine',
      'Finitions marbre blanc de Carrare'
    ],
    images: [
      SAHLOUL_PENTHOUSE_IMAGE,
      KANTAOUI_APT_IMAGE,
      HERO_IMAGE
    ],
    mainImage: SAHLOUL_PENTHOUSE_IMAGE,
    documents: [
      { id: 'doc-6', name: 'Certificat de Conformité Urbaine', type: 'PDF', size: '1.8 MB', url: '#', isPrivate: true },
      { id: 'doc-7', name: 'Dossier Technique & Plans', type: 'PDF', size: '5.2 MB', url: '#', isPrivate: false }
    ],
    status: 'disponible',
    isFeatured: true,
    isNew: true,
    viewsCount: 3450,
    favoritesCount: 182,
    ownerId: 'owner-1',
    agentId: 'agent-2',
    createdAt: '2026-08-01',
    updatedAt: '2026-09-25'
  },
  {
    id: 'prop-4',
    ref: 'AL-CN-004',
    title: 'Appartement Meublé de Luxe S+2 Corniche Boujaafar',
    titleAr: 'شقة مفروشة راقية س+2 كورنيش بوجعفر سوسة للكراء',
    titleEn: 'Luxury Furnished 2-Bedroom Apartment Boujaafar Corniche',
    description: 'À louer à l\'année ou bail longue durée, superbe appartement S+2 de 125 m² entièrement meublé et décoré avec raffinement sur la célèbre Corniche de Sousse. Vue mer imprenable à 180°, à 2 pas de la plage de sable fin. Salon spacieux, cuisine italienne toute équipée, 2 chambres confortables avec literie hôtelière 5 étoiles.',
    descriptionAr: 'للكراء السنوي شقة س+2 مفروشة بأرقى الأثاث تطل على كورنيش بوجعفر الشهير بسوسة وبحرها الصافي.',
    descriptionEn: 'Luxury furnished 2-bedroom rental apartment of 125 sqm right on Sousse Corniche Boujaafar with panoramic sea view.',
    type: 'appartement',
    transactionType: 'rent',
    price: 2400, // Monthly in TND
    currency: 'TND',
    surface: 125,
    bedrooms: 2,
    bathrooms: 2,
    floor: 4,
    totalFloors: 8,
    yearBuilt: 2021,
    condition: 'excellent',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Sousse',
    district: 'Corniche Boujaafar',
    address: 'Boulevard Habib Bourguiba, Corniche',
    showExactAddress: true,
    latitude: 35.8315,
    longitude: 10.6402,
    nearbyAmenities: [
      { name: 'Plage Boujaafar (en face)', type: 'beach', distance: '30 m' },
      { name: 'Médina Historique de Sousse (UNESCO)', type: 'shopping', distance: '900 m' },
      { name: 'Restaurants de poissons du Port', type: 'restaurant', distance: '500 m' }
    ],
    features: [
      'Entièrement Meublé & Équipé',
      'Vue Mer Panoramique Directe',
      'Balcon terrasse face aux vagues',
      'Fibre optique haut débit',
      'Ascenseur & Concierge permanent',
      'Climatisation chaud/froid'
    ],
    images: [
      KANTAOUI_APT_IMAGE,
      SAHLOUL_PENTHOUSE_IMAGE
    ],
    mainImage: KANTAOUI_APT_IMAGE,
    documents: [],
    status: 'disponible',
    isFeatured: false,
    isNew: true,
    viewsCount: 1890,
    favoritesCount: 76,
    ownerId: 'owner-3',
    agentId: 'agent-2',
    createdAt: '2026-09-01',
    updatedAt: '2026-09-26'
  },
  {
    id: 'prop-5',
    ref: 'AL-HS-005',
    title: 'Maison de Ville avec Jardin Privé Hammam Sousse',
    titleAr: 'منزل أنيق مع حديقة خاصة في حمام سوسة',
    titleEn: 'Townhouse with Private Garden in Hammam Sousse',
    description: 'Charmante maison de ville de 220 m² sur 2 niveaux avec jardin arboré de 180 m² située dans un quartier résidentiel très calme de Hammam Sousse (proche Menchia). Grand séjour traversant, cuisine familiale indépendante ouvrant sur terrasse ombragée, 4 chambres dont 1 au rez-de-chaussée, abri pour 2 véhicules.',
    descriptionAr: 'منزل عائلي راقٍ مع حديقة مشجرة في حي هادئ بحمام سوسة قريب من كافة المرافق.',
    descriptionEn: 'Charming 220 sqm townhouse with 180 sqm mature private garden in a quiet residential street of Hammam Sousse.',
    type: 'maison',
    transactionType: 'sale',
    price: 640000,
    currency: 'TND',
    surface: 220,
    landSurface: 320,
    bedrooms: 4,
    bathrooms: 2,
    floor: 0,
    totalFloors: 2,
    yearBuilt: 2018,
    condition: 'bon_etat',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Hammam Sousse',
    district: 'Menchia / El Kantaoui Sud',
    address: 'Rue des Orangers, Hammam Sousse',
    showExactAddress: false,
    latitude: 35.8590,
    longitude: 10.6020,
    nearbyAmenities: [
      { name: 'Écoles primaires et collèges', type: 'school', distance: '400 m' },
      { name: 'Supermarché Carrefour Market', type: 'shopping', distance: '700 m' },
      { name: 'Plage Menchia', type: 'beach', distance: '1.2 km' }
    ],
    features: [
      'Jardin clos et sécurisé',
      'Puits avec sonde pour arrosage',
      'Abri de voiture fermé',
      'Chauffage central installé',
      'Quartier résidentiel calme'
    ],
    images: [
      HERO_IMAGE,
      SAHLOUL_PENTHOUSE_IMAGE
    ],
    mainImage: HERO_IMAGE,
    documents: [],
    status: 'disponible',
    isFeatured: false,
    isNew: false,
    viewsCount: 940,
    favoritesCount: 38,
    ownerId: 'owner-2',
    agentId: 'user-agent-1',
    createdAt: '2026-08-20',
    updatedAt: '2026-09-18'
  },
  {
    id: 'prop-6',
    ref: 'AL-CM-006',
    title: 'Terrain Constructible 1 450 m² Pieds dans l\'Eau Chott Mariem',
    titleAr: 'أرض سكنية للبناء 1450 م² شاطئية في شط مريم سوسة',
    titleEn: '1,450 sqm Prime Beachfront Building Plot in Chott Mariem',
    description: 'Rare opportunité d\'investissement foncier à Chott Mariem, à 7 minutes de Port El Kantaoui. Terrain pieds dans l\'eau de 1 450 m² avec façade de 32 mètres sur une plage de sable doré vierge. Vocation résidentielle R+2 (autorisation villa de luxe ou petite résidence haut standing). Titre foncier individuel net et sans hypothèque.',
    descriptionAr: 'فرصة نادرة للاستثمار العقاري: قطعة أرض للبناء مباشرة على البحر بشط مريم بمساحة 1450 م² مع شهادة ملكية فردية (رسم عقاري أزرق).',
    descriptionEn: 'Rare direct beachfront parcel of 1,450 sqm in Chott Mariem with a 32m pristine sand beach frontage and clean individual freehold title.',
    type: 'terrain',
    transactionType: 'sale',
    price: 1880000,
    currency: 'TND',
    surface: 1450,
    landSurface: 1450,
    bedrooms: 0,
    bathrooms: 0,
    condition: 'neuf',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Chott Mariem',
    district: 'Plage Chott Mariem',
    address: 'Route Touristique de Chott Mariem',
    showExactAddress: false,
    latitude: 35.9230,
    longitude: 10.5620,
    nearbyAmenities: [
      { name: 'Accès direct plage', type: 'beach', distance: '0 m' },
      { name: 'Port El Kantaoui', type: 'marina', distance: '5 km' },
      { name: 'Aéroport International Enfidha-Hammamet', type: 'transport', distance: '25 min' }
    ],
    features: [
      'Pieds dans l\'eau direct',
      'Titre Foncier Individuel (Titre Bleu)',
      'Viabilisé (Eau, Électricité, Gaz de ville)',
      'Zone constructible R+2',
      'Façade maritime 32 mètres'
    ],
    images: [
      HERO_IMAGE,
      KANTAOUI_APT_IMAGE
    ],
    mainImage: HERO_IMAGE,
    documents: [
      { id: 'doc-8', name: 'Certificat de propriété de la Conservation Foncière', type: 'PDF', size: '1.5 MB', url: '#', isPrivate: true },
      { id: 'doc-9', name: 'Plan de bornage et d\'implantation cadastral', type: 'PDF', size: '2.9 MB', url: '#', isPrivate: true }
    ],
    status: 'disponible',
    isFeatured: true,
    isNew: false,
    viewsCount: 4120,
    favoritesCount: 145,
    ownerId: 'owner-1',
    agentId: 'user-agent-1',
    createdAt: '2026-07-28',
    updatedAt: '2026-09-24'
  },
  {
    id: 'prop-7',
    ref: 'AL-SC-007',
    title: 'Plateau Bureau / Centre Médical 210 m² Sousse Centre',
    titleAr: 'مكتب فاخر 210 م² في قلب مدينة سوسة لعيادة أو مقر شركة',
    titleEn: '210 sqm Commercial Office Floor in Sousse City Center',
    description: 'Idéal pour siège de société, cabinet médical groupé ou étude d\'avocats. Situé sur un axe stratégique de Sousse Ville dans un immeuble de bureaux récent avec ascenseur et concierge. Composé d\'un grand accueil, 6 bureaux lumineux, 2 blocs sanitaires et kitchenette.',
    descriptionAr: 'مكتب تجاري حديث مجهز بمساحة 210 م² في شارع حيوي وسط مدينة سوسة.',
    descriptionEn: 'High visibility 210 sqm professional office suite on a prime avenue in downtown Sousse, perfect for a corporate HQ or medical practice.',
    type: 'bureau',
    transactionType: 'rent',
    price: 3200, // Monthly in TND
    currency: 'TND',
    surface: 210,
    bedrooms: 6,
    bathrooms: 2,
    floor: 3,
    totalFloors: 5,
    yearBuilt: 2023,
    condition: 'excellent',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Sousse',
    district: 'Sousse Centre / Boulevard 14 Janvier',
    address: 'Boulevard 14 Janvier, Sousse',
    showExactAddress: true,
    latitude: 35.8340,
    longitude: 10.6310,
    nearbyAmenities: [
      { name: 'Gare ferroviaire de Sousse', type: 'transport', distance: '600 m' },
      { name: 'Banques & Administrations', type: 'shopping', distance: '100 m' }
    ],
    features: [
      'Câblage réseau informatique RJ45',
      'Climatisation centrale par zone',
      'Accès PMR handicapé conforme',
      'Immeuble gardé 24h/24',
      'Possibilité de division en 2 lots'
    ],
    images: [
      KANTAOUI_APT_IMAGE,
      SAHLOUL_PENTHOUSE_IMAGE
    ],
    mainImage: KANTAOUI_APT_IMAGE,
    documents: [],
    status: 'disponible',
    isFeatured: false,
    isNew: false,
    viewsCount: 1120,
    favoritesCount: 29,
    ownerId: 'owner-3',
    agentId: 'agent-3',
    createdAt: '2026-08-10',
    updatedAt: '2026-09-12'
  },
  {
    id: 'prop-8',
    ref: 'AL-KH-008',
    title: 'Duplex Neuf avec Patio Andalou Khezama Ouest',
    titleAr: 'دوبلكس عصري مع فناء أندلسي في خزامة الغربية سوسة',
    titleEn: 'Contemporary Duplex with Andalusian Patio in Khezama West',
    description: 'Splendide duplex de 195 m² dans une petite copropriété intime de Khezama Ouest. Grand salon avec cheminée décorative ouvrant sur un patio avec fontaine, suite parentale à l\'étage avec terrasse privée, cuisine équipée haut de gamme et garage privé en sous-sol.',
    descriptionAr: 'دوبلكس راقٍ في حي خزامة الغربية مع فناء أندلسي وتشطيبات ممتازة.',
    descriptionEn: 'Stunning 195 sqm duplex in Khezama West with Andalusian fountain patio and private basement garage.',
    type: 'appartement',
    transactionType: 'sale',
    price: 520000,
    currency: 'TND',
    surface: 195,
    bedrooms: 3,
    bathrooms: 2,
    floor: 1,
    totalFloors: 2,
    yearBuilt: 2024,
    condition: 'neuf',
    country: 'Tunisie',
    governorate: 'Sousse',
    city: 'Sousse',
    district: 'Khezama Ouest',
    address: 'Rue de Carthage, Khezama',
    showExactAddress: false,
    latitude: 35.8450,
    longitude: 10.6180,
    nearbyAmenities: [
      { name: 'Commerces et boulangeries de quartier', type: 'shopping', distance: '200 m' },
      { name: 'Clinique Essalem', type: 'hospital', distance: '1.1 km' }
    ],
    features: [
      'Patio privatif avec fontaine',
      'Chauffage central au gaz naturel',
      'Volets roulants électriques',
      'Garage fermé privatif',
      'Suite parentale avec dressing'
    ],
    images: [
      SAHLOUL_PENTHOUSE_IMAGE,
      HERO_IMAGE
    ],
    mainImage: SAHLOUL_PENTHOUSE_IMAGE,
    documents: [],
    status: 'disponible',
    isFeatured: false,
    isNew: true,
    viewsCount: 1650,
    favoritesCount: 54,
    ownerId: 'owner-2',
    agentId: 'agent-2',
    createdAt: '2026-09-05',
    updatedAt: '2026-09-27'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    ref: 'CRM-2026-081',
    firstName: 'Tarek',
    lastName: 'Mansour',
    phone: '+216 98 220 314',
    email: 'tarek.mansour@invest-tn.com',
    needType: 'buy',
    propertyType: 'villa',
    budgetMin: 2500000,
    budgetMax: 3500000,
    targetAreas: ['Port El Kantaoui', 'Chott Mariem'],
    source: 'site_web',
    status: 'visite_programmee',
    agentId: 'user-agent-1',
    interestedPropertyRef: 'AL-KT-001',
    notes: [
      {
        id: 'note-1',
        author: 'Karim Ben Salah',
        text: 'Client sérieux, médecin chirurgien résidant en France (TRE). Recherche villa front de mer avec titre bleu obligatoire pour retraite anticipée.',
        date: '2026-09-24 14:30'
      }
    ],
    interactions: [
      {
        id: 'int-1',
        type: 'call',
        summary: 'Premier contact téléphonique : confirmation des critères et budget disponible comptant.',
        date: '2026-09-24',
        author: 'Karim Ben Salah'
      },
      {
        id: 'int-2',
        type: 'whatsapp',
        summary: 'Envoi du dossier d\'architecte et des photos en haute résolution.',
        date: '2026-09-25',
        author: 'Karim Ben Salah'
      }
    ],
    createdAt: '2026-09-24',
    updatedAt: '2026-09-26'
  },
  {
    id: 'lead-2',
    ref: 'CRM-2026-082',
    firstName: 'Youssef & Salma',
    lastName: 'Boussetta',
    phone: '+216 22 550 991',
    email: 'boussetta.y@gmail.com',
    needType: 'buy',
    propertyType: 'appartement',
    budgetMin: 750000,
    budgetMax: 950000,
    targetAreas: ['Port El Kantaoui', 'Sahloul 4'],
    source: 'passage_agence',
    status: 'en_negociation',
    agentId: 'user-agent-1',
    interestedPropertyRef: 'AL-KT-002',
    notes: [
      {
        id: 'note-2',
        author: 'Karim Ben Salah',
        text: 'Offre faite à 840 000 DT pour l\'appartement Marina Kantaoui (affiché à 880 000 DT). En attente du retour du propriétaire.',
        date: '2026-09-26 11:00'
      }
    ],
    interactions: [
      {
        id: 'int-3',
        type: 'visit',
        summary: 'Visite guidée effectuée. Coup de cœur pour la vue marina.',
        date: '2026-09-25',
        author: 'Karim Ben Salah'
      }
    ],
    createdAt: '2026-09-20',
    updatedAt: '2026-09-27'
  },
  {
    id: 'lead-3',
    ref: 'CRM-2026-083',
    firstName: 'Meriem',
    lastName: 'Karray',
    phone: '+216 55 410 780',
    email: 'm.karray@topnet.tn',
    needType: 'rent',
    propertyType: 'appartement',
    budgetMin: 1800,
    budgetMax: 2600,
    targetAreas: ['Corniche Boujaafar', 'Sousse Centre'],
    source: 'site_web',
    status: 'contacte',
    agentId: 'agent-2',
    interestedPropertyRef: 'AL-CN-004',
    notes: [
      {
        id: 'note-3',
        author: 'Inès Masmoudi',
        text: 'Cadre supérieure mutée à Sousse pour 2 ans. Recherche logement meublé clé en main.',
        date: '2026-09-27 09:15'
      }
    ],
    interactions: [
      {
        id: 'int-4',
        type: 'call',
        summary: 'Appel de qualification. Souhaite visiter ce week-end.',
        date: '2026-09-27',
        author: 'Inès Masmoudi'
      }
    ],
    createdAt: '2026-09-27',
    updatedAt: '2026-09-27'
  },
  {
    id: 'lead-4',
    ref: 'CRM-2026-084',
    firstName: 'Zouhair',
    lastName: 'Chouchane',
    phone: '+216 97 334 112',
    email: 'z.chouchane@groupe-sahel.com',
    needType: 'invest',
    propertyType: 'terrain',
    budgetMin: 1500000,
    budgetMax: 2200000,
    targetAreas: ['Chott Mariem', 'Hergla'],
    source: 'recommandation',
    status: 'qualifie',
    agentId: 'user-agent-1',
    interestedPropertyRef: 'AL-CM-006',
    notes: [
      {
        id: 'note-4',
        author: 'Karim Ben Salah',
        text: 'Investisseur privé souhaitant développer un projet éco-résidentiel haut de gamme les pieds dans l\'eau.',
        date: '2026-09-25 16:00'
      }
    ],
    interactions: [],
    createdAt: '2026-09-25',
    updatedAt: '2026-09-25'
  }
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: 'visit-1',
    propertyId: 'prop-1',
    propertyRef: 'AL-KT-001',
    propertyTitle: 'Somptueuse Villa Contemporaine Front de Mer',
    propertyImage: HERO_IMAGE,
    propertyPrice: 3200000,
    clientUserId: 'user-client-1',
    clientName: 'Dr. Tarek Mansour',
    clientPhone: '+216 98 220 314',
    clientEmail: 'tarek.mansour@invest-tn.com',
    agentId: 'user-agent-1',
    date: '2026-09-30',
    timeSlot: '15:30',
    visitorsCount: 2,
    comment: 'Visite avec son épouse pour valider les dimensions de la suite et le calme du quartier.',
    status: 'confirmee',
    createdAt: '2026-09-24'
  },
  {
    id: 'visit-2',
    propertyId: 'prop-3',
    propertyRef: 'AL-SH-003',
    propertyTitle: 'Penthouse d\'Exception avec Rooftop Privatif Sahloul',
    propertyImage: SAHLOUL_PENTHOUSE_IMAGE,
    propertyPrice: 1150000,
    clientName: 'Wassim Ben Ammar',
    clientPhone: '+216 50 880 771',
    clientEmail: 'wassim.ba@gmail.com',
    agentId: 'agent-2',
    date: '2026-09-29',
    timeSlot: '11:00',
    visitorsCount: 3,
    comment: 'Intéressé par le rooftop et l\'accès sécurisé par ascenseur privé.',
    status: 'demandee',
    createdAt: '2026-09-28'
  },
  {
    id: 'visit-3',
    propertyId: 'prop-2',
    propertyRef: 'AL-KT-002',
    propertyTitle: 'Appartement S+3 Haut Standing Marina Kantaoui',
    propertyImage: KANTAOUI_APT_IMAGE,
    propertyPrice: 880000,
    clientName: 'Youssef Boussetta',
    clientPhone: '+216 22 550 991',
    clientEmail: 'boussetta.y@gmail.com',
    agentId: 'user-agent-1',
    date: '2026-09-25',
    timeSlot: '16:00',
    visitorsCount: 2,
    comment: 'Visite très concluante. Demande d\'offre d\'achat immédiate.',
    status: 'effectuee',
    feedbackRating: 5,
    feedbackComment: 'Appartement encore plus lumineux et impressionnant en vrai. Agent très ponctuel et professionnel.',
    agentNotes: 'Client a soumis une offre à 840K DT le soir même.',
    createdAt: '2026-09-22'
  }
];

export const INITIAL_OWNERS: Owner[] = [
  {
    id: 'owner-1',
    firstName: 'Hédi',
    lastName: 'Ben Romdhane',
    phone: '+216 98 333 111',
    email: 'hedi.romdhane@promotionsahel.tn',
    address: 'Résidence Les Palmiers, Kantaoui Sousse',
    idCardNumber: '04899214',
    ownedPropertyIds: ['prop-1', 'prop-3', 'prop-6'],
    documentsCount: 6,
    notes: 'Promoteur et propriétaire foncier historique de Sousse. Partenaire privilégié d\'Albayen.',
    status: 'actif',
    createdAt: '2025-01-10'
  },
  {
    id: 'owner-2',
    firstName: 'Monia',
    lastName: 'Chahed',
    phone: '+216 23 444 888',
    email: 'monia.chahed@yahoo.fr',
    address: 'Avenue Habib Bourguiba, Hammam Sousse',
    idCardNumber: '02334812',
    ownedPropertyIds: ['prop-2', 'prop-5', 'prop-8'],
    documentsCount: 4,
    notes: 'Résidente en Suisse. Mandats de vente exclusifs accordés à notre agence.',
    status: 'actif',
    createdAt: '2025-06-18'
  },
  {
    id: 'owner-3',
    firstName: 'Société Immobilière Sousse Plage',
    lastName: '(Représentée par M. Sellami)',
    phone: '+216 73 222 999',
    email: 'contact@sousseplage-immo.com',
    address: 'Boulevard 14 Janvier, Sousse',
    ownedPropertyIds: ['prop-4', 'prop-7'],
    documentsCount: 3,
    notes: 'Parc locatif corporate géré à 100% par Albayen Immobilier.',
    status: 'actif',
    createdAt: '2026-02-14'
  }
];

export const INITIAL_OFFERS: CommercialOffer[] = [
  {
    id: 'offer-1',
    ref: 'OFF-2026-019',
    propertyId: 'prop-2',
    propertyRef: 'AL-KT-002',
    propertyTitle: 'Appartement S+3 Haut Standing Marina Kantaoui',
    clientName: 'Youssef Boussetta',
    clientPhone: '+216 22 550 991',
    clientEmail: 'boussetta.y@gmail.com',
    offeredAmount: 840000,
    listedPrice: 880000,
    agentId: 'user-agent-1',
    commissionRate: 2.5,
    estimatedCommission: 21000,
    status: 'pending',
    notes: 'Acompte prêt à être versé dès accord de la propriétaire Mme Chahed.',
    createdAt: '2026-09-26'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-agent-1',
    title: 'Nouvelle demande de visite',
    message: 'Dr. Tarek Mansour a demandé une visite pour la Villa Kantaoui (AL-KT-001) le 30/09 à 15h30.',
    type: 'visit',
    date: '2026-09-28 08:30',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-agent-1',
    title: 'Offre d\'achat enregistrée',
    message: 'Offre reçue de 840 000 DT sur l\'appartement Marina Kantaoui (AL-KT-002).',
    type: 'offer',
    date: '2026-09-26 14:15',
    read: true
  },
  {
    id: 'notif-3',
    userId: 'user-client-1',
    title: 'Visite Confirmée !',
    message: 'Votre visite pour la Somptueuse Villa Kantaoui a été validée par votre agent Karim Ben Salah.',
    type: 'visit',
    date: '2026-09-28 09:00',
    read: false
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-agent-1',
    userName: 'Karim Ben Salah',
    userRole: 'agent',
    action: 'CONFIRMATION_VISITE',
    targetObject: 'Visite V-001 (Villa Kantaoui AL-KT-001)',
    details: 'Confirmation du créneau du 30/09/2026 à 15h30 avec Dr. Tarek Mansour.',
    ipAddress: '197.14.182.45',
    timestamp: '2026-09-28 09:00:14'
  },
  {
    id: 'log-2',
    userId: 'user-admin-1',
    userName: 'Sonia Trabelsi',
    userRole: 'admin',
    action: 'MODIFICATION_PRIX',
    targetObject: 'Bien AL-SH-003 (Penthouse Sahloul)',
    details: 'Ajustement du prix catalogue de 1 200 000 DT à 1 150 000 DT suite à l\'accord promoteur.',
    ipAddress: '197.14.180.12',
    timestamp: '2026-09-27 16:22:08'
  },
  {
    id: 'log-3',
    userId: 'user-superadmin-1',
    userName: 'Direction Albayen',
    userRole: 'superadmin',
    action: 'PUBLICATION_ANNONCE',
    targetObject: 'Bien AL-KT-001',
    details: 'Publication et mise en avant "À la une" de la Villa Contemporaine Kantaoui.',
    ipAddress: '197.14.190.88',
    timestamp: '2026-09-25 10:15:30'
  }
];
