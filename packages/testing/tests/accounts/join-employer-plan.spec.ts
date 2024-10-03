// Copyright 2023 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import {
  generateCashUser,
  resetAccount,
  benefitGenerator,
} from '../../utilities';
import { test } from '../../fixtures/test-scoped-page-context-fixture';
import { pbmUser, joinEmployerPlanTestData } from '../../test-data';

test.describe.configure({ mode: 'serial' });

let person;
let lock;

test.beforeAll(async ({ waitForAccount }) => {
  lock = await waitForAccount(pbmUser.phoneNumber, false);
  await test.step('Reset account', () =>
    resetAccount({
      number: pbmUser.phoneNumber,
      countryCode: pbmUser.countryCode,
    })
  );
  person = await test.step('Generate benefit', () => benefitGenerator());
  await test.step('Generate cash user', () =>
    generateCashUser({ ...person, ...pbmUser })
  );
});

test.beforeEach(async ({ login }) => {
  await login({ ...pbmUser, phoneNumberDialingCode: pbmUser.countryCode });
});

test.afterAll(async () => {
  await lock?.unlock();
});

test.describe('Authenticated user join employer plan', () => {
  test('Wrong member Id @exec', async ({
    homeScreen,
    loginScreen,
    page,
    waitUntilOverlayLoadingDisappeared,
  }) => {
    await homeScreen.goToJoinEmployerPlan();
    await loginScreen.fillMemberId(joinEmployerPlanTestData.badMemberId);
    await expect(loginScreen.firstName()).toHaveValue(
      joinEmployerPlanTestData.upperCaseInitial.firstName
    );
    await expect(loginScreen.lastName()).toHaveValue(
      joinEmployerPlanTestData.upperCaseInitial.lastName
    );
    await expect
      .poll(() => loginScreen.dateOfBirth())
      .toStrictEqual(pbmUser.dateOfBirth);

    await waitUntilOverlayLoadingDisappeared(loginScreen.joinMember);

    const [request] = await Promise.all([
      page.waitForRequest(/tel:.*/),
      loginScreen.memberSupport(),
    ]);
    expect(request.url()).toBe(joinEmployerPlanTestData.contactUs.uri);
  });

  test('Successful @exec', async ({ homeScreen, loginScreen, page }) => {
    await homeScreen.goToJoinEmployerPlan();

    await loginScreen.fillMemberId(person.primaryMemberRxId);
    await expect(loginScreen.firstName()).toHaveValue(
      joinEmployerPlanTestData.upperCaseInitial.firstName
    );
    await expect(loginScreen.lastName()).toHaveValue(
      joinEmployerPlanTestData.upperCaseInitial.lastName
    );
    await expect
      .poll(() => loginScreen.dateOfBirth())
      .toStrictEqual(pbmUser.dateOfBirth);

    const responsePromise = page.waitForResponse(
      `https://${process.env.MY_PRESCRYPTIVE_URL}/api/members`
    );
    await loginScreen.joinMember();
    const membersRequestResponse = await responsePromise;

    expect(membersRequestResponse.ok).toBeTruthy();
  });
});
