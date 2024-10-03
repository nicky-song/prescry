// Copyright 2023 Prescryptive Health, Inc.

import { StaticFeedContextServiceListSubTextDefinition } from './static-feed-context-service-list-subtext.definition';

describe('StaticFeedContextServiceListSubTextDefinition()', () => {
  it('creates instance of SchemaDefinition<IStaticFeedContextServiceItemSubText>', () => {
    const result = StaticFeedContextServiceListSubTextDefinition();
    expect(result).toEqual({
      language: { type: String, required: true },
      markDownText: { type: String, required: true },
    });
  });
});
