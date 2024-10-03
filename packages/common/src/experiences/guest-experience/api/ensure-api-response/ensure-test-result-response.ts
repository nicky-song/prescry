// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ITestResultResponse } from '../../../../models/api-response/test-result-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureTestResultResponse = (responseJson: unknown) => {
  const response = responseJson as ITestResultResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
