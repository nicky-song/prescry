// Copyright 2023 Prescryptive Health, Inc.

import { expect } from '@playwright/test';
import moment from 'moment-timezone';
import { AppointmentService, ProviderService } from '../services';
import {
  AppointmentServiceExternal,
  ProcedureService,
} from '../services/external';
import { recordProcedureTemplate } from '../test-data';
import {
  AppointmentAvailableSlot,
  CreateFreeMemberAppointmentFixtureProps,
  ProviderService as ProviderWithServiceType,
  RecordAppointmentProcedure,
} from '../types';
import { test as base } from './base-fixtures';

export const test = base.extend<{
  bookAppointmentSlot: (
    automationProviderIdentifier: string,
    serviceType: string,
    appointmentSlotSearch: {
      searchCondition: 'greaterOrEqualThan' | 'lessThan';
      timeFromProviderTimeZone: {
        hours?: number;
        minutes?: number;
      };
    }
  ) => void;
  createFreeMemberAppointment: (
    props: CreateFreeMemberAppointmentFixtureProps
  ) => Promise<{ orderNumber: string; startInUTC: string; bookingId: string }>;
  recordAppointmentProcedure: (
    props: RecordAppointmentProcedure
  ) => Promise<void>;
}>({
  bookAppointmentSlot: async (
    {
      page,
      appSettings,
      appointmentScreen,
      waitUntilOverlayLoadingDisappeared,
      pharmacyLocationsScreen,
    },
    use
  ) => {
    await use(
      async (providerIdentifier, serviceType, appointmentSlotSearch) => {
        await test.step('Picking an Appointment Slot', async () => {
          const { token, deviceToken } = await appSettings();

          expect(
            token !== undefined && deviceToken !== undefined,
            `Provider's timezone cannot be consulted, Api security parameters required`
          ).toBeTruthy();

          const { timeFromProviderTimeZone, searchCondition } =
            appointmentSlotSearch;

          // Get Provider TimeZone
          const { timezone: providerTimeZone } =
            await ProviderService.getProviderWithServiceByIdentifier(
              token,
              deviceToken,
              providerIdentifier,
              serviceType
            );

          // Add Time interval to Utc Time
          const dateWithInterval = moment
            .utc()
            .add(timeFromProviderTimeZone.hours ?? 0, 'hours')
            .add(timeFromProviderTimeZone.minutes ?? 0, 'minutes');
          // Convert it to the Provider TimeZone
          const dateWithIntervalProviderLocal = dateWithInterval
            .clone()
            .tz(providerTimeZone);

          const findAvailableSlot = async (
            triggerAvailabilityRequest: () => Promise<void>
          ) => {
            const availabilityResponsePromise = page.waitForResponse(
              '**/api/provider-location/get-availability'
            );

            await waitUntilOverlayLoadingDisappeared(
              triggerAvailabilityRequest
            );

            // Initiate Availability Request response
            // Wait for Slots available
            const availabilityResponse = await availabilityResponsePromise;
            const availabilityResponseJSon = await availabilityResponse.json();

            expect(
              availabilityResponse.ok(),
              'Get Availability for an Appointment failed'
            ).toBeTruthy();
            expect(
              availabilityResponseJSon?.data?.slots,
              'No slots were found for an appointment'
            ).toBeTruthy();

            const slotsAvailable = availabilityResponseJSon.data.slots;

            // Find first Slot available based on search criteria
            const slot = slotsAvailable.find((s) => {
              const startInEpoch = moment
                .tz(s.start, providerTimeZone)
                .valueOf();
              const dateWithIntervalProviderLocalEpoch =
                dateWithIntervalProviderLocal.valueOf();
              if (searchCondition === 'greaterOrEqualThan')
                return startInEpoch >= dateWithIntervalProviderLocalEpoch;
              else return startInEpoch < dateWithIntervalProviderLocalEpoch;
            });
            return slot;
          };

          // Try to find a Slot in the first month
          let availableSlot = await findAvailableSlot(() =>
            pharmacyLocationsScreen.selectProvider(providerIdentifier)
          );
          if (availableSlot === undefined)
            // Try with the next month
            availableSlot = await findAvailableSlot(
              appointmentScreen.moveCalendarToNextMonth
            );

          expect(availableSlot, 'No slot available was found').toBeTruthy();

          // Wait for the application to Secure the date for the Appointment
          await waitUntilOverlayLoadingDisappeared(() =>
            // Select the Slot in the Appointment Screen
            appointmentScreen.selectAppointmentSlot(
              availableSlot.day,
              availableSlot.slotName
            )
          );
        });
      }
    );
  },
  createFreeMemberAppointment: ({ appSettings }, use) => {
    return use(
      async ({
        primaryMemberData,
        requiredQuestionAnswers,
        providerIdentifier,
        providerServiceType,
        createCancellable,
      }: CreateFreeMemberAppointmentFixtureProps) => {
        const { token, deviceToken } = await appSettings();

        if (token === undefined && deviceToken === undefined) {
          throw new Error(
            "Either Token or DeviceToken is not present on Local Storage. Probably, you didn't Logged in a User"
          );
        }

        const myRxBaseUrl = process.env.MY_PRESCRYPTIVE_URL;
        if (myRxBaseUrl === undefined)
          throw new Error('My Prescryptive API Url is not defined');

        // 1° Get Provider by including service data
        const providerWithService: ProviderWithServiceType =
          await ProviderService.getProviderWithServiceByIdentifier(
            token,
            deviceToken,
            providerIdentifier,
            providerServiceType
          );

        const serviceInfo = providerWithService.serviceInfo.at(0);

        if (serviceInfo === undefined)
          throw new Error('Service Info not found in provider');

        // 2° Validate that the Service is free
        if (serviceInfo.paymentRequired)
          throw new Error(`The Service must be free`);

        // 3° Calculate appointment availability intervals
        const minDaysDuration = moment.duration(serviceInfo.minLeadDays);
        const maxDaysDuration = moment.duration(serviceInfo.maxLeadDays);
        const startMoment = moment()
          .tz(providerWithService.timezone)
          .add(minDaysDuration)
          .startOf('day');
        const minDate = startMoment.format('YYYY-MM-DD');

        const maxDayMoment = moment()
          .tz(providerWithService.timezone)
          .add(maxDaysDuration)
          .endOf('day');

        const maxDate = maxDayMoment.format('YYYY-MM-DD');

        // 4° Get available slots based on the interval calculated above
        const availableSlots: AppointmentAvailableSlot[] =
          await ProviderService.getStaffAvailability(
            token,
            deviceToken,
            providerIdentifier,
            providerServiceType,
            minDate,
            maxDate
          );

        // 5° Find Slot based on Appointment cancellable criteria
        const cancellableSlotPredicate = ({
          start,
        }: AppointmentAvailableSlot) => {
          return (
            moment.tz(start, providerWithService.timezone).valueOf() >
            moment.utc().add(7, 'hour').valueOf()
          );
        };

        const nonCancellableSlotPredicate = ({
          start,
        }: AppointmentAvailableSlot) => {
          return (
            moment.tz(start, providerWithService.timezone).valueOf() <
            moment.utc().add(6, 'hour').valueOf()
          );
        };

        const selectedSlot = availableSlots.find((slot) => {
          if (createCancellable) return cancellableSlotPredicate(slot);
          else return nonCancellableSlotPredicate(slot);
        });

        if (selectedSlot === undefined)
          throw new Error('No free slot was found to create the appointment');

        const appointmentStartTime = moment
          .tz(selectedSlot.start, providerWithService.timezone)
          .utc()
          .format();

        // 6° Lock Slot
        const { bookingId } = await AppointmentServiceExternal.lockSlot(
          providerIdentifier,
          appointmentStartTime,
          providerServiceType,
          primaryMemberData.phoneNumber
        );

        // 7° Create the Appointment
        const requestId = `AUTOMATION|${bookingId}`;

        const orderNumber = await AppointmentService.createForFreeService(
          token,
          deviceToken,
          bookingId,
          providerIdentifier,
          providerServiceType,
          appointmentStartTime,
          {
            address1: primaryMemberData.address1,
            county: primaryMemberData.county,
            city: primaryMemberData.city,
            state: primaryMemberData.state,
            zip: primaryMemberData.zip,
          },
          requiredQuestionAnswers.map((qa) => ({ ...qa, required: true })),
          myRxBaseUrl,
          requestId
        );

        return { orderNumber, startInUTC: appointmentStartTime, bookingId };
      }
    );
  },
  // eslint-disable-next-line no-empty-pattern
  recordAppointmentProcedure: ({}, use) => {
    use(async (recordAppointmentProcedureData: RecordAppointmentProcedure) => {
      const { claimOption, prescriber, providerNpi, appointment } =
        recordAppointmentProcedureData;

      recordProcedureTemplate.variables.id = appointment.bookingId;

      const setProcedureResultAnswers = (
        resultId: string,
        value: { answerId?: string; answerText: string }
      ) => {
        const procedureResult =
          recordProcedureTemplate.variables.procedureResults.find(
            (r) => r.procedureResultId === resultId
          );
        if (procedureResult !== undefined) {
          procedureResult.answerId = value.answerId ?? '';
          procedureResult.answerText = value.answerText;
        }
      };

      setProcedureResultAnswers('test-result', {
        answerId: claimOption.id,
        answerText: claimOption.text,
      });
      setProcedureResultAnswers('provider-npi', { answerText: providerNpi });
      setProcedureResultAnswers('prescriber-first-name', {
        answerText: prescriber.firstName,
      });
      setProcedureResultAnswers('prescriber-last-name', {
        answerText: prescriber.lastName,
      });
      setProcedureResultAnswers('procedure-date', {
        answerText: appointment.startDate,
      });

      await test.step(
        `Recording a result for Booking N°${appointment.bookingId}`,
        () => ProcedureService.recordProcedure(recordProcedureTemplate)
      );
    });
  },
});
