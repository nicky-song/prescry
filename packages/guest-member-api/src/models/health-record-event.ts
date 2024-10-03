// Copyright 2020 Prescryptive Health, Inc.

export interface IHealthRecordEvent<T> {
  identifiers: IEventIdentifier[];
  createdOn: number;
  createdBy: string;
  tags?: string[];
  eventType: string;
  eventData: T;
}
export interface IEventIdentifier {
  type: string;
  value: string;
}
