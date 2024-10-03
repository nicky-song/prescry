// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { IMemberLoginState } from '../../member-login/member-login-reducer';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { addMembership } from '../../../api/api-v1.add-membership';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { IDispatchContactInfoActionsType } from '../../member-list-info/member-list-info-reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { ErrorAddMembership } from '../../../../../errors/error-add-membership';
import {
  getFeedResponseAction,
  IGetFeedResponseAction,
} from '../../feed/actions/get-feed-response.action';
import { ISetIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { Dispatch } from 'react';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { resetStackToHome } from '../../navigation/navigation-reducer.actions';
import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';

export type AddMembershipDispatchType =
  | IUpdateSettingsAction
  | IDispatchContactInfoActionsType
  | IGetFeedResponseAction
  | ISetIdentityVerificationEmailFlagAction;

export const addMembershipDispatch = async (
  dispatch: Dispatch<AddMembershipDispatchType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  memberLoginInfo: IMemberLoginState
) => {
  const state = getState();
  const { memberProfile, settings, config } = state;
  const { guestExperienceApi } = config.apis;

  try {
    const response = await addMembership(
      guestExperienceApi,
      memberLoginInfo,
      settings.deviceToken,
      settings.token,
      getEndpointRetryPolicy
    );

    if (response.status === 'success') {
      const memberInfoResponseDataLogger = (
        responseData: IMemberInfoResponseData
      ): void => {
        if (
          responseData.profileList.length === memberProfile.profileList.length
        ) {
          guestExperienceCustomEventLogger(
            CustomAppInsightEvents.PROFILE_NOT_UPDATED_AFTER_JOIN_EMPLOYER_PLAN,
            { primaryMemberRxId: memberLoginInfo.primaryMemberRxId }
          );
        }
      };

      dispatch(getFeedResponseAction([]));
      await tokenUpdateDispatch(dispatch, response.refreshToken);
      await loadMemberDataDispatch(
        dispatch,
        getState,
        navigation,
        memberInfoResponseDataLogger
      );
      resetStackToHome(navigation);
    }
  } catch (error) {
    if (error instanceof ErrorAddMembership) {
      throw error;
    } else {
      await handlePostLoginApiErrorsAction(
        error as Error,
        dispatch,
        navigation
      );
    }
  }
};
