// Copyright 2020 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureAddRecoveryEmailResponse = (responseJson: unknown) => {
  const addRecoveryEmailResponse = responseJson as IApiResponse;
  const isValid = addRecoveryEmailResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return addRecoveryEmailResponse;
};
