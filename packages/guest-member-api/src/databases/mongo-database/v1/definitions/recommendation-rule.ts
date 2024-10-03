// Copyright 2018 Prescryptive Health, Inc.

import { Schema, SchemaDefinition } from 'mongoose';
import { IRecommendationRule } from '@phx/common/src/models/recommendation';

export const RecommendationRuleDefinition = (
  medicationSchema: Schema
): SchemaDefinition<IRecommendationRule> => ({
  alternativeSubstitution: {
    required: false,
    type: {
      toMedication: medicationSchema,
      savings: { required: false, type: String },
      planSavings: { required: false, type: String },
    },
  },
  description: { required: true, type: String },
  genericSubstitution: {
    required: false,
    type: {
      toMedication: medicationSchema,
      savings: { required: false, type: String },
      planSavings: { required: false, type: String },
    },
  },
  medication: { required: true, type: medicationSchema },
  minimumSavingsAmount: { required: false, type: String },
  minimumPlanSavingsAmount: { required: false, type: String },
  notificationMessageTemplate: { required: false, type: String },
  planGroupNumber: { required: true, type: String },
  reversalMessageTemplate: { required: false, type: String },
  type: { required: true, type: String },
});
