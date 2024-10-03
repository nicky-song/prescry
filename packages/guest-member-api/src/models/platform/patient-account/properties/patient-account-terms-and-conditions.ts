// Copyright 2022 Prescryptive Health, Inc.

export interface ITermsAndConditionsAcceptance {
  hasAccepted: boolean;
  allowSmsMessages: boolean;
  allowEmailMessages: boolean;
  fromIP?: string | undefined;
  acceptedDateTime: string;
  browser: string | undefined;
}
