// Copyright 2018 Prescryptive Health, Inc.

import {
  ILogActionMiddleware,
  ILogActionNext,
} from '../store/store-logger.middleware';
import { ICustomPropertiesForLoggingCustomEvent } from './api/ensure-api-response/ensure-api-response';

export const DefaultLogActionMiddleware: ILogActionMiddleware =
  (): ILogActionNext => (next) => (action) =>
    next(action);

export interface IGuestExperienceLogService {
  appInsights: object;
  loggerMiddleware: (actionType?: string[]) => ILogActionMiddleware;
  logException: (error: Error) => void;
  trackEvent: <T = ICustomPropertiesForLoggingCustomEvent>(
    actionType: string,
    payload: T
  ) => void;
  setTelemetryId: (operationId: string) => string;
  requestCounter: number;
}

export const GuestExperienceLogService: IGuestExperienceLogService = {
  appInsights: {},
  // eslint-disable-next-line no-console
  logException: (error: Error) => console.error(error),
  loggerMiddleware: () => DefaultLogActionMiddleware,
  requestCounter: 0,
  setTelemetryId: (operationId: string) => operationId,
  trackEvent: <T = ICustomPropertiesForLoggingCustomEvent>(
    actionType: string,
    payload: T
    // eslint-disable-next-line no-console
  ) => console.error(actionType, payload),
};
