// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { pbmUser, createAccountPbmTestData } from '../../test-data';
import { test } from '../../fixtures/test-scoped-page-context-fixture';
import { UserService } from '../../services';
import { PbmUserType } from '../../types';

test.describe.configure({ mode: 'serial' });

let person: PbmUserType;
test.beforeEach(async ({ getPbmUser }) => {
  person = await getPbmUser(pbmUser, { withoutAccount: true });
});

test.describe(
  'Non matching person data when creating account for PBM user',
  () => {
    for (const wrongData in createAccountPbmTestData.badEntries) {
      test(`Bad person data ${JSON.stringify(
        createAccountPbmTestData.badEntries[wrongData]
      )} @exec`, async ({
        unauthHomePage,
        pbmMemberBenefitsPage,
        createAccountScreen,
        waitUntilOverlayLoadingDisappeared,
        page,
      }) => {
        const wrongPerson = {
          ...person,
          ...createAccountPbmTestData.badEntries[wrongData],
        };

        await test.step('Begin join employer plan', async () => {
          await unauthHomePage.goto();
          await unauthHomePage.joinEmployerPlanButtonClick();
        });
        await pbmMemberBenefitsPage.continue();

        await test.step('Fill fields with wrong account data', () =>
          createAccountScreen.fillAccountData(wrongPerson)
        );
        const responsePromise = page.waitForResponse(
          `https://${process.env.MY_PRESCRYPTIVE_URL}/api/members/verify`
        );
        await waitUntilOverlayLoadingDisappeared(() =>
          createAccountScreen.clickContinueButton()
        );
        const verifyResponse: { status: string } = await (
          await responsePromise
        ).json();
        expect(verifyResponse.status).toBe('failure');

        await expect(createAccountScreen.accountError()).toBeVisible();
        expect(await UserService.getPbmUser(wrongPerson)).toBeFalsy();
      });
    }
  }
);

test('Successful account created @exec', async ({
  unauthHomePage,
  pbmMemberBenefitsPage,
  createAccountScreen,
  homeScreen,
  oneTimePassword,
  createPin,
}) => {
  await test.step('Begin join employer plan', async () => {
    await unauthHomePage.goto();
    await unauthHomePage.joinEmployerPlanButtonClick();
  });
  await pbmMemberBenefitsPage.continue();

  await test.step('Fill fields with correct account data', () =>
    createAccountScreen.fillAccountData(person)
  );
  await oneTimePassword(person.phoneNumber, () =>
    createAccountScreen.clickContinueButton()
  );
  await createPin(person);

  expect(await homeScreen.avatarInitials()).toBe(pbmUser.initials);
  await expect(
    homeScreen.welcome(createAccountPbmTestData.welcomeName)
  ).toBeVisible();
});

test.afterEach(async () => await person?.unlock());
