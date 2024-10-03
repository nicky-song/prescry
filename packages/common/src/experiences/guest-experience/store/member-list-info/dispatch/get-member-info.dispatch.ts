// Copyright 2018 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';

import { IRedirectResponse } from '../../../api/api-v1-helper';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getMemberProfileInfo } from '../../../api/api-v1.get-member-profile';
import { storeMemberProfileApiResponseDispatch } from '../../member-profile/dispatch/store-member-profile-api-response.dispatch';
import { IMemberProfileActionTypes } from '../../member-profile/member-profile-reducer';
import {
  IMemberInfoResponse,
  IMemberInfoResponseData,
} from '../../../../../models/api-response/member-info-response';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';

export type MemberInfoDataResponseLogger = (
  responseData: IMemberInfoResponseData
) => void;

export const getMemberInfoDispatch = async (
  dispatch: Dispatch<IUpdateSettingsAction | IMemberProfileActionTypes>,
  getState: () => RootState,
  retryPolicy = getEndpointRetryPolicy,
  memberInfoResponseLogger?: MemberInfoDataResponseLogger
) => {
  const state = getState();
  const {
    config,
    settings: { token, deviceToken },
  } = state;

  const response = await getMemberProfileInfo(
    config.apis.guestExperienceApi,
    token,
    retryPolicy,
    deviceToken
  );
  await tokenUpdateDispatch(dispatch, response.refreshToken);

  if (!response.responseCode) {
    const memberInfoResponse = response as IMemberInfoResponse;

    if (memberInfoResponseLogger) {
      memberInfoResponseLogger(memberInfoResponse.data);
    }

    await storeMemberProfileApiResponseDispatch(dispatch, memberInfoResponse);
  }

  return response as IRedirectResponse;
};
