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
  alternativeBothComboBrand,
  alternativeBothComboGeneric,
  alternativeBothSingleBrand,
  alternativeBothSingleGeneric,
  bestPriceBrand,
  bestPriceGeneric,
} from '../../experiences/guest-experience/__mocks__/claim-alert.mock';
import { IClaimAlert } from '../../models/claim-alert/claim-alert';

type root = 'alternative' | 'best-price';
type whoSaves = 'plan' | 'member' | 'both';
type amount = 'single' | 'combo';
type drug = 'brand' | 'generic';

export type Dasherize<T1 extends string, T2 extends string> = `${T1}-${T2}`;

export type AlternativeClaimPath = Dasherize<
  Dasherize<Dasherize<Exclude<root, 'best-price'>, whoSaves>, amount>,
  drug
>;
export type BestPriceClaimPath = Dasherize<Exclude<root, 'alternative'>, drug>;

export type ClaimPath = AlternativeClaimPath | BestPriceClaimPath;

export type ClaimNotification =
  | 'alternativesAvailable'
  | 'bestPrice'
  | 'reversal';

type MockMap = {
  [k in ClaimPath]: IClaimAlert;
};

export const claimAlertMocks: MockMap = {
  'alternative-plan-combo-brand': alternativePlanComboBrand,
  'alternative-plan-combo-generic': alternativePlanComboGenericMock,
  'alternative-plan-single-brand': alternativePlanSingleBrand,
  'alternative-plan-single-generic': alternativePlanSingleGeneric,
  'alternative-member-combo-brand': alternativeMemberComboBrand,
  'alternative-member-combo-generic': alternativeMemberComboGeneric,
  'alternative-member-single-brand': alternativeMemberSingleBrand,
  'alternative-member-single-generic': alternativeMemberSingleGeneric,
  'alternative-both-combo-brand': alternativeBothComboBrand,
  'alternative-both-combo-generic': alternativeBothComboGeneric,
  'alternative-both-single-brand': alternativeBothSingleBrand,
  'alternative-both-single-generic': alternativeBothSingleGeneric,
  'best-price-brand': bestPriceBrand,
  'best-price-generic': bestPriceGeneric,
};

// TODO: M.Meletti - Update this to be more then a single structure
export const claimAlertMockMap = new Map<string, IClaimAlert>([
  ['alternative-plan-combo-brand', alternativePlanComboBrand],
  ['alternative-plan-combo-generic', alternativePlanComboGenericMock],
  ['alternative-plan-single-brand', alternativePlanSingleBrand],
  ['alternative-plan-single-generic', alternativePlanSingleGeneric],
  ['alternative-member-combo-brand', alternativeMemberComboBrand],
  ['alternative-member-combo-generic', alternativeMemberComboGeneric],
  ['alternative-member-single-brand', alternativeMemberSingleBrand],
  ['alternative-member-single-generic', alternativeMemberSingleGeneric],
  ['alternative-both-combo-brand', alternativeBothComboBrand],
  ['alternative-both-combo-generic', alternativeBothComboGeneric],
  ['alternative-both-single-brand', alternativeBothSingleBrand],
  ['alternative-both-single-generic', alternativeBothSingleGeneric],
  ['best-price-brand', bestPriceBrand],
  ['best-price-generic', bestPriceGeneric],
]);

export const buildMockClaimAlertArgs = (path: ClaimPath) => {
  return claimAlertMocks[path];
};
