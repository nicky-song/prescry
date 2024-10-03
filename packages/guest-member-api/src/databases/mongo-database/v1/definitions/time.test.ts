// Copyright 2018 Prescryptive Health, Inc.

import { TimeDefinition } from './time';

describe('HourDefinition()', () => {
  it('creates instance of SchemaDefinition<IHour>', () => {
    const result = TimeDefinition();
    expect(result).toMatchObject({
      h: { type: Number, required: false },
      m: { type: Number, required: false },
      pm: { type: Boolean, required: false },
    });
  });
});
