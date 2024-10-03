// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IPrescriptionUserStatusResponse } from '../../../../models/api-response/prescription-user-status-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensurePrescriptionUserStatusResponse = (responseJson: unknown) => {
  const response = responseJson as IPrescriptionUserStatusResponse;
  const isValid = response.data;
  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
