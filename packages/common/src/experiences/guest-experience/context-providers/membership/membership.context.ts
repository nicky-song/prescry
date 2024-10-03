// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';
import {
  IMembershipState,
  defaultMembershipState,
} from '../../state/membership/membership.state';
import { MembershipDispatch } from '../../state/membership/dispatch/membership.dispatch';

export interface IMembershipContext {
  readonly membershipState: IMembershipState;
  readonly membershipDispatch: MembershipDispatch;
}

export const MembershipContext = createContext<IMembershipContext>({
  membershipState: defaultMembershipState,
  membershipDispatch: () => {
    return;
  },
});
