// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
  KnownFailureResponse,
} from '../../../utils/response-helper';

import { getAppointmentEventByOrderNumberNoRxId } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { IConfiguration } from '../../../configuration';
import { cancelBookingHandler } from './cancel-booking.handler';
import { IAppointmentEvent } from '../../../models/appointment-event';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { publishAppointmentCancelledEventMessage } from '../../../utils/service-bus/appointment-cancel-event-helper';
import {
  isMemberIdValidForUserAndDependents,
  getLoggedInUserProfileForRxGroupType,
} from '../../../utils/person/get-dependent-person.helper';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);
jest.mock('../../../utils/response-helper');

jest.mock('../../../utils/service-bus/appointment-cancel-event-helper');
jest.mock('../../../utils/person/get-dependent-person.helper');

const routerResponseMock = {} as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const getAppointmentEventByOrderNumberNoRxIdMock =
  getAppointmentEventByOrderNumberNoRxId as jest.Mock;
const getLoggedInUserProfileForRxGroupTypeMock =
  getLoggedInUserProfileForRxGroupType as jest.Mock;
const publishAppointmentCancelledEventMessageMock =
  publishAppointmentCancelledEventMessage as jest.Mock;
const isMemberIdValidForUserAndDependentsMock =
  isMemberIdValidForUserAndDependents as jest.Mock;
const databaseMock = {
  Models: {},
} as unknown as IDatabase;
const requestMock = {
  body: { orderNumber: '1234' },
} as unknown as Request;

const configuration = {
  cancelAppointmentWindowExpiryTimeInHours: 6,
} as IConfiguration;

const appointmentDetails = {
  eventType: 'appointment/confirmation',
  eventData: {
    appointment: {
      memberRxId: 'member-id1',
      bookingId: 'booking-id1',
      locationId: 'location-id1',
      startInUtc: new Date('2020-12-18T11:00:00+0000'),
    },
    bookingStatus: 'Requested',
    orderNumber: '1234',
  },
} as unknown as IAppointmentEvent;

beforeEach(() => {
  unknownFailureResponseMock.mockReset();
  successResponseMock.mockReset();
  successResponseMock.mockReturnValue('success');
  knownFailureResponseMock.mockReset();
  getAppointmentEventByOrderNumberNoRxIdMock.mockReset();
  publishAppointmentCancelledEventMessageMock.mockReset();
  getLoggedInUserProfileForRxGroupTypeMock.mockReset();
  isMemberIdValidForUserAndDependentsMock.mockReset();
  getLoggedInUserProfileForRxGroupTypeMock.mockReturnValue({
    primaryMemberRxId: 'member-id1',
  });
});

