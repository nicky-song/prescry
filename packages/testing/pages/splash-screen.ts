// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page, expect } from '@playwright/test';

export class SplashScreen {
  private readonly _page: Page;
  private readonly _imageBackground: Locator;

  constructor(page: Page) {
    this._page = page;
    this._imageBackground = this._page.locator(
      '[data-testid="splashScreenImageBackground"]'
    );
  }

  waitUntilContentIsShown = (timeoutForProgressBarToDisappear = 10 * 1000) =>
    expect.soft(this._imageBackground).toBeVisible({
      timeout: timeoutForProgressBarToDisappear,
    });

  waitUntilContentIsHidden = (timeoutForProgressBarToDisappear = 40 * 1000) =>
    expect(this._imageBackground).toBeHidden({
      timeout: timeoutForProgressBarToDisappear,
    });
}
