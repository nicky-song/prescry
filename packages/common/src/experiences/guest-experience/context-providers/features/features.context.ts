// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import {
  GuestExperienceFeatures,
  IFeaturesState,
} from '../../guest-experience-features';

export interface IFeaturesContext {
  readonly featuresState: IFeaturesState;
}

export const FeaturesContext = createContext<IFeaturesContext>({
  featuresState: GuestExperienceFeatures,
});
