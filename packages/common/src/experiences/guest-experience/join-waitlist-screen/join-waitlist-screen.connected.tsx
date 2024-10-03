// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { getProfilesByGroup } from '../../../utils/profile.helper';
import { RootState } from '../store/root-reducer';
import { joinWaitlistDataLoadingAsyncAction } from '../store/waitlist/async-actions/join-waitlist-data-loading.async-action';
import { joinWaitlistLocationPreferencesAsyncAction } from '../store/waitlist/async-actions/join-waitlist-location-preferences.async-action';
import { joinWaitlistResetErrorAsyncAction } from '../store/waitlist/async-actions/join-waitlist-reset-error.async-action';
import {
  IJoinWaitlistScreenDataProps,
  IJoinWaitlistScreenActionProps,
  JoinWaitlistScreen,
} from './join-waitlist-screen';

export const mapStateToProps = (
  state: RootState,
  ownProps?: Partial<IJoinWaitlistScreenDataProps>
): IJoinWaitlistScreenDataProps => {
  const cashProfile = state.memberProfile.profileList
    ? getProfilesByGroup(state.memberProfile.profileList, RxGroupTypesEnum.CASH)
    : [];
  const hasCashProfile = cashProfile && cashProfile.length > 0;

  return {
    serviceType: state.serviceType,
    error: state.waitlist?.joinWaitlistError,
    availableWaitlistMembers: hasCashProfile
      ? [
          ...(cashProfile[0].adultMembers ?? []),
          ...(cashProfile[0].childMembers ?? []),
        ]
      : [],
    ...ownProps,
  };
};

export const actions: IJoinWaitlistScreenActionProps = {
  onJoinPress: joinWaitlistDataLoadingAsyncAction,
  resetErrorMessage: joinWaitlistResetErrorAsyncAction,
  updateLocationPreferences: joinWaitlistLocationPreferencesAsyncAction,
};

export const JoinWaitlistScreenConnected = connect(
  mapStateToProps,
  actions
)(JoinWaitlistScreen);
