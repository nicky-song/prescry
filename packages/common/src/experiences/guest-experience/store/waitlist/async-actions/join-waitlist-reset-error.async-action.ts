// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { IJoinWaitlistResetErrorAction } from '../actions/join-waitlist-reset-error.action';
import { joinWaitlistResetErrorDispatch } from '../dispatch/join-waitlist-reset-error.dispatch';

export type IWaitlistResetErrorActionType = IJoinWaitlistResetErrorAction;

export const joinWaitlistResetErrorAsyncAction = () => {
  return (
    dispatch: (action: IWaitlistResetErrorActionType) => RootState,
    _: () => RootState
  ) => {
    joinWaitlistResetErrorDispatch(dispatch);
  };
};
