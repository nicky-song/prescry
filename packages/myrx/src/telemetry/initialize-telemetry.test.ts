// Copyright 2022 Prescryptive Health, Inc.

import { GuestExperienceLogService } from '@phx/common/src/experiences/guest-experience/guest-experience-log-service';
import {
  initializeTelemetry,
  reactTelemetryPlugin,
} from './initialize-telemetry';
import { setUpAppInsights } from './set-up-app-insights';

jest.mock('./set-up-app-insights', () => ({
  setUpAppInsights: jest.fn().mockReturnValue({
    appInsights: 'fakeAppInsights',
    getLogActionMiddlewareBuilder: 'fakeBuilder',
    requestCounter: 0,
    setTelemetryId: 'fakeSetTelemetryId',
    trackCustomEvent: 'fakeTrackCustomEvent',
    trackCustomException: 'fakeException',
    trackEvent: 'fakeTrackEvent',
  }),
}));
const mockSetUpAppInsights = setUpAppInsights as jest.Mock;

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  ReactPlugin: jest.fn(),
}));

describe('initializeAppInsightService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes GuestExperienceLogService', () => {
    mockSetUpAppInsights.mockReturnValue({
      appInsights: 'fakeAppInsights',
      getLogActionMiddlewareBuilder: 'fakeBuilder',
      requestCounter: 0,
      setTelemetryId: 'fakeSetTelemetryId',
      trackCustomEvent: 'fakeTrackCustomEvent',
      trackCustomException: 'fakeException',
      trackEvent: 'fakeTrackEvent',
    });

    const instrumentionKeyMock = 'instrumentation-key';
    const serviceNameMock = 'service-name';
    initializeTelemetry({
      instrumentationKey: instrumentionKeyMock,
      serviceName: serviceNameMock,
    });

    expect(mockSetUpAppInsights).toHaveBeenCalledWith(
      instrumentionKeyMock,
      serviceNameMock,
      reactTelemetryPlugin
    );

    expect(GuestExperienceLogService.loggerMiddleware).toBe('fakeBuilder');
    expect(GuestExperienceLogService.logException).toBe('fakeException');
    expect(GuestExperienceLogService.appInsights).toBe('fakeAppInsights');
    expect(GuestExperienceLogService.trackEvent).toBe('fakeTrackCustomEvent');
    expect(GuestExperienceLogService.setTelemetryId).toBe('fakeSetTelemetryId');
    expect(GuestExperienceLogService.requestCounter).toBe(0);
  });
});
