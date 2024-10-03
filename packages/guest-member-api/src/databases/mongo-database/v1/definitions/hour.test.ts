// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { HourDefinition } from './hour';

describe('HoursDefinition()', () => {
  it('creates instance of SchemaDefinition<IHours>', () => {
    const timeSchema = {} as Schema;
    const result = HourDefinition(timeSchema);
    expect(result).toMatchObject({
      closes: { type: timeSchema, required: false },
      day: { type: String, required: true },
      opens: { type: timeSchema, required: false },
    });
  });
});
