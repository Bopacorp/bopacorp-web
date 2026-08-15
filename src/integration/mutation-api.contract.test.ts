import { describe, expect, it } from 'vitest';
import {
  listContentBlocks,
  updateContentBlock,
  uploadContentBlockImage,
} from '@/modules/cms/cms.service.js';
import { createContactRequest } from '@/modules/contact/contact.service.js';
import {
  applyJobVacancy,
  listPublishedVacancies,
} from '@/modules/employability/employability.service.js';
import { authenticate } from './support/api-test-client.js';

const allowMutations = import.meta.env.VITE_WEB_TEST_ALLOW_MUTATIONS === 'true';
const allowStorageMutations =
  allowMutations && import.meta.env.VITE_WEB_TEST_ALLOW_STORAGE_MUTATIONS === 'true';

describe.skipIf(!allowMutations)('mutation API contracts', () => {
  it('creates a contact request with the frontend service payload', async () => {
    const email = `integration-${Date.now()}@example.com`;
    const response = await createContactRequest({
      clientName: 'Frontend Integration Test',
      clientEmail: email,
      clientPhone: '0991234567',
      message: 'Integration contract request',
    });

    expect(response).toEqual(expect.objectContaining({ clientEmail: email }));
  });

  it('updates and restores a text CMS block through the frontend service', async () => {
    await authenticate('cms');
    await updateAndRestoreTextBlock();
  });

  it('submits a valid vacancy application with multipart data', async () => {
    const vacancy = await getPublishedVacancy();
    const form = createApplicationForm(vacancy.id);
    const response = await applyJobVacancy(form);

    expect(response).toEqual(
      expect.objectContaining({
        state: 'PENDING',
        vacancy: expect.objectContaining({ id: vacancy.id }),
      }),
    );
  });
});

describe.skipIf(!allowStorageMutations)('storage mutation API contracts', () => {
  it('uploads an image and restores the content block body', async () => {
    await authenticate('cms');
    await uploadAndRestoreImage();
  });
});

async function updateAndRestoreTextBlock() {
  const block = await getEditableBlock();
  const originalBody = block.body ?? '';
  const updatedBody = `${originalBody} integration-${Date.now()}`;
  try {
    await verifyUpdatedTextBlock(block.id, updatedBody);
  } finally {
    await updateContentBlock(block.id, { body: originalBody });
  }
}

async function verifyUpdatedTextBlock(id: string, body: string) {
  const updated = await updateContentBlock(id, { body });
  expect(updated.body).toBe(body);
  await expectBlockBody(id, body);
}

async function uploadAndRestoreImage() {
  const block = await getRestorableUploadTarget();
  const originalBody = block.body ?? '';
  try {
    await verifyImageUpload(block);
  } finally {
    await updateContentBlock(block.id, { body: originalBody });
  }
}

async function verifyImageUpload(block: Awaited<ReturnType<typeof getRestorableUploadTarget>>) {
  const response = await uploadContentBlockImage(block.contentKey, createImageFile());
  expect(response).toEqual(
    expect.objectContaining({ contentKey: block.contentKey, url: expect.any(String) }),
  );
}

async function getEditableBlock() {
  const response = await listContentBlocks(1, '', '');
  const block = response.data.find(
    (item) => item.contentType?.code !== 'IMAGE' && item.contentType?.code !== 'BANNER',
  );
  if (!block) throw new Error('The integration environment needs an editable text CMS block');
  return block;
}

async function getRestorableUploadTarget() {
  const response = await listContentBlocks(1, '', '');
  const block = response.data.find(
    (item) =>
      Boolean(item.body) &&
      item.contentType?.code !== 'IMAGE' &&
      item.contentType?.code !== 'BANNER',
  );
  if (!block) throw new Error('The integration environment needs a restorable text CMS block');
  return block;
}

async function expectBlockBody(id: string, body: string) {
  const response = await listContentBlocks(1, '', '');
  expect(response.data.find((item) => item.id === id)?.body).toBe(body);
}

async function getPublishedVacancy() {
  const response = await listPublishedVacancies({ page: 1, limit: 1, sortOrder: 'asc' });
  const vacancy = response.data[0];
  if (!vacancy) throw new Error('The integration environment needs a published vacancy');
  return vacancy;
}

function createApplicationForm(vacancyId: string) {
  const form = new FormData();
  form.append('file', createPdfFile());
  form.append('vacancyId', vacancyId);
  form.append('candidate', JSON.stringify(createCandidate()));
  form.append('coverLetter', 'Integration contract application');
  return form;
}

function createCandidate() {
  return {
    nationalId: `09${String(Date.now()).slice(-8)}`,
    firstName: 'Frontend',
    lastName: 'Integration',
    email: `candidate-${Date.now()}@example.com`,
    phone: '0991234567',
    address: 'Integration test address',
  };
}

function createPdfFile() {
  const bytes = new Uint8Array(10 * 1024);
  bytes.set([37, 80, 68, 70]);
  return new File([bytes], `resume-${Date.now()}.pdf`, {
    type: 'application/pdf',
  });
}

function createImageFile() {
  return new File([new Uint8Array([137, 80, 78, 71])], `image-${Date.now()}.png`, {
    type: 'image/png',
  });
}
