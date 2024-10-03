// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

type CardData = {
  number: number;
  Cvc: number;
  expiryDate: { twoDigitsMonth: string; twoDigitsYear: string };
  nameOnCard: string;
};

export class StripeCheckoutScreen {
  private _page: Page;
  private _emailInput: Locator;
  private _cardNumberInput: Locator;
  private _cardExpiryInput: Locator;
  private _cardCvcInput: Locator;
  private _nameOnCardInput: Locator;
  private _countrySelect: Locator;
  private _confirmCheckoutButton: Locator;
  private _countryZipCodeInput: Locator;

  constructor(page: Page) {
    this._page = page;
    this._emailInput = page.locator('xpath=//input[@id="email"]');
    this._cardNumberInput = page.locator('xpath=//input[@id="cardNumber"]');
    this._cardExpiryInput = page.locator('xpath=//input[@id="cardExpiry"]');
    this._cardCvcInput = page.locator('xpath=//input[@id="cardCvc"]');
    this._nameOnCardInput = page.locator('xpath=//input[@name="billingName"]');
    this._countrySelect = page.locator('xpath=//select[@id="billingCountry"]');
    this._confirmCheckoutButton = page.locator(
      'xpath=//button[@data-testid="hosted-payment-submit-button"]'
    );
    this._countryZipCodeInput = page.locator(
      'xpath=//input[@id="billingPostalCode"]'
    );
  }

  fillEmail = async (email: string) => {
    await this._emailInput.fill(email);
  };

  fillCardData = async (cardData: CardData) => {
    await this._cardNumberInput.fill(cardData.number.toString());
    await this._cardCvcInput.fill(cardData.Cvc.toString());
    await this._cardExpiryInput.fill(
      `${cardData.expiryDate.twoDigitsMonth}/${cardData.expiryDate.twoDigitsYear}`
    );
    await this._nameOnCardInput.fill(cardData.nameOnCard);
  };

  selectCountry = async (countryAbbreviation: string) => {
    await this._countrySelect.selectOption({
      value: `${countryAbbreviation}`,
    });
  };

  fillZipCode = async (zipCode: string) => {
    await this._countryZipCodeInput.fill(zipCode);
  };

  confirmPayment = async () => {
    (await this._confirmCheckoutButton.isEnabled()) &&
      (await this._confirmCheckoutButton.click());
  };
}
