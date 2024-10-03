// Copyright 2018 Prescryptive Health, Inc.

import { ISetPrescribedMemberDetailsAction } from '../prescribed-member/prescribed-member-reducer.actions';
import { IUpdateSettingsAction } from '../settings/settings-reducer.actions';
import { ISetMissingAccountErrorMessageAction } from '../support-error/support-error.reducer.actions';
import {
  ISetMemberInfoRequestIdAction,
  ISetPrescriptionInfoRequestIdAction,
} from '../telemetry/telemetry-reducer.actions';
import { IMemberContactInfo } from '../../../../models/member-info/member-contact-info';
import { IMemberProfileActionTypes } from '../member-profile/member-profile-reducer';

export enum MemberListInfoActionKeys {
  SET_MEMBER_LIST_INFO = 'SET_MEMBER_LIST_INFO',
}

export interface ISetContactInfoAction {
  readonly type: MemberListInfoActionKeys.SET_MEMBER_LIST_INFO;
  readonly payload: {
    loggedInMember: IMemberContactInfo;
    childMembers: IMemberContactInfo[];
    adultMembers: IMemberContactInfo[];
    isMember: boolean;
  };
}

export type IDispatchContactInfoActionsType =
  | ISetContactInfoAction
  | IUpdateSettingsAction
  | ISetPrescriptionInfoRequestIdAction
  | ISetMemberInfoRequestIdAction
  | ISetPrescribedMemberDetailsAction
  | ISetMissingAccountErrorMessageAction
  | IMemberProfileActionTypes;

export const setMembersInfoAction = (
  loggedInMember: IMemberContactInfo,
  childMembers: IMemberContactInfo[],
  adultMembers: IMemberContactInfo[],
  isMember: boolean
): ISetContactInfoAction => ({
  payload: {
    adultMembers,
    childMembers,
    loggedInMember,
    isMember,
  },
  type: MemberListInfoActionKeys.SET_MEMBER_LIST_INFO,
});
