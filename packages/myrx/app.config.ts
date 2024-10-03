// Copyright 2022 Prescryptive Health, Inc.

import { ExpoConfig, ConfigContext } from '@expo/config';
import env from '@phx/common/config/env';

export default ({ config: currentConfig }: ConfigContext): ExpoConfig => {
  const environment = env();

  const updatedConfig = {
    ...currentConfig,
    extra: {
      ...environment,
    },
  };

  return updatedConfig as ExpoConfig;
};
