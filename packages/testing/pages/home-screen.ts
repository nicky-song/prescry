// Copyright 2022 Prescryptive Health, Inc.

import { Locator, Page } from '@playwright/test';

export class HomeScreen {
  private readonly _page: Page;
  private readonly saveYourMedicationsItem: Locator;
  private readonly popUpModal: Locator;
  private readonly homeScreenSearchButton: Locator;
  private readonly testResultsItem: Locator;
  private readonly profileAvatar: Locator;
  private readonly covid19ServicesFeedItem: Locator;
  private readonly joinEmployerPlanFeedItem: Locator;

  constructor(page: Page) {
    this._page = page;
    this.saveYourMedicationsItem = page.locator(
      '[data-testid="homeFeedItem-cashIdCard"]'
    );
    this.homeScreenSearchButton = page.locator(
      '[data-testid="homeScreenSearchButton"]'
    );
    this.testResultsItem = page.locator(
      '[data-testid="homeFeedItem-testResults"]'
    );
    this.profileAvatar = page.locator('[data-testid="ProfileAvatar"]');
    this.covid19ServicesFeedItem = page.getByTestId(
      'homeFeedItem-scheduleTestAll'
    );
    this.popUpModal = page.getByTestId('homeScreenPopupModalPrimaryButton');
    this.joinEmployerPlanFeedItem = page.getByTestId(
      'homeFeedItem-addMembershipFeedItem'
    );
  }

  isAvatarVisible = () => this.profileAvatar.isVisible();

  welcome(firstName: string) {
    return this._page.locator('h1', { hasText: firstName });
  }

  avatarInitials() {
    return this.profileAvatar.textContent();
  }

  waitFor = () => this.homeScreenSearchButton.waitFor();

  // GO TO SAVE ON MEDICATIONS
  async goToSaveOnMedications() {
    await this.saveYourMedicationsItem.click();
  }

  goToJoinEmployerPlan = () => this.joinEmployerPlanFeedItem.click();

  selectFeedOption = async (feedCode: string) => {
    const feedItem = this._page.getByTestId(`homeFeedItem-${feedCode}`);
    await feedItem.click();
  };

  goToTestResults = () => this.testResultsItem.click();

  goToCovid19Services = () => this.covid19ServicesFeedItem.click();

  goToFindMedication = () => this.homeScreenSearchButton.click();

  getHomeScreenSearchButton = () => {
    return this.homeScreenSearchButton;
  };
  getPopUpModalLocator = () => {
    return this.popUpModal;
  };
}
