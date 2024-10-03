// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page, expect } from '@playwright/test';

export class LoadingOverlay {
  private _page: Page;
  private _overlayContentView: Locator;

  constructor(page: Page) {
    this._page = page;
    this._overlayContentView = this._page.locator(
      '[data-testid="overlay-content"]'
    );
  }

  waitUntilContentIsShown = (timeout?: number) =>
    expect(this._overlayContentView).toBeVisible({
      timeout,
    });

  waitUntilContentIsHidden = (timeout = 40 * 1000) =>
    expect(this._overlayContentView).toBeHidden({
      timeout,
    });
}
