// Copyright 2022 Prescryptive Health, Inc.

import { logTelemetryEvent } from './app-insight-helper';
import {
  trackWaitlistRemoveFailureEvent,
  trackWaitlistSuccessEvent,
} from './waitlist-custom-event.helper';

jest.mock('./app-insight-helper', () => ({
  logTelemetryEvent: jest.fn(),
  logTelemetryException: jest.fn(),
}));

const logTelemetryEventMock = logTelemetryEvent as jest.Mock;

beforeEach(() => {
  logTelemetryEventMock.mockReset();
});

describe('trackWaitlistRemoveFailureEvent', () => {
  it('expects logTelemetryEvent to be called with WAITLIST_REMOVE_FAILURE as key and expected TWILIO Data in the properties', () => {
    const failureType = 'WaitlistFulfilled';
    const from = 'SENDER PHONE NUMBER';
    const fromCity = 'TACOMA';
    const fromState = 'WA';
    const fromZip = '98402';
    const fromCountry = 'USA';
    const messageSid = 'MESSAGEID from twilio';
    const waitlistId = 'waitlist id';

    trackWaitlistRemoveFailureEvent(
      failureType,
      messageSid,
      from,
      fromCity,
      fromState,
      fromZip,
      fromCountry,
      waitlistId
    );
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('WAITLIST_REMOVE_FAILURE', {
      failureType,
      messageSid,
      from,
      fromCity,
      fromState,
      fromZip,
      fromCountry,
      waitlistId,
    });
  });
});

describe('trackWaitlistSuccessEvent', () => {
  it('expects logTelemetryEvent to be called with WAITLIST_REMOVE_SUCCESS as key and expected TWILIO Data in the properties', () => {
    const from = 'SENDER PHONE NUMBER';
    const fromCity = 'TACOMA';
    const fromState = 'WA';
    const fromZip = '98402';
    const fromCountry = 'USA';
    const messageSid = 'MESSAGEID from twilio';
    const waitlistId = 'waitlist id';

    trackWaitlistSuccessEvent(
      messageSid,
      from,
      fromCity,
      fromState,
      fromZip,
      fromCountry,
      waitlistId
    );
    expect(logTelemetryEventMock).toBeCalledTimes(1);
    expect(logTelemetryEventMock).toBeCalledWith('WAITLIST_REMOVE_SUCCESS', {
      messageSid,
      from,
      fromCity,
      fromState,
      fromZip,
      fromCountry,
      waitlistId,
    });
  });
});
