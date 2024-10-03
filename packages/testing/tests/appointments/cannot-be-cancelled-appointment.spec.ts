// Copyright 2023 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../fixtures/appointment-fixtures';
import { nonCancellableAppointmentTestData } from '../../test-data';
import {
  generateAppointmentUrl,
  isAppointmentCancelled,
} from '../../utilities';

let lock;
let nonCancellableAppointmentOrderNumber: string;
const { appointment, primaryMember, providerService } =
  nonCancellableAppointmentTestData;

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

  // Create a NON Cancellable Appointment
  const { orderNumber } = await test.step(
    'Creating NON cancellable Appointment',
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
  nonCancellableAppointmentOrderNumber = orderNumber;
});

test('An appointment whose cancellation has expired cannot be canceled. @exec', async ({
  page,
  baseURL,
  appointmentConfirmationScreen,
  waitUntilProgressBarDisappeared,
}) => {
  const isAppointmentCancelledOrNull = await isAppointmentCancelled(
    nonCancellableAppointmentOrderNumber
  );
  expect(
    isAppointmentCancelledOrNull,
    `assertion: The Appointment with order number ${nonCancellableAppointmentOrderNumber} can be cancelled`
  ).toBeFalsy();

  // Generate the appointment url
  const appointmentUrl = generateAppointmentUrl(
    baseURL as string,
    nonCancellableAppointmentOrderNumber,
    {
      dialingCode: primaryMember.phoneNumberDialingCode,
      phoneNumber: primaryMember.phoneNumber,
    }
  );

  await test.step(
    `Navigating to Appointment N°${nonCancellableAppointmentOrderNumber} and login in`,
    async () => {
      await waitUntilProgressBarDisappeared(async () => {
        await page.goto(appointmentUrl);
      });
    }
  );

  // Assert that the appointment can't be cancelled because time to do the cancellation has expired
  await expect(
    appointmentConfirmationScreen.appointmentCancelButtonLocator(),
    'assertion: Cancel Appointment button is enabled'
  ).not.toBeEnabled();
});

test.afterEach(() => lock?.unlock());
