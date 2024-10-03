// Copyright 2020 Prescryptive Health, Inc.

export interface IConsentEvent {
  fromIP: string | undefined;
  acceptedDateTime: string;
  browser: string | undefined;
  authToken: string | string[] | undefined;
  sessionId: string;
}
