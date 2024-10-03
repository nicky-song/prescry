// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponse } from '../../../../../models/api-response/member-info-response';
import { Dispatch } from 'react';
import { setMemberInfoRequestIdAction } from '../../telemetry/telemetry-reducer.actions';
import { IMemberProfileActionTypes } from '../member-profile-reducer';
import { setMemberProfileDispatch } from './set-member-profile.dispatch';

export const storeMemberProfileApiResponseDispatch = async (
  dispatch: Dispatch<IMemberProfileActionTypes>,
  memberProfileResponse: IMemberInfoResponse
) => {
  await setMemberProfileDispatch(dispatch, memberProfileResponse.data);

  if (memberProfileResponse.memberInfoRequestId) {
    await dispatch(
      setMemberInfoRequestIdAction(memberProfileResponse.memberInfoRequestId)
    );
  }
};
