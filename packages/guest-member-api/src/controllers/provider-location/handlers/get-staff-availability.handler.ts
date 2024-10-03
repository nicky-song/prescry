// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAvailableSlotsData } from '@phx/common/src/models/api-response/available-slots-response';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { IGetAvailableBookingSlotsRequest } from '../../../models/pharmacy-portal/get-available-booking-slots.request';
import { IAvailableBookingSlotsResponse } from '../../../models/pharmacy-portal/get-available-booking-slots.response';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getSlotsAndUnavailableDays } from '../helpers/get-slots-and-unavailable-days';
import {
  convertToBookingAvailability,
  getAvailableBookingSlotsEndpointHelper,
} from '../helpers/get-available-booking-slots-endpoint.helper';

export async function getStaffAvailabilityHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const start: string = request.body.start;
    const end: string = request.body.end;

    const apiResponse: IAvailableBookingSlotsResponse =
      await getAvailableBookingSlotsEndpointHelper(configuration, {
        locationId: request.body.locationId,
        serviceType: request.body.serviceType,
        start,
        end,
      } as IGetAvailableBookingSlotsRequest);

    if (apiResponse.slots) {
      const bookingAvailabilities = convertToBookingAvailability(
        start,
        end,
        apiResponse.slots
      );
      const availabilityData = getSlotsAndUnavailableDays(
        bookingAvailabilities
      );
      return SuccessResponse<IAvailableSlotsData>(
        response,
        SuccessConstants.SUCCESS_OK,
        availabilityData
      );
    }
    return KnownFailureResponse(
      response,
      apiResponse.errorCode || HttpStatusCodes.INTERNAL_SERVER_ERROR,
      apiResponse.message ?? ''
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
