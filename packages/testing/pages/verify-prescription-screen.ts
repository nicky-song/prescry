// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class VerifyPrescriptionScreen {
  private _page: Page;
  private _prescriptionNumberInput: Locator;
  private _submitButton: Locator;
  private _cancelButton: Locator;

  constructor(page: Page) {
    this._page = page;

    this._prescriptionNumberInput = this._page.locator(
      '[data-testid="verifyPrescriptionScreenPrescriptionNumberTextInput"]'
    );
    this._submitButton = this._page.locator(
      '[data-testid="verifyPrescriptionScreenSubmitButton"]'
    );
    this._cancelButton = this._page.locator(
      '[data-testid="verifyPrescriptionScreenCancelButton"]'
    );
  }

  clickSubmitButton = async () => {
    await this._submitButton.click();
  };
}
