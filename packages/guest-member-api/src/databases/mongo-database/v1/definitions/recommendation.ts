// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IRecommendation } from '@phx/common/src/models/recommendation';

export const RecommendationDefinition = (
  recommendationRuleSchema: Schema
): SchemaDefinition<IRecommendation> => ({
  identifier: { required: true, type: String },
  rule: { required: true, type: recommendationRuleSchema },
  savings: { required: true, type: Number },
  type: { required: true, type: String },
});
