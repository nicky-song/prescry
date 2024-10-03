// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixtures';
import { resetAccount } from '../../utilities';
import { createFromDrugSearchTestData } from '../../test-data';
import { waitForAccountInDatabase } from '../test-partials/wait-for-account-in-database';

let lock: { unlock: () => Promise<void> };
test.beforeEach(async ({ waitForAccount }) => {
  const { phoneNumber, phoneNumberDialingCode } = createFromDrugSearchTestData;
  lock = await waitForAccount(phoneNumber, false);
  await test.step('Reset account', () =>
    resetAccount({
      countryCode: phoneNumberDialingCode,
      number: phoneNumber,
    })
  );
});

test.afterEach(async () => await lock?.unlock());

test('Account creation from drug search @exec', async ({
  createAccountScreen,
  createPin,
  drugSearchHomeScreen,
  findLocationScreen,
  oneTimePassword,
  page,
  pickAPharmacy,
  smartPriceScreen,
  unauthHomePage,
  whatComesNextScreen,
}) => {
  await unauthHomePage.goto();

  // Click into drug search field
  await unauthHomePage.clickDrugSearch();

  // Enter the drug name to search
  await drugSearchHomeScreen.enterDrugNameToSearch(
    createFromDrugSearchTestData.drugName
  );
  await drugSearchHomeScreen.selectFirstItemDrugName();

  // Go to Find location screen
  await pickAPharmacy.clickLocationButton();

  // Enter the location code to search
  await findLocationScreen.enterLocationCodeToSearch(
    createFromDrugSearchTestData.locationCode
  );

  // Choose the first location and click in apply button
  await findLocationScreen.clickFirstItemLocationCodeSearch();
  await findLocationScreen.clickApplyLocationCode();

  // Get the first Prescription valueCard and click
  await pickAPharmacy.getPharmacyselectPrescriptionValueCardFirstItem();

  // Click in sign up for more savings
  await whatComesNextScreen.clickSignUpForMoreSavings();

  expect(
    await createAccountScreen.getBodyContentContainer(),
    'The section to create a new account is not visible.'
  ).toBeVisible();

  // Create the Account
  await test.step('Set personal user data', async () => {
    await createAccountScreen.fillAccountData({
      firstName: createFromDrugSearchTestData.firstName,
      lastName: createFromDrugSearchTestData.lastName,
      phoneNumber: createFromDrugSearchTestData.phoneNumber,
      email: createFromDrugSearchTestData.email,
      dateOfBirth: new Date(createFromDrugSearchTestData.dateOfBirth),
    });
  });

  await oneTimePassword(createFromDrugSearchTestData.phoneNumber, () =>
    createAccountScreen.clickContinueButton()
  );

  // Wait until Account gets created in data base
  const account = {
    ...createFromDrugSearchTestData,
    countryCode: createFromDrugSearchTestData.phoneNumberDialingCode,
  };
  await waitForAccountInDatabase(account, page, true);

  // Creates PIN
  await createPin({
    phoneNumberDialingCode: createFromDrugSearchTestData.phoneNumberDialingCode,
    phoneNumber: createFromDrugSearchTestData.phoneNumber,
    pin: createFromDrugSearchTestData.pin,
  });

  expect(
    await smartPriceScreen.getCardSection(),
    'The correctly created account section is not visible.'
  ).toBeVisible();
});
