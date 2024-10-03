// Copyright 2021 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { logTelemetryEvent } from '../utils/app-insight-helper';

export const logRequestBodyMiddleware = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  if (request.method === 'POST' && request.body) {
    const requestUrl = request.originalUrl.toLowerCase();

    const requestEligibleToLog = !(
      requestUrl.includes('account/add') ||
      requestUrl.includes('account/pin/verify') ||
      requestUrl.includes('account/pin/update')
    );
    if (requestEligibleToLog) {
      const body = JSON.stringify(request.body);
      if (body !== '{}') {
        logTelemetryEvent(`REQUEST_BODY_${request.url}`, {
          body: JSON.stringify(request.body),
          originalUrl: request.originalUrl,
        });
      }
    }
  }
  return next();
};
