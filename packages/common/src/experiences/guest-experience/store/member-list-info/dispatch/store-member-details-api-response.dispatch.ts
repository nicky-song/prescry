// Copyright 2018 Prescryptive Health, Inc.

import { IMembersApiResponse } from '../../../../../models/api-response';
import { setPrescribedMemberDetailsAction } from '../../prescribed-member/prescribed-member-reducer.actions';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { setMemberInfoRequestIdAction } from '../../telemetry/telemetry-reducer.actions';
import { IDispatchContactInfoActionsType } from '../member-list-info-reducer.actions';
import { setMembersInfoDispatch } from './set-members-info.dispatch';

export const storeMemberDetailsApiResponseDispatch = async (
  dispatch: Dispatch<IDispatchContactInfoActionsType>,
  memberInfoList: IMembersApiResponse,
  getState: () => RootState
) => {
  const state = getState();
  const member = memberInfoList.data.memberDetails;
  if (!state.prescribedMember.identifier) {
    const prescribedMember = member.loggedInMember;

    await dispatch(
      setPrescribedMemberDetailsAction({
        firstName: prescribedMember.firstName,
        identifier: prescribedMember.identifier,
        isPrimary: prescribedMember.isPrimary,
        dateOfBirth: prescribedMember.dateOfBirth,
        lastName: prescribedMember.lastName,
      })
    );
  }

  await setMembersInfoDispatch(dispatch, member);

  if (memberInfoList.memberInfoRequestId) {
    await dispatch(
      setMemberInfoRequestIdAction(memberInfoList.memberInfoRequestId)
    );
  }
};
