// Copyright 2022 Prescryptive Health, Inc.

import { IClaimAlertState } from '../claim-alert.state';

type ActionKeys = 'SET_CLAIM_ALERT';

export interface IClaimAlertAction<T extends ActionKeys> {
  readonly type: T;
  readonly payload: Partial<IClaimAlertState>;
}

export type ClaimAlertAction = IClaimAlertAction<ActionKeys>;
