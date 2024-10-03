// Copyright 2020 Prescryptive Health, Inc.

import { IStaticFeedContextServiceItem } from '@phx/common/src/models/static-feed';
import { Schema, SchemaDefinition } from 'mongoose';

export const StaticFeedContextServiceListDefinition = (
  StaticFeedContextServiceItemSubTextSchema: Schema
): SchemaDefinition<IStaticFeedContextServiceItem> => ({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceType: { type: String, required: true },
  subText: {
    type: [StaticFeedContextServiceItemSubTextSchema],
    required: false,
  },
  minAge: { type: Number, required: false },
  featureFlag: { type: String, required: false },
  cost: { type: String, required: false },
  enabled: { type: Boolean, required: true },
});
