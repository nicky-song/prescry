// Copyright 2022 Prescryptive Health, Inc.

export type CommonEventType = 'notification' | 'error';
export type MessageOrigin = 'connectServiceAgent' | 'myPHX';

export interface ICommonBusinessMonitoringEventData {
  idType: string;
  id: string;
  messageOrigin: MessageOrigin;
  tags: string[];
  type: CommonEventType;
  subject: string;
  messageData: string;
  eventDateTime: string;
}

export type CommonTopic = 'Business' | 'Monitoring';

export interface ICommonBusinessMonitoringEvent {
  topic: CommonTopic;
  eventData: ICommonBusinessMonitoringEventData;
}
