// Copyright 2020 Prescryptive Health, Inc.

import {
  IDispatchPostLoginApiErrorActionsType,
  handlePostLoginApiErrorsAction,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { getTestResultDispatch } from '../dispatch/get-test-result.dispatch';
import { IGetTestResultResponseAction } from '../actions/test-result-actions';
import { PastProceduresStackNavigationProp } from '../../../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';

export type IGetTestResultsActionType =
  | IGetTestResultResponseAction
  | IDispatchPostLoginApiErrorActionsType;

export const getTestResultAsyncAction = (args: {
  navigation: PastProceduresStackNavigationProp;
  orderNumber: string;
}) => {
  return async (
    dispatch: Dispatch<IGetTestResultsActionType>,
    getState: () => RootState,
  ) => {
    try {
      await getTestResultDispatch(dispatch, getState, args.orderNumber);
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
