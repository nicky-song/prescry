// Copyright 2021 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensurePrescriptionTransferResponse = (
  responseJson: unknown
): IApiResponse => {
  const prescriptionTransferResponse = responseJson as IApiResponse;
  const isValid = prescriptionTransferResponse.status === 'success';

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return prescriptionTransferResponse;
};
