// Copyright 2023 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../../fixtures/base-fixtures';
import {
  primaryUserDrugSearch,
  resetPinFlowTestData,
} from '../../../test-data';

let lock;
test.beforeEach(async ({ getCashUser }) => {
  lock = await getCashUser(primaryUserDrugSearch, true);
});
test.setTimeout(120000);

test('Reset pin account locked on first screen @exec', async ({
  loginPinScreen,
  verifyIdentityScreen,
  accountLockedScreen,
  unauthHomePage,
  oneTimePassword,
  waitUntilOverlayLoadingDisappeared,
}) => {
  // GO to
  await unauthHomePage.goto();
  await unauthHomePage.goToLogin();

  await oneTimePassword(primaryUserDrugSearch.phoneNumber);
  // Choose the forgotten pin option
  await loginPinScreen.forgotPin();

  // Enter wrong user data
  await verifyIdentityScreen.fillUserData({
    phoneNumber: primaryUserDrugSearch.phoneNumber,
    email: resetPinFlowTestData.wrongEmail,
    dateOfBirth: new Date(primaryUserDrugSearch.dateOfBirth),
  });
  // Force the error on verify screen for 5 times
  for (let i = 0; i < 5; i++) {
    await waitUntilOverlayLoadingDisappeared(
      verifyIdentityScreen.clickContinueButton
    );
  }

  // Check if the account is locked
  await expect(
    accountLockedScreen.accountLockedMessage(),
    'Account is not locked'
  ).toBeVisible();
});

test.afterEach(() => lock?.unlock());
