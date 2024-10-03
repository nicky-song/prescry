// Copyright 2018 Prescryptive Health, Inc.

import { ACTION_ADD_HEALTH_RECORD_EVENT } from '../../constants/service-bus-actions';
import { senderForHealthRecordEvent } from './service-bus-helper';
import { IHealthRecordEvent } from '../../models/health-record-event';

export const publishHealthRecordEventMessage = async <TEvent>(
  data: IHealthRecordEvent<TEvent>
): Promise<void> => {
  const msgBody = {
    body: {
      action: ACTION_ADD_HEALTH_RECORD_EVENT,
      data,
    },
  };
  await senderForHealthRecordEvent.send(msgBody);
};
