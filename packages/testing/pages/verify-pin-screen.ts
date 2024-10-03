// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class VerifyPinScreen {
  private _page: Page;
  private _confirmPinButton: Locator;
  private _backPinKey: Locator;
  private _pinErrorMessage: Locator;

  constructor(page: Page) {
    this._page = page;
    this._confirmPinButton = this._page.getByTestId('verifyPinNextButton');
    this._backPinKey = this._page.getByTestId(
      'verifyPinScreenContainerPinKeyPadContainerBackSpaceButton'
    );
    this._pinErrorMessage = this._page.getByTestId(
      'verifyPinScreenContainerPrimaryTextBox'
    );
  }

  enterPin = async (pin: string) => {
    for (const number of pin) {
      const pinKeyPad = this._page.getByTestId(
        `verifyPinScreenContainerPinKeyPadContainer-pinKeypadCircle${number}`
      );
      await pinKeyPad.click();
    }
  };

  clearPin = async () => {
    for (let number = 0; number < 4; number++) {
      await this._backPinKey.click();
    }
  };

  get pinErrorMessageLocator() {
    return this._pinErrorMessage;
  }

  getValidationMessage = () => {
    return this._page.locator(
      'div[data-testid="verifyPinScreenContainerPrimaryTextBox"]'
    );
  };

  clickVerifyButton = async () => {
    await this._confirmPinButton.click();
  };
}
