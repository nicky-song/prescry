// Copyright 2021 Prescryptive Health, Inc.

export interface IRemoveWaitlistRequestBody {
  To: string;
  AccountSid: string;
  Body: string;
  From: string;
  FromCity: string;
  FromCountry: string;
  FromState: string;
  FromZip: string;
  MessageSid: string;
}

export type WaitlistRemoveFailure =
  | 'NoWaitlistForPhone'
  | 'InvalidAccountSidOrPhone'
  | 'InvalidTwilioSignature'
  | 'WaitlistFulfilled'
  | 'WaitlistCanceled'
  | 'WaitlistError';

export interface IWaitlistRemoveOperationResult {
  success: boolean;
  firstName: string;
  lastName: string;
  serviceType: string;
  serviceName: string;
  identifier: string;
  failureType?: WaitlistRemoveFailure;
  error?: string;
}
