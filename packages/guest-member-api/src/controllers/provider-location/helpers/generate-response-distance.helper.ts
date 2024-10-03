// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IProviderLocationData } from '@phx/common/src/models/api-response/provider-location-response';
import { SuccessConstants } from '../../../constants/response-messages';
import { IProviderLocationListItem } from '../../../models/pharmacy-portal/get-provider-location.response';
import { IServices } from '../../../models/services';
import { SuccessResponse } from '../../../utils/response-helper';
import { buildProviderLocation } from './build-provider-location';

export const generateSuccessResponseForLocationsWithDistance = (
  response: Response,
  results: IProviderLocationListItem[],
  serviceTypeDetails?: IServices
): Response => {
  if (!results) {
    results = [] as IProviderLocationListItem[];
  }
  const locationList = [];
  for (const providerLocation of results) {
    locationList.push(buildProviderLocation(providerLocation));
  }
  return SuccessResponse<IProviderLocationData>(
    response,
    SuccessConstants.DOCUMENT_FOUND,
    {
      locations: locationList,
      serviceNameMyRx: serviceTypeDetails?.serviceNameMyRx,
      minimumAge: serviceTypeDetails?.minimumAge,
    }
  );
};
