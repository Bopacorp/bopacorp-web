import type { ContentBlockResponse } from '@bopacorp/shared/catalog';
import bannerImg from '@/assets/banner.jpg';
import logoImg from '@/assets/logo.png';
import teamImg from '@/assets/team.jpg';

export const CMS_IMAGE_KEYS = {
  heroBackground: 'landing.hero.background_image_url',
  aboutImage: 'landing.about.image_url',
  logo: 'site.logo_url',
} as const;

const IMAGE_FALLBACKS: Record<string, string> = {
  [CMS_IMAGE_KEYS.heroBackground]: bannerImg,
  [CMS_IMAGE_KEYS.aboutImage]: teamImg,
  [CMS_IMAGE_KEYS.logo]: logoImg,
};

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function createImageBlock(key: string, url: string): ContentBlockResponse {
  const contentTypeId = generateUuid();
  return {
    id: generateUuid(),
    contentKey: key,
    contentTypeId,
    contentType: { id: contentTypeId, code: 'IMAGE', name: 'Image' },
    title: null,
    body: url,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function withFallbackImageBlocks(
  blocks: Record<string, ContentBlockResponse> | null,
): Record<string, ContentBlockResponse> {
  const merged = { ...(blocks ?? {}) };
  for (const [key, url] of Object.entries(IMAGE_FALLBACKS)) {
    if (!merged[key]) {
      merged[key] = createImageBlock(key, url);
    }
  }
  return merged;
}
