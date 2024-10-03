// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class CreatePinScreen {
  private _page: Page;
  private _confirmPinButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._confirmPinButton = this._page.locator(
      '[data-testid="createPinNextButton"]'
    );
  }

  enterPin = async (pin: string) => {
    for (const number of pin) {
      const pinKeyPad = this._page.locator(
        `[data-testid="createPinScreenContainerPinKeyPadContainer-pinKeypadCircle${number}"]`
      );

      await pinKeyPad.click();
    }
  };

  clickNextButton = async () => {
    await this._confirmPinButton.click();
  };
}
