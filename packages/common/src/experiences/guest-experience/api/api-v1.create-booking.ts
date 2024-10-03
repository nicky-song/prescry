// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { ICreateBookingResponse } from '../../../models/api-response/create-booking-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureCreateBookingResponse } from './ensure-api-response/ensure-create-booking-response';
import { ICreateBookingRequestBody } from '../../../models/api-request-body/create-booking.request-body';
import { withRefreshToken } from './with-refresh-token';

export const createBooking = async (
  config: IApiConfig,
  createBookingRequestBody: ICreateBookingRequestBody,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<ICreateBookingResponse> => {
  const url = buildUrl(config, 'createBooking', {});
  if (createBookingRequestBody.dependentInfo) {
    if (createBookingRequestBody.dependentInfo.identifier) {
      createBookingRequestBody.dependentInfo = {
        identifier: createBookingRequestBody.dependentInfo.identifier,
        masterId: createBookingRequestBody.dependentInfo.masterId,
      };
    } else {
      if (createBookingRequestBody.dependentInfo.addressSameAsParent) {
        createBookingRequestBody.dependentInfo = {
          firstName: createBookingRequestBody.dependentInfo.firstName?.trim(),
          lastName: createBookingRequestBody.dependentInfo.lastName?.trim(),
          dateOfBirth: createBookingRequestBody.dependentInfo.dateOfBirth,
          addressSameAsParent:
            createBookingRequestBody.dependentInfo.addressSameAsParent,
        };
      } else {
        createBookingRequestBody.dependentInfo = {
          firstName: createBookingRequestBody.dependentInfo.firstName?.trim(),
          lastName: createBookingRequestBody.dependentInfo.lastName?.trim(),
          dateOfBirth: createBookingRequestBody.dependentInfo.dateOfBirth,
          address: createBookingRequestBody.dependentInfo.address,
          addressSameAsParent:
            createBookingRequestBody.dependentInfo.addressSameAsParent,
        };
      }
    }
  }

  const response: Response = await call(
    url,
    createBookingRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureCreateBookingResponse(responseJson)) {
    return withRefreshToken<ICreateBookingResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForCreateBooking,
    APITypes.CREATE_BOOKING,
    errorResponse.code,
    errorResponse
  );
};
