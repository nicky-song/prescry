// Copyright 2020 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IAppointmentsResponse } from '../../../../models/api-response/appointment.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureGetAppointmentsListResponse = (responseJson: unknown) => {
  const response = responseJson as IAppointmentsResponse;
  const isValid = response.data && response.data.appointments;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }
  return response;
};
