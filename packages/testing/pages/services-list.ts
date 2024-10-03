// Copyright 2022 Prescryptive Health, Inc.

import { Page } from '@playwright/test';

export class ServicesList {
  private _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  selectService = async (serviceType: string) => {
    const service = this._page.getByTestId(
      `servicesListBookTestCard-${serviceType}`
    );
    await service.click();
  };
}
