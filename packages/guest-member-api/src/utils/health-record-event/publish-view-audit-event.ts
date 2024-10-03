// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ApiConstants } from '../../constants/api-constants';
import { IViewAuditEvent } from '../../models/view-audit-event';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { publishHealthRecordEventMessage } from '../../utils/service-bus/health-record-event-helper';
import { getRequiredResponseLocal } from '../request/request-app-locals.helper';
import { fetchRequestHeader } from '../request-helper';
import { getSessionIdFromRequest } from './get-sessionid-from-request';

export const publishViewAuditEvent = async (
  request: Request,
  response: Response,
  eventType: string,
  itemId: string,
  success: boolean,
  errorMessage?: string
) => {
  const date = getNewDate();
  const currentTime = UTCDate(date);
  const accountId = getRequiredResponseLocal(response, 'accountIdentifier');
  const sessionId = getSessionIdFromRequest(request);
  const viewAuditEvent: IViewAuditEvent = {
    identifiers: [
      {
        type: 'accountIdentifier',
        value: accountId,
      },
    ],
    createdOn: currentTime,
    createdBy: ApiConstants.EVENT_APPLICATION_NAME,
    tags: [],
    eventType,
    eventData: {
      accountId,
      success,
      itemId,
      apiUrl: request.originalUrl,
      originUrl: fetchRequestHeader(request, 'origin') ?? '',
      refererUrl: fetchRequestHeader(request, 'referer') ?? '',
      sessionId,
      accessTime: date.toString(),
      browser: fetchRequestHeader(request, 'user-agent'),
      fromIP:
        request.connection.remoteAddress ??
        fetchRequestHeader(request, 'x-forwarded-for'),
      errorMessage,
    },
  };

  await publishHealthRecordEventMessage(viewAuditEvent);
};
