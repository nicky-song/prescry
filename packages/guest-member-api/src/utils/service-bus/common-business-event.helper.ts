// Copyright 2022 Prescryptive Health, Inc.

import { senderForCommonBusinessEvent } from './service-bus-helper';
import { ICommonBusinessMonitoringEventData } from '../../models/common-business-monitoring-event';

export const publishCommonBusinessEventMessage = async (
  body: ICommonBusinessMonitoringEventData
): Promise<void> => {
  const msgBody = {
    body,
  };
  await senderForCommonBusinessEvent.send(msgBody);
};
