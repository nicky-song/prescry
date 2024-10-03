// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class DigitalIdCardScreen {
  private _page: Page;
  private _phoneNumberMemberSupport: Locator;
  private _emailMemberSupport: Locator;

  constructor(page: Page) {
    this._page = page;
    this._phoneNumberMemberSupport = page.locator(
      '[data-testid="contactInfoPanelPhoneNumberInlineLink"]'
    );
    this._emailMemberSupport = page.locator(
      '[data-testid="supportEmailContent"]'
    );
  }

  clickPhoneNumber = async () => {
    await this._phoneNumberMemberSupport.click();
  };
}
