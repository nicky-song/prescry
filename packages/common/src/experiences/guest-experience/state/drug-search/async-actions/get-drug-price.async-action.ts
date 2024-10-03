// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { IDispatchPostLoginApiErrorActionsType } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { DrugSearchDispatch } from '../dispatch/drug-search.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { getDrugPriceResponseDispatch } from '../dispatch/get-drug-price-response.dispatch';
import { setDrugPriceResponseDispatch } from '../dispatch/set-drug-price-response.dispatch';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorConstants } from '../../../api/api-response-messages';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { handleAuthUserApiErrorsAction } from '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { setIsGettingPharmaciesDispatch } from '../dispatch/set-is-getting-pharmacies.dispatch';
import { setNoPharmacyErrorDispatch } from '../dispatch/set-no-pharmacy-error.dispatch';

export interface IGetDrugPriceAsyncActionArgs extends IAsyncActionArgs {
  location: ILocationCoordinates;
  sortBy: string;
  ndc: string;
  supply: number;
  quantity: number;
  isUnauthExperience: boolean;
  distance: number;
  drugSearchDispatch: DrugSearchDispatch;
  navigation: RootStackNavigationProp;
}

export const getDrugPriceAsyncAction = async (
  args: IGetDrugPriceAsyncActionArgs
): Promise<void> => {
  await asyncAction(args)(args.reduxDispatch);
};

export type IGetPrescriptionPharmaciesActionType =
  IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IGetDrugPriceAsyncActionArgs) => {
  return async (dispatch: Dispatch<IGetPrescriptionPharmaciesActionType>) => {
    setNoPharmacyErrorDispatch(args.drugSearchDispatch, false);
    setDrugPriceResponseDispatch(args.drugSearchDispatch, []);
    setIsGettingPharmaciesDispatch(args.drugSearchDispatch, true);

    if (
      args.location.zipCode ||
      (args.location.latitude && args.location.longitude)
    ) {
      try {
        await getDrugPriceResponseDispatch(args);
      } catch (error) {
        if (error instanceof ErrorBadRequest) {
          setDrugPriceResponseDispatch(
            args.drugSearchDispatch,
            [],
            undefined,
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
            setDrugPriceResponseDispatch(
              args.drugSearchDispatch,
              [],
              undefined,
              ErrorConstants.PHARMACY_SEARCH_FAILURE
            );
          }
        }
      }
    } else {
      setDrugPriceResponseDispatch(
        args.drugSearchDispatch,
        [],
        undefined,
        ErrorConstants.GEOLOCATION_DETECTION_FAILURE
      );
    }
    setIsGettingPharmaciesDispatch(args.drugSearchDispatch, false);
  };
};
