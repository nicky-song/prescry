// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ICreateWaitlistResponse } from '../../../../models/api-response/create-waitlist.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureJoinWaitlistResponse = (
  responseJson: unknown
): ICreateWaitlistResponse => {
  const response = responseJson as ICreateWaitlistResponse;
  const isValid =
    response.data && response.data.phoneNumber && response.data.serviceType;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
