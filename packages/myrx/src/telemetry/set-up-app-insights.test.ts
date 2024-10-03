// Copyright 2022 Prescryptive Health, Inc.

import {
  IConfig,
  IConfiguration,
  ITelemetryPlugin,
} from '@microsoft/applicationinsights-web';
import { createBrowserHistory } from 'history';
import { setUpAppInsights } from './set-up-app-insights';
import { GuestExperienceTelemetryService } from './guest-experience-telemetry-service';

const mockAddTelemetryInitializerFn = jest.fn();

const mockHistory = 'fakeHistoryObject';
jest.mock('history', () => ({
  createBrowserHistory: jest.fn(() => mockHistory),
}));

const createBrowserHistoryMock = createBrowserHistory as jest.Mock;

jest.mock('./guest-experience-telemetry-service', () => ({
  GuestExperienceTelemetryService: jest.fn().mockImplementation(() => {
    return {
      appInsights: {
        addTelemetryInitializer: mockAddTelemetryInitializerFn,
      },
    };
  }),
}));

describe('setUpAppInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call createBrowserHistory', () => {
    setUpAppInsights('fake-key', 'fake-service-name', {
      identifier: 'test',
    } as ITelemetryPlugin);
    expect(createBrowserHistoryMock).toHaveBeenCalledTimes(1);
  });

  it('should call GuestExperienceTelemetryService constructor with parameter', () => {
    const fakeKey = 'fake-key';

    setUpAppInsights(fakeKey, 'fake-service-name', {
      identifier: 'test',
    } as ITelemetryPlugin);
    const mockConfig: IConfig & IConfiguration = {
      disableAjaxTracking: true,
      disableFetchTracking: false,
      enableCorsCorrelation: true,
      instrumentationKey: fakeKey,
    };
    const mockHistoryObject = { history: mockHistory };
    expect(GuestExperienceTelemetryService).toHaveBeenCalledWith(
      mockConfig,
      { identifier: 'test' },
      mockHistoryObject
    );
  });

  it('should call AddTelemetryInitializer once', () => {
    setUpAppInsights('fake-key', 'fake-service-name', {
      identifier: 'test',
    } as ITelemetryPlugin);
    expect(mockAddTelemetryInitializerFn).toBeCalledTimes(1);
  });
});
