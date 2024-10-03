// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IClaimAlertContext, ClaimAlertContext } from './claim-alert.context';

export const useClaimAlertContext = (): IClaimAlertContext =>
  useContext(ClaimAlertContext);
