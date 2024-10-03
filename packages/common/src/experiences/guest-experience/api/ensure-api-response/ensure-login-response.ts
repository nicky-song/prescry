// Copyright 2020 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureLoginResponse = (responseJson: unknown) => {
  const loginResponse = responseJson as IApiResponse;
  const isValid = loginResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return loginResponse;
};
