// Copyright 2020 Prescryptive Health, Inc.

import {
  IDispatchPostLoginApiErrorActionsType,
  handlePostLoginApiErrorsAction,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IGetProviderLocationsResponseAction } from '../actions/get-provider-locations-response.action';
import { getProviderLocationsDispatch } from '../dispatch/get-provider-locations.dispatch';
import { IZipcodeParam } from '../../../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list';
import { ISetServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export type IGetProviderLocationsActionType =
  | IGetProviderLocationsResponseAction
  | IDispatchPostLoginApiErrorActionsType
  | ISetServiceDetailsAction;

export const getProviderLocationsAsyncAction = (args: {
  navigation: AppointmentsStackNavigationProp;
  zipcodeParam: IZipcodeParam;
}) => {
  return async (
    dispatch: Dispatch<IGetProviderLocationsActionType>,
    getState: () => RootState
  ) => {
    try {
      await getProviderLocationsDispatch(dispatch, getState, args.zipcodeParam);
    } catch (error) {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
