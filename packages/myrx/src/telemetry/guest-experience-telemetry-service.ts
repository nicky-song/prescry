// Copyright 2022 Prescryptive Health, Inc.

import {
  ApplicationInsights,
  IConfig,
  IConfiguration,
  ITelemetryPlugin,
} from '@microsoft/applicationinsights-web';
import { History } from 'history';
import { ICustomPropertiesForLoggingCustomEvent } from '@phx/common/src/experiences/guest-experience/api/ensure-api-response/ensure-api-response';
import { GuestExperienceConfig } from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import {
  ILogAction,
  ILogActionMiddleware,
} from '@phx/common/src/experiences/store/store-logger.middleware';
import { Dispatch } from 'react';
export class GuestExperienceTelemetryService {
  public appInsights: ApplicationInsights;

  public requestCounter = 0;
  public constructor(
    appInsightsConfigRule: IConfiguration & IConfig,
    appInsightPlatformPlugin: ITelemetryPlugin,
    appPluginConfig?: { [key in string]: History }
  ) {
    this.appInsights = new ApplicationInsights({
      config: {
        ...appInsightsConfigRule,
        extensionConfig: {
          [appInsightPlatformPlugin.identifier]: appPluginConfig,
        },
        extensions: [appInsightPlatformPlugin],
      },
    });
    this.appInsights.loadAppInsights();
  }

  public getLogActionMiddlewareBuilder = (
    actionType?: string[]
  ): ILogActionMiddleware => {
    const dispatchHandler = (next: Dispatch<ILogAction>) => {
      const actionHandler = (action: ILogAction): void => {
        if (actionType && actionType.indexOf(action.type) !== -1) {
          this.truncatePayload(action, 8000);
        }
        next(action);
      };

      return actionHandler;
    };

    const middlewareBuilder = () => dispatchHandler;
    return middlewareBuilder;
  };

  public trackEvent(actionType: string, payload: string) {
    this.appInsights.trackEvent({
      name: actionType,
      properties: { payload },
    });
  }

  public trackCustomEvent<T = ICustomPropertiesForLoggingCustomEvent>(
    actionType: string,
    eventProperties: T
  ) {
    this.appInsights.trackEvent({
      name: actionType,
      properties: eventProperties,
    });
  }

  public trackTrace(action: ILogAction) {
    this.appInsights.trackTrace({
      message: this.customMessageLogging(action, 32000),
    });
  }

  public truncatePayload(action: ILogAction, size: number) {
    let payload = action.payload || '';
    const actionList: string[] | undefined =
      GuestExperienceConfig.allowedActionTypeList;

    if (actionList && actionList.indexOf(action.type) < 0) {
      payload = '';
    }

    const navigationActionPayload = this.getNavigationActionPayload(action);
    if (navigationActionPayload) {
      payload = navigationActionPayload;
    }

    const payloadTruncated = JSON.stringify(payload).substring(0, size);
    this.trackEvent(action.type, payloadTruncated);
  }

  public customMessageLogging(action: ILogAction, messageLimit: number) {
    const payload = action.payload || '';
    return `Redux action type: ${action.type},Route name: ${
      action.routeName
    },Action payload: ${JSON.stringify(payload).substr(0, messageLimit)}`;
  }

  public trackCustomException(error: Error) {
    this.appInsights.trackException({ exception: error });
  }

  public setTelemetryId(operationId: string) {
    this.requestCounter++;
    const newOperationId = `${operationId}.${this.requestCounter}_`;
    this.appInsights.context.telemetryTrace.parentID = operationId;
    this.appInsights.context.telemetryTrace.traceID = newOperationId;
    return newOperationId;
  }

  public getNavigationActionPayload(
    action: ILogAction
  ): INavigationActionPayload | undefined {
    const routeName = action.routeName;

    if (routeName) {
      const payload: INavigationActionPayload = {
        routeName,
        params: action.params,
      };
      return payload;
    }

    return undefined;
  }
}

interface INavigationActionPayload {
  routeName: string;
  params?: unknown;
}
