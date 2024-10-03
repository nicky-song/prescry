// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class PharmacyLocationsScreen {
  private _page: Page;
  private _searchButton: Locator;
  private _zipCodeInput: Locator;

  constructor(page: Page) {
    this._page = page;
    this._zipCodeInput = this._page.locator(
      '[data-testid="pharmacyLocationsSearchBox-inputTextInput"]'
    );
    this._searchButton = this._page.locator(
      '[data-testid="pharmacyLocationsSearchBox-search"]'
    );
  }

  searchByZipCode = async (zipCode: number) => {
    await this._zipCodeInput.fill(zipCode.toString());
    await this._searchButton.click();
  };

  selectProvider = async (providerIdentifier: string) => {
    const providerButton = this._page.locator(
      `[data-testid="pharmacySearchResultItem-${providerIdentifier}"]`
    );
    await providerButton.click();
  };
}
