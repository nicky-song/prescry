// Copyright 2020 Prescryptive Health, Inc.

import { InternalStringResponseCode } from '../../experiences/guest-experience/api/response-codes';

export interface ISessionResponse {
  message: string;
  status: string;
  responseCode: InternalStringResponseCode;
  data?: {
    recoveryEmailExists: boolean;
  };
}
