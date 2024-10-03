// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import {
  IJoinWaitlistResetErrorAction,
  joinWaitlistResetErrorAction,
} from '../actions/join-waitlist-reset-error.action';

export type JoinWaitlistResetErrorDispatchType = IJoinWaitlistResetErrorAction;

export const joinWaitlistResetErrorDispatch = (
  dispatch: Dispatch<JoinWaitlistResetErrorDispatchType>
) => {
  dispatch(joinWaitlistResetErrorAction());
};
