// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { memberSingleTestData, pbmUser } from '../../test-data';
import { test } from '../../fixtures/claim-alerts-fixture';

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
  waitUntilProgressBarDisappeared,
  claimAlertsMedicationTagsValidator,
  waitUntilOverlayLoadingDisappeared,
  page,
}) => {
  await test.step(
    `Generate Claim Link "${memberSingleTestData.planLinkScenario}" and Navigate to it`,
    async () => {
      const link = await generateClaimLink(
        person,
        memberSingleTestData.planLinkScenario
      );
      await waitUntilProgressBarDisappeared(async () => {
        await page.goto(link);
      });
    }
  );

  await test.step('Assert alternative medication savings', async () => {
    await claimAlertsMedicationTagsValidator(memberSingleTestData.tagsStatus);
  });

  await test.step('Validating Learn more PopUp and close', async () => {
    await recommendedAlternativesScreen.learnMore();
    await recommendedAlternativesScreen.closeLearnMore();
  });

  await test.step('Keep current prescription with a link', async () => {
    await waitUntilOverlayLoadingDisappeared(
      recommendedAlternativesScreen.keepCurrentPrescription
    );

    await expect(page).toHaveURL(memberSingleTestData.regExpCabinet);
  });
});
