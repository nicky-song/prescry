// Copyright 2022 Prescryptive Health, Inc.

import { WaitlistRemoveFailure } from '../models/twilio-web-hook/remove-waitlist-request.body';
import { logTelemetryEvent } from './app-insight-helper';

export function trackWaitlistRemoveFailureEvent(
  failureType: WaitlistRemoveFailure,
  messageSid: string,
  from: string,
  fromCity: string,
  fromState: string,
  fromZip: string,
  fromCountry: string,
  waitlistId: string,
  error?: string
) {
  logTelemetryEvent('WAITLIST_REMOVE_FAILURE', {
    failureType,
    messageSid,
    from,
    fromCity,
    fromState,
    fromZip,
    fromCountry,
    waitlistId,
    error,
  });
}

export function trackWaitlistSuccessEvent(
  messageSid: string,
  from: string,
  fromCity: string,
  fromState: string,
  fromZip: string,
  fromCountry: string,
  waitlistId: string
) {
  logTelemetryEvent('WAITLIST_REMOVE_SUCCESS', {
    messageSid,
    from,
    fromCity,
    fromState,
    fromZip,
    fromCountry,
    waitlistId,
  });
}
