// Copyright 2022 Prescryptive Health, Inc.

import { logTelemetryEvent } from './app-insight-helper';

export function trackClaimAlertUnauthorizeFailureEvent(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  phoneNumber: string,
  claimAlertIdAccessed: string,
  claimAlertPhoneNumber: string
) {
  logTelemetryEvent('LOGIN_CLAIM_ALERT_FAILURE', {
    failureType: 'unauthorizedRequest',
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    claimAlertIdAccessed,
    claimAlertPhoneNumber,
  });
}
