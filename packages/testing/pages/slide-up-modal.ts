// Copyright 2023 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export abstract class SlideUpModal {
  private readonly _page: Page;
  private readonly _modalCloseButton: Locator;
  protected readonly _container: Locator;

  constructor(page: Page) {
    this._page = page;
    this._modalCloseButton = this._page.locator(
      '[data-testid="modalCloseButton"]'
    );
    this._container = this._page.locator(
      '[data-testid="slideUpModalContentContainer"]'
    );
  }

  close = async () => {
    await this._modalCloseButton.click();
  };
}
