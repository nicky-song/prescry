// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IProviderLocationDetailsResponseData } from '@phx/common/src/models/api-response/provider-location-details-response';
import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { SuccessConstants } from '../../../constants/response-messages';
import { IServices } from '../../../models/services';
import { SuccessResponse } from '../../../utils/response-helper';
import { buildProviderLocationDetails } from './provider-location-details-map.helper';
import { assertIsDefined } from '@phx/common/src/assertions/assert-is-defined';

export const generateSuccessResponseForLocation = (
  response: Response,
  result: IProviderLocation,
  serviceTypeDetails: IServices
): Response<IProviderLocationDetailsResponseData> => {
  const selectedService = result.serviceList?.find(
    (service) => service.serviceType === serviceTypeDetails.serviceType
  );
  assertIsDefined(selectedService);

  return SuccessResponse<IProviderLocationDetailsResponseData>(
    response,
    SuccessConstants.DOCUMENT_FOUND,
    {
      location: buildProviderLocationDetails(result, selectedService),
      serviceNameMyRx: serviceTypeDetails.serviceNameMyRx,
      minimumAge: serviceTypeDetails.minimumAge ?? 0,
      aboutQuestionsDescriptionMyRx:
        serviceTypeDetails.aboutQuestionsDescriptionMyRx,
      aboutDependentDescriptionMyRx:
        serviceTypeDetails.aboutDependentDescriptionMyRx,
      cancellationPolicyMyRx: serviceTypeDetails.cancellationPolicyMyRx ?? '',
    }
  );
};
