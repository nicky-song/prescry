// Copyright 2018 Prescryptive Health, Inc.

export interface ITelemetryEvents {
  events?: ITelemetryIds[];
}
export interface ITelemetryIds {
  operationId: string;
  correlationId: string;
}
