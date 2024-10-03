// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { RecommendationRuleDefinition } from './recommendation-rule';

describe('RecommendationDefinition()', () => {
  it('creates instance of SchemaDefinition<IRecommendation>', () => {
    const medicationSchema = {} as Schema;

    const result = RecommendationRuleDefinition(medicationSchema);
    expect(result).toMatchObject({
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
  });
});
