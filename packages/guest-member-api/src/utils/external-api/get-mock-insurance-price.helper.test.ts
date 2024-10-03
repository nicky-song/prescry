// Copyright 2022 Prescryptive Health, Inc.

import { getMockInsurancePrice, mockInsurancePrice } from "./get-mock-insurance-price.helper";

describe('getMockInsurancePrice', () => {
  it('Return expected insurance price', () => {
    const insurancePrice = getMockInsurancePrice();
    expect(insurancePrice).toEqual(mockInsurancePrice);
  });
});
