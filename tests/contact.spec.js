const { test, describe, beforeEach } = require("@playwright/test");
const { ContactPage } = require("../pageObjects/contact.po");
const { LoginPage } = require("../pageObjects/herokuLogin.po");
const testData = require("../fixtures/herokuFixture.json");
const { 
  authenticateUser,
  createEntity,
  getEntity,
  deleteEntity,
  validateEntity,
  updateEntity,
} = require("../utils/helper.spec");

let accessToken;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const login = new LoginPage(page);
  await login.login(testData.validUser.username, testData.validUser.password);
  await login.verifyValidLogin();
});

describe('Form Submission', () => {
  test('Add contact with valid details', async ({ page, request }) => {
    const ContactPageClass = new ContactPage(page);
    await ContactPageClass.addContact(
      testData.contactDetails.firstName,
      testData.contactDetails.lastName,
      testData.contactDetails.birthdate,
      testData.contactDetails.email,
      testData.contactDetails.phone,
      testData.contactDetails.street1,
      testData.contactDetails.street2,
      testData.contactDetails.city,
      testData.contactDetails.stateProvince,
      testData.contactDetails.postalCode,
      testData.contactDetails.country,
    )
    await page.waitForTimeout(2000);
    let contactId = await ContactPageClass.findContact(
          testData.contactDetails.firstName,
          testData.contactDetails.lastName,
          testData.contactDetails.birthdate,
          testData.contactDetails.email,
          testData.contactDetails.phone
        );
    await ContactPageClass.verifyAddContact(contactId);

    accessToken =  await authenticateUser(testData.validUser.username, testData.validUser.password, { request });
    // await createEntity(testData.contactDetails, accessToken, '/contacts', { request });
    // page.reload();
    const id = await getEntity(accessToken, '/contacts', '200', { request });
    await deleteEntity(accessToken, `/contacts/${id}`, { request })
    await validateEntity(accessToken, `/contacts/${id}`, '404', { request })
  })

  test('Add contact with invalid details', async ({ page }) => {
    const ContactPageClass = new ContactPage(page);
    await ContactPageClass.addContact(
      testData.invalidContactDetails.firstName,
      testData.invalidContactDetails.lastName,
      testData.invalidContactDetails.birthdate,
      testData.invalidContactDetails.email,
      testData.invalidContactDetails.phone,
      testData.invalidContactDetails.street1,
      testData.invalidContactDetails.street2,
      testData.invalidContactDetails.city,
      testData.invalidContactDetails.stateProvince,
      testData.invalidContactDetails.postalCode,
      testData.invalidContactDetails.country,
    )
    await page.waitForTimeout(2000);
    await ContactPageClass.verifyInvalidAddContact();
  })
});

describe('Update Contact', () => {
  test('Edit contact details', async ({ page, request }) => {
    const ContactPageClass = new ContactPage(page);
    accessToken = await authenticateUser(testData.validUser.username, testData.validUser.password, { request });
    const id = await createEntity(testData.contactDetails, accessToken, '/contacts', { request });
    // page.reload();
    await ContactPageClass.findContact(
      testData.contactDetails.firstName,
      testData.contactDetails.lastName,
      testData.contactDetails.birthdate,
      testData.contactDetails.email,
      testData.contactDetails.phone
    )
    await ContactPageClass.editContact(
      testData.updateContactDetails.firstName,
      testData.updateContactDetails.lastName,
      testData.updateContactDetails.birthdate,
      testData.updateContactDetails.email,
      testData.updateContactDetails.phone
    )
    await deleteEntity(accessToken, `/contacts/${id}`, {request})
    await validateEntity(accessToken, `/contacts/${id}`, '404', { request });
  });

  test.only('Delete contact details', async ({ page, request }) => {
    const ContactPageClass = new ContactPage(page);
    accessToken = await authenticateUser(testData.validUser.username, testData.validUser.password, { request });
    const id = await createEntity(testData.contactDetails, accessToken, '/contacts', { request });
    await page.reload();
    await ContactPageClass.deleteContact(id);
    await validateEntity(accessToken, `/contacts/${id}`, '404', { request })
  });
});