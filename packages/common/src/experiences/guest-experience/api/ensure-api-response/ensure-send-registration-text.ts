// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorConstants } from '../../../../theming/constants';
export interface ISendRegistrationLink {
  message?: string;
  status?: string;
}
export const ensureSendRegistrationText = (
  responseJson: ISendRegistrationLink
): ISendRegistrationLink => {
  const response = responseJson as ISendRegistrationLink;
  const isValid = response.message && response.status;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
