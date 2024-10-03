// Copyright 2022 Prescryptive Health, Inc.

export interface ITwilioError {
  isKnownError: boolean;
  message: string;
  type?: string;
}
