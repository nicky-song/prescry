// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import {
  TelemetryEventsDefination,
  TelemetryIdsDefination,
} from './telemetry-id';

describe('TelemetryIdsDefination()', () => {
  it('creates instance of SchemaDefinition<ITelemetryIds>', () => {
    const result = TelemetryIdsDefination();
    expect(result).toMatchObject({
      correlationId: { required: true, type: String },
      operationId: { required: true, type: String },
    });
  });
});

describe('TelemetryEventsDefination()', () => {
  it('creates instance of SchemaDefinition<ITelemetryEvents>', () => {
    const TelemetryIdsSchema = {} as Schema;
    const result = TelemetryEventsDefination(TelemetryIdsSchema);
    expect(result).toMatchObject({
      events: { required: false, type: [TelemetryIdsSchema] },
    });
  });
});
