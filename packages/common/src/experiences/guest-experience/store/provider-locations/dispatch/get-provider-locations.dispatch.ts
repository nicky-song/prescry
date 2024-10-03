// Copyright 2020 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { IGetProviderLocationsActionType } from '../async-actions/get-provider-locations.async-action';
import { getProviderLocationsResponseAction } from '../actions/get-provider-locations-response.action';
import { RootState } from '../../root-reducer';
import { getProviderLocations } from '../../../api/api-v1.get-provider-locations';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IZipcodeParam } from '../../../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list';
import {
  ISetServiceDetailsAction,
  setServiceDetailsAction,
} from '../../service-type/actions/set-service-details.action';

export const getProviderLocationsDispatch = async (
  dispatch: Dispatch<
    IGetProviderLocationsActionType | ISetServiceDetailsAction
  >,
  getState: () => RootState,
  params: IZipcodeParam
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  const zipcode = params ? params.zipcode : undefined;
  const distance = params ? params.distance : undefined;
  const response = await getProviderLocations(
    api,
    zipcode,
    distance,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken,
    state.serviceType.type
  );
  await tokenUpdateDispatch(dispatch, response.refreshToken);

  const { data } = response;

  await dispatch(getProviderLocationsResponseAction(data.locations));
  await dispatch(
    setServiceDetailsAction({
      serviceNameMyRx: data.serviceNameMyRx,
      minimumAge: data.minimumAge,
    })
  );
};
