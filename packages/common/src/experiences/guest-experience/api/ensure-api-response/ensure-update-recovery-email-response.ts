// Copyright 2020 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureUpdateRecoveryEmailResponse = (responseJson: unknown) => {
  const updateRecoveryEmailResponse = responseJson as IApiResponse;
  const isValid = updateRecoveryEmailResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return updateRecoveryEmailResponse;
};
