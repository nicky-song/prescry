// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class PbmMemberBenefitsPage {
  private readonly page: Page;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.locator(
      '[data-testid="pbmMemberBenefitsScreenContinueButton"]'
    );
  }

  async continue() {
    await this.continueButton.click();
  }
}
