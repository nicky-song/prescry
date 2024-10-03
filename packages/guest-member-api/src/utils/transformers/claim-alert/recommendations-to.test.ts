// Copyright 2022 Prescryptive Health, Inc.

import { toTransformer } from './recommendations-to';
import { mockGeneric, mockAlternative } from './__mocks__/recommendations';

describe('to rule mapper', () => {
  test('generic', () => {
    const result = toTransformer(mockGeneric);
    expect(result.savings).toBe(mockGeneric.savings);
    expect(result.planSavings).toBe(mockGeneric.planSavings);
    expect(result.drugs.length).toBe(1);
  });
  test('alternative', () => {
    const result = toTransformer(mockAlternative);
    expect(result.savings).toBe(mockAlternative.savings);
    expect(result.planSavings).toBe(mockAlternative.planSavings);
    expect(result.drugs.length).toBe(1);
  });
});
