// Copyright 2023 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultInstallContext, InstallContext } from './install.context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('InstallContext', () => {
  it('initializes defaultInstallContext to an empty object', () => {
    expect(defaultInstallContext).toEqual({});
  });

  it('initializes InstallContext to calling createContext with defaultInstallContext', () => {
    expect(InstallContext).toBeDefined();

    expect(createContextMock).toHaveBeenCalledTimes(1);
    expect(createContextMock).toHaveBeenNthCalledWith(1, defaultInstallContext);
  });
});
