// Copyright 2018 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { RootState } from '../../root-reducer';
import { getFavoritedPharmacies } from '../../../api/api-v1.get-favorited-pharmacies';
import { IFavoritedPharmacyResponse } from '../../../../../models/api-response/favorited-pharmacy-response';
import { IMemberProfileActionTypes } from '../../member-profile/member-profile-reducer';

export const getFavoritedPharmaciesDispatch = async (
  _dispatch: Dispatch<IMemberProfileActionTypes>,
  getState: () => RootState,
  retryPolicy = getEndpointRetryPolicy
) => {
  const state = getState();

  const response = await getFavoritedPharmacies(
    state.config.apis.guestExperienceApi,
    state.settings.token,
    retryPolicy,
    state.settings.deviceToken
  );

  return response as IFavoritedPharmacyResponse;
};
