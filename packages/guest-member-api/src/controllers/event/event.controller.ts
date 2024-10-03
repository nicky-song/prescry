// Copyright 2023 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { Request } from 'express';
import { publishCommonBusinessEventMessage } from '../../utils/service-bus/common-business-event.helper';

export class EventController {
  public sendEvent = async (request: Request) => {
    const {
      idType,
      id,
      tags,
      type = 'notification',
      subject,
      messageData,
    } = request.body;

    await publishCommonBusinessEventMessage({
      idType,
      id,
      messageOrigin: 'myPHX',
      tags,
      type,
      subject,
      messageData,
      eventDateTime: getNewDate().toISOString(),
    });
  };
}
