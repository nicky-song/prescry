// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { isPersonAddressInDatabase } from '../../utilities/is-person-address-in-database';

import { test } from '../../fixtures/appointment-fixtures';
import { convertToAppointmentQuestion } from '../../mappers';
import { appointmentCreationFreeServiceTestData } from '../../test-data';

let lock;
const { automationProviderService, member } =
  appointmentCreationFreeServiceTestData;

test.beforeEach(async ({ getCashUser, login }) => {
  lock = await getCashUser(member);
  await login(member);
});

test('Schedule Appointment for Free Service @exec', async ({
  appointmentScreen,
  homeScreen,
  servicesList,
  pharmacyLocationsScreen,
  page,
  waitUntilOverlayLoadingDisappeared,
  bookAppointmentSlot,
}) => {
  // Schedule COVID-19 test
  await homeScreen.goToCovid19Services();

  await servicesList.selectService(automationProviderService.service.type);

  // Search and select Automation Provider
  // Wait until Providers are shown
  await waitUntilOverlayLoadingDisappeared(() =>
    pharmacyLocationsScreen.searchByZipCode(automationProviderService.zip)
  );

  // Initiate Slot Appointment selection
  bookAppointmentSlot(
    automationProviderService.identifier,
    automationProviderService.service.type,
    {
      searchCondition: 'greaterOrEqualThan',
      timeFromProviderTimeZone: { hours: 7 },
    }
  );

  const memberAddressAlreadyAddedOrNull = await isPersonAddressInDatabase(
    `${member.phoneNumberDialingCode}${member.phoneNumber}`,
    member.rxGroupType
  );
  expect(memberAddressAlreadyAddedOrNull).not.toBeNull();

  if (!memberAddressAlreadyAddedOrNull) {
    await appointmentScreen.fillMemberAddress(member.address);
  }

  await appointmentScreen.selectAppointmentForMyself();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Object is possibly 'null'.
  for (const qa of automationProviderService.service.answers) {
    const appointmentQuestion = convertToAppointmentQuestion(qa);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await appointmentScreen.answerQuestion(appointmentQuestion as any);
  }
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
});

test.afterEach(() => lock?.unlock());
