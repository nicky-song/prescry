// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { IConfigContext, ConfigContext } from './config.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('ConfigContext', () => {
  it('creates context', () => {
    expect(ConfigContext).toBeDefined();

    const expectedContext: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
