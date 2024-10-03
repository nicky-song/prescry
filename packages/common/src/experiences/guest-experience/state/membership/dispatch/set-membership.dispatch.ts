// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import { MembershipDispatch } from './membership.dispatch';
import { membershipSetAction } from '../actions/membership-set.action';

export const setMembershipDispatch = (
  dispatch: MembershipDispatch,
  membership: IMemberInfoResponseData
): void => {
  dispatch(membershipSetAction(membership));
};
