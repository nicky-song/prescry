// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import {
  ITelemetryEvents,
  ITelemetryIds,
} from '@phx/common/src/models/telemetry-id';

export const TelemetryEventsDefination = (
  telemtryIds: Schema
): SchemaDefinition<ITelemetryEvents> => ({
  events: { required: false, type: [telemtryIds] },
});

export const TelemetryIdsDefination = (): SchemaDefinition<ITelemetryIds> => ({
  correlationId: { required: true, type: String },
  operationId: { required: true, type: String },
});
