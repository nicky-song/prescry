// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class ClaimExperienceScreen {
  private readonly _page: Page;
  private readonly _claimExperienceScreen: Locator;

  constructor(page: Page) {
    this._page = page;
    this._claimExperienceScreen = this._page.locator(
      '[data-testid="claimExperienceScreen"]'
    );
  }

  waitUntilContentIsHidden = async () => {
    await this._claimExperienceScreen.waitFor({
      state: 'hidden',
      timeout: 30000,
    });
  };
}
