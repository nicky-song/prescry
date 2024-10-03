// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class FindLocationScreen {
  private _page: Page;
  private _locationInput: Locator;
  private _locationFirstItemInput: Locator;
  private _locationApplyButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._locationInput = this._page.locator(
      '[data-testid="locationTextInput"]'
    );
    this._locationApplyButton = this._page.locator(
      '[data-testid="findLocationScreenApplyButton"]'
    );
  }

  enterLocationCodeToSearch = async (locationCode: string) => {
    await this._locationInput.fill(locationCode);
  };

  clickFirstItemLocationCodeSearch = async () => {
    this._locationFirstItemInput = this._page
      .locator('[data-testid^="locationAutocompleteInput-"]')
      .first();
    await this._locationFirstItemInput.click();
  };

  clickApplyLocationCode = async () => {
    await this._locationApplyButton.click();
  };
}
