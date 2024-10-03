// Copyright 2020 Prescryptive Health, Inc.

import { IStaticFeed } from '@phx/common/src/models/static-feed';
import { Schema, SchemaDefinition } from 'mongoose';

export const StaticFeedDefinition = (
  audienceSchema: Schema,
  contextSchema: Schema
): SchemaDefinition<IStaticFeed> => ({
  audience: { type: audienceSchema, required: false },
  context: { type: contextSchema, required: false },
  enabled: { required: true, type: Boolean },
  endDate: { required: false, type: Date },
  feedCode: { required: true, type: String },
  priority: { required: true, type: Number },
  startDate: { required: false, type: Date },
});
