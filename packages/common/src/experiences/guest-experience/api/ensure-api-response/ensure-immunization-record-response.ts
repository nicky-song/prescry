// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IImmunizationRecordResponse } from '../../../../models/api-response/immunization-record-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureImmunizationRecordResponse = (responseJson: unknown) => {
  const response = responseJson as IImmunizationRecordResponse;

  if (!response.data) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  const data = response.data;
  if (
    !data.immunizationResult ||
    !(data.immunizationResult.length > 0) ||
    !data.immunizationResult[0].orderNumber
  ) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
