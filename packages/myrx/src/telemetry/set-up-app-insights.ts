// Copyright 2022 Prescryptive Health, Inc.

import {
  IConfig,
  IConfiguration,
  ITelemetryPlugin,
} from '@microsoft/applicationinsights-web';
import { createBrowserHistory } from 'history';
import { GuestExperienceTelemetryService } from './guest-experience-telemetry-service';

export function setUpAppInsights(
  instrumentationKey: string,
  serviceName: string,
  appInsightReactPlugin: ITelemetryPlugin
): GuestExperienceTelemetryService {
  const browserHistory = createBrowserHistory();

  const appInsightsConfig: IConfig & IConfiguration = {
    disableAjaxTracking: true,
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    instrumentationKey,
  };

  const telemetryService = new GuestExperienceTelemetryService(
    appInsightsConfig,
    appInsightReactPlugin,
    { history: browserHistory }
  );
  telemetryService.appInsights.addTelemetryInitializer((envelope) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    envelope.tags!['ai.cloud.role'] = serviceName;
  });

  return telemetryService;
}
