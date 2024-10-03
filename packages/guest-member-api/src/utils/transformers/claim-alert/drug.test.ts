// Copyright 2022 Prescryptive Health, Inc.

import {
  drugTransformerPrescriptionDetails,
  drugTransformerPrescribedMedication,
} from './drug';
import { mockMedication2 as mockMedication } from './__mocks__/recommendations';

describe('drugMappers', () => {
  test('drugMapperPrescriptionDetails', () => {
    const quantity = 30;
    const supply = 30;
    const savings = { memberPays: 20, planPays: 50 };
    const result = drugTransformerPrescriptionDetails({
      fromModel: mockMedication,
      additional: { quantity, supply, ...savings },
    });

    expect(result.productName).toBe(mockMedication.name);
    expect(result.formCode).toBe(mockMedication.form);
    expect(result.supply).toBe(supply);
    expect(result.quantity).toBe(quantity);
    expect(result.strength).toBe(mockMedication.strength);
    expect(result.unit).toBe(mockMedication.units);
    expect(result.formCode).toBe(mockMedication.form);
    expect(result.memberPays).toBe(savings.memberPays);
    expect(result.planPays).toBe(savings.planPays);
  });

  test('drugMapperPrescribedMedication', () => {
    const cost = {
      price: 20,
      planPrice: 50,
      orderDate: new Date().toDateString(),
    };
    const { strength, units: unit, form: formCode } = mockMedication;
    const drugDetails = {
      strength,
      unit,
      formCode,
      quantity: 30,
      supply: 30,
    };
    const result = drugTransformerPrescribedMedication({
      fromModel: mockMedication,
      additional: { drugDetails, ...cost },
    });

    expect(result.drugName).toBe(mockMedication.name);
    expect(result.price).toBe(cost.price);
    expect(result.planPrice).toBe(cost.planPrice);
    expect(result.drugDetails).toMatchObject(drugDetails);
  });
});
