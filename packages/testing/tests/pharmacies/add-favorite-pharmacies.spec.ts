// Copyright 2023 Prescryptive Health, Inc.

import { test } from '../../fixtures/base-fixtures';
import { addFavoritedPharmaciesTestData } from '../../test-data';
import { expect } from '@playwright/test';
import { AccountService } from '../../services';

test.setTimeout(120000);
test.describe.configure({ mode: 'serial' });

let lock;
test.beforeEach(async ({ getCashUser, login }) => {
  lock = await getCashUser(addFavoritedPharmaciesTestData.user, true);
  await login(addFavoritedPharmaciesTestData.user);
});

test.describe.serial('Add favorite pharmacy with login', () => {
  test.beforeEach(async ({ appSettings, page }) => {
    const { token, deviceToken } = await appSettings();
    await expect
      .poll(
        async () => {
          const favorited = await test.step('Get favorited pharmacies', () =>
            AccountService.getFavoritedPharmacies({
              token,
              deviceToken,
            })
          );
          if (favorited?.data?.favoritedPharmacies?.length === 0) {
            return true;
          }
          await test.step('Set empty favorited pharmacies', () =>
            AccountService.setFavoritedPharmacies({
              favoritedPharmacies:
                addFavoritedPharmaciesTestData.emptyFavoritedPharmacies,
              token,
              deviceToken,
            })
          );
          await page.goto('/');
          return false;
        },
        {
          message: 'Remove existing favorite pharmacies before test',
          timeout: 10000,
          intervals: [100, 200, 400, 800],
        }
      )
      .toBeTruthy();
  });

  test('Find and add new favorite pharmacy @exec', async ({
    page,
    drugSearchHomeScreen,
    homeScreen,
    findLocationScreen,
    pickAPharmacy,
    whatComesNextScreen,
    favoritePharmacyScreen,
  }) => {
    await homeScreen.goToFindMedication();

    // Drug Search Home Page
    await drugSearchHomeScreen.enterDrugNameToSearch(
      addFavoritedPharmaciesTestData.drugName
    );
    await drugSearchHomeScreen.selectFirstItemDrugName();

    // Drug Search Pick A Pharmacy Page - Go to Find Location Page
    const locationButton = page.locator('[data-testid="locationButton"]');
    await locationButton.click();

    // Find Location Page
    await findLocationScreen.enterLocationCodeToSearch(
      addFavoritedPharmaciesTestData.locationCode
    );
    await findLocationScreen.clickFirstItemLocationCodeSearch();
    await findLocationScreen.clickApplyLocationCode();

    // Get the first Prescription ValueCard - Pick a Pharmacy
    const idPharmacy =
      await pickAPharmacy.getIdPharmacyselectPrescriptionValueCardFirstItem();

    // Add favorite pharmacy
    await whatComesNextScreen.setUnsetFavoritePharmacy();

    // Check favorite pharmacy save message is visible
    await expect(
      pickAPharmacy.getMessageSaveFavoritePharmacy(),
      'Add favorite pharmacy failed'
    ).toBeVisible({ timeout: 10000 });

    // Go to Favorite Pharmacy Screen
    await whatComesNextScreen.goToFavoritePharmacies();

    // Check favorite pharmacy card first item is visible
    await expect(
      favoritePharmacyScreen.getFavoritePharmacyCardByTestId(idPharmacy),
      'Pharmacy card do not exist.'
    ).toBeVisible();
  });
});

test.describe.serial('Remove pharmacy from favorite with login', () => {
  test.beforeEach(async ({ appSettings, page }) => {
    const { token, deviceToken } = await appSettings();
    await expect
      .poll(
        async () => {
          const favorited = await test.step('Get favorited pharmacies', () =>
            AccountService.getFavoritedPharmacies({
              token,
              deviceToken,
            })
          );
          if (favorited?.data?.favoritedPharmacies?.length > 0) {
            return true;
          }
          await test.step('Set favorited pharmacy', () =>
            AccountService.setFavoritedPharmacies({
              favoritedPharmacies:
                addFavoritedPharmaciesTestData.favoritedPharmacies,
              token,
              deviceToken,
            })
          );
          await page.goto('/');
          return false;
        },
        {
          message: 'Add a favorited pharmacy before the test',
          timeout: 10000,
          intervals: [100, 200, 400, 800],
        }
      )
      .toBeTruthy();
  });

  test('Remove first pharmacy from favorite @exec', async ({
    authHomePage,
    pickAPharmacy,
    favoritePharmacyScreen,
  }) => {
    // Go to Favorite Pharmacy Screen
    await authHomePage.goToFavoritePharmacies();

    // Remove the first pharmacy
    await favoritePharmacyScreen.removeFirstFavoritePharmacy();

    // Check favorite pharmacy remove message is visible
    await expect(
      pickAPharmacy.getMessageRemoveFavoritePharmacy(),
      'Remove favorite pharmacy failed'
    ).toBeVisible();
  });
});

test.afterEach(() => lock?.unlock());
