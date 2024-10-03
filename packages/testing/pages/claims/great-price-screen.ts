// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class GreatPriceScreen {
  private readonly _page: Page;
  private readonly _greatPriceScreenDoneButton: Locator;
  private readonly _pharmacyHoursButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._greatPriceScreenDoneButton = this._page.locator(
      '[data-testid="greatPriceScreenDoneButton"]'
    );
    this._pharmacyHoursButton = this._page.locator(
      '[data-testid="expandableCardButton"]'
    );
  }

  collapseUncollapsePharmacyHours = () => this._pharmacyHoursButton.click();

  returnHome = () => this._greatPriceScreenDoneButton.click();

  getPrescribedMedicationDrugNameLocator = (drugName: string) =>
    this._page
      .getByTestId('prescribedMedication')
      .getByRole('heading', { name: `${drugName}` });

  getPrescribedMedicationPriceLocator = (drugPrice: string) =>
    this._page.getByTestId('prescriptionPriceContainer').getByText(drugPrice);

  getPharmacyInfoLocator = (pharmacyName: string) =>
    this._page.getByText(pharmacyName, { exact: true });
}
