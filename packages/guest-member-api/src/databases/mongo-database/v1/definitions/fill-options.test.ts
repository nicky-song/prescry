// Copyright 2018 Prescryptive Health, Inc.

import { FillOptionsDefinition } from './fill-options';

describe('FillOptionsDefinition()', () => {
  it('creates instance of SchemaDefinition<IFillOptions>', () => {
    const result = FillOptionsDefinition();
    expect(result).toMatchObject({
      authorizedRefills: { required: true, type: Number },
      count: { required: true, type: Number },
      daysSupply: { required: false, type: Number },
      fillNumber: { required: true, type: Number },
    });
  });
});
