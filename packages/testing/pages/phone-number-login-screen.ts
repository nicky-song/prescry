// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class PhoneNumberLoginScreen {
  private _page: Page;
  private _termsAndConditionsTouchable: Locator;
  private _phoneNumberInput: Locator;
  private _continueButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._termsAndConditionsTouchable = page.locator(
      '[data-testid="termsAndConditionsCheckLinkCheckBoxTouchable"]'
    );
    this._phoneNumberInput = page.locator(
      '[data-testid="phoneNumberLoginPhoneMaskInputTextInput"]'
    );
    this._continueButton = page.locator(
      '[data-testid="phoneNumberLoginNextButton"]'
    );
  }

  fillPhoneNumber = async (phoneNumber: string) => {
    await this._phoneNumberInput.fill(phoneNumber);
  };

  acceptTermsAndConditions = async () => {
    await this._termsAndConditionsTouchable.click({
      position: { x: 0, y: 0 },
    });
  };

  continueWithLogin = async () => {
    await this._continueButton.click();
  };
}
