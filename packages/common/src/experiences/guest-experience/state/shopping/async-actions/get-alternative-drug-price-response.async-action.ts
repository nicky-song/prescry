// Copyright 2022 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { IDispatchPostLoginApiErrorActionsType } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { ErrorConstants } from '../../../api/api-response-messages';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { handleAuthUserApiErrorsAction } from '../../../store/navigation/async-actions/handle-api-errors-for-auth-users.async-action';
import { getAlternativeDrugPriceResponseDispatch } from '../dispatch/get-alternative-drug-price-response.dispatch';
import { ShoppingDispatch } from '../dispatch/shopping.dispatch';
import { setAlternativeDrugPriceResponseDispatch } from '../dispatch/set-alternative-drug-price-response.dispatch';

export interface IGetAlternativeDrugPriceAsyncActionArgs
  extends IAsyncActionArgs {
  ndc: string;
  ncpdp: string;
  isUnauthExperience?: boolean;
  navigation: RootStackNavigationProp;
  shoppingDispatch: ShoppingDispatch;
}

export const getAlternativeDrugPriceAsyncAction = async (
  args: IGetAlternativeDrugPriceAsyncActionArgs
): Promise<void> => {
  await asyncAction(args)(args.reduxDispatch);
};

export type IGetAlternativeDrugPriceActionType =
  IDispatchPostLoginApiErrorActionsType;

const asyncAction = (args: IGetAlternativeDrugPriceAsyncActionArgs) => {
  return async (dispatch: Dispatch<IGetAlternativeDrugPriceActionType>) => {
    try {
      await getAlternativeDrugPriceResponseDispatch(args);
    } catch (error) {
      try {
        await handleAuthUserApiErrorsAction(
          error as Error,
          dispatch,
          args.navigation
        );
      } catch (error) {
        setAlternativeDrugPriceResponseDispatch(
          args.shoppingDispatch,
          undefined,
          ErrorConstants.ALTERNATIVE_DRUG_SEARCH_FAILURE
        );
      }
    }
  };
};
