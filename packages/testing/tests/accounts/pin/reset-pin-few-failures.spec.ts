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

test('Reset pin with few failures @exec', async ({
  authHomePage,
  page,
  loginPinScreen,
  verifyIdentityScreen,
  verifyIdentitySendCodeScreen,
  verifyIdentityVerificationCodeScreen,
  createPinScreen,
  verifyPinScreen,
  unauthHomePage,
  oneTimePassword,
  waitUntilOverlayLoadingDisappeared,
  homeScreen,
}) => {
  await unauthHomePage.goto();
  await unauthHomePage.goToLogin();

  await oneTimePassword(primaryUserDrugSearch.phoneNumber);

  // Choose the forgotten pin option
  await loginPinScreen.forgotPin();

  // Enter wrong user data and confirm
  await verifyIdentityScreen.fillUserData({
    phoneNumber: primaryUserDrugSearch.phoneNumber,
    email: resetPinFlowTestData.wrongEmail,
    dateOfBirth: new Date(primaryUserDrugSearch.dateOfBirth),
  });
  await waitUntilOverlayLoadingDisappeared(
    verifyIdentityScreen.clickContinueButton
  );

  // Validate the code error message is visible
  await expect(
    verifyIdentityScreen.getErrorMessage(),
    'The wrong code message is not visible'
  ).toBeVisible();

  // Enter correct user data and continue
  await verifyIdentityScreen.fillUserData({
    phoneNumber: primaryUserDrugSearch.phoneNumber,
    email: primaryUserDrugSearch.email,
    dateOfBirth: new Date(primaryUserDrugSearch.dateOfBirth),
  });
  await waitUntilOverlayLoadingDisappeared(
    verifyIdentityScreen.clickContinueButton
  );

  // Choose the option of phone number
  await verifyIdentitySendCodeScreen.selectRadioButtonByOption(
    resetPinFlowTestData.radioButtonOptions.phoneNumber
  );

  // Go back to Pin Screen
  await unauthHomePage.goto();
  // Choose forgot pin option
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
  let phoneNumberVerificationCode = await getOTPMessage(page, {
    twilioPhoneNumber: primaryUserDrugSearch.phoneNumber,
    delay: 500,
  });

  // Take the phoneNumberVerificationCode in reverse the to get an error message
  const phoneNumberVerificationCodebad = phoneNumberVerificationCode
    .split('')
    .reverse()
    .join('');

  // Stablish OTP code with a phoneNumberVerificationCodebad Pin and confirm
  await verifyIdentityVerificationCodeScreen.fillResetVerificationCode(
    phoneNumberVerificationCodebad
  );
  await waitUntilOverlayLoadingDisappeared(
    verifyIdentityVerificationCodeScreen.clickVerifyButton
  );

  // Validate the code error message is visible
  await expect(
    verifyIdentityVerificationCodeScreen.getVerifyErrorMessage(),
    'The wrong code message is not visible'
  ).toBeVisible();

  // Get the correct verificacion number
  phoneNumberVerificationCode = await getOTPMessage(page, {
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

  // Verify Pin Screen - Enter a wrong Pin
  await verifyPinScreen.enterPin(resetPinFlowTestData.wrongPin);
  await verifyPinScreen.clickVerifyButton();

  // Validate the pin error message is visible
  await expect(
    verifyPinScreen.getValidationMessage(),
    'The wrong pin message is not visible'
  ).toBeVisible();

  // Refresh the panel Pin
  await verifyPinScreen.clickVerifyButton();
  // Verify Pin Screen - Verifying the new PIN
  await verifyPinScreen.enterPin(primaryUserDrugSearch.pin);
  await waitUntilOverlayLoadingDisappeared(
    verifyPinScreen.clickVerifyButton,
    40 * 1000
  );

  // Sign out
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

test.afterEach(() => lock?.unlock());
