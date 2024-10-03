// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import { IMembershipAction } from './membership.action';

export type IMembershipSetAction = IMembershipAction<'SET_MEMBERSHIP'>;

export const membershipSetAction = (
  membership: IMemberInfoResponseData
): IMembershipSetAction => ({
  type: 'SET_MEMBERSHIP',
  payload: membership,
});
