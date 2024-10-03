// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IConfiguration } from '../../../configuration';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { ApiConstants } from '../../../constants/api-constants';
import { getGeolocationByZip } from '../../geolocation/helpers/get-geolocation-by-zip';
import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { getPharmaciesAndPricesForNdc } from '../../../utils/external-api/get-pharmacy-and-prices-for-ndc';

export async function searchPharmacyDrugPriceHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const switches = fetchRequestHeader(request, RequestHeaders.switches);
    const zipCode = getRequestQuery(request, 'zipcode');
    const latitude = getRequestQuery(request, 'latitude');
    const longitude = getRequestQuery(request, 'longitude');
    const ndc = getRequestQuery(request, 'ndc');
    const daysSupply = getRequestQuery(request, 'supply');
    const quantity = getRequestQuery(request, 'quantity');
    const sortBy = getRequestQuery(request, 'sortby') || 'distance';
    const limit =
      getRequestQuery(request, 'limit') || ApiConstants.NUM_PHARMACY_LIMIT;
    const distance =
      getRequestQuery(request, 'distance') ||
      ApiConstants.PHARMACY_SEARCH_RADIUS_MILES;

    if (
      !ndc ||
      !daysSupply ||
      !quantity ||
      (!zipCode && (!latitude || !longitude))
    ) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.QUERYSTRING_INVALID
      );
    }
    const coordinates = { latitude: 0, longitude: 0 };
    if (latitude && longitude) {
      coordinates.latitude = latitude;
      coordinates.longitude = longitude;
    } else if (zipCode) {
      const coord = getGeolocationByZip(zipCode);
      if (!coord) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.INVALID_ZIPCODE_SEARCH
        );
      }
      coordinates.latitude = coord.latitude;
      coordinates.longitude = coord.longitude;
    }

    const personList = getResponseLocal(response, 'personList');
    const cashMember = personList?.find((x) => x.rxGroupType === 'CASH');
    const sieMember = personList?.find((x) => x.rxGroupType === 'SIE');
    const highPriorityProfile = sieMember ?? cashMember;

    let useSiePrice = false;
    let useCashPrice = false;

    const features = getResponseLocal(response, 'features');

    if (highPriorityProfile) {
      useSiePrice = features?.usesieprice ?? false;
      useCashPrice = features?.usecashprice ?? false;
    } else {
      useSiePrice = switches ? switches.indexOf('usesieprice:1') !== -1 : false;
    }

    const groupPlanCode = useSiePrice
      ? ApiConstants.SIE_USER_RX_SUB_GROUP
      : useCashPrice
      ? ApiConstants.CASH_USER_RX_SUB_GROUP
      : highPriorityProfile?.rxSubGroup ?? ApiConstants.CASH_USER_RX_SUB_GROUP;

    return await getPharmaciesAndPricesForNdc(
      response,
      coordinates.latitude,
      coordinates.longitude,
      distance,
      configuration,
      highPriorityProfile?.primaryMemberRxId ?? 'MOCK-DRUG-SEARCH-MEMBER-ID',
      groupPlanCode,
      sortBy,
      limit,
      ndc,
      quantity,
      daysSupply,
      '1', // TODO: Do we hardcode the refillNumber to 1
      'MOCK-DRUG-SEARCH',
      false,
      !!features?.usertpb,
      undefined,
      features?.useDualPrice,
      features?.useTestThirdPartyPricing
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
