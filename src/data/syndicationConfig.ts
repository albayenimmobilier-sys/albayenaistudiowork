import { SyndicationChannelId, PropertySyndicationChannel } from '../types';

export interface ExternalChannelMetadata {
  id: SyndicationChannelId;
  name: string;
  nameAr: string;
  category: 'portail_national' | 'site_officiel' | 'reseaux_sociaux' | 'portail_international';
  logoUrl?: string;
  websiteUrl: string;
  apiEndpoint: string;
  feedUrl: string;
  authType: 'api_key' | 'oauth2' | 'xml_ftp_feed';
  activeListingsCount: number;
  syncFrequencyHours: number;
  description: string;
}

export const EXTERNAL_CHANNELS_CONFIG: ExternalChannelMetadata[] = [
  {
    id: 'albayen_web',
    name: 'Site Officiel Albayen Immobilier',
    nameAr: 'الموقع الرسمي للبيان العقارية',
    category: 'site_officiel',
    websiteUrl: 'https://albayen-sousse.com',
    apiEndpoint: 'https://api.albayen-sousse.com/v1/properties',
    feedUrl: 'https://albayen-sousse.com/feeds/properties.json',
    authType: 'api_key',
    activeListingsCount: 16,
    syncFrequencyHours: 1,
    description: 'Diffusion temps réel sur le portail public et mobile officiel Albayen avec photos HD et visite 360°.'
  },
  {
    id: 'mubawab',
    name: 'Mubawab Tunisie',
    nameAr: 'مبوب تونس',
    category: 'portail_national',
    websiteUrl: 'https://www.mubawab.tn',
    apiEndpoint: 'https://partner-api.mubawab.tn/v2/listings',
    feedUrl: 'https://albayen-sousse.com/feeds/mubawab.xml',
    authType: 'api_key',
    activeListingsCount: 14,
    syncFrequencyHours: 6,
    description: 'Portail immobilier n°1 en Tunisie. Synchronisation bidirectionnelle des annonces et réception des leads.'
  },
  {
    id: 'tayara',
    name: 'Tayara Immo',
    nameAr: 'طيارة عقارات',
    category: 'portail_national',
    websiteUrl: 'https://www.tayara.tn/immobilier',
    apiEndpoint: 'https://business-api.tayara.tn/listings',
    feedUrl: 'https://albayen-sousse.com/feeds/tayara.xml',
    authType: 'api_key',
    activeListingsCount: 12,
    syncFrequencyHours: 12,
    description: 'Leader des petites annonces en Tunisie avec une forte audience locale sur Sousse et le Sahel.'
  },
  {
    id: 'facebook_instagram',
    name: 'Facebook & Instagram Real Estate',
    nameAr: 'فيسبوك وإنستغرام عقارات',
    category: 'reseaux_sociaux',
    websiteUrl: 'https://business.facebook.com/commerce',
    apiEndpoint: 'https://graph.facebook.com/v19.0/catalog/listings',
    feedUrl: 'https://albayen-sousse.com/feeds/facebook_catalog.csv',
    authType: 'oauth2',
    activeListingsCount: 10,
    syncFrequencyHours: 24,
    description: 'Catalogue produits Meta dynamique avec ciblages sponsorisés et formulaires Instant Leads intégrés.'
  },
  {
    id: 'international_portals',
    name: 'Portails Internationaux (TRE / Diaspora)',
    nameAr: 'المواقع الدولية (الجالية بالخارج)',
    category: 'portail_international',
    websiteUrl: 'https://www.green-acres.com',
    apiEndpoint: 'https://api.green-acres.com/syndication/albayen',
    feedUrl: 'https://albayen-sousse.com/feeds/international.xml',
    authType: 'xml_ftp_feed',
    activeListingsCount: 8,
    syncFrequencyHours: 24,
    description: 'Réseau Green-Acres, SeLoger International, LeFigaro Properties pour investisseurs européens et Tunisiens Résidant à l\'Étranger (TRE).'
  }
];

export const getDefaultSyndicationChannels = (propertyRef: string): PropertySyndicationChannel[] => {
  return [
    {
      channelId: 'albayen_web',
      channelName: 'Site Officiel Albayen',
      enabled: true,
      status: 'publie',
      lastSyncDate: '2026-09-29 10:15',
      externalPropertyId: `ALB-${propertyRef}`,
      lastUpdatedDate: '2026-09-29 10:15',
      autoSync: true
    },
    {
      channelId: 'mubawab',
      channelName: 'Mubawab Tunisie',
      enabled: true,
      status: 'publie',
      lastSyncDate: '2026-09-29 08:30',
      externalPropertyId: `MBW-${propertyRef}`,
      lastUpdatedDate: '2026-09-28 17:40',
      autoSync: true
    },
    {
      channelId: 'tayara',
      channelName: 'Tayara Immo',
      enabled: true,
      status: 'publie',
      lastSyncDate: '2026-09-28 14:00',
      externalPropertyId: `TYR-${propertyRef}`,
      lastUpdatedDate: '2026-09-28 14:00',
      autoSync: false
    },
    {
      channelId: 'facebook_instagram',
      channelName: 'Meta Catalog (FB/IG)',
      enabled: false,
      status: 'non_publie',
      autoSync: false
    },
    {
      channelId: 'international_portals',
      channelName: 'Portails Internationaux (TRE)',
      enabled: false,
      status: 'non_publie',
      autoSync: false
    }
  ];
};
