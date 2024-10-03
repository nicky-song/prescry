// Copyright 2020 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { StaticFeedContextDefinition } from './static-feed-context.definition';

describe('StaticFeedContextDefinition()', () => {
  it('creates instance of SchemaDefinition<IStaticFeedContext>', () => {
    const serviceListSchema = {} as Schema;
    const result = StaticFeedContextDefinition(serviceListSchema);
    expect(result).toEqual({
      title: { type: String, required: false },
      description: { type: String, required: false },
      type: { type: String, required: false },
      markDownText: { type: String, required: false },
      minAge: { type: Number, required: false },
      serviceList: { type: [serviceListSchema], required: false },
      featureFlag: { type: String, required: false },
      serviceType: { type: String, required: false },
    });
  });
});
