// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { resetAccount } from '../../utilities';
import { test } from '../../fixtures/base-fixtures';
import { createFromDrugSearchPresTransTestData } from '../../test-data';

let lock: { unlock: () => Promise<void> };
test.beforeEach(async ({ waitForAccount }) => {
  const { phoneNumber, phoneNumberDialingCode } =
    createFromDrugSearchPresTransTestData;
  lock = await waitForAccount(phoneNumber, false);
  await test.step('Reset account', () =>
    resetAccount({
      countryCode: phoneNumberDialingCode,
      number: phoneNumber,
    })
  );
});

test.afterEach(async () => await lock?.unlock());

test('Account creation from drug search and prescription transfer @exec', async ({
  appointmentScreen,
  createAccountScreen,
  createPin,
  drugSearchHomeScreen,
  findLocationScreen,
  findYourPharmacyScreen,
  oneTimePassword,
  orderConfirmationScreen,
  pickAPharmacy,
  verifyPrescriptionScreen,
  unauthHomePage,
  waitUntilOverlayLoadingDisappeared,
  whatComesNextScreen,
}) => {
  await unauthHomePage.goto();

  // Click into drug search field
  await unauthHomePage.clickDrugSearch();

  // Enter the drug name to search
  await drugSearchHomeScreen.enterDrugNameToSearch(
    createFromDrugSearchPresTransTestData.drugName
  );
  await drugSearchHomeScreen.selectFirstItemDrugName();

  // Go to Find location screen
  await pickAPharmacy.clickLocationButton();

  // Enter the location code to search
  await findLocationScreen.enterLocationCodeToSearch(
    createFromDrugSearchPresTransTestData.locationCode
  );

  // Choose the first location and click in apply button
  await findLocationScreen.clickFirstItemLocationCodeSearch();
  await findLocationScreen.clickApplyLocationCode();

  // Get the first Prescription valueCard and click
  await pickAPharmacy.getPharmacyselectPrescriptionValueCardFirstItem();

  // Click in card pill bottle icon
  await whatComesNextScreen.clickActionCardPillBottleIcon();

  // Enter the pharmacy code and search
  await findYourPharmacyScreen.enterPharmacyCode(
    createFromDrugSearchPresTransTestData.findYourPharmacyCode
  );
  await findYourPharmacyScreen.clickSearchPharmacy();

  // Select the first Pharmacy Card item
  await findYourPharmacyScreen.getFindYourPharmacyCardFirstItem();

  // Validate the section of new account is visible
  await expect(
    createAccountScreen.getBodyContentContainer(),
    'The section to create a new account is not visible.'
  ).toBeVisible();

  // Create the Account
  await test.step('Set personal user data', async () => {
    await createAccountScreen.fillAccountData({
      firstName: createFromDrugSearchPresTransTestData.firstName,
      lastName: createFromDrugSearchPresTransTestData.lastName,
      phoneNumber: createFromDrugSearchPresTransTestData.phoneNumber,
      email: createFromDrugSearchPresTransTestData.email,
      dateOfBirth: new Date(createFromDrugSearchPresTransTestData.dateOfBirth),
    });
  });

  await oneTimePassword(createFromDrugSearchPresTransTestData.phoneNumber, () =>
    createAccountScreen.clickContinueButton()
  );

  // Creates PIN
  await createPin({
    phoneNumberDialingCode:
      createFromDrugSearchPresTransTestData.phoneNumberDialingCode,
    phoneNumber: createFromDrugSearchPresTransTestData.phoneNumber,
    pin: createFromDrugSearchPresTransTestData.pin,
  });

  // Register the order and submit
  await test.step('Fill address and create the order', async () => {
    await appointmentScreen.fillMemberAddress(
      createFromDrugSearchPresTransTestData.address
    );
    await waitUntilOverlayLoadingDisappeared(
      verifyPrescriptionScreen.clickSubmitButton
    );
  });
  // Validate if the order was created
  await expect(
    orderConfirmationScreen.getContentOrderConfirmationScreen(),
    'The screen of the order confirmed is not visible.'
  ).toBeVisible();
});
