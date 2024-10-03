// Copyright 2023 Prescryptive Health, Inc.

export type EventType = 'notification' | 'error';

export interface ISendEventRequestBody {
  idType: string;
  id: string;
  tags: string[];
  type?: EventType;
  subject: string;
  messageData: string;
}
