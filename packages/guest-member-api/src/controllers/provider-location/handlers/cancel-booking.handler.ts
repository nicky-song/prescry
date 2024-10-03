// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import moment from 'moment';
import { ICancelBookingRequestBody } from '@phx/common/src/models/api-request-body/cancel-booking.request-body';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { getAppointmentEventByOrderNumberNoRxId } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  isMemberIdValidForUserAndDependents,
  getLoggedInUserProfileForRxGroupType,
} from '../../../utils/person/get-dependent-person.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishAppointmentCancelledEventMessage } from '../../../utils/service-bus/appointment-cancel-event-helper';

export async function cancelBookingHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const { orderNumber } = request.body as ICancelBookingRequestBody;

    const personInfo = getLoggedInUserProfileForRxGroupType(response, 'CASH');
    if (personInfo) {
      const appointmentDetails = await getAppointmentEventByOrderNumberNoRxId(
        orderNumber,
        database
      );
      if (appointmentDetails) {
        if (
          !isMemberIdValidForUserAndDependents(
            response,
            appointmentDetails.eventData.appointment.memberRxId
          )
        ) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.UNAUTHORIZED_REQUEST,
            ErrorConstants.UNAUTHORIZED_ACCESS
          );
        }

        const scheduledAppointmentStatus =
          appointmentDetails.eventData.bookingStatus;
        if (
          scheduledAppointmentStatus === 'Confirmed' ||
          scheduledAppointmentStatus === 'Requested'
        ) {
          let isCustomerInitiated = false;
          if (scheduledAppointmentStatus === 'Confirmed') {
            const appointmentTimeInUtc = moment(
              appointmentDetails.eventData.appointment.startInUtc
            );
            const durationFromAppointment = moment
              .duration(appointmentTimeInUtc.diff(moment.utc()))
              .asHours();

            if (
              durationFromAppointment >=
              configuration.cancelAppointmentWindowExpiryTimeInHours
            ) {
              isCustomerInitiated = true;
            } else {
              return KnownFailureResponse(
                response,
                HttpStatusCodes.BAD_REQUEST,
                ErrorConstants.CANCEL_BOOKING_WINDOW_PASSED
              );
            }
          }
          const cancellationPayload: ICancelBookingRequestBody = {
            locationId: appointmentDetails.eventData.appointment.locationId,
            eventId: appointmentDetails.eventData.appointment.bookingId,
            orderNumber,
            reason: isCustomerInitiated
              ? 'CustomerInitiatedCancellation'
              : 'SystemInitiatedCancellation',
          };
          await publishAppointmentCancelledEventMessage(cancellationPayload);
          return SuccessResponse(
            response,
            SuccessConstants.CANCEL_BOOKING_SUCCESS
          );
        }
        if (scheduledAppointmentStatus === 'Cancelled') {
          return SuccessResponse(
            response,
            SuccessConstants.APPOINTMENT_ALREADY_CANCELED
          );
        }
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.CANCEL_BOOKING_NOT_ELIGIBLE
        );
      }
    }
    return UnknownFailureResponse(response, ErrorConstants.UNAUTHORIZED_ACCESS);
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
