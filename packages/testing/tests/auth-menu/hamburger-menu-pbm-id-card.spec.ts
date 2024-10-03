// Copyright 2023 Prescryptive Health, Inc.

import { test } from '../../fixtures/base-fixtures';
import { menuPBMIdCardTestData, pbmUser } from '../../test-data';
import { expect } from '@playwright/test';

test.setTimeout(120000);

let person;
test.beforeEach(async ({ getPbmUser, login }) => {
  person = await getPbmUser(pbmUser);
  await login({
    phoneNumberDialingCode: pbmUser.phoneNumberDialingCode,
    phoneNumber: pbmUser.phoneNumber,
    pin: pbmUser.pin,
  });
});

test.describe('Auth menu hamburger PBM Id Card', () => {
  test('PBM Id Card Phone Number option @exec', async ({
    authHomePage,
    digitalIdCardScreen,
    page,
  }) => {
    // Go to Member Id Card
    await authHomePage.memberIdCard();

    // Wait for the request after click in phone number option
    const request = await Promise.all([
      page.waitForRequest(/tel:.*/),
      await digitalIdCardScreen.clickPhoneNumber(),
    ]);

    // Validate the request of the phone number
    expect(
      request[0].url(),
      'The request has not been executed on the member service telephone number.'
    ).toBe(menuPBMIdCardTestData.phoneNumberMemberSupport);
  });

  test('PBM Id Card Email option @exec', async ({ authHomePage, page }) => {
    // Go to Member Id Card
    await authHomePage.memberIdCard();

    // Validate the link email of the Member support it is visible
    await expect(
      page.getByRole('link', {
        name: menuPBMIdCardTestData.emailMemberSupport,
      }),
      'Link email of the Member support it is not visible'
    ).toBeVisible();
  });
});

test.afterEach(() => {
  person?.unlock();
});
