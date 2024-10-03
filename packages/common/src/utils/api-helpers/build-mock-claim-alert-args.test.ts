// Copyright 2022 Prescryptive Health, Inc.

import {
  alternativeMemberComboBrand,
  alternativeMemberComboGeneric,
  alternativeMemberSingleBrand,
  alternativeMemberSingleGeneric,
  alternativePlanComboBrand,
  alternativePlanComboGenericMock,
  alternativePlanSingleBrand,
  alternativePlanSingleGeneric,
  bestPriceBrand,
  bestPriceGeneric,
} from '../../experiences/guest-experience/__mocks__/claim-alert.mock';
import { buildMockClaimAlertArgs } from './build-mock-claim-alert-args';

describe('buildMockClaimAlertArgs', () => {
  it("returns alternativePlanComboBrand mock object when given 'alternative-plan-combo-brand' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-plan-combo-brand'
    );

    expect(mockClaimAlert).toEqual(alternativePlanComboBrand);
  });

  it("returns alternativePlanComboGeneric mock object when given 'alternative-plan-combo-generic' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-plan-combo-generic'
    );

    expect(mockClaimAlert).toEqual(alternativePlanComboGenericMock);
  });

  it("returns alternativePlanSingleBrand mock object when given 'alternative-plan-single-brand' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-plan-single-brand'
    );

    expect(mockClaimAlert).toEqual(alternativePlanSingleBrand);
  });

  it("returns alternativePlanSingleGeneric mock object when given 'alternative-plan-single-generic' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-plan-single-generic'
    );

    expect(mockClaimAlert).toEqual(alternativePlanSingleGeneric);
  });

  it("returns alternativeMemberComboBrand mock object when given 'alternative-member-combo-brand' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-member-combo-brand'
    );

    expect(mockClaimAlert).toEqual(alternativeMemberComboBrand);
  });

  it("returns alternativeMemberComboGeneric mock object when given 'alternative-member-combo-generic' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-member-combo-generic'
    );

    expect(mockClaimAlert).toEqual(alternativeMemberComboGeneric);
  });

  it("returns alternativeMemberSingleBrand mock object when given 'alternative-member-single-brand' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-member-single-brand'
    );

    expect(mockClaimAlert).toEqual(alternativeMemberSingleBrand);
  });

  it("returns alternativeMemberSingleGeneric mock object when given 'alternative-member-single-generic' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs(
      'alternative-member-single-generic'
    );

    expect(mockClaimAlert).toEqual(alternativeMemberSingleGeneric);
  });

  it("returns bestPriceBrand mock object when given 'best-price-brand' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs('best-price-brand');

    expect(mockClaimAlert).toEqual(bestPriceBrand);
  });

  it("returns bestPriceGeneric mock object when given 'best-price-generic' path", () => {
    const mockClaimAlert = buildMockClaimAlertArgs('best-price-generic');

    expect(mockClaimAlert).toEqual(bestPriceGeneric);
  });
});
