// Copyright 2018 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { Request } from 'express';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../models/terms-and-conditions-acceptance-info';

export const buildTermsAndConditionsAcceptance = (
  request: Request,
  token: string
): ITermsAndConditionsWithAuthTokenAcceptance => {
  const acceptedDateTime: string = getNewDate().toISOString();

  return {
    acceptedDateTime,
    allowEmailMessages: true,
    allowSmsMessages: true,
    authToken: token,
    browser: request.headers['user-agent'],
    fromIP: request.socket.remoteAddress,
    hasAccepted: true,
  };
};
