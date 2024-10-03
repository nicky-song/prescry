// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class PhoneNumberVerificationScreen {
  private _page: Page;
  private _phoneNumberVerificationCodeLocator: Locator;
  private _confirmVerificationCodeLocator: Locator;

  constructor(page: Page) {
    this._page = page;
    this._phoneNumberVerificationCodeLocator = page.locator(
      '[data-testid="phoneNumberVerificationCodeInputTextInput"]'
    );
    this._confirmVerificationCodeLocator = page.locator(
      '[data-testid="phoneNumberVerificationVerifyButton"]'
    );
  }

  fillPhoneVerificationCode = async (phoneVerificationCode: string) => {
    await this._phoneNumberVerificationCodeLocator.fill(phoneVerificationCode);
  };

  confirmPhoneVerificationCode = async () => {
    await this._confirmVerificationCodeLocator.click();
  };
}
