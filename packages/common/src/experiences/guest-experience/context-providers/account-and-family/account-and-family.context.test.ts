// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import { defaultAccountAndFamilyState } from '../../state/account-and-family/account-and-family.state';
import {
  IAccountAndFamilyContext,
  AccountAndFamilyContext,
} from './account-and-family.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  createContext: jest.fn().mockReturnValue({}),
}));
const createContextMock = createContext as jest.Mock;

describe('AccountAndFamilyContext', () => {
  it('creates context', () => {
    expect(AccountAndFamilyContext).toBeDefined();

    const expectedContext: IAccountAndFamilyContext = {
      accountAndFamilyState: defaultAccountAndFamilyState,
      accountAndFamilyDispatch: expect.any(Function),
    };
    expect(createContextMock).toHaveBeenCalledWith(expectedContext);
  });
});
