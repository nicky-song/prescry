// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class RecoveryEmailModal {
  private _page: Page;
  private _emailInput: Locator;
  private _addEmailButton: Locator;
  private _invalidEmailMessage: Locator;

  constructor(page: Page) {
    this._page = page;
    this._emailInput = this._page.locator(
      '[data-testid="recoveryEmailModalEmailAddressTextInput"]'
    );
    this._addEmailButton = this._page.locator(
      '[data-testid="recoveryEmailModalAddEmailButton"]'
    );
    this._invalidEmailMessage = this._page.locator(
      '[data-testid="txt_PopupModalError"]'
    );
  }

  enterEmail = async (email: string) => {
    await this._emailInput.fill(email);
  };

  addRecoveryEmail = async () => {
    await this._addEmailButton.click();
  };

  isInvalidEmailMessageVisible = async () => {
    return await this._invalidEmailMessage.isVisible();
  };

  isVisible = async () => {
    try {
      await this._page.waitForSelector(
        '[data-testid="txt_RecoveryEmailModalHeader"]',
        {
          state: 'visible',
          timeout: 5000,
        }
      );
      return true;
    } catch {
      return false;
    }
  };
}
