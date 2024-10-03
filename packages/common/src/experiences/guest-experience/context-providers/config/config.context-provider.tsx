// Copyright 2022 Prescryptive Health, Inc.

import React, { FunctionComponent } from 'react';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { ConfigContext } from './config.context';

export const ConfigContextProvider: FunctionComponent = ({ children }) => {
  return (
    <ConfigContext.Provider
      value={{
        configState: GuestExperienceConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
