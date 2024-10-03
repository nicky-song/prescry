// Copyright 2023 Prescryptive Health, Inc.

import { test } from '../../../fixtures/base-fixtures';
import {
  primaryUserDrugSearch,
  resetPinFlowTestData,
} from '../../../test-data';
import { getOTPMessage } from '../../../utilities';
import { expect } from '@playwright/test';

let lock;
test.beforeEach(async ({ getCashUser }) => {
  lock = await getCashUser(primaryUserDrugSearch, true);
});

test('Reset pin happy path @exec', async ({
  unauthHomePage,
  authHomePage,
  page,
  loginPinScreen,
  verifyIdentityScreen,
  verifyIdentitySendCodeScreen,
  verifyIdentityVerificationCodeScreen,
  createPinScreen,
  verifyPinScreen,
  oneTimePassword,
  homeScreen,
  waitUntilOverlayLoadingDisappeared,
}) => {
  await unauthHomePage.goto();
  await unauthHomePage.goToLogin();

  await oneTimePassword(primaryUserDrugSearch.phoneNumber);
  // Choose the forgotten pin option
  await loginPinScreen.forgotPin();

  // Enter correct user data and continue
  await verifyIdentityScreen.fillUserData({
    phoneNumber: primaryUserDrugSearch.phoneNumber,
    email: primaryUserDrugSearch.email,
    dateOfBirth: new Date(primaryUserDrugSearch.dateOfBirth),
  });
  await waitUntilOverlayLoadingDisappeared(
    verifyIdentityScreen.clickContinueButton
  );

  // Choose the option of phone number and continue
  await verifyIdentitySendCodeScreen.selectRadioButtonByOption(
    resetPinFlowTestData.radioButtonOptions.phoneNumber
  );
  await waitUntilOverlayLoadingDisappeared(
    verifyIdentitySendCodeScreen.clickContinueButton
  );

  // Get OTP phone number verification code
  const phoneNumberVerificationCode = await getOTPMessage(page, {
    twilioPhoneNumber: primaryUserDrugSearch.phoneNumber,
    delay: 500,
  });

  // Stablish OTP code and verify
  await verifyIdentityVerificationCodeScreen.fillResetVerificationCode(
    phoneNumberVerificationCode
  );
  await waitUntilOverlayLoadingDisappeared(
    verifyIdentityVerificationCodeScreen.clickVerifyButton
  );

  // Create Pin Screen - Creating a new PIN
  await createPinScreen.enterPin(primaryUserDrugSearch.pin);
  await createPinScreen.clickNextButton();

  // Verify Pin Screen - Verifying the new PIN
  await verifyPinScreen.enterPin(primaryUserDrugSearch.pin);
  await waitUntilOverlayLoadingDisappeared(verifyPinScreen.clickVerifyButton);

  // Go to Sign out
  await authHomePage.goToSignOut();

  // Login Pin Screen
  await loginPinScreen.enterPin(primaryUserDrugSearch.pin);
  await waitUntilOverlayLoadingDisappeared(loginPinScreen.login);

  // Validate the user is in the home
  await expect(
    homeScreen.getHomeScreenSearchButton().last(),
    'The home search button is not visible'
  ).toBeVisible();
});

test.afterEach(() => lock.unlock());
