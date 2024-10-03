// Copyright 2021 Prescryptive Health, Inc.

import {
  IDispatchPostLoginApiErrorActionsType,
  handlePostLoginApiErrorsAction,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IGetImmunizationRecordResponseAction } from '../actions/get-immunization-record-response.action';
import { getImmunizationRecordDispatch } from '../dispatch/get-immunization-record.dispatch';
import { PastProceduresStackNavigationProp } from '../../../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';

export type IGetImmunizationRecordActionType =
  | IGetImmunizationRecordResponseAction
  | IDispatchPostLoginApiErrorActionsType;

export const getImmunizationRecordAsyncAction = (args: {
  navigation: PastProceduresStackNavigationProp;
  orderNumber: string;
}) => {
  return async (
    dispatch: Dispatch<IGetImmunizationRecordActionType>,
    getState: () => RootState,
  ) => {
    try {
      await getImmunizationRecordDispatch(dispatch, getState, args.orderNumber);
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
