// Copyright 2022 Prescryptive Health, Inc.

import { test } from '../../fixtures/appointment-fixtures';
import { expect } from '@playwright/test';
import { appointmentCreationPaidServiceTestData } from '../../test-data';

import { isPersonAddressInDatabase } from '../../utilities';
import { convertToAppointmentQuestion } from '../../mappers';

let lock;
const { automationProviderService, member, stripePayment } =
  appointmentCreationPaidServiceTestData;

test.beforeEach(async ({ getCashUser, login }) => {
  lock = await getCashUser(member);
  await login(member);
});

test('Schedule Appointment and Pay for it @exec', async ({
  stripeCheckoutScreen,
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
      timeFromProviderTimeZone: { hours: 6, minutes: 30 },
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

  // Wait until the appointment is saved
  waitUntilOverlayLoadingDisappeared(() =>
    appointmentScreen.submitAppointmentCreation(
      automationProviderService.service.paymentRequired
    )
  );

  await stripeCheckoutScreen.fillEmail(member.email);
  const [expiryMonth, expiryYear] = stripePayment.cardExpiry();

  await stripeCheckoutScreen.fillCardData({
    number: stripePayment.cardNumber,
    Cvc: stripePayment.cardCvc,
    expiryDate: { twoDigitsMonth: expiryMonth, twoDigitsYear: expiryYear },
    nameOnCard: member.firstName,
  });
  await stripeCheckoutScreen.selectCountry(member.address.countryAbbreviation);
  await stripeCheckoutScreen.fillZipCode(
    automationProviderService.zip.toString()
  );

  const appointmentDataResponsePromise = page.waitForResponse(
    '**/api/appointment/**',
    { timeout: 30000 }
  );

  await stripeCheckoutScreen.confirmPayment();

  const appointmentDataResponse = await appointmentDataResponsePromise;
  expect(appointmentDataResponse.ok(), 'Appointment was not created');
});

test.afterEach(() => lock?.unlock());
