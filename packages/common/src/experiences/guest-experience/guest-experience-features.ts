// Copyright 2018 Prescryptive Health, Inc.

import type { RxGroupTypes } from '../../models/member-profile/member-profile-info';

/**
 * @deprecated - Do not add feature switches here. Use FeatureSwitch or FeatureString.
 */
export type LegacyFeatureSwitch =
  | 'usecountrycode'
  | 'usegrouptypecovid'
  | 'usegrouptypesie'
  | 'usegrouptypecash'
  | 'usepharmacy'
  | 'usetestpharmacy'
  | 'usevaccine'
  | 'usesieprice'
  | 'usecashprice'
  | 'useinsurance'
  | 'usehome'
  | 'usetestcabinet';

/**
 * Launch Darkly boolean switches.
 *
 * Note: Alphabetical order makes life easier.
 */
export type FeatureSwitch =
  | 'useAccount'
  | 'useAllMedicationsSearch'
  | 'useblockchain'
  | 'useDualPrice'
  | 'uselangselector'
  | 'useNewLocalization'
  | 'usePatient'
  | 'usePointOfCare'
  | 'usertpb'
  | 'usesso'
  | 'useTestThirdPartyPricing'
  | 'useVietnamese';

/**
 * Launch Darkly string switches.
 *
 * Note: Alphabetical order makes life easier.
 */
export type FeatureString = 'memberId' | 'rxSubGroup';

export type FeatureFlag = FeatureSwitch | FeatureString | LegacyFeatureSwitch;

export type IFeaturesState = Partial<
  Record<FeatureSwitch, boolean> &
    Record<FeatureString, string> &
    Record<LegacyFeatureSwitch, boolean>
>;

export const GuestExperienceFeatures: IFeaturesState = {
  usecountrycode: false,
  usegrouptypecash: false,
  usegrouptypecovid: false,
  usegrouptypesie: false,
  usepharmacy: false,
  usetestpharmacy: false,
  usevaccine: false,
  usesieprice: false,
  usecashprice: false,
  useinsurance: false,
  usehome: false,
  usetestcabinet: false,
};

export const rxGroupTypeFeatureMap = new Map<LegacyFeatureSwitch, RxGroupTypes>(
  [
    ['usegrouptypecash', 'CASH'],
    ['usegrouptypesie', 'SIE'],
    ['usegrouptypecovid', 'COVID19'],
  ]
);

export const getFirstRxGroupTypeByFeatureSwitch = (
  features: IFeaturesState
): RxGroupTypes | undefined => {
  return getFirstValueByFeatureSwitch(features, rxGroupTypeFeatureMap);
};

export const getFirstValueByFeatureSwitch = <TValue>(
  features: IFeaturesState,
  map: Map<FeatureFlag, TValue>
): TValue | undefined => {
  const key = Object.keys(features).find(
    (f) => features[f as FeatureFlag] && map.has(f as LegacyFeatureSwitch)
  ) as LegacyFeatureSwitch;
  return map.get(key) as TValue;
};
