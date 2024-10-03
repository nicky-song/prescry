// Copyright 2022 Prescryptive Health, Inc.

import { DrugPrice } from './../types';
import { Validators, ScenarioSet, scenarioFactory } from './data-generator';

export type AlternativesInput = {
  ndc: string;
  price: number;
  coverage: number;
};

export const altValidators: Validators<DrugPrice> = {
  validateAmount: ({ totalAmountPaid, patientPayAmount, planTotalPaid }) =>
    totalAmountPaid === patientPayAmount + planTotalPaid,
  validatePositive: ({ totalAmountPaid, patientPayAmount, planTotalPaid }) =>
    totalAmountPaid > 0 &&
    ((patientPayAmount >= 0 && planTotalPaid > 0) ||
      (patientPayAmount > 0 && planTotalPaid >= 0)),
  validateCustomerPaysMore: ({ patientPayAmount, planTotalPaid }) =>
    patientPayAmount > planTotalPaid,
  validatePlanAmount: ({ patientPayAmount }) => patientPayAmount > 0,
  validateCustomerAmount: ({ planTotalPaid }) => planTotalPaid > 0,
};

const generator = (input: AlternativesInput) => {
  const { ndc, price, coverage } = input;
  return {
    ndc,
    patientPayAmount: price - coverage,
    planTotalPaid: coverage,
    totalAmountPaid: price,
  };
};

const alternativesSet: ScenarioSet<AlternativesInput, DrugPrice> = {
  bothSaves: {
    input: { ndc: '00023916360', price: 240, coverage: 40 },
    generator,
    validators: [altValidators.validateAmount],
  },
  memberSaves: {
    input: { ndc: '00023916360', price: 240, coverage: 1 },
    generator,
    validators: [altValidators.validateAmount],
  },
  planSaves: {
    input: { ndc: '00023916360', price: 100, coverage: 99 },
    generator,
    validators: [altValidators.validateAmount],
  },
  greatPrice: {
    input: { ndc: '00023916360', price: 5, coverage: 4 },
    generator,
    validators: [altValidators.validateAmount],
  },
  bothComboGeneric: {
    input: { ndc: '00169368712', price: 10000, coverage: 5000 },
    generator,
    validators: [altValidators.validateAmount],
  },
  memberComboGeneric: {
    input: { ndc: '00169368712', price: 100, coverage: 0.1 },
    generator,
    validators: [altValidators.validateAmount],
  },
  planComboGeneric: {
    input: { ndc: '00169368712', price: 100, coverage: 99 },
    generator,
    validators: [altValidators.validateAmount],
  },
};

const altDrugData = scenarioFactory(alternativesSet);
export { altDrugData };
