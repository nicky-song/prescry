// Copyright 2023 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../fixtures/appointment-fixtures';
import { cancellableAppointmentTestData } from '../../test-data';
import { isAppointmentCancelled } from '../../utilities';
import { generateAppointmentUrl } from '../../utilities/generate-appointment-url';

let lock;
let cancellableAppointmentOrderNumber: string;
const { appointment, primaryMember, providerService } =
  cancellableAppointmentTestData;

test.beforeEach(async ({ getCashUser, login, createFreeMemberAppointment }) => {
  lock = await getCashUser(primaryMember);
  await login(primaryMember);
  // Map questions
  const questionAnswers = appointment.questionAnswers.map((qa) => ({
    questionId: qa.questionId,
    questionText: qa.questionText,
    answer: Array.isArray(qa.responseValue)
      ? qa.responseValue.join(',')
      : qa.responseValue,
  }));

  // Create a Cancellable Appointment
  const { orderNumber } = await test.step(
    'Creating cancellable Appointment',
    () =>
      createFreeMemberAppointment({
        primaryMemberData: {
          phoneNumber: `${primaryMember.phoneNumberDialingCode}${primaryMember.phoneNumber}`,
          address1: primaryMember.address.street,
          city: primaryMember.address.city,
          state: primaryMember.address.stateAbbreviation,
          zip: primaryMember.address.zipCode,
          county: primaryMember.address.county,
        },
        providerIdentifier: providerService.providerIdentifier,
        providerServiceType: providerService.serviceType,
        requiredQuestionAnswers: questionAnswers,
        createCancellable: appointment.createCancellable,
      })
  );
  cancellableAppointmentOrderNumber = orderNumber;
});

test('Should the Appointment with accepted status inside the cancellation time window be cancelable @exec', async ({
  page,
  baseURL,
  waitUntilOverlayLoadingDisappeared,
  appointmentConfirmationScreen,
  waitUntilProgressBarDisappeared,
}) => {
  // Generate the appointment url
  const appointmentUrl = generateAppointmentUrl(
    baseURL as string,
    cancellableAppointmentOrderNumber,
    {
      dialingCode: primaryMember.phoneNumberDialingCode,
      phoneNumber: primaryMember.phoneNumber,
    }
  );

  await test.step(
    `Navigating to Appointment N°${cancellableAppointmentOrderNumber} and login in`,
    async () => {
      await waitUntilProgressBarDisappeared(async () => {
        await page.goto(appointmentUrl);
      });
    }
  );

  // Check if the appointment can be cancelled
  await expect(
    await appointmentConfirmationScreen.appointmentCancelButtonLocator(),
    'assertion: The Appointment cancellation button is not enabled'
  ).toBeEnabled();

  let isAppointmentCancelledOrNull: boolean | null;

  await test.step(
    'Validating cancellation regret of the Appointment',
    async () => {
      await appointmentConfirmationScreen.cancelAppointment();
      await appointmentConfirmationScreen.regretForAppointmentCancellation();

      isAppointmentCancelledOrNull = await isAppointmentCancelled(
        cancellableAppointmentOrderNumber
      );
      expect(
        isAppointmentCancelledOrNull,
        `assertion: The Appointment with order number ${cancellableAppointmentOrderNumber} was not found or was cancelled`
      ).not.toBeTruthy();
    }
  );

  // Initiate cancellation and confirm it
  await test.step('Validating cancellation of the Appointment', async () => {
    await appointmentConfirmationScreen.cancelAppointment();
    await waitUntilOverlayLoadingDisappeared(
      appointmentConfirmationScreen.confirmAppointmentCancellation
    );

    isAppointmentCancelledOrNull = await isAppointmentCancelled(
      cancellableAppointmentOrderNumber
    );
    expect(
      isAppointmentCancelledOrNull,
      `assertion: The Appointment with order number ${cancellableAppointmentOrderNumber} was not cancelled`
    ).toBeTruthy();
  });
});

test.afterEach(() => lock?.unlock());
