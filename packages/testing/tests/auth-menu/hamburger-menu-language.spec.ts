// Copyright 2023 Prescryptive Health, Inc.

import { test } from '../../fixtures/base-fixtures';
import { primaryUserDrugSearch, languagesToTest } from '../../test-data';
import { languageConstants } from '../../utilities';
import { expect } from '@playwright/test';

let lock;

let isoStartLanguage;
test.beforeEach(async ({ getCashUser, login, page, baseURL }) => {
  // Setting start language of the test data
  const startLanguage =
    languagesToTest.find((lang) => lang.defaultLanguage)?.language ?? '';

  // Getting start language ISO
  isoStartLanguage = languageConstants.find(
    (lang) => lang.language === startLanguage
  )?.codeIso;

  lock = await getCashUser(primaryUserDrugSearch);

  // Login with the User Drug Search credentials
  await login({
    phoneNumberDialingCode: primaryUserDrugSearch.phoneNumberDialingCode,
    phoneNumber: primaryUserDrugSearch.phoneNumber,
    pin: primaryUserDrugSearch.pin,
  });

  // Go to home with the start language
  const RedictWithStartLanguage = `${baseURL}/?lang=${isoStartLanguage}`;
  await page.goto(RedictWithStartLanguage);
});

languagesToTest
  .filter((lang) => lang.defaultLanguage === undefined)
  .forEach((language) => {
    test(`Language to change ${language.language} @exec`, async ({
      page,
      selectLanguageScreen,
    }) => {
      const languageToChange = language.language;

      // Getting current language ISO
      const currentIso = languageConstants.find(
        (lang) => lang.language === languageToChange
      )?.codeIso;

      // Go to select language
      await selectLanguageScreen.goToLanguageSetting();

      // Validate Iso code is not undefined
      expect(currentIso, 'Iso language not found').toBeDefined();

      // Change language by
      await selectLanguageScreen.changeLanguage(languageToChange);

      // Validate the new language on the page
      await expect(page).toHaveURL(`/?lang=${currentIso}`);
    });
  });

test.afterEach(() => lock?.unlock());
