// Copyright 2020 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureAddMembershipResponse = (responseJson: unknown) => {
  const addMembershipResponse = responseJson as IApiResponse;
  const isValid = addMembershipResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return addMembershipResponse;
};
