// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { getPharmaciesByZipCodeDispatch } from '../dispatch/get-pharmacies-by-zip-code.dispatch';
import { DrugSearchDispatch } from '../dispatch/drug-search.dispatch';
import { setPharmaciesByZipCodeDispatch } from '../dispatch/set-pharmacies-by-zip-code.dispatch';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { setInvalidZipErrorMessageDispatch } from '../dispatch/set-invalid-zip-error-message.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export interface IGetPharmaciesByZipCodeAsyncActionArgs
  extends IAsyncActionArgs {
  zipCode: string;
  start?: string;
  isUnauthExperience: boolean;
  drugSearchDispatch: DrugSearchDispatch;
  navigation: RootStackNavigationProp;
}

export const getPharmaciesByZipCodeAsyncAction = async (
  args: IGetPharmaciesByZipCodeAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};
export type IGetPharmaciesActionType = IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IGetPharmaciesByZipCodeAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<IGetPharmaciesActionType>
  ) => {
    try {
      setInvalidZipErrorMessageDispatch(args.drugSearchDispatch, undefined);
      await getPharmaciesByZipCodeDispatch(args);
    } catch (error) {
      if (error instanceof ErrorBadRequest) {
        setInvalidZipErrorMessageDispatch(
          args.drugSearchDispatch,
          error.message
        );
        setPharmaciesByZipCodeDispatch(args.drugSearchDispatch, [], false);
        return;
      }
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        args.navigation
      );
    }
  };
};
