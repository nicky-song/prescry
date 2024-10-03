// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { IProcessInviteCodeResponse } from '../../../../models/api-response/process-invite-code.response';
import { ErrorConstants } from '../../../../theming/constants';

export const ensureProcessInviteCodeDetailsResponse = (
  responseJson: unknown
) => {
  const response = responseJson as IProcessInviteCodeResponse;
  const isValid =
    response.data &&
    response.data.availableSlots &&
    response.data.location &&
    response.data.maxDate &&
    response.data.minDate &&
    response.data.service &&
    response.data.inviteCode;

  if (!isValid) {
    throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
  }

  return response;
};
