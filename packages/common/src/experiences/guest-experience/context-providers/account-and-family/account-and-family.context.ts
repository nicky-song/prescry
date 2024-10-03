// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';
import {
  defaultAccountAndFamilyState,
  IAccountAndFamilyState,
} from '../../state/account-and-family/account-and-family.state';
import { AccountAndFamilyDispatch } from '../../state/account-and-family/dispatch/account-and-family.dispatch';

export interface IAccountAndFamilyContext {
  readonly accountAndFamilyState: IAccountAndFamilyState;
  readonly accountAndFamilyDispatch: AccountAndFamilyDispatch;
}

export const AccountAndFamilyContext = createContext<IAccountAndFamilyContext>({
  accountAndFamilyState: defaultAccountAndFamilyState,
  accountAndFamilyDispatch: () => {
    return;
  },
});
