// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IPrescriptionInfoResponse } from '../../../../models/api-response/prescryption-info.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetPrescriptionInfoResponse = (responseJson: unknown) => {
  const response = responseJson as IPrescriptionInfoResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
