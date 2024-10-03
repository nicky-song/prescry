// Copyright 2022 Prescryptive Health, Inc.

import { logTelemetryEvent } from './app-insight-helper';
import { trackClaimAlertUnauthorizeFailureEvent } from './claim-alert.custom-event.helper';

jest.mock('./app-insight-helper', () => ({
  logTelemetryEvent: jest.fn(),
  logTelemetryException: jest.fn(),
}));

const logTelemetryEventMock = logTelemetryEvent as jest.Mock;

beforeEach(() => {
  logTelemetryEventMock.mockReset();
});

describe('trackClaimAlertUnauthorizeFailureEvent', () => {
  it('expects logTelemetryEvent to be called with LOGIN_CLAIM_ALERT_FAILURE as key', () => {
    const dateOfBirth = '01-05-2000';
    const firstName = 'John';
    const lastName = 'Doe';
    const phoneNumber = 'phone-number';
    const claimAlertIdAccessed = 'claim-alert-id';
    const claimAlertPhoneNumber = 'phone-number-from-claim-alert';
    trackClaimAlertUnauthorizeFailureEvent(
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      claimAlertIdAccessed,
      claimAlertPhoneNumber
    );
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('LOGIN_CLAIM_ALERT_FAILURE', {
      failureType: 'unauthorizedRequest',
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      claimAlertIdAccessed,
      claimAlertPhoneNumber,
    });
  });
});
