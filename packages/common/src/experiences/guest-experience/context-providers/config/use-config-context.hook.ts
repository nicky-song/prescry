// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IConfigContext, ConfigContext } from './config.context';

export const useConfigContext = (): IConfigContext => useContext(ConfigContext);
