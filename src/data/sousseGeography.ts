/**
 * Sousse Geographic Hierarchy & Micro-Districts Data
 * Albayen Immobilier Sousse
 */

export interface SousseDistrict {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  delegation: string;
  delegationAr: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  sectors: string[];
  description: string;
  descriptionAr: string;
  averagePriceM2Apartment: number; // TND/m²
  averagePriceM2Villa: number; // TND/m²
}

export interface DelegationGroup {
  id: string;
  name: string;
  nameAr: string;
  districts: string[];
}

export const SOUSSE_DELEGATIONS: DelegationGroup[] = [
  {
    id: 'sousse_ville',
    name: 'Sousse Ville & Corniche',
    nameAr: 'سوسة المدينة والكورنيش',
    districts: ['Corniche Sousse (Boujaafar)', 'Sousse Médina & Centre-Ville', 'Khézama Est', 'Khézama Ouest']
  },
  {
    id: 'sousse_jawhara',
    name: 'Sousse Jawhara & Sahloul',
    nameAr: 'سوسة جوهرة وسهلول',
    districts: ['Sahloul 1', 'Sahloul 2', 'Sahloul 3', 'Sahloul 4', 'Sousse Jawhara', 'Bouhsina']
  },
  {
    id: 'hammam_sousse',
    name: 'Hammam Sousse & El Kantaoui',
    nameAr: 'حمام سوسة والقنطاوي',
    districts: ['Port El Kantaoui', 'Hammam Sousse Plage', 'Menchia / Centre', 'Tantana']
  },
  {
    id: 'chott_meriem_hergla',
    name: 'Chott Meriem & Hergla',
    nameAr: 'شط مريم والهرقلة',
    districts: ['Chott Meriem', 'Hergla Village & Falaises', 'Akouda']
  },
  {
    id: 'sousse_sud',
    name: 'Sousse Sud & Périphérie',
    nameAr: 'سوسة الجنوبية والضواحي',
    districts: ['Sousse Riadh', 'Sidi Abdelhamid', 'Kalaa Kebira', 'Msaken']
  }
];

