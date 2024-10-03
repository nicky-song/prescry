// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IUIContentResponse } from '../../../../models/api-response/ui-content-response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetUIContentResponse = (responseJson: unknown) => {
  const response = responseJson as IUIContentResponse;

  if (!response) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
