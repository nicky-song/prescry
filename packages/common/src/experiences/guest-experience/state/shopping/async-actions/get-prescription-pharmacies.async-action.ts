// Copyright 2021 Prescryptive Health, Inc.

import { IDispatchPostLoginApiErrorActionsType } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { ShoppingDispatch } from '../dispatch/shopping.dispatch';
import { getPrescriptionPharmaciesDispatch } from '../dispatch/get-prescription-pharmacies.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { Dispatch } from 'react';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { setPrescriptionPharmaciesDispatch } from '../dispatch/set-prescription-pharmacies.dispatch';
import { ErrorConstants } from '../../../api/api-response-messages';
import { ShoppingAction } from '../actions/shopping.action';
import { handleAuthUserApiErrorsAction } from '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { setIsGettingPharmaciesDispatch } from '../dispatch/set-is-getting-pharmacies.dispatch';
import { setNoPharmacyErrorDispatch } from '../dispatch/set-no-pharmacy-error.dispatch';

export interface IGetPrescriptionPharmaciesAsyncActionArgs
  extends IAsyncActionArgs {
  location: ILocationCoordinates;
  sortBy: string;
  prescriptionId: string;
  distance: number;
  shoppingDispatch: ShoppingDispatch;
  navigation: RootStackNavigationProp;
  blockchain?: boolean;
}

export const getPrescriptionPharmaciesAsyncAction = async (
  args: IGetPrescriptionPharmaciesAsyncActionArgs
): Promise<void> => {
  await asyncAction(args)(args.reduxDispatch);
};

export type IGetPrescriptionPharmaciesActionType =
  | IDispatchPostLoginApiErrorActionsType
  | ShoppingAction;

const asyncAction = (args: IGetPrescriptionPharmaciesAsyncActionArgs) => {
  return async (dispatch: Dispatch<IGetPrescriptionPharmaciesActionType>) => {
    setNoPharmacyErrorDispatch(args.shoppingDispatch, false);
    setIsGettingPharmaciesDispatch(args.shoppingDispatch, true);
    if (
      args.location.zipCode ||
      (args.location.latitude && args.location.longitude)
    ) {
      try {
        await getPrescriptionPharmaciesDispatch(args);
      } catch (error) {
        if (error instanceof ErrorBadRequest) {
          setPrescriptionPharmaciesDispatch(
            args.shoppingDispatch,
            { pharmacyPrices: [] },
            args.prescriptionId,
            ErrorConstants.INVALID_ZIPCODE_SEARCH
          );
        } else {
          try {
            await handleAuthUserApiErrorsAction(
              error as Error,
              dispatch,
              args.navigation
            );
          } catch (error) {
            setPrescriptionPharmaciesDispatch(
              args.shoppingDispatch,
              { pharmacyPrices: [] },
              args.prescriptionId,
              ErrorConstants.PHARMACY_SEARCH_FAILURE
            );
          }
        }
      }
    } else {
      setPrescriptionPharmaciesDispatch(
        args.shoppingDispatch,
        { pharmacyPrices: [] },
        args.prescriptionId,
        ErrorConstants.GEOLOCATION_DETECTION_FAILURE
      );
    }
    setIsGettingPharmaciesDispatch(args.shoppingDispatch, false);
  };
};
