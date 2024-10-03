// Copyright 2022 Prescryptive Health, Inc.

import { IUpdateFavoritedPharmaciesRequestBody } from '../../../../../models/api-request-body/update-favorited-pharmacies.request-body';
import { updateFavoritedPharmacies } from '../../../api/api-v1.update-favorited-pharmacies';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { IFavoritePharmacyAsyncActionArgs } from '../async-actions/favorite-pharmacy.async-action';

export interface IFavoritePharmacyDispatchArgs
  extends IFavoritePharmacyAsyncActionArgs {
  updateFavoritedPharmaciesRequestBody: IUpdateFavoritedPharmaciesRequestBody;
}
export const favoritePharmacyDispatch = async (
  args: IFavoritePharmacyDispatchArgs
): Promise<boolean> => {
  const state = args.reduxGetState();

  const result = await updateFavoritedPharmacies(
    state.config.apis.guestExperienceApi,
    args.updateFavoritedPharmaciesRequestBody,
    state.settings.deviceToken,
    state.settings.token
  );

  if (result) {
    setFavoritingStatusDispatch(args.membershipDispatch, 'success');

    return true;
  }

  return false;
};
