// Copyright 2023 Prescryptive Health, Inc.

import { test } from '../../../fixtures/base-fixtures';
import {
  primaryUserDrugSearch,
  resetPinFlowTestData,
} from '../../../test-data';
import { getOTPMessage } from '../../../utilities';
import { expect } from '@playwright/test';

test.setTimeout(120000);

let lock;
test.beforeEach(async ({ getCashUser }) => {
  lock = await getCashUser(primaryUserDrugSearch, true);
});

test('Reset pin account locked 3rd screen', async ({
  loginPinScreen,
  verifyIdentityScreen,
  verifyIdentitySendCodeScreen,
  verifyIdentityVerificationCodeScreen,
  accountLockedScreen,
  unauthHomePage,
  oneTimePassword,
  page,
  waitUntilOverlayLoadingDisappeared,
}) => {
  await unauthHomePage.goto();
  await unauthHomePage.goToLogin();

  await oneTimePassword(primaryUserDrugSearch.phoneNumber);
  // Choose the forgotten pin option
  await loginPinScreen.forgotPin();

  // Enter user data and continue
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

  // Invert phoneNumberVerificationCode to get a failed response
  const phoneNumberVerificationCodebad = phoneNumberVerificationCode
    .split('')
    .reverse()
    .join('');

  // Stablish OTP code and confirm it
  await verifyIdentityVerificationCodeScreen.fillResetVerificationCode(
    phoneNumberVerificationCodebad
  );
  // Force the error on verify code screen for 5 times
  for (let i = 0; i < 5; i++) {
    await waitUntilOverlayLoadingDisappeared(
      verifyIdentityVerificationCodeScreen.clickVerifyButton
    );
  }
  // Check if the account is locked
  await expect(
    accountLockedScreen.accountLockedMessage(),
    'Account was not locked'
  ).toBeVisible();
});

test.afterEach(() => lock?.unlock());
