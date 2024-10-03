// Copyright 2018 Prescryptive Health, Inc.

import { IMemberDetails } from '../../../../../models/api-response';
import { Dispatch } from 'react';
import {
  ISetContactInfoAction,
  setMembersInfoAction,
} from '../member-list-info-reducer.actions';
import { formatMemberDetailsToPascalCase } from '../utils/format-member-details-to-pascal-case';

export const setMembersInfoDispatch = async (
  dispatch: Dispatch<ISetContactInfoAction>,
  memberDetails: IMemberDetails
) => {
  const loggedInMember = formatMemberDetailsToPascalCase([
    memberDetails.loggedInMember,
  ])[0];

  const childMembers = formatMemberDetailsToPascalCase(
    memberDetails.childMembers
  );

  const adultMembers = formatMemberDetailsToPascalCase(
    memberDetails.adultMembers
  );

  await dispatch(
    setMembersInfoAction(
      loggedInMember,
      childMembers,
      adultMembers,
      memberDetails.isMember
    )
  );
};
