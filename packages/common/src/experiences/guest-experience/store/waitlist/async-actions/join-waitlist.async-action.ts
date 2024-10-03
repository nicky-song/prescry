// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../../../models/api-request-body/create-waitlist.request-body';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { IJoinWaitlistErrorAction } from '../actions/join-waitlist-error.action';
import { joinWaitlistDispatch } from '../dispatch/join-waitlist.dispatch';

export type IJoinWaitlistActionType =
  | IDispatchPostLoginApiErrorActionsType
  | IJoinWaitlistErrorAction;

export const joinWaitlistAsyncAction = (args: {
  data: ICreateWaitlistRequestBody;
  navigation: AppointmentsStackNavigationProp;
}) => {
  return async (
    dispatch: (action: IJoinWaitlistActionType) => RootState,
    getState: () => RootState
  ) => {
    try {
      await joinWaitlistDispatch(
        dispatch,
        args.navigation,
        getState,
        args.data
      );
      return true;
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
      return false;
    }
  };
};
