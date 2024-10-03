// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { InternalResponseCode } from '../../../../errors/error-codes';
import { ErrorInternalServer } from '../../../../errors/error-internal-server';
import { loginUser } from '../../api/api-v1';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';
import {
  IDispatchAnyDeepLinkLocationActionsType,
  IDispatchInitialScreenActionsType,
} from '../root-navigation.actions';
import { RootState } from '../root-reducer';
import { IUpdateSettingsAction } from '../settings/settings-reducer.actions';
import {
  ISetMissingAccountErrorMessageAction,
  setMissingAccountErrorMessageAction,
} from '../support-error/support-error.reducer.actions';
import { IMemberLoginState } from './member-login-reducer';
import { ICreatePinScreenRouteProps } from './../../create-pin-screen/create-pin-screen';
import { loginMemberRetryPolicy } from '../../../../utils/retry-policies/login-user.retry-policy';
import { ISetUserAuthenticatedAction } from '../secure-pin/secure-pin-reducer.actions';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { Dispatch } from 'react';

export enum MemberLoginStateActionKeys {
  SET_MEMBER_LOGIN_INFO = 'SET_MEMBER_LOGIN_INFO',
}

export interface ISetMemberLoginInfoAction {
  type: MemberLoginStateActionKeys.SET_MEMBER_LOGIN_INFO;
  payload: IMemberLoginState;
}

export type MemberLoginActionTypes = ISetMemberLoginInfoAction;

export type IDispatchMemberLoginActionsType =
  | ISetMemberLoginInfoAction
  | IUpdateSettingsAction
  | ISetMissingAccountErrorMessageAction
  | IDispatchInitialScreenActionsType
  | IDispatchAnyDeepLinkLocationActionsType
  | ISetUserAuthenticatedAction;

export const dispatchLoginUserResponse = async (
  dispatch: Dispatch<IDispatchMemberLoginActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  memberLoginInfo: IMemberLoginState
) => {
  const state = getState();
  try {
    const guestExperienceApi = state.config.apis.guestExperienceApi;
    const response = await loginUser(
      guestExperienceApi,
      {
        dateOfBirth: memberLoginInfo.dateOfBirth ?? '',
        firstName: memberLoginInfo.firstName ?? '',
        lastName: memberLoginInfo.lastName ?? '',
        primaryMemberRxId: memberLoginInfo.primaryMemberRxId,
        accountRecoveryEmail: memberLoginInfo.emailAddress ?? '',
        claimAlertId: memberLoginInfo.claimAlertId,
        prescriptionId: memberLoginInfo.prescriptionId,
        isBlockchain: memberLoginInfo.isBlockchain,
      },
      state.settings.deviceToken,
      loginMemberRetryPolicy
    );

    if (response.responseCode === InternalResponseCode.REQUIRE_USER_SET_PIN) {
      const createPinScreenParams: ICreatePinScreenRouteProps = {};
      navigation.navigate('CreatePin', createPinScreenParams);
    }
  } catch (error) {
    if (error instanceof ErrorInternalServer) {
      internalErrorDispatch(navigation, error);
    } else if (error instanceof ErrorApiResponse) {
      dispatch(
        setMissingAccountErrorMessageAction(
          error.message,
          'LogoutAndStartOverAtLogin'
        )
      );
      navigation.navigate('SupportError');
    } else {
      throw error;
    }
  }
};

export const setMemberLoginInfoAction = (
  memberLoginInfo: IMemberLoginState
): ISetMemberLoginInfoAction => {
  return {
    payload: memberLoginInfo,
    type: MemberLoginStateActionKeys.SET_MEMBER_LOGIN_INFO,
  };
};
