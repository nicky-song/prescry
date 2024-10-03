// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { RecommendationDefinition } from './recommendation';

describe('RecommendationDefinition()', () => {
  it('creates instance of SchemaDefinition<IRecommendation>', () => {
    const RecommendationRuleSchema = {} as Schema;

    const result = RecommendationDefinition(RecommendationRuleSchema);
    expect(result).toMatchObject({
      identifier: { required: true, type: String },
      rule: { required: true, type: RecommendationRuleSchema },
      savings: { required: true, type: Number },
      type: { required: true, type: String },
    });
  });
});
