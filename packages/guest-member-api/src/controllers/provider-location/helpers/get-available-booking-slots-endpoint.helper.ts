// Copyright 2021 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { IGetAvailableBookingSlotsRequest } from '../../../models/pharmacy-portal/get-available-booking-slots.request';
import { IPharmacyPortalEndpointError } from '../../../models/pharmacy-portal/pharmacy-portal-error.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';
import { Response } from 'node-fetch';
import { IBookingAvailability } from '@phx/common/src/models/booking/booking-availability.response';
import { ApiConstants } from '../../../constants/api-constants';
import moment from 'moment';
import { IAvailableBookingSlotsResponse } from '../../../models/pharmacy-portal/get-available-booking-slots.response';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';

export async function getAvailableBookingSlotsEndpointHelper(
  configuration: IConfiguration,
  requestParams: IGetAvailableBookingSlotsRequest
): Promise<IAvailableBookingSlotsResponse> {
  const token: string = await generateBearerToken(
    configuration.pharmacyPortalApiTenantId,
    configuration.pharmacyPortalApiClientId,
    configuration.pharmacyPortalApiClientSecret,
    configuration.pharmacyPortalApiScope
  );

  const params: { [key: string]: string } = {};
  params.locationId = requestParams.locationId;
  params.start = requestParams.start;
  params.end = requestParams.end;
  params.serviceType = requestParams.serviceType;

  const query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  const apiResponse: Response = await getDataFromUrl(
    configuration.pharmacyPortalApiUrl + '/provider/booking/?' + query,
    null,
    'GET',
    {
      Authorization: `Bearer ${token}`,
    },
    undefined,
    undefined,
    defaultRetryPolicy
  );

  if (apiResponse.ok) {
    const response = await apiResponse.json();
    return { slots: response, message: 'success' };
  }

  const apiError: IPharmacyPortalEndpointError = await apiResponse.json();

  return {
    errorCode: apiResponse.status,
    message: apiError.message,
  };
}

export function convertToBookingAvailability(
  startDate: string,
  endDate: string,
  availableSlotDates: string[]
): IBookingAvailability[] {
  const bookingAvailabilities: IBookingAvailability[] = [];

  const dates = availableSlotDates.map((x) =>
    moment(x, ApiConstants.LONG_DATE_FORMAT).toDate()
  );

  let currDayDate = getStartOfDayDate(startDate);
  const endDayDate = getStartOfDayDate(endDate);

  while (currDayDate.getTime() <= endDayDate.getTime()) {
    const datesWithinADay = dates.filter(
      (x) => getStartOfDayDate(new Date(x)).getTime() === currDayDate.getTime()
    );
    bookingAvailabilities.push({ date: currDayDate, slots: datesWithinADay });

    currDayDate = moment(new Date(currDayDate)).add(1, 'days').toDate();
  }

  return bookingAvailabilities;
}

const getStartOfDayDate = (date: string | Date): Date =>
  moment(date).startOf('day').toDate();
