// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '../../guest-experience-config';

export interface IConfigContext {
  readonly configState: IGuestExperienceConfig;
}

export const ConfigContext = createContext<IConfigContext>({
  configState: GuestExperienceConfig,
});
