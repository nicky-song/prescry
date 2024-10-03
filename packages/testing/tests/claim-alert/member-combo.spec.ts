// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { memberComboTestData, pbmUser } from '../../test-data';
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
  claimAlertsMedicationTagsValidator,
  generateClaimLink,
  page,
  recommendedAlternativesScreen,
  waitUntilProgressBarDisappeared,
  waitUntilOverlayLoadingDisappeared,
}) => {
  await test.step(
    `Generate Claim Link "${memberComboTestData.planLinkScenario}" and Navigate to it`,
    async () => {
      const link = await generateClaimLink(
        person,
        memberComboTestData.planLinkScenario
      );
      await waitUntilProgressBarDisappeared(async () => {
        await page.goto(link);
      });
    }
  );

  await test.step('Assert alternative medication savings', async () => {
    await claimAlertsMedicationTagsValidator(memberComboTestData.tagsStatus);
  });

  await test.step('Validating Learn more PopUp and close', async () => {
    await recommendedAlternativesScreen.learnMore();
    await recommendedAlternativesScreen.closeLearnMore();
  });

  await test.step('Keep current prescription with a link', async () => {
    await waitUntilOverlayLoadingDisappeared(
      recommendedAlternativesScreen.keepCurrentPrescription
    );

    await expect(page).toHaveURL(memberComboTestData.regExpCabinet);
  });
});
