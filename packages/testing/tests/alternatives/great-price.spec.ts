// Copyright 2022 Prescryptive Health, Inc.

import { test } from '../../fixtures/claim-alerts-fixture';
import { pbmUser } from '../../test-data';
import { expect } from '@playwright/test';
import {
  bestPriceGenericData,
  greatePriceData,
} from '../../test-data/great-price.test-data';

let person;
test.beforeAll(async ({ getPbmUser }) => {
  person = await getPbmUser(pbmUser);
});

test.beforeEach(async ({ login }) => {
  await login(person);
});

test.afterAll(async () => {
  await person?.unlock();
});

test('render GreatPriceScreen (generic) as expected @exec', async ({
  page,
  greatPriceScreen,
  waitUntilProgressBarDisappeared,
}) => {
  await test.step(`Navigating to ${bestPriceGenericData.url}`, () =>
    waitUntilProgressBarDisappeared(async () => {
      await page.goto(bestPriceGenericData.url);
    })
  );

  await test.step('Validating screen data', async () => {
    await expect(
      greatPriceScreen.getPrescribedMedicationDrugNameLocator(
        bestPriceGenericData.prescribedMedication.drugName
      )
    ).toBeVisible();

    await expect(
      greatPriceScreen.getPrescribedMedicationPriceLocator(
        bestPriceGenericData.prescribedMedication.price
      )
    ).toBeVisible();

    await expect(
      greatPriceScreen.getPharmacyInfoLocator(
        bestPriceGenericData.pharmacyInfo.name
      )
    ).toBeVisible();
  });
});

test('render GreatPriceScreen (brand) as expected @exec', async ({
  generateClaimLink,
  greatPriceScreen,
  page,
  waitUntilProgressBarDisappeared,
}) => {
  await test.step(
    `Generate Claim Link "${greatePriceData.scenario}" and Navigate to it`,
    async () => {
      const link = await generateClaimLink(person, greatePriceData.scenario);
      await waitUntilProgressBarDisappeared(async () => {
        await page.goto(link);
      });
    }
  );

  await test.step('Validating screen data', async () => {
    // 1° Collapse Pharmacy hours
    await greatPriceScreen.collapseUncollapsePharmacyHours();
    // 2° Uncollapse Pharmacy hours
    await greatPriceScreen.collapseUncollapsePharmacyHours();
    // 3° Validate Prescribed Medication rendered data
    await expect(
      greatPriceScreen.getPrescribedMedicationDrugNameLocator(
        greatePriceData.prescribedMedication.drugName
      )
    ).toBeVisible();

    await expect(
      greatPriceScreen.getPrescribedMedicationPriceLocator(
        greatePriceData.prescribedMedication.price
      )
    ).toBeVisible();

    await expect(
      greatPriceScreen.getPharmacyInfoLocator(greatePriceData.pharmacyInfo.name)
    ).toBeVisible();
  });
});
