// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class LoginPinScreen {
  private _page: Page;
  private _confirmPinButton: Locator;
  private _forgotPinButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._confirmPinButton = this._page.locator(
      '[data-testid="loginPinScreenLoginButton"]'
    );
    this._forgotPinButton = this._page.locator('[data-testid="forgotPinText"]');
  }

  enterPin = async (pin: string) => {
    for (const number of pin) {
      const pinKeyPad = this._page.locator(
        `[data-testid="loginPinScreenContainerPinKeyPadContainer-pinKeypadCircle${number}"]`
      );

      await pinKeyPad.click();
    }
  };

  login = async () => {
    await this._confirmPinButton.click();
  };

  forgotPin = async () => {
    await this._forgotPinButton.click();
  };
}
