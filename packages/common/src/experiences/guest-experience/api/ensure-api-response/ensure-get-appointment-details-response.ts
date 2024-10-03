// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IAppointmentResponse } from '../../../../models/api-response/appointment.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetAppointmentDetailsResponse = (
  responseJson: unknown
): IAppointmentResponse => {
  const response = responseJson as IAppointmentResponse;
  const isValid = response.data;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
