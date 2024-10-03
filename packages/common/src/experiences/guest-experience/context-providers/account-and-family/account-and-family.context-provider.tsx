// Copyright 2022 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import {
  accountAndFamilyReducer,
  AccountAndFamilyReducer,
} from '../../state/account-and-family/account-and-family.reducer';
import { defaultAccountAndFamilyState } from '../../state/account-and-family/account-and-family.state';
import { AccountAndFamilyContext } from './account-and-family.context';

export const AccountAndFamilyContextProvider: FunctionComponent = ({
  children,
}) => {
  const [state, dispatch] = useReducer<AccountAndFamilyReducer>(
    accountAndFamilyReducer,
    defaultAccountAndFamilyState
  );
  return (
    <AccountAndFamilyContext.Provider
      value={{
        accountAndFamilyState: state,
        accountAndFamilyDispatch: dispatch,
      }}
    >
      {children}
    </AccountAndFamilyContext.Provider>
  );
};
