// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class PickAPharmacy {
  private _page: Page;
  private _prescriptionValueCardFirstItem: Locator;
  private _locationButton: Locator;
  private _favoritedPharmacyNotification: Locator;
  private _unFavoritedPharmacyNotification: Locator;

  constructor(page: Page) {
    this._page = page;
    this._prescriptionValueCardFirstItem = this._page
      .locator('[data-testid^="prescriptionValueCard"]')
      .first();
    this._favoritedPharmacyNotification = this._page.locator(
      '[data-testid="favoritedPharmacyNotificationBaseNotification"]'
    );
    this._unFavoritedPharmacyNotification = this._page.locator(
      '[data-testid="unFavoritedPharmacyNotificationBaseNotification"]'
    );
    this._locationButton = this._page.locator('[data-testid="locationButton"]');
  }

  getIdPharmacyselectPrescriptionValueCardFirstItem = async () => {
    const testIDPrescriptionValueCard =
      await this._prescriptionValueCardFirstItem.getAttribute('data-testid');
    const idPharmacy = testIDPrescriptionValueCard?.split('-').pop();
    await this._prescriptionValueCardFirstItem.click();
    return idPharmacy ?? '';
  };

  getMessageSaveFavoritePharmacy = () => {
    return this._favoritedPharmacyNotification;
  };

  getMessageRemoveFavoritePharmacy = () => {
    return this._unFavoritedPharmacyNotification;
  };

  getPharmacyselectPrescriptionValueCardFirstItem = async () => {
    await this._prescriptionValueCardFirstItem.click();
  };

  clickLocationButton = async () => {
    await this._locationButton.click();
  };
}
