// Copyright 2018 Prescryptive Health, Inc.

import {
  DefaultLogActionMiddleware,
  GuestExperienceLogService,
} from './guest-experience-log-service';

// tslint:disable-next-line:no-console
console.error = jest.fn();

describe('GuestExperienceLogService', () => {
  it('should have logService with initial state', () => {
    expect(GuestExperienceLogService.loggerMiddleware()).toBe(
      DefaultLogActionMiddleware
    );
    expect(
      GuestExperienceLogService.logException(new Error('error'))
    ).toBeUndefined();
    expect(GuestExperienceLogService.appInsights).toEqual({});
    expect(
      GuestExperienceLogService.trackEvent('fake-action', {
        ExpectedFrom: 'fake ExpectedFrom',
        ExpectedInterface: 'fake ExpectedInterface',
        Message: 'fake Message',
      })
    ).toBeUndefined();
    expect(GuestExperienceLogService.setTelemetryId('operationId')).toBe(
      'operationId'
    );
    expect(GuestExperienceLogService.requestCounter).toBe(0);
  });
});
