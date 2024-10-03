// Copyright 2020 Prescryptive Health, Inc.

import {
  IDispatchPostLoginApiErrorActionsType,
  handlePostLoginApiErrorsAction,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { getProviderLocationDetailsDispatch } from '../dispatch/get-provider-location-details.dispatch';
import { IResetAppointmentStateAction } from '../../appointment/actions/reset-appointment-state.action';
import { ISetCalendarStatusAction } from '../../appointment/actions/set-calendar-status.action';
import { ISetSelectedLocationAction } from '../../appointment/actions/set-selected-location.action';
import { ISetServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type IGetProviderLocationDetailsActionType =
  | IDispatchPostLoginApiErrorActionsType
  | ISetSelectedLocationAction
  | ISetCalendarStatusAction
  | IResetAppointmentStateAction
  | ISetServiceDetailsAction;

export const getProviderLocationDetailsAsyncAction = (args: {
  navigation: RootStackNavigationProp;
  identifier: string;
}) => {
  return async (
    dispatch: Dispatch<IGetProviderLocationDetailsActionType>,
    getState: () => RootState
  ) => {
    try {
      await getProviderLocationDetailsDispatch(
        dispatch,
        getState,
        args.navigation,
        args.identifier
      );
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
