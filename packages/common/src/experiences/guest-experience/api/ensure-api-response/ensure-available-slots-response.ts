// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IAvailableSlotsResponse } from '../../../../models/api-response/available-slots-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureAvailableSlotsResponse = (responseJson: unknown) => {
  const response = responseJson as IAvailableSlotsResponse;
  const isValid =
    response.data && response.data.slots && response.data.unAvailableDays;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
