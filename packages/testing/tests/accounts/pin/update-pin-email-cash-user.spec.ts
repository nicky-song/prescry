// Copyright 2023 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../../fixtures/base-fixtures';
import { AccountService } from '../../../services';
import { updatePinEmailCashUserTestData } from '../../../test-data';

let lock;
test.beforeEach(async ({ getCashUser }) => {
  lock = await getCashUser(updatePinEmailCashUserTestData, true);
});

test('update pin and email for cash user @exec', async ({
  loginPinScreen,
  homeScreen,
  verifyPinScreen,
  accountInformationScreen,
  createPinScreen,
  smartPriceScreen,
  unauthHomePage,
  login,
  waitUntilOverlayLoadingDisappeared,
}) => {
  await unauthHomePage.goto();

  // Login with the User Drug Search credentials
  await login({
    phoneNumberDialingCode:
      updatePinEmailCashUserTestData.phoneNumberDialingCode,
    phoneNumber: updatePinEmailCashUserTestData.phoneNumber,
    pin: updatePinEmailCashUserTestData.pin,
  });

  // Home Screen View - Go to save on Medications
  await homeScreen.goToSaveOnMedications();

  // Smart Price Screen View - Go to Account Information
  await smartPriceScreen.goToAccountInfoScreen();

  // Account Information Screen View - Editing the email and save
  await accountInformationScreen.clickEmailIcon();
  await accountInformationScreen.clearAndFillEmailInput(
    updatePinEmailCashUserTestData.newEmail
  );
  await accountInformationScreen.saveChanges();

  // Account Information Screen View - Editing the PIN
  await accountInformationScreen.clickEditPinIcon();

  // Login with the PIN
  await loginPinScreen.enterPin(updatePinEmailCashUserTestData.pin);
  await waitUntilOverlayLoadingDisappeared(loginPinScreen.login);

  // Create Pin Screen - Creating a new PIN
  await createPinScreen.enterPin(updatePinEmailCashUserTestData.newPin);
  await createPinScreen.clickNextButton();

  // Verify Pin Screen - Verifying the new PIN sending a wrong PIN
  await verifyPinScreen.enterPin(updatePinEmailCashUserTestData.wrongPin);
  await verifyPinScreen.clickVerifyButton();

  // Validate the pin error message is visible
  await expect(
    verifyPinScreen.getValidationMessage(),
    'The wrong pin message is not visible'
  ).toBeVisible();

  // Clear the wrong PIN inserted
  await verifyPinScreen.clickVerifyButton();

  // Verifying the new PIN
  await verifyPinScreen.enterPin(updatePinEmailCashUserTestData.newPin);
  await waitUntilOverlayLoadingDisappeared(verifyPinScreen.clickVerifyButton);

  // Validate the home screen popup modal is visible
  await expect(
    homeScreen.getPopUpModalLocator(),
    'The home screen popup modal is not visible'
  ).toBeVisible();
});

test.afterEach(async ({ appSettings }) => {
  const { token, deviceToken } = await appSettings();
  expect
    .soft(
      await test.step('Revert mail change', () =>
        AccountService.updateEmail({
          email: updatePinEmailCashUserTestData.email,
          oldEmail: updatePinEmailCashUserTestData.newEmail,
          token,
          deviceToken,
        })
      )
    )
    .toStrictEqual({
      message: 'Recovery email updated successfully',
      status: 'success',
    });
  expect
    .soft(
      await test.step('Revert pin change', () =>
        AccountService.updatePin({
          newPin: updatePinEmailCashUserTestData.newPin,
          oldPin: updatePinEmailCashUserTestData.pin,
          token,
          deviceToken,
        })
      )
    )
    .toStrictEqual({ message: 'Pin updated successfully', status: 'success' });
  await lock.unlock();
});
