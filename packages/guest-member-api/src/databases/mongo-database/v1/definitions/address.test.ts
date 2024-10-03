// Copyright 2018 Prescryptive Health, Inc.

import { AddressDefinition } from './address';

describe('AddressDefinition()', () => {
  it('creates instance of SchemaDefinition<IAddress>', () => {
    const result = AddressDefinition();
    expect(result).toMatchObject({
      city: { type: String, required: true },
      distance: { type: String, required: false },
      lineOne: { type: String, required: true },
      lineTwo: { type: String, required: false },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    });
  });
});
