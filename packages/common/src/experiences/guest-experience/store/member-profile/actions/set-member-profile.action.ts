// Copyright 2021 Prescryptive Health, Inc.

import {
  ILimitedAccount,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { IMemberProfileAction } from './member-profile.action';

export interface ISetMemberProfileActionPayload {
  account?: ILimitedAccount;
  profileList?: IProfile[];
}
export type ISetMemberProfileAction = IMemberProfileAction<
  'SET_MEMBER_PROFILE',
  ISetMemberProfileActionPayload
>;

export const setMemberProfileAction = (
  data: ISetMemberProfileActionPayload
): ISetMemberProfileAction => ({
  payload: data,
  type: 'SET_MEMBER_PROFILE',
});
