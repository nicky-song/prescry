// Copyright 2022 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import { test } from '../../fixtures/appointment-fixtures';
import { recordProcedureAppointmentTestData } from '../../test-data';

let lock;
let cancellableAppointmentOrderNumber: string;
const { appointment, primaryMember, providerService } =
  recordProcedureAppointmentTestData;

test.beforeEach(
  async ({
    getCashUser,
    login,
    createFreeMemberAppointment,
    recordAppointmentProcedure,
  }) => {
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
    const { orderNumber, bookingId, startInUTC } = await test.step(
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

    const { claimOption, providerNpi, prescriber } =
      recordProcedureAppointmentTestData.appointment.procedureResult;

    await recordAppointmentProcedure({
      appointment: {
        bookingId,
        startDate: startInUTC,
      },
      claimOption: {
        id: claimOption.id,
        text: claimOption.text,
      },
      providerNpi,
      prescriber: {
        firstName: prescriber.firstName,
        lastName: prescriber.lastName,
      },
    });

    cancellableAppointmentOrderNumber = orderNumber;
  }
);

test('Recorded procedure should be in Past Procedures Tests Results screen @exec', async ({
  homeScreen,
  waitUntilProgressBarDisappeared,
  pastProceduresListScreen,
  page,
}) => {
  await waitUntilProgressBarDisappeared(async () => {
    await page.reload();
  });

  // go to Results screen
  await homeScreen.goToTestResults();

  await expect(
    pastProceduresListScreen.getProcedureLocatorItemForOrderNumber(
      cancellableAppointmentOrderNumber
    ),
    `assertion: Record Procedure not Found for Order Number ${cancellableAppointmentOrderNumber}`
  ).toBeVisible();
});

test.afterEach(() => lock?.unlock());
