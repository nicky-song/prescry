// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IDrugInformationItem } from '../../../../models/api-response/drug-information-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetDrugInformationResponse = (responseJson: unknown) => {
  const response = responseJson as IDrugInformationItem;
  if (!response) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response.NDC;
};
