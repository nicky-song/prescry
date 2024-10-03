// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getPrescriptionInfoDispatch } from '../dispatch/get-prescription-info.dispatch';
import { ShoppingDispatch } from '../dispatch/shopping.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { ErrorConstants } from '../../../../../theming/constants';
import { ErrorPhoneNumberMismatched } from '../../../../../errors/error-phone-number-mismatched';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';
import { ErrorNewDependentPrescription } from '../../../../../errors/error-caregiver-new-dependent-prescription';
import { prescriptionPersonNavigateDispatch } from '../../../store/navigation/dispatch/account-and-family/prescription-person-navigate.dispatch';

export interface IGetPrescriptionInfoAsyncActionArgs extends IAsyncActionArgs {
  prescriptionId: string;
  shoppingDispatch: ShoppingDispatch;
  navigation: RootStackNavigationProp;
  userExists?: boolean;
  blockchain?: boolean;
}

export const getPrescriptionInfoAsyncAction = async (
  args: IGetPrescriptionInfoAsyncActionArgs
): Promise<void> => {
  await dataLoadingAction(asyncAction, args)(
    args.reduxDispatch,
    args.reduxGetState
  );
};

export type IGetPrescriptionInfoActionType =
  IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IGetPrescriptionInfoAsyncActionArgs) => {
  return async (dispatch: Dispatch<IGetPrescriptionInfoActionType>) => {
    try {
      await getPrescriptionInfoDispatch(args);
    } catch (error) {
      if (error instanceof ErrorPhoneNumberMismatched) {
        await navigateHomeScreenNoApiRefreshDispatch(
          args.reduxGetState,
          args.navigation,
          {
            modalContent: {
              showModal: true,
              modalTopContent: ErrorConstants.errorForGettingPrescription,
            },
          }
        );
      } else if (error instanceof ErrorNewDependentPrescription) {
        prescriptionPersonNavigateDispatch(
          args.navigation,
          args.prescriptionId,
          args.userExists
        );
      } else {
        await handlePostLoginApiErrorsAction(
          error as Error,
          dispatch,
          args.navigation
        );
      }
    }
  };
};
