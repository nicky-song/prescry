// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IPastProcedureResponse } from '../../../../models/api-response/past-procedure-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensurePastProceduresListResponse = (responseJson: unknown) => {
  const response = responseJson as IPastProcedureResponse;
  const isValid = response.data && response.data.pastProcedures;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
