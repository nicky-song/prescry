// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class VerifyIdentityVerificationCodeScreen {
  private _page: Page;
  private _verifyCode: Locator;
  private _verifyButton: Locator;
  private _verifyErrorMessage: Locator;

  constructor(page: Page) {
    this._page = page;
    this._verifyCode = this._page.locator(
      '[data-testid="verifyIdentityVerificationCodeTextInput"] input'
    );
    this._verifyButton = this._page.locator(
      '[data-testid="verifyIdentityVerificationCodeVerifyButton"]'
    );
    this._verifyErrorMessage = this._page.locator(
      '[data-testid="verifyIdentityVerificationCodeErrorMessage"]'
    );
  }

  fillResetVerificationCode = async (phoneVerificationCode: string) => {
    await this._verifyCode.fill(phoneVerificationCode);
  };

  clickVerifyButton = async () => {
    await this._verifyButton.click();
  };

  getVerifyErrorMessage = () => {
    return this._verifyErrorMessage;
  };
}
