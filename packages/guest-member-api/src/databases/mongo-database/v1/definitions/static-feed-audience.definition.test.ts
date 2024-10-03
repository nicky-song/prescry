// Copyright 2020 Prescryptive Health, Inc.

import { StaticFeedAudienceDefinition } from './static-feed-audience.definition';

describe('StaticFeedAudienceDefinition()', () => {
  it('creates instance of SchemaDefinition<IStaticFeedAudience>', () => {
    const result = StaticFeedAudienceDefinition();
    expect(result).toEqual({
      exclude: { type: [String], required: false },
      include: { type: [String], required: false },
    });
  });
});
