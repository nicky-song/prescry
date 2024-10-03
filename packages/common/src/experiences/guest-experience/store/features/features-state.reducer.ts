// Copyright 2018 Prescryptive Health, Inc.

import {
  // FeatureSwitches,
  GuestExperienceFeatures,
  IFeaturesState,
} from '../../guest-experience-features';

export enum FeaturesStateActionKeys {}
// SET_FEATURES = 'SET_FEATURES',

// export interface IActivateFeatureAction {
//   readonly type: FeaturesStateActionKeys.SET_FEATURES;
//   readonly payload: { [key in FeatureSwitches]: boolean };
// }

// export type FeaturesStateActionTypes = IActivateFeatureAction;
// | IOtherAction

export const featuresStateReducer = (
  state: IFeaturesState = GuestExperienceFeatures
  // action: FeaturesStateActionTypes
) => {
  // switch (action.type) {
  //   case FeaturesStateActionKeys.SET_FEATURES:
  //     return {
  //       ...state,
  //       ...action.payload,
  //     };
  //     break;
  // }

  return state;
};
