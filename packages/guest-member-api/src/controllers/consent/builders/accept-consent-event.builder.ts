// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { IHealthRecordEvent } from '../../../models/health-record-event';
import { ApiConstants } from '../../../constants/api-constants';
import { IConsentEvent } from '../../../models/consent-event';
import { getSessionIdFromRequest } from '../../../utils/health-record-event/get-sessionid-from-request';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { mapServiceTypeToEventType } from '../../../utils/service-to-event-type-map.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';

export function acceptConsentEventBuilder(
  request: Request,
  response: Response,
  serviceType: string
): IHealthRecordEvent<IConsentEvent> {
  const eventType = mapServiceTypeToEventType(serviceType);
  const currentTime = UTCDate(new Date());
  const sessionId = getSessionIdFromRequest(request);
  const personInfo = getLoggedInUserProfileForRxGroupType(response, 'CASH');
  const primaryMemberRxId = personInfo?.primaryMemberRxId;
  const consentHealthEventRecord: IHealthRecordEvent<IConsentEvent> = {
    identifiers: [
      ...(primaryMemberRxId
        ? [{ type: 'primaryMemberRxId', value: primaryMemberRxId }]
        : []),
      {
        type: 'accountIdentifier',
        value: getRequiredResponseLocal(response, 'accountIdentifier'),
      },
    ],
    createdOn: currentTime,
    createdBy: ApiConstants.EVENT_APPLICATION_NAME,
    tags: [...(primaryMemberRxId ? [primaryMemberRxId] : [])],
    eventType,
    eventData: {
      sessionId,
      acceptedDateTime: currentTime.toString(),
      authToken:
        request.headers[RequestHeaders.accessTokenRequestHeader] ||
        request.headers.authorization,
      browser: fetchRequestHeader(request, 'user-agent'),
      fromIP: request.connection.remoteAddress,
    },
  };

  return consentHealthEventRecord;
}
