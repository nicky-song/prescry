// Copyright 2020 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { StaticFeedContextServiceListDefinition } from './static-feed-context-service-list.definition';

describe('StaticFeedContextDefinition()', () => {
  it('creates instance of SchemaDefinition<IStaticFeedContextServiceItem>', () => {
    const staticFeedContextServiceItemSubTextSchema = {} as Schema;
    const result = StaticFeedContextServiceListDefinition(
      staticFeedContextServiceItemSubTextSchema
    );
    expect(result).toEqual({
      title: { type: String, required: true },
      description: { type: String, required: true },
      serviceType: { type: String, required: true },
      subText: {
        type: [staticFeedContextServiceItemSubTextSchema],
        required: false,
      },
      minAge: { type: Number, required: false },
      featureFlag: { type: String, required: false },
      cost: { type: String, required: false },
      enabled: { type: Boolean, required: true },
    });
  });
});
