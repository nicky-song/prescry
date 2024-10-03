// Copyright 2020 Prescryptive Health, Inc.

import { SchemaDefinition } from 'mongoose';
import { IStaticFeedContext } from '@phx/common/src/models/static-feed';
import { Schema } from 'mongoose';

export const StaticFeedContextDefinition = (
  ServiceListSchema: Schema
): SchemaDefinition<IStaticFeedContext> => ({
  title: { type: String, required: false },
  description: { type: String, required: false },
  type: { type: String, required: false },
  markDownText: { type: String, required: false },
  minAge: { type: Number, required: false },
  serviceList: { type: [ServiceListSchema], required: false },
  featureFlag: { type: String, required: false },
  serviceType: { type: String, required: false },
});