export const SOUSSE_DISTRICTS_DATA: SousseDistrict[] = [
  {
    id: 'sahloul',
    name: 'Sahloul',
    nameAr: 'سهلول',
    nameEn: 'Sahloul',
    delegation: 'Sousse Jawhara',
    delegationAr: 'سوسة جوهرة',
    postalCode: '4054',
    latitude: 35.8360,
    longitude: 10.5960,
    sectors: ['Sahloul 1', 'Sahloul 2', 'Sahloul 3', 'Sahloul 4', 'Zone Cliniques'],
    description: 'Quartier résidentiel prisé, pôle médical d\'excellence avec le CHU Sahloul, résidences haut standing et vie commerciale active.',
    descriptionAr: 'حي سكني راقٍ وقطب طبي متميز مع المستشفى الجامعي سهلول، إقامات فاخرة وحياة تجارية حيوية.',
    averagePriceM2Apartment: 2800,
    averagePriceM2Villa: 3200
  },
  {
    id: 'khezama',
    name: 'Khezama',
    nameAr: 'خزامة',
    nameEn: 'Khezama',
    delegation: 'Sousse Ville',
    delegationAr: 'سوسة المدينة',
    postalCode: '4051',
    latitude: 35.8480,
    longitude: 10.6180,
    sectors: ['Khézama Est', 'Khézama Ouest', 'Avenue Taieb Mehiri', 'Zone Touristique'],
    description: 'Quartier cosmopolite emblématique de Sousse, proximité immédiate de la mer, cafés chics, écoles internationales et commerces.',
    descriptionAr: 'حي سياحي وتجاري نابض بالحياة، قريب جداً من الشاطئ ومتميز بالمطاعم الراقية والمدارس.',
    averagePriceM2Apartment: 3100,
    averagePriceM2Villa: 3600
  },
  {
    id: 'port_el_kantaoui',
    name: 'Port El Kantaoui',
    nameAr: 'ميناء القنطاوي',
    nameEn: 'Port El Kantaoui',
    delegation: 'Hammam Sousse',
    delegationAr: 'حمام سوسة',
    postalCode: '4089',
    latitude: 35.8920,
    longitude: 10.5980,
    sectors: ['Marina', 'Zone Golf 36 Trous', 'Résidences du Port', 'Front de Mer'],
    description: 'Première marina-jardin de la Méditerranée, golf international 36 trous, villas de prestige pieds dans l\'eau et appartements haut de gamme.',
    descriptionAr: 'أول ميناء ترفيهي حدائقي في البحر الأبيض المتوسط، ملعب غولف دولي 36 حفرة، وفيلات فخمة على الواجهة البحرية.',
    averagePriceM2Apartment: 3800,
    averagePriceM2Villa: 4500
  },
  {
    id: 'chott_meriem',
    name: 'Chott Meriem',
    nameAr: 'شط مريم',
    nameEn: 'Chott Meriem',
    delegation: 'Akouda',
    delegationAr: 'أكودة',
    postalCode: '4042',
    latitude: 35.9250,
    longitude: 10.5620,
    sectors: ['Plage Chott Meriem', 'Tantana', 'Résidence des Roses', 'Zone Villas'],
    description: 'Havre de paix balnéaire au nord de Kantaoui, longues plages de sable fin, résidences balnéaires pieds dans l\'eau très recherchées.',
    descriptionAr: 'منتجع بحري هادئ شمال القنطاوي، شواطئ رملية شاسعة وإقامات صيفية فاخرة مطلة مباشرة على البحر.',
    averagePriceM2Apartment: 2600,
    averagePriceM2Villa: 3400
  },
  {
    id: 'corniche_sousse',
    name: 'Corniche Sousse (Boujaafar)',
    nameAr: 'كورنيش بوجعفر',
    nameEn: 'Sousse Corniche',
    delegation: 'Sousse Ville',
    delegationAr: 'سوسة المدينة',
    postalCode: '4000',
    latitude: 35.8320,
    longitude: 10.6380,
    sectors: ['Boujaafar Plage', 'Avenue Habib Bourguiba', 'Port de Plaisance', 'Place des Villes Jumelées'],
    description: 'Le cœur maritime de Sousse, vue panoramique sur le golfe, promenade animée et appartements avec vue mer imprenable.',
    descriptionAr: 'الواجهة البحرية التاريخية لمدينة سوسة، إطلالات بانورامية على الخليج وشقق فاخرة بواجهة بحرية مباشرة.',
    averagePriceM2Apartment: 3400,
    averagePriceM2Villa: 4000
  },
  {
    id: 'bouhsina',
    name: 'Bouhsina',
    nameAr: 'بوحسينة',
    nameEn: 'Bouhsina',
    delegation: 'Sousse Jawhara',
    delegationAr: 'سوسة جوهرة',
    postalCode: '4002',
    latitude: 35.8190,
    longitude: 10.6210,
    sectors: ['Bouhsina Nord', 'Bouhsina Sud', 'Ceinture Verte', 'Zone Universités'],
    description: 'Quartier résidentiel calme et familial, proche du centre-ville et des pôles universitaires, fort potentiel de valorisation.',
    descriptionAr: 'منطقة سكنية عائلية هادئة وقريبة من وسط المدينة والكليات، ذات مردود كراء استثماري ممتاز.',
    averagePriceM2Apartment: 2200,
    averagePriceM2Villa: 2700
  },
  {
    id: 'hergla',
    name: 'Hergla',
    nameAr: 'هرقلة',
    nameEn: 'Hergla',
    delegation: 'Hergla',
    delegationAr: 'هرقلة',
    postalCode: '4012',
    latitude: 36.0310,
    longitude: 10.5080,
    sectors: ['Falaises d\'Hergla', 'Vieux Port', 'Plage El Madfoun', 'Centre Historique'],
    description: 'Village pittoresque perché sur une falaise dominant la mer, architecture traditionnelle blanche et bleue, spot d\'exception très prisé par les artistes et investisseurs étrangers.',
    descriptionAr: 'قرية ساحلية ساحرة تطل على المنحدرات الصخرية والبحر، بطابع معماري أبيض وأزرق مميز وموقع استثماري فريد.',
    averagePriceM2Apartment: 2900,
    averagePriceM2Villa: 3900
  },
  {
    id: 'hammam_sousse',
    name: 'Hammam Sousse',
    nameAr: 'حمام سوسة',
    nameEn: 'Hammam Sousse',
    delegation: 'Hammam Sousse',
    delegationAr: 'حمام سوسة',
    postalCode: '4011',
    latitude: 35.8610,
    longitude: 10.6020,
    sectors: ['Menchia', 'Route Touristique', 'Bled El Ghadir', 'Plage'],
    description: 'Commune côtière dynamique reliant Sousse à Kantaoui, excellente infrastructure, commerces de bouche et accès rapide à la mer.',
    descriptionAr: 'بلدية ساحلية حيوية تربط سوسة بالقنطاوي، بنية تحتية متطورة وقرب استراتيجي من كافة المرافق والشواطئ.',
    averagePriceM2Apartment: 2700,
    averagePriceM2Villa: 3300
  }
];

/**
 * Checks if a property matches a geographical search query, taking into account
 * delegations, subdivisions, alternate names, and Arabic/French translations.
 */
export function matchPropertyGeography(
  propertyDistrict: string,
  propertyCity: string,
  searchQuery: string
): boolean {
  if (!searchQuery || searchQuery === 'all' || searchQuery.trim() === '') return true;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizedDistrict = (propertyDistrict || '').toLowerCase();
  const normalizedCity = (propertyCity || '').toLowerCase();

  // Direct match on district or city
  if (normalizedDistrict.includes(normalizedQuery) || normalizedCity.includes(normalizedQuery)) {
    return true;
  }

  // Delegation-level check
  for (const group of SOUSSE_DELEGATIONS) {
    const groupMatches = 
      group.id.toLowerCase().includes(normalizedQuery) ||
      group.name.toLowerCase().includes(normalizedQuery) ||
      group.nameAr.includes(searchQuery);

    if (groupMatches) {
      // Check if property is within this delegation's districts
      const districtInGroup = group.districts.some(d => 
        normalizedDistrict.includes(d.toLowerCase()) || 
        d.toLowerCase().includes(normalizedDistrict)
      );
      if (districtInGroup) return true;
    }
  }

  // District aliases & sectors check
  for (const dist of SOUSSE_DISTRICTS_DATA) {
    const isTargetDistrict = 
      dist.id.toLowerCase().includes(normalizedQuery) ||
      dist.name.toLowerCase().includes(normalizedQuery) ||
      dist.nameAr.includes(searchQuery) ||
      dist.sectors.some(s => s.toLowerCase().includes(normalizedQuery));

    if (isTargetDistrict) {
      if (
        normalizedDistrict.includes(dist.name.toLowerCase()) ||
        dist.sectors.some(s => normalizedDistrict.includes(s.toLowerCase()))
      ) {
        return true;
      }
    }
  }

  return false;
}
