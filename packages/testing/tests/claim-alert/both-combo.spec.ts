// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../fixtures/claim-alerts-fixture';
import { bothComboTestData, pbmUser } from '../../test-data';

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

test('Keep current prescription @exec', async ({
  generateClaimLink,
  recommendedAlternativesScreen,
  page,
  waitUntilProgressBarDisappeared,
  claimAlertsMedicationTagsValidator,
  waitUntilOverlayLoadingDisappeared,
}) => {
  await test.step(
    `Generate Claim Link "${bothComboTestData.planLinkScenario}" and Navigate to it`,
    async () => {
      const link = await generateClaimLink(
        person,
        bothComboTestData.planLinkScenario
      );
      await waitUntilProgressBarDisappeared(async () => {
        await page.goto(link);
      });
    }
  );

  await test.step('Assert alternative medication savings', async () => {
    await claimAlertsMedicationTagsValidator(bothComboTestData.tagsStatus);
  });

  await test.step('Validating Learn more PopUp and close', async () => {
    await recommendedAlternativesScreen.learnMore();
    await recommendedAlternativesScreen.closeLearnMore();
  });

  await test.step('Keep current prescription', async () => {
    await waitUntilOverlayLoadingDisappeared(
      recommendedAlternativesScreen.keepCurrentPrescription
    );

    await expect(page).toHaveURL(bothComboTestData.regExpCabinet);
  });
});
