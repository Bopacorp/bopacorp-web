/**
 * SAMPLE seed script for the backend repo.
 *
 * This file is NOT runnable in this frontend project — it references backend-only
 * modules such as `@lib/db.js` and `../db/schema/catalog.js`. Copy it to the
 * backend repository (e.g. `src/db/seeds/seed-cms-images.ts`) and run it there.
 */
import 'dotenv/config';
import type { CreateContentBlockRequest } from '@bopacorp/shared/catalog';
import { ContentTypeCode } from '@bopacorp/shared/catalog';
import { closeDb, db } from '@lib/db.js';
import { logger } from '@lib/logger.js';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { contentBlocks, contentTypes } from '../db/schema/catalog.js';

async function getContentTypeId(code: ContentTypeCode): Promise<string> {
  const [row] = await db
    .select({ id: contentTypes.id })
    .from(contentTypes)
    .where(eq(contentTypes.code, code));

  if (!row) {
    throw new Error(`Content type "${code}" not found. Run seed-content-types.ts first.`);
  }

  return row.id;
}

const buildImageBlocks = (imageTypeId: string): CreateContentBlockRequest[] => [
  {
    contentKey: 'landing.hero.background_image_url',
    contentTypeId: imageTypeId,
    title: 'Fondo del hero (Landing)',
    body: 'https://placehold.co/1920x800/0a0a2e/ffffff?text=Bopacorp+Hero',
    sortOrder: 1,
  },
  {
    contentKey: 'landing.about.image_url',
    contentTypeId: imageTypeId,
    title: 'Imagen sección About (Landing)',
    body: 'https://placehold.co/800x1000/1a1a4e/ffffff?text=Bopacorp+Team',
    sortOrder: 2,
  },
  {
    contentKey: 'site.logo_url',
    contentTypeId: imageTypeId,
    title: 'Logo del sitio',
    body: 'https://placehold.co/200x200/ffffff/0a0a2e?text=Logo',
    sortOrder: 3,
  },
];

async function seed() {
  const imageTypeId = await getContentTypeId(ContentTypeCode.IMAGE);
  const blocks = buildImageBlocks(imageTypeId);

  const existing = await db
    .select({ contentKey: contentBlocks.contentKey })
    .from(contentBlocks)
    .where(
      and(
        isNull(contentBlocks.deletedAt),
        inArray(
          contentBlocks.contentKey,
          blocks.map((b) => b.contentKey),
        ),
      ),
    );

  const existingKeys = new Set(existing.map((r) => r.contentKey));
  const newBlocks = blocks.filter((b) => !existingKeys.has(b.contentKey));

  if (newBlocks.length === 0) {
    logger.info('All CMS image blocks already exist, skipping');
    await closeDb();
    return;
  }

  await db.insert(contentBlocks).values(
    newBlocks.map((b) => ({
      contentKey: b.contentKey,
      contentTypeId: b.contentTypeId,
      title: b.title,
      body: b.body,
      sortOrder: b.sortOrder,
    })),
  );

  logger.info({ count: newBlocks.length }, 'Seeded CMS image blocks');
  await closeDb();
}

seed().catch((err) => {
  logger.error({ err }, 'Seed CMS image blocks failed');
  process.exit(1);
});
