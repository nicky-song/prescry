// Copyright 2021 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureSendVerificationCodeResponse = (responseJson: unknown) => {
  const sendVerificationCodeResponse = responseJson as IApiResponse;
  const isValid = sendVerificationCodeResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return sendVerificationCodeResponse;
};
