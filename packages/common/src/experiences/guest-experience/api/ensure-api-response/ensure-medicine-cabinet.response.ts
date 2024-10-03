// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IMedicineCabinetResponse } from '../../../../models/api-response/medicine-cabinet.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetMedicineCabinetResponse = (responseJson: unknown) => {
  const response = responseJson as IMedicineCabinetResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
