const { test, describe, beforeEach } = require("@playwright/test");
const { ContactPage } = require("../pageObjects/contact.po");
const { LoginPage } = require("../pageObjects/herokuLogin.po");
const testData = require("../fixtures/herokuFixture.json");

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const login = new LoginPage(page);
  await login.login(testData.validUser.username, testData.validUser.password);
  await login.verifyValidLogin();
});

describe('From Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/addContact');
  });

  test('Add contact with valid details', async ({ page }) => {
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

    if(contactId) {
      await ContactPageClass.verifyAddContact(contactId);
    }
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
  test.beforeEach(async ({ page }) => {
    await page.goto('/contactList');
    await page.waitForTimeout(2000);
  });

  test('Edit contact details', async ({ page }) => {
    const ContactPageClass = new ContactPage(page);
    let contactId = await ContactPageClass.findContact(
      testData.contactDetails.firstName,
      testData.contactDetails.lastName,
      testData.contactDetails.birthdate,
      testData.contactDetails.email,
      testData.contactDetails.phone
    );
    await page.waitForTimeout(2000);
    if(contactId) {
      await ContactPageClass.editContact(
        contactId,
        testData.updateContactDetails.firstName,
        testData.updateContactDetails.lastName,
        testData.updateContactDetails.birthdate,
        testData.updateContactDetails.email,
        testData.updateContactDetails.phone
      );
      await page.waitForTimeout(2000);
      await ContactPageClass.findUpdatedContact(
        testData.updateContactDetails.firstName,
        testData.updateContactDetails.lastName,
        testData.updateContactDetails.birthdate,
        testData.updateContactDetails.email,
        testData.updateContactDetails.phone
      );
    }
  });

  test('Delete contact details', async ({ page }) => {
    const ContactPageClass = new ContactPage(page);
    let contactId = await ContactPageClass.findContact(
      testData.contactDetails.firstName,
      testData.contactDetails.lastName,
      testData.contactDetails.birthdate,
      testData.contactDetails.email,
      testData.contactDetails.phone
    );
    await page.waitForTimeout(2000);
    if(contactId) {
      await ContactPageClass.deleteContact(contactId);
    }
  });
});