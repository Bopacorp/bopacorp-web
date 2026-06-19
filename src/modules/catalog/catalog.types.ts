export interface PublicCatalogItemRef {
  id: string;
  name: string;
}

export interface PublicCatalogItemTypedRef {
  id: string;
  code: string;
  name: string;
}

export interface PublicVoiceDetails {
  id: string;
  gigasStructural: number;
  gigasLoyalty: number;
  minutesNational: number | null;
  minutesLdi: number;
  sms: number;
  hasUnlimitedMinutes: boolean;
  hasUnlimitedWhatsapp: boolean;
  hasSocialNetworks: boolean;
  includedRoamingGb: number;
}

export interface PublicCatalogItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imagePath: string | null;
  permanenceMonths: number;
  category: PublicCatalogItemRef | null;
  itemType: PublicCatalogItemTypedRef | null;
  contractType: PublicCatalogItemTypedRef | null;
  segment: PublicCatalogItemTypedRef | null;
  tier: PublicCatalogItemTypedRef | null;
  voiceDetails: PublicVoiceDetails | null;
  benefits: PublicCatalogItemBenefit[];
}

export interface PublicCatalogItemBenefit {
  id: string;
  benefitTypeId: string;
  name: string;
  description: string | null;
  durationDays: number | null;
}
