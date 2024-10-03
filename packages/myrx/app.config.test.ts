// Copyright 2022 Prescryptive Health, Inc.

import { ConfigContext, ExpoConfig } from '@expo/config';
import env, { IEnvironment } from '@phx/common/config/env';
import appConfig from './app.config';

jest.mock('@phx/common/config/env');
const envMock = env as jest.Mock;

interface ITestEnvironment extends IEnvironment {
  REACT_APP_CONFIG_KEY1: string;
  REACT_APP_CONFIG_KEY2: string;
}

describe('appConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected config', () => {
    const environmentMock: ITestEnvironment = {
      mode: 'development',
      isDev: true,
      REACT_APP_CONFIG_KEY1: 'key1',
      REACT_APP_CONFIG_KEY2: 'key2',
    };
    envMock.mockReturnValue(environmentMock);

    const configMock: Partial<ExpoConfig> = {
      name: 'name',
      description: 'description',
    };

    const expectedConfig = {
      ...configMock,
      extra: {
        ...environmentMock,
      },
    };

    expect(appConfig({ config: configMock } as ConfigContext)).toEqual(
      expectedConfig
    );
  });
});
