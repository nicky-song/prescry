// Copyright 2023 Prescryptive Health, Inc.

import { useContext } from 'react';
import { InstallContext } from './install.context';
import { useInstallContext } from './use-install-context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

jest.mock('./install.context', () => ({
  InstallContext: jest.fn(),
}));

describe('useInstallContext', () => {
  it('calls useContext with InstallContext', () => {
    useInstallContext();

    expect(useContextMock).toHaveBeenCalledTimes(1);
    expect(useContextMock).toHaveBeenNthCalledWith(1, InstallContext);
  });
});
