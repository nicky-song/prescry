// Copyright 2022 Prescryptive Health, Inc.

import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { GuestExperienceLogService } from '@phx/common/src/experiences/guest-experience/guest-experience-log-service';
import { setUpAppInsights } from './set-up-app-insights';
import { ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ITelemetryConfig } from '@phx/common/src/utils/api.helper';

export const reactTelemetryPlugin: ReactPlugin = new ReactPlugin();

export const initializeTelemetry = ({
  instrumentationKey,
  serviceName,
}: ITelemetryConfig) => {
  const setup = setUpAppInsights(
    instrumentationKey,
    serviceName,
    reactTelemetryPlugin as ITelemetryPlugin
  );
  GuestExperienceLogService.loggerMiddleware =
    setup.getLogActionMiddlewareBuilder;
  GuestExperienceLogService.logException = setup.trackCustomException;
  GuestExperienceLogService.appInsights = setup.appInsights;
  GuestExperienceLogService.trackEvent = setup.trackCustomEvent;
  GuestExperienceLogService.setTelemetryId = setup.setTelemetryId;
  GuestExperienceLogService.requestCounter = setup.requestCounter;
};
