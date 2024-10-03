// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useConfigContext } from './use-config-context.hook';
import { IConfigContext } from './config.context';
import { GuestExperienceConfig } from '../../guest-experience-config';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useConfigContext', () => {
  it('returns expected context', () => {
    const contextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IConfigContext = useConfigContext();
    expect(context).toEqual(contextMock);
  });
});
