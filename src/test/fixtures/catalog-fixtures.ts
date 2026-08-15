import type { PublicCatalogItemResponse } from '@bopacorp/shared';

export function createCatalogItem(
  overrides: Partial<PublicCatalogItemResponse> = {},
): PublicCatalogItemResponse {
  return {
    id: 'item-1',
    name: 'Plan Empresarial',
    description: 'Conectividad para empresas.',
    price: 49.99,
    imagePath: null,
    permanenceMonths: 12,
    category: { id: 'category-1', name: 'Voz', slug: 'voz' },
    itemType: { id: 'type-1', code: 'VOICE', name: 'Voz' },
    contractType: { id: 'contract-1', code: 'ANNUAL', name: 'Anual' },
    segment: { id: 'segment-1', code: 'SME', name: 'Pymes' },
    tier: { id: 'tier-1', code: 'STANDARD', name: 'Estándar' },
    voiceDetails: null,
    connectivityDetails: null,
    digitalDetails: null,
    roamingDetails: null,
    deviceDetails: null,
    benefits: [],
    ...overrides,
  };
}

export function createVoiceCatalogItem(
  overrides: Partial<PublicCatalogItemResponse> = {},
): PublicCatalogItemResponse {
  return createCatalogItem({
    voiceDetails: {
      id: 'voice-1',
      gigasStructural: 10,
      gigasLoyalty: 6,
      minutesNational: 500,
      minutesLdi: 20,
      sms: 100,
      hasUnlimitedMinutes: false,
      hasUnlimitedWhatsapp: true,
      hasSocialNetworks: true,
      includedRoamingGb: 2,
    },
    benefits: [
      {
        id: 'benefit-1',
        benefitTypeId: 'benefit-type-1',
        name: 'Atención prioritaria',
        description: null,
        durationDays: null,
      },
    ],
    ...overrides,
  });
}

export function createContactResponse() {
  return {
    id: 'request-1',
    itemId: null,
    clientName: 'Ana Pérez',
    clientEmail: 'ana@empresa.com',
    clientPhone: null,
    message: null,
    isAttended: false,
    attendedAt: null,
    attendedBy: null,
    createdAt: '2026-08-15T12:00:00.000Z',
  };
}
