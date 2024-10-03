// Copyright 2022 Prescryptive Health, Inc.

import { senderForCommonMonitoringEvent } from './service-bus-helper';
import { ICommonBusinessMonitoringEventData } from '../../models/common-business-monitoring-event';

export const publishCommonMonitoringEventMessage = async (
  body: ICommonBusinessMonitoringEventData
): Promise<void> => {
  const msgBody = {
    body,
  };
  await senderForCommonMonitoringEvent.send(msgBody);
};
