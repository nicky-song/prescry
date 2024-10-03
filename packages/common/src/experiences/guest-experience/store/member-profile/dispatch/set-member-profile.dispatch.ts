// Copyright 2021 Prescryptive Health, Inc.

import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import {
  ILimitedAccount,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import {
  formatAccountDetailsToPascalCase,
  formatMemberProfileListToPascalCase,
} from '../../member-list-info/utils/format-member-details-to-pascal-case';
import { Dispatch } from 'react';
import {
  ISetMemberProfileAction,
  setMemberProfileAction,
} from '../actions/set-member-profile.action';

export const setMemberProfileDispatch = async (
  dispatch: Dispatch<ISetMemberProfileAction>,
  memberProfileResponseData: IMemberInfoResponseData
) => {
  const { patientDependents, patientList } = memberProfileResponseData;

  const account = formatAccountDetailsToPascalCase(
    memberProfileResponseData.account
  ) as ILimitedAccount;

  const profileList = formatMemberProfileListToPascalCase(
    memberProfileResponseData.profileList
  ) as IProfile[];

  const formattedData = {
    account,
    profileList,
    patientDependents,
    patientList,
  };

  await dispatch(setMemberProfileAction(formattedData));
};
