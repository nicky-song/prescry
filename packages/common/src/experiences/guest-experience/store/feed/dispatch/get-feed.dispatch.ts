// Copyright 2020 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getFeed } from '../../../api/api-v1.get-feed';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { getFeedResponseAction } from '../actions/get-feed-response.action';
import { IGetFeedActionType } from '../async-actions/get-feed.async-action';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';

export const getFeedDispatch = async (
  dispatch: Dispatch<IGetFeedActionType>,
  getState: () => RootState,
  refreshToken?: boolean
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;

  const response = await getFeed(
    api,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken
  );
  if (refreshToken || refreshToken === undefined) {
    await tokenUpdateDispatch(dispatch, response.refreshToken);
  }

  const { data } = response;
  await dispatch(getFeedResponseAction(data.feedItems));
};
