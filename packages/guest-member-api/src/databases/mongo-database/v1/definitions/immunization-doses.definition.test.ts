// Copyright 2021 Prescryptive Health, Inc.

import { ImmunizationDosesDefinition } from './immunization-doses.definition';

describe('ImmunizationDosesDefinition()', () => {
  it('creates instance of SchemaDefinition<IProtocolApplied>', () => {
    const result = ImmunizationDosesDefinition();
    expect(result).toMatchObject({
      series: { type: String, required: true },
      doseNumber: { type: Number, required: true },
      seriesDoses: { type: Number, required: true },
    });
  });
});
