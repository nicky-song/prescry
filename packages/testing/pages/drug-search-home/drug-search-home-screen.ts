// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class DrugSearchHomeScreen {
  private _page: Page;
  private _drugSearchTextInput: Locator;
  private _firstItemDrugNameInput: Locator;

  constructor(page: Page) {
    this._page = page;
    this._drugSearchTextInput = this._page.locator(
      '[data-testid="searchForDrugsTextInputTextInput"]'
    );
  }

  selectFirstItemDrugName = async () => {
    this._firstItemDrugNameInput = this._page
      .locator(`[data-testid^="listItemDrugNameButton-"]`)
      .first();
    await this._firstItemDrugNameInput.click();
  };

  enterDrugNameToSearch = async (drugName: string) => {
    await this._drugSearchTextInput.fill(drugName);
  };
}
