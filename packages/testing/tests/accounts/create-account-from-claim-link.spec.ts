// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { pbmUser, createAccountFromClaimLinkData } from '../../test-data';
import { test } from '../../fixtures/claim-alerts-fixture';
import { PbmUserType } from '../../types';

let person: PbmUserType;
let link: string;
test.beforeEach(async ({ getPbmUser, generateClaimLink }) => {
  person = await getPbmUser(pbmUser, { withActivationPhone: true });
  link = await generateClaimLink(person, 'greatPrice');
});

test.describe.serial('Create pbm account via claim alert id', () => {
  test(`Bad person data @exec`, async ({
    page,
    loginScreen,
    oneTimePassword,
  }) => {
    const wrongPerson = {
      ...person,
      ...createAccountFromClaimLinkData.badEntries,
    };
    await page.goto(link);
    await test.step('Complete One Time Password', () =>
      oneTimePassword(person.phoneNumber)
    );
    await test.step('Fill fields with wrong account data', () =>
      loginScreen.fillMemberData(wrongPerson)
    );
    await loginScreen.confirmMemberCreation();
  });

  test('Successful account created @exec', async ({
    page,
    loginScreen,
    greatPriceScreen,
    oneTimePassword,
    createPin,
  }) => {
    await page.goto(link);
    await test.step('Complete One Time Password', () =>
      oneTimePassword(person.phoneNumber)
    );
    await test.step('Fill with correct account data', () =>
      loginScreen.fillMemberData(person)
    );
    await loginScreen.confirmMemberCreation();
    await createPin(person);

    await expect(
      greatPriceScreen.getPrescribedMedicationDrugNameLocator(
        createAccountFromClaimLinkData.prescribedMedication.drugName
      ),
      'Expect drug name to be visible'
    ).toBeVisible();

    await expect(
      greatPriceScreen.getPrescribedMedicationPriceLocator(
        createAccountFromClaimLinkData.prescribedMedication.price
      ),
      'Expect price to be visible'
    ).toBeVisible();

    await expect(
      greatPriceScreen.getPharmacyInfoLocator(
        createAccountFromClaimLinkData.pharmacyInfo.name
      ),
      'Expect pharmacy name to be visible'
    ).toBeVisible();
  });
});

test.afterEach(async () => await person?.unlock());
