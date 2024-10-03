// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  getRequestQuery,
  getRequiredRequestQuery,
} from '../../../utils/request/get-request-query';
import { generateSuccessResponseForLocationsWithDistance } from '../helpers/generate-response-distance.helper';
import { ApiConstants } from '../../../constants/api-constants';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { IProviderLocationData } from '@phx/common/src/models/api-response/provider-location-response';
import { isVaccineServiceType } from '@phx/common/src/utils/vaccine-service-type.helper';
import { IServices } from '../../../models/services';
import { IConfiguration } from '../../../configuration';
import { getNearbyProviderLocationsForZipCode } from '../helpers/get-nearby-provider-locations-for-zip-code';
import { getServiceDetailsByServiceType } from '../../../utils/external-api/get-service-details-by-service-type';

export async function getProviderLocationsHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const serviceType = getRequiredRequestQuery(request, 'servicetype');
    const features = getRequiredResponseLocal(response, 'features');
    const switches = fetchRequestHeader(request, RequestHeaders.switches);
    const usetestpharmacy =
      features.usepharmacy ||
      features.usetestpharmacy ||
      (isVaccineServiceType(serviceType) &&
        features.usevaccine &&
        switches?.indexOf('usepharmacy:1') !== -1);

    const zipCode = getRequestQuery(request, 'zipcode');
    const distance = getRequestQuery(request, 'distance');
    const withinMiles = zipCode
      ? distance !== undefined
        ? distance
        : ApiConstants.PHARMACY_DISTANCE_FROM_ZIP
      : undefined;
    const providerLocationsResponse =
      await getNearbyProviderLocationsForZipCode(
        configuration,
        serviceType,
        usetestpharmacy,
        withinMiles,
        zipCode
      );
    const providerLocations = providerLocationsResponse.locations;
    const serviceTypeDetailsResponse = await getServiceDetailsByServiceType(
      configuration,
      serviceType
    );
    const serviceTypeDetailsForService: IServices | undefined =
      serviceTypeDetailsResponse.service;
    if (!providerLocations) {
      return SuccessResponse<IProviderLocationData>(
        response,
        SuccessConstants.DOCUMENT_FOUND,
        {
          locations: [],
          serviceNameMyRx: serviceTypeDetailsForService?.serviceNameMyRx,
          minimumAge: serviceTypeDetailsForService?.minimumAge,
        }
      );
    }

    if (!providerLocations.length) {
      if (serviceTypeDetailsForService) {
        return generateSuccessResponseForLocationsWithDistance(
          response,
          providerLocations,
          serviceTypeDetailsForService
        );
      }
    }
    return generateSuccessResponseForLocationsWithDistance(
      response,
      providerLocations
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
