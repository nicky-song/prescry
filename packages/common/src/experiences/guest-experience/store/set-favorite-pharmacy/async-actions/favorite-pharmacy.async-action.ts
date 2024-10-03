// Copyright 2022 Prescryptive Health, Inc.

import { ErrorFavoritingPharmacy } from '../../../../../errors/error-favoriting-pharmacy';
import { IUpdateFavoritedPharmaciesRequestBody } from '../../../../../models/api-request-body/update-favorited-pharmacies.request-body';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAsyncActionArgs } from '../../../state/async-action-args';
import { MembershipDispatch } from '../../../state/membership/dispatch/membership.dispatch';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { toggleFavoritedPharmaciesDispatch } from '../../../state/membership/dispatch/toggle-favorite-pharmacies.dispatch';
import { toggleFavoritedPharmacyHelper } from '../../../state/membership/helpers/toggle-favorited-pharmacy.helper';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import {
  favoritePharmacyDispatch,
  IFavoritePharmacyDispatchArgs,
} from '../dispatch/favorite-pharmacy.dispatch';

export interface IFavoritePharmacyAsyncActionArgs extends IAsyncActionArgs {
  ncpdp: string;
  navigation: RootStackNavigationProp;
  membershipDispatch: MembershipDispatch;
}

export const favoritePharmacyAsyncAction = async (
  args: IFavoritePharmacyAsyncActionArgs
): Promise<boolean> => {
  return await asyncAction(args);
};

const asyncAction = async (
  args: IFavoritePharmacyAsyncActionArgs
): Promise<boolean> => {
  try {
    toggleFavoritedPharmaciesDispatch(args.membershipDispatch, args.ncpdp);

    const state = args.reduxGetState();

    const favoritedPharmacies = state.memberProfile.account.favoritedPharmacies;

    const updatedFavoritedPharmacies = toggleFavoritedPharmacyHelper(
      args.ncpdp,
      favoritedPharmacies
    );

    const updateFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody =
      { favoritedPharmacies: updatedFavoritedPharmacies };

    const favoritePharmacyDispatchArgs: IFavoritePharmacyDispatchArgs = {
      updateFavoritedPharmaciesRequestBody,
      ncpdp: args.ncpdp,
      navigation: args.navigation,
      reduxDispatch: args.reduxDispatch,
      reduxGetState: args.reduxGetState,
      membershipDispatch: args.membershipDispatch,
    };

    return await favoritePharmacyDispatch(favoritePharmacyDispatchArgs);
  } catch (error) {
    toggleFavoritedPharmaciesDispatch(args.membershipDispatch, args.ncpdp);
    setFavoritingStatusDispatch(args.membershipDispatch, 'error');
    if (error instanceof ErrorFavoritingPharmacy) {
      throw error;
    } else {
      await handlePostLoginApiErrorsAction(
        error as Error,
        args.reduxDispatch,
        args.navigation
      );
    }
    return false;
  }
};
