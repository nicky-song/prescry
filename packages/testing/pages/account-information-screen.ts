// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class AccountInformationScreen {
  private _page: Page;
  private _editEmailButtonIcon: Locator;
  private _editPinButtonIcon: Locator;
  private _accountInfoEditEmailInput: Locator;
  private _accountInfoSaveButton: Locator;
  private _accountInfoCancelButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._editEmailButtonIcon = this._page.locator(
      '[data-testid="editEmailButtonIcon"]'
    );
    this._editPinButtonIcon = this._page.locator(
      '[data-testid="editPinButtonIcon"]'
    );
    this._accountInfoEditEmailInput = this._page.locator(
      '[data-testid="accountInfoEditEmail"] input'
    );
    this._accountInfoSaveButton = this._page.locator(
      '[data-testid="accountInformationScreenBaseButtonSave"]'
    );
    this._accountInfoCancelButton = this._page.locator(
      '[data-testid="accountInformationScreenSecondaryButtonCancel"]'
    );
  }

  async clickEmailIcon() {
    await this._editEmailButtonIcon.click();
  }

  async clearAndFillEmailInput(newEmail: string) {
    await this._accountInfoEditEmailInput.click();
    await this._accountInfoEditEmailInput.clear();
    await this._accountInfoEditEmailInput.fill(newEmail);
  }

  clickEditPinIcon = async () => {
    await this._editPinButtonIcon.click();
  };

  saveChanges = async () => {
    await this._accountInfoSaveButton.click();
  };
}
