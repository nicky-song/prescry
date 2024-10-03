// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ISessionResponse } from '../../../../models/api-response/session-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureSessionResponse = (
  responseJson: unknown
): ISessionResponse => {
  const response = responseJson as ISessionResponse;
  const isValid = response.message && response.responseCode;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
