// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class VerifyIdentitySendCodeScreen {
  private _page: Page;
  private _continueButton: Locator;
  private _selectRadioButtonOption: Locator;

  constructor(page: Page) {
    this._page = page;
    this._continueButton = this._page.locator(
      '[data-testid="verifyIdentitySendCodeScreenBaseButtonContinue"]'
    );
  }

  selectRadioButtonByOption = async (option: number) => {
    this._selectRadioButtonOption = this._page
      .locator(`[data-testid^="radioButtonToggleRadioButton-"]`)
      .nth(option);
    await this._selectRadioButtonOption.click();
  };

  clickContinueButton = async () => {
    await this._continueButton.click();
  };
}