describe('cancelBookingHandler', () => {
  it('publish cancel appointment request to Topic when bookingStatus is Requested', async () => {
    const cancellationPayloadMock = {
      locationId: 'location-id1',
      eventId: 'booking-id1',
      orderNumber: '1234',
      reason: 'SystemInitiatedCancellation',
    };

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetails
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );
    expect(publishAppointmentCancelledEventMessageMock).toBeCalledTimes(1);
    expect(publishAppointmentCancelledEventMessageMock).toHaveBeenCalledWith(
      cancellationPayloadMock
    );

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.CANCEL_BOOKING_SUCCESS
    );
  });
  it('publish cancel Appointment request to Topic if bookingStatus is Confirmed and cancellation window is not expired ', async () => {
    const cancellationPayloadMock = {
      locationId: 'location-id1',
      eventId: 'booking-id1',
      orderNumber: '1234',
      reason: 'CustomerInitiatedCancellation',
    };
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1608246613000);

    const appointmentDetailsWithConfirmedStatus = {
      ...appointmentDetails,
      eventData: {
        ...appointmentDetails.eventData,
        bookingStatus: 'Confirmed',
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetailsWithConfirmedStatus
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);

    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );
    expect(isMemberIdValidForUserAndDependentsMock).toHaveBeenCalledWith(
      routerResponseMock,
      appointmentDetails.eventData.appointment.memberRxId
    );

    expect(publishAppointmentCancelledEventMessageMock).toBeCalledTimes(1);
    expect(publishAppointmentCancelledEventMessageMock).toHaveBeenCalledWith(
      cancellationPayloadMock
    );

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.CANCEL_BOOKING_SUCCESS
    );

    dateNowSpyMock.mockRestore();
  });

  it('returns BAD REQUEST if bookingStatus is Confirmed and cancellation window is expired ', async () => {
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1608282613000);

    const appointmentDetailsWithConfirmedStatus = {
      ...appointmentDetails,
      eventData: {
        ...appointmentDetails.eventData,
        bookingStatus: 'Confirmed',
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetailsWithConfirmedStatus
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );

    expect(publishAppointmentCancelledEventMessageMock).not.toBeCalled();

    expect(KnownFailureResponse).toBeCalledTimes(1);
    expect(KnownFailureResponse).toHaveBeenCalledWith(
      {},
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.CANCEL_BOOKING_WINDOW_PASSED
    );
    dateNowSpyMock.mockRestore();
  });
  it('returns error from cancelBookingHandler if booking status is not requested/confirmed/cancelled', async () => {
    const appointmentDetailsCompletedStatus = {
      ...appointmentDetails,
      eventData: {
        ...appointmentDetails.eventData,
        bookingStatus: 'Completed',
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetailsCompletedStatus
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      {},
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.CANCEL_BOOKING_NOT_ELIGIBLE
    );
  });

  it('returns success from cancelBookingHandler if booking status is already cancelled', async () => {
    const appointmentDetailsCancelledStatus = {
      ...appointmentDetails,
      eventData: {
        ...appointmentDetails.eventData,
        bookingStatus: 'Cancelled',
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetailsCancelledStatus
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.APPOINTMENT_ALREADY_CANCELED
    );
  });

  it('returns UNAUTHORIZED_ACCESS error if there is no person info', async () => {
    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(null);
    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );
    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });
  it('returns unauthorized error from cancelBookingHandler if primaryMemberRxId is incorrect', async () => {
    const appointmentDetailsWithIncorrectID = {
      ...appointmentDetails,
      eventData: {
        appointment: {
          ...appointmentDetails.eventData.appointment,
          memberRxId: 'member-id2',
        },
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetailsWithIncorrectID
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(false);

    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );
    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(isMemberIdValidForUserAndDependentsMock).toHaveBeenCalledWith(
      routerResponseMock,
      appointmentDetailsWithIncorrectID.eventData.appointment.memberRxId
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      {},
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });

  it('returns error from cancelBookingHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    getAppointmentEventByOrderNumberNoRxIdMock.mockImplementation(() => {
      throw error;
    });
    const response = await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );
    expect(response).toEqual(undefined);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('Allow dependents for cancellation if there is no error from database', async () => {
    const cancellationPayloadMock = {
      locationId: 'location-id1',
      eventId: 'booking-id1',
      orderNumber: '1234',
      reason: 'CustomerInitiatedCancellation',
    };
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1608246613000);

    const appointmentDetail = {
      ...appointmentDetails,
      eventData: {
        appointment: {
          memberRxId: 'child-member-id1',
          bookingId: 'booking-id1',
          locationId: 'location-id1',
          startInUtc: new Date('2020-12-18T11:00:00+0000'),
        },
        bookingStatus: 'Confirmed',
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetail
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);

    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );

    expect(isMemberIdValidForUserAndDependentsMock).toHaveBeenCalledWith(
      routerResponseMock,
      appointmentDetail.eventData.appointment.memberRxId
    );

    expect(publishAppointmentCancelledEventMessageMock).toBeCalledTimes(1);
    expect(publishAppointmentCancelledEventMessageMock).toHaveBeenCalledWith(
      cancellationPayloadMock
    );

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.CANCEL_BOOKING_SUCCESS
    );
    dateNowSpyMock.mockReset();
  });
  it('DO NOT allow for cancellation if memberID is not a dependant', async () => {
    const appointmentDetail = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          memberRxId: 'child-dummy-member-id1',
          bookingId: 'booking-id1',
          locationId: 'location-id1',
        },
        orderNumber: '1234',
      },
    } as unknown as IAppointmentEvent;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(
      appointmentDetail
    );
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(false);

    await cancelBookingHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configuration
    );

    expect(getLoggedInUserProfileForRxGroupTypeMock).toBeCalledTimes(1);
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      routerResponseMock,
      'CASH'
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );

    expect(isMemberIdValidForUserAndDependentsMock).toHaveBeenCalledWith(
      routerResponseMock,
      appointmentDetail.eventData.appointment.memberRxId
    );

    expect(publishAppointmentCancelledEventMessageMock).not.toBeCalled();
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      {},
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });
});
