// Copyright 2018 Prescryptive Health, Inc.

import { ErrorRequireUserVerifyPin } from '../../../../errors/error-require-user-verify-pin';
import { ErrorUnauthorizedAccess } from '../../../../errors/error-unauthorized-access';
import { updateMemberContactInfo } from '../../api/api-v1';
import { storeMemberListInfoAsyncAction } from '../member-list-info/async-actions/store-member-list-info.async-action';
import { IDispatchMemberLoginActionsType } from '../member-login/member-login-reducer.actions';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { RootState } from '../root-reducer';
import { IUpdateSettingsAction } from '../settings/settings-reducer.actions';
import { IEditMemberProfileState } from './edit-member-profile-reducer';
import { tokenUpdateDispatch } from '../settings/dispatch/token-update.dispatch';
import { setIdentityVerificationEmailFlagAction } from '../identity-verification/actions/set-identity-verification-email-flag.action';
import { ISetMemberProfileAction } from '../member-profile/actions/set-member-profile.action';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { loginPinNavigateDispatch } from '../navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { handleUnauthorizedAccessErrorAction } from '../error-handling.actions';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';

export enum EditMemberProfileActionKeys {
  SET_SELECTED_MEMBER = 'SET_SELECTED_MEMBER',
  UPDATE_SELECTED_MEMBER_INFO = 'UPDATE_SELECTED_MEMBER_INFO',
  SET_EDIT_MEMBER_PROFILE_ERROR = 'SET_EDIT_MEMBER_PROFILE_ERROR',
}

export interface ISetSelectedMemberAction {
  type: EditMemberProfileActionKeys.SET_SELECTED_MEMBER;
  payload: IEditMemberProfileState;
}

export interface IUpdatedMemberInfo {
  email?: string;
  phoneNumber?: string;
  secondaryMemberIdentifier?: string;
}

export interface ISetEditMemberProfileErrorAction {
  type: EditMemberProfileActionKeys.SET_EDIT_MEMBER_PROFILE_ERROR;
  payload: {
    errorMessage?: string;
  };
}

export interface IUpdateSelectedMemberInfoAction {
  type: EditMemberProfileActionKeys.UPDATE_SELECTED_MEMBER_INFO;
  payload: IEditMemberProfileState;
}

export type EditMemberProfileActionTypes =
  | ISetSelectedMemberAction
  | ISetEditMemberProfileErrorAction
  | IUpdateSelectedMemberInfoAction;

export const setSelectedMemberAction = (
  selectedMember: IEditMemberProfileState
): ISetSelectedMemberAction => {
  return {
    payload: selectedMember,
    type: EditMemberProfileActionKeys.SET_SELECTED_MEMBER,
  };
};

export const updateSelectedMemberInfoAction = (
  memberInfo: IEditMemberProfileState
): IUpdateSelectedMemberInfoAction => {
  return {
    payload: memberInfo,
    type: EditMemberProfileActionKeys.UPDATE_SELECTED_MEMBER_INFO,
  };
};

export const setEditMemberProfileErrorAction = (
  errorMessage?: string
): ISetEditMemberProfileErrorAction => {
  return {
    payload: {
      errorMessage,
    },
    type: EditMemberProfileActionKeys.SET_EDIT_MEMBER_PROFILE_ERROR,
  };
};

export const saveUpdatedMemberContactInfoAction = (
  navigation: RootStackNavigationProp,
  memberInfo: IEditMemberProfileState
) =>
  dataLoadingAction(updatedMemberContactInfoAction, {
    navigation,
    editMemberProfileState: memberInfo,
  });

export interface IUpdatedMemberContactInfoActionArgs {
  navigation: RootStackNavigationProp;
  editMemberProfileState: IEditMemberProfileState;
}

export const updatedMemberContactInfoAction = ({
  navigation,
  editMemberProfileState,
}: IUpdatedMemberContactInfoActionArgs) => {
  return async (
    dispatch: (
      action:
        | ISetEditMemberProfileErrorAction
        | IUpdateSelectedMemberInfoAction
        | IDispatchMemberLoginActionsType
        | IUpdateSettingsAction
        | ISetMemberProfileAction
    ) => RootState,
    getState: () => RootState
  ) => {
    dispatch(updateSelectedMemberInfoAction(editMemberProfileState));

    const state = getState();
    const config = state.config.apis.guestExperienceApi;
    const token = state.settings.token;
    const identifier = editMemberProfileState.memberInfo.identifier;
    const secondaryUserIdentifier =
      (editMemberProfileState.secondaryUser &&
        editMemberProfileState.secondaryUser.identifier) ||
      '';

    try {
      if (token && identifier) {
        const updatedMember: IUpdatedMemberInfo = {
          email: editMemberProfileState.memberInfo.email,
          phoneNumber: editMemberProfileState.memberInfo.phoneNumber,
          secondaryMemberIdentifier: secondaryUserIdentifier,
        };
        const response = await updateMemberContactInfo(
          config,
          token,
          identifier,
          updatedMember,
          state.settings.deviceToken
        );
        await tokenUpdateDispatch(dispatch, response.refreshToken);
      }

      storeMemberListInfoAsyncAction()(dispatch, getState);

      dispatch(setEditMemberProfileErrorAction());
      navigation.navigate('MemberListInfo');
    } catch (error) {
      if (error instanceof ErrorRequireUserVerifyPin) {
        dispatch(
          setIdentityVerificationEmailFlagAction({
            recoveryEmailExists: error.isEmailExist || false,
          })
        );

        loginPinNavigateDispatch(navigation, {
          workflow: error.workflow,
        });
      }
      if (error instanceof ErrorUnauthorizedAccess) {
        await handleUnauthorizedAccessErrorAction(
          dispatch,
          navigation,
          error.message
        );
      } else {
        internalErrorDispatch(navigation, error as Error);
      }
    }
  };
};
