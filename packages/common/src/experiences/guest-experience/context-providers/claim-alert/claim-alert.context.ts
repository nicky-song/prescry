// Copyright 2022 Prescryptive Health, Inc.

import { createContext } from 'react';

import {
  defaultClaimAlertState,
  IClaimAlertState,
} from '../../state/claim-alert/claim-alert.state';
import { ClaimAlertDispatch } from '../../state/claim-alert/dispatch/claim-alert.dispatch';

export interface IClaimAlertContext {
  readonly claimAlertState: IClaimAlertState;
  readonly claimAlertDispatch: ClaimAlertDispatch;
}

export const ClaimAlertContext = createContext<IClaimAlertContext>({
  claimAlertState: defaultClaimAlertState,
  claimAlertDispatch: () => {
    return;
  },
});
