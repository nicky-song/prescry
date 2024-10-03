// Copyright 2020 Prescryptive Health, Inc.

import { StaticFeedDefinition } from './static-feed.definition';
import { Schema } from 'mongoose';

describe('StaticFeedDefinition()', () => {
  it('creates instance of SchemaDefinition<IStaticFeed>', () => {
    const audienceSchema = {} as Schema;
    const contextSchema = {} as Schema;

    const result = StaticFeedDefinition(audienceSchema, contextSchema);
    expect(result).toEqual({
      audience: { type: audienceSchema, required: false },
      context: { type: contextSchema, required: false },
      enabled: { required: true, type: Boolean },
      endDate: { required: false, type: Date },
      feedCode: { required: true, type: String },
      priority: { required: true, type: Number },
      startDate: { required: false, type: Date },
    });
  });
});
