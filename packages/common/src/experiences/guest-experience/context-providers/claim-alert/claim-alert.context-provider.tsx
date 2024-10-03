// Copyright 2022 Prescryptive Health, Inc.

import React, { FunctionComponent, useReducer } from 'react';
import {
  ClaimAlertReducer,
  claimAlertReducer,
} from '../../state/claim-alert/claim-alert.reducer';
import { defaultClaimAlertState } from '../../state/claim-alert/claim-alert.state';
import { ClaimAlertContext } from './claim-alert.context';

export const ClaimAlertContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<ClaimAlertReducer>(
    claimAlertReducer,
    defaultClaimAlertState
  );

  return (
    <ClaimAlertContext.Provider
      value={{
        claimAlertState: state,
        claimAlertDispatch: dispatch,
      }}
    >
      {children}
    </ClaimAlertContext.Provider>
  );
};
