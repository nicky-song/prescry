// Copyright 2020 Prescryptive Health, Inc.

import { EventIdentifierDefinition } from './event-identifier.definition';

describe('EventIdentifierDefinition()', () => {
  it('creates instance of SchemaDefinition<IEventIdentifier>', () => {
    const result = EventIdentifierDefinition();
    expect(result).toMatchObject({
      type: { type: String, required: true },
      value: { type: String, required: true },
    });
  });
});
