// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { publishViewAuditEvent } from './health-record-event/publish-view-audit-event';
import { KnownFailureResponse } from './response-helper';

export const knownFailureResponseAndPublishEvent = async (
  request: Request,
  response: Response,
  eventType: string,
  itemId: string,
  statusCode: number,
  errorMessage: string,
  internalCode?: number
) => {
  await publishViewAuditEvent(
    request,
    response,
    eventType,
    itemId,
    false,
    errorMessage
  );
  return KnownFailureResponse(
    response,
    statusCode,
    errorMessage,
    undefined,
    internalCode
  );
};
