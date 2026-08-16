import { expect, type Locator, type Page, test } from '@playwright/test';

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}@example.com`;
}

function adminCredentials() {
  const email = process.env.E2E_ADMIN_EMAIL ?? process.env.VITE_WEB_TEST_CMS_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD ?? process.env.VITE_WEB_TEST_CMS_PASSWORD;
  if (!email || !password) throw new Error('E2E admin credentials are required');
  return { email, password };
}

function candidateFields() {
  const suffix = Date.now().toString().slice(-8);
  return [
    ['#apply-national-id', `09${suffix}`],
    ['#apply-first-name', 'E2E'],
    ['#apply-last-name', 'Candidate'],
    ['#apply-email', uniqueEmail('e2e-candidate')],
    ['#apply-phone', '0991234567'],
  ] as const;
}

async function fillFields(page: Page, fields: readonly (readonly [string, string])[]) {
  for (const [selector, value] of fields) await page.locator(selector).fill(value);
}

async function loginAsAdmin(page: Page) {
  const { email, password } = adminCredentials();
  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(/\/admin\/cms$/);
}

async function selectHeroDescription(page: Page) {
  await page.goto('/admin/cms');
  await expect(page.getByRole('heading', { name: 'Bloques de Contenido' })).toBeVisible();
  await page.getByRole('tab', { name: /^Hero/ }).click();
  await page.getByPlaceholder(/Buscar por título/).fill('description');
}

async function openHeroDescription(page: Page) {
  await selectHeroDescription(page);
  const editButton = page.getByRole('button', { name: 'Editar' });
  await expect(editButton).toHaveCount(1);
  await editButton.click();
  const editor = page.locator('#edit-body');
  await expect(editor).toBeVisible();
  return editor;
}

async function saveCmsBody(page: Page, body: string) {
  await page.locator('#edit-body').fill(body);
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText('Bloque actualizado')).toBeVisible();
}

function createPdfUpload() {
  const buffer = Buffer.alloc(10 * 1024);
  buffer.set(Buffer.from('%PDF'));
  return { name: `e2e-resume-${Date.now()}.pdf`, mimeType: 'application/pdf', buffer };
}

async function openContactDialog(page: Page) {
  await page.goto('/servicios');
  await expect(page.getByRole('heading', { name: /Cátalogo de Servicios/ })).toBeVisible();
  await page.locator('#filter-min').fill('0');
  await expect(page.getByText(/\d+ resultados?/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Cotizar Servicios' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Solicitar Cotizacion' });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function submitContactRequest(page: Page, dialog: Locator) {
  await fillFields(page, [
    ['#contact-name', 'E2E Visitor'],
    ['#contact-email', uniqueEmail('e2e-contact')],
    ['#contact-phone', '0991234567'],
    ['#contact-message', 'E2E contact request'],
  ]);
  await dialog.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.getByRole('dialog', { name: 'Solicitud enviada' })).toBeVisible();
}

async function openApplicationDialog(page: Page) {
  await page.goto('/empleos');
  await expect(page.getByRole('heading', { name: 'Ofertas disponibles' })).toBeVisible();
  await page
    .getByRole('button', { name: /Ver detalle/ })
    .first()
    .click();
  await page.getByRole('button', { name: 'Postular a esta vacante' }).click();
  return page.getByRole('dialog', { name: /Postular a/ });
}

async function assertApplicationValidation(page: Page, dialog: Locator) {
  await dialog.getByRole('button', { name: 'Enviar postulacion' }).click();
  await expect(page.locator('#apply-national-id')).toHaveAttribute('aria-invalid', 'true');
}

async function submitCandidateApplication(page: Page, dialog: Locator) {
  await fillFields(page, candidateFields());
  await page.locator('#applicant-resume').setInputFiles(createPdfUpload());
  await dialog.getByRole('button', { name: 'Enviar postulacion' }).click();
  await expect(page.getByRole('dialog', { name: 'Postulacion enviada' })).toBeVisible();
}

async function runVisitorJourney(page: Page) {
  const dialog = await openContactDialog(page);
  await submitContactRequest(page, dialog);
}

async function runCandidateJourney(page: Page) {
  const dialog = await openApplicationDialog(page);
  await assertApplicationValidation(page, dialog);
  await submitCandidateApplication(page, dialog);
}

async function verifyCmsMarker(page: Page, marker: string) {
  await page.goto('/');
  await expect(page.getByText(marker, { exact: false })).toBeVisible();
}

async function restoreCmsBody(page: Page, originalBody: string) {
  await openHeroDescription(page);
  await saveCmsBody(page, originalBody);
}

async function editAndRestoreCmsBody(page: Page, originalBody: string, marker: string) {
  try {
    await saveCmsBody(page, `${originalBody}${marker}`);
    await verifyCmsMarker(page, marker);
  } finally {
    await restoreCmsBody(page, originalBody);
  }
}

async function runAdminCmsJourney(page: Page) {
  await loginAsAdmin(page);
  const editor = await openHeroDescription(page);
  const originalBody = await editor.inputValue();
  const marker = ` E2E-${Date.now()}`;
  await editAndRestoreCmsBody(page, originalBody, marker);
}

test('visitor submits a contact request from the services page', async ({ page }) => {
  await runVisitorJourney(page);
});

test('candidate submits a valid PDF application after invalid form feedback', async ({ page }) => {
  await runCandidateJourney(page);
});

test('administrator edits and restores a public CMS text block', async ({ page }) => {
  await runAdminCmsJourney(page);
});
