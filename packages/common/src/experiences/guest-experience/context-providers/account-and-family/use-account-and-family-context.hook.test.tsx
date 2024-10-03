// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { useAccountAndFamilyContext } from './use-account-and-family-context.hook';
import { IAccountAndFamilyContext } from './account-and-family.context';
import { defaultAccountAndFamilyState } from '../../state/account-and-family/account-and-family.state';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useAccountAndFamilyContext', () => {
  it('returns expected context', () => {
    const contextMock: IAccountAndFamilyContext = {
      accountAndFamilyState: defaultAccountAndFamilyState,
      accountAndFamilyDispatch: jest.fn(),
    };
    useContextMock.mockReturnValue(contextMock);

    const context: IAccountAndFamilyContext = useAccountAndFamilyContext();
    expect(context).toEqual(contextMock);
  });
});
