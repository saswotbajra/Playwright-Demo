const { expect } = require('@playwright/test');
const { log } = require('console');


exports.ContactPage = class ContactPage {
  constructor(page) {
    this.page = page;

    // Input fields
    this.firstName = '//input[@id="firstName"]';
    this.lastName = '//input[@id="lastName"]';
    this.birthdate = '//input[@id="birthdate"]';
    this.email = '//input[@id="email"]';
    this.phone = '//input[@id="phone"]';
    this.street1 = '//input[@id="street1"]';
    this.street2 = '//input[@id="street2"]';
    this.city = '//input[@id="city"]';
    this.stateProvince = '//input[@id="stateProvince"]';
    this.postalCode = '//input[@id="postalCode"]';
    this.country = '//input[@id="country"]';
    
    // Update spans
    this.updatedFirstName = '//span[@id="firstName"]';
    this.updatedLastName = '//span[@id="lastName"]';
    this.updatedBirthdate = '//span[@id="birthdate"]';
    this.updatedEmail = '//span[@id="email"]';
    this.updatedPhone = '//span[@id="phone"]';

    // Submit button
    this.submit = '//button[@id="submit"]';
    // Delete button
    this.deleteButton = '//button[@id="delete"]';
    // Edit button
    this.editButton = '//button[@id="edit-contact"]';

    // Validation and result elements
    this.contactTable = '//table[@id="myTable"]';
    this.contactList = '//tr[@class="contactTableBodyRow"]';
    this.alertMessage = '#error';
    this.errorText ='Contact validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required.'

    
  }

  async addContact(
    firstName, 
    lastName, 
    birthdate, 
    email, 
    phone, 
    street1, 
    street2, 
    city, 
    stateProvince, 
    postalCode, 
    country
  ) {
    this.page.goto('/addContact');
    await this.page.locator(this.firstName).fill(firstName);
    await this.page.locator(this.lastName).fill(lastName);
    await this.page.locator(this.birthdate).fill(birthdate);
    await this.page.locator(this.email).fill(email);
    await this.page.locator(this.phone).fill(phone);
    await this.page.locator(this.street1).fill(street1);
    await this.page.locator(this.street2).fill(street2);
    await this.page.locator(this.city).fill(city);
    await this.page.locator(this.stateProvince).fill(stateProvince);
    await this.page.locator(this.postalCode).fill(postalCode);
    await this.page.locator(this.country).fill(country);

    await this.page.locator(this.submit).click();
  }

  async findContact(
    firstName, 
    lastName, 
    birthdate, 
    email, 
    phone
  ) {
    this.page.goto('/contactList');
    await this.page.waitForTimeout(2000);

    const contactTableRows = await this.page.locator(this.contactList).all();
    let haveContact = false;
    await this.page.waitForTimeout(2000);

    for (const row of contactTableRows) {
      const idColumn = await row.locator('//td').first();
      const nameColumn = await row.locator('//td').nth(1);
      const birthdateColumn = await row.locator('//td').nth(2);
      const emailColumn = await row.locator('//td').nth(3);
      const phoneColumn = await row.locator('//td').nth(4);
      
      const actualname = await nameColumn.textContent();
      const actualbirthdate = await birthdateColumn.textContent();
      const actualemail = await emailColumn.textContent();
      const actualphone = await phoneColumn.textContent();

      if(
        actualname === `${firstName} ${lastName}` &&
        actualbirthdate === birthdate &&
        actualemail === email &&
        actualphone === phone
      ) {
        haveContact = true;
        return await idColumn.textContent();
      }
    }
    expect(haveContact).toBe(true);
  }

  async findUpdatedContact(
    firstName, 
    lastName, 
    birthdate, 
    email, 
    phone
  ) {
    this.page.goto('/contactList');
    await this.page.waitForTimeout(2000);
    await expect(this.page.locator(this.updatedFirstName)).toHaveText(firstName);
    await expect(this.page.locator(this.updatedLastName)).toHaveText(lastName);
    await expect(this.page.locator(this.updatedBirthdate)).toHaveText(birthdate);
    await expect(this.page.locator(this.updatedEmail)).toHaveText(email);
    await expect(this.page.locator(this.updatedPhone)).toHaveText(phone);
  }

  async verifyAddContact(contactId) {
    const contactTableRows = await this.page.locator(this.contactList).all();
    await this.page.waitForTimeout(2000);
    let haveContact = false;

    for (const row of contactTableRows) {
      const idColumn = await row.locator('//td').first();
      const actualId = await idColumn.textContent();
      
      if(actualId === contactId) {
        haveContact = true;
        await expect(idColumn).toHaveText(contactId);
        break;
      }
    }
    expect(haveContact).toBe(true);
  }

  async verifyInvalidAddContact() {
    const errorMessage = await this.page.locator(this.alertMessage);

    await this.page.waitForTimeout(2000);
    await expect(errorMessage).toHaveText(this.errorText);
  }

  async editContact(
    contactId,
    firstName,
    lastName,
    birthdate,
    email,
    phone
  ) {
    const contactTableRows = await this.page.locator(this.contactList).all();
    const editButton = await this.page.locator(this.editButton);

    await this.page.waitForTimeout(2000);

    for (const row of contactTableRows) {
      const idColumn = await row.locator('//td').first();
      const actualid = await idColumn.textContent();

      if(actualid === contactId) {
        row.click();
        await this.page.waitForTimeout(2000);
        editButton.click();
        await this.page.waitForTimeout(2000);
    
        await this.page.locator(this.firstName).fill(firstName);
        await this.page.locator(this.lastName).fill(lastName);
        await this.page.locator(this.birthdate).fill(birthdate);
        await this.page.locator(this.email).fill(email);
        await this.page.locator(this.phone).fill(phone);
        
        await this.page.locator(this.submit).click();

        break;
      }
    }
  }

  async deleteContact(contactId) {
    await this.page.goto('/contactList');
    await this.page.waitForTimeout(2000);

    const contactTableRows = await this.page.locator(this.contactList).all();
    const deleteButton = await this.page.locator(this.deleteButton);
    let haveContact = true;

    for (const row of contactTableRows) {
      const idColumn = await row.locator('//td').first();
      const actualid = await idColumn.textContent();
      console.log(actualid, contactId);
      

      if(actualid === contactId) {
        row.click();
        await this.page.waitForTimeout(2000);
        this.page.on('dialog', dialog => {
          dialog.accept();
        });
        await deleteButton.click();
        haveContact = false;
        break;
      }
    }
    expect(haveContact).toBe(false);
  }
}