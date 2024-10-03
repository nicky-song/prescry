// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { resetAccount } from '../../utilities';
import { test } from '../../fixtures/appointment-fixtures';
import { waitForAccountInDatabase } from '../test-partials/wait-for-account-in-database';
import { convertToAppointmentQuestion } from '../../mappers';
import { appointmentCreationFreeServiceTestData } from '../../test-data';

test.setTimeout(3 * 60 * 1000);
const { automationProviderService, member } =
  appointmentCreationFreeServiceTestData;

let lock: { unlock: () => Promise<void> };
test.beforeEach(async ({ waitForAccount }) => {
  const { phoneNumber, phoneNumberDialingCode } = member;
  lock = await waitForAccount(phoneNumber, false);
  await test.step('Reset account', () =>
    resetAccount({
      countryCode: phoneNumberDialingCode,
      number: phoneNumber,
    })
  );
});

test.afterEach(async () => await lock?.unlock());

test('From Service Booking including Appointment creation for COVID19 antigen test @exec', async ({
  appointmentScreen,
  unauthHomePage,
  homeScreen,
  servicesList,
  pharmacyLocationsScreen,
  page,
  waitUntilOverlayLoadingDisappeared,
  loginScreen,
  bookAppointmentSlot,
  oneTimePassword,
  createPin,
}) => {
  await test.step('Go to book a Clinical service', async () => {
    await unauthHomePage.goto();
    await unauthHomePage.bookClinicalService();
  });

  await oneTimePassword(member.phoneNumber);

  // Create the Account
  await test.step('Set personal user data', async () => {
    await loginScreen.fillMemberData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      dateOfBirth: new Date(member.dateOfBirth),
    });
  });

  // Wait until Account gets created
  await waitUntilOverlayLoadingDisappeared(loginScreen.confirmMemberCreation);

  const account = {
    ...member,
    countryCode: member.phoneNumberDialingCode,
  };
  await waitForAccountInDatabase(account, page, true);

  // Creates PIN
  await createPin({
    phoneNumberDialingCode: member.phoneNumberDialingCode,
    phoneNumber: member.phoneNumber,
    pin: member.pin,
  });

  // Schedule COVID-19 test
  await test.step('Select the service', async () => {
    await homeScreen.goToCovid19Services();

    await servicesList.selectService(automationProviderService.service.type);
  });

  // Search and select Automation Provider
  // Wait until Providers are shown
  await waitUntilOverlayLoadingDisappeared(() =>
    pharmacyLocationsScreen.searchByZipCode(automationProviderService.zip)
  );

  // Initiate Slot Appointment selection
  await bookAppointmentSlot(
    automationProviderService.identifier,
    automationProviderService.service.type,
    {
      searchCondition: 'greaterOrEqualThan',
      timeFromProviderTimeZone: { hours: 6, minutes: 30 },
    }
  );

  await test.step(
    'Fill address and select an appointment for myself',
    async () => {
      await appointmentScreen.fillMemberAddress(member.address);
      await appointmentScreen.selectAppointmentForMyself();
    }
  );

  await test.step(
    'Answer general, regional, and pharmacy appointment service questions',
    async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Object is possibly 'null'.
      for (const qa of automationProviderService.service.answers) {
        const appointmentQuestion = convertToAppointmentQuestion(qa);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await appointmentScreen.answerQuestion(appointmentQuestion as any);
      }
    }
  );

  await test.step(
    'Accept terms and conditions and finish appointment creation',
    async () => {
      await appointmentScreen.acceptTermsAndConditions();

      const createBookingResponsePromise = page.waitForResponse(
        '**/api/provider-location/create-booking',
        { timeout: 30000 }
      );

      await appointmentScreen.submitAppointmentCreation(
        automationProviderService.service.paymentRequired
      );

      const createBookingResponse = await createBookingResponsePromise;
      expect(
        createBookingResponse.ok(),
        'Appointment was not created'
      ).toBeTruthy();
    }
  );
});
