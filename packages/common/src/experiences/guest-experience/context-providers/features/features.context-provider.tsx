// Copyright 2022 Prescryptive Health, Inc.

import React, { FunctionComponent } from 'react';
import { GuestExperienceFeatures } from '../../guest-experience-features';
import { FeaturesContext } from './features.context';

export const FeaturesContextProvider: FunctionComponent = ({ children }) => {
  return (
    <FeaturesContext.Provider
      value={{
        featuresState: GuestExperienceFeatures,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
};
