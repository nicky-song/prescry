// Copyright 2022 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IAccumulatorResponse } from '../../../../models/api-response/accumulators.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetAccumulatorsResponse = (responseJson: unknown) => {
  const response = responseJson as IAccumulatorResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
