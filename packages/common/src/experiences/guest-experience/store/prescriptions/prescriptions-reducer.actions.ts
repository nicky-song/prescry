// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorInvalidAuthToken } from '../../../../errors/error-invalid-auth-token';
import { ErrorRequireUserVerifyPin } from '../../../../errors/error-require-user-verify-pin';
import { ErrorShowPinFeatureWelcomeScreen } from '../../../../errors/error-show-pin-feature-welcome-screen';
import { ErrorUnauthorizedAlertUrl } from '../../../../errors/error-unauthorized-alert-url';
import { IGetPendingPrescriptionResponse } from '../../../../models/api-response';
import { IPendingPrescriptionsList } from '../../../../models/pending-prescription';
import { IUpdateSettingsAction } from '../../../guest-experience/store/settings/settings-reducer.actions';
import { getPendingPrescriptions } from '../../api/api-v1';
import {
  handleRedirectSuccessResponse,
  IRedirectResponse,
} from '../../api/api-v1-helper';
import { updateTelemetryId } from '../../guest-experience-logger.middleware';
import { ISettings } from '../../guest-experience-settings';
import { ISetMissingAccountErrorMessageAction } from '../../store/support-error/support-error.reducer.actions';
import { ISetContactInfoAction } from '../member-list-info/member-list-info-reducer.actions';
import {
  ISetPrescribedMemberDetailsAction,
  setPrescribedMemberDetailsAction,
} from '../prescribed-member/prescribed-member-reducer.actions';
import { RootState } from '../root-reducer';
import { Dispatch } from 'react';
import {
  ISetMemberInfoRequestIdAction,
  ISetPrescriptionInfoRequestIdAction,
  setMemberInfoRequestIdAction,
  setPrescriptionInfoRequestIdAction,
} from '../telemetry/telemetry-reducer.actions';
import { IMemberContactInfo } from '../../../../models/member-info/member-contact-info';
import { tokenUpdateDispatch } from '../settings/dispatch/token-update.dispatch';
import {
  ISetIdentityVerificationEmailFlagAction,
  setIdentityVerificationEmailFlagAction,
} from '../identity-verification/actions/set-identity-verification-email-flag.action';
import {
  IMemberProfileActionTypes,
  IMemberProfileState,
} from '../member-profile/member-profile-reducer';
import {
  IDependentProfile,
  IPrimaryProfile,
} from '../../../../models/member-profile/member-profile-info';
import { getMemberProfileInfo } from '../../api/api-v1.get-member-profile';
import { storeMemberProfileApiResponseDispatch } from '../member-profile/dispatch/store-member-profile-api-response.dispatch';
import { IMemberInfoResponse } from '../../../../models/api-response/member-info-response';
import { RootStackNavigationProp } from './../../navigation/stack-navigators/root/root.stack-navigator';
import { loginPinNavigateDispatch } from '../navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import {
  handleAuthenticationErrorAction,
  handleCommonErrorAction,
  handleUnauthorizedAccessErrorAction,
} from '../error-handling.actions';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';
import { popToTop } from '../../navigation/navigation.helper';

export enum PrescriptionsStateActionKeys {
  UPDATE_PRESCRIPTIONS = 'UPDATE_PRESCRIPTIONS',
}

export interface IUpdatePrescriptionsAction {
  readonly type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS;
  readonly payload: {
    pendingPrescriptionsList: IPendingPrescriptionsList;
    arePrescriptionsInitialized?: boolean;
  };
}

export type PrescriptionsStateActionTypes = IUpdatePrescriptionsAction;

export type IDispatchInitializePrescriptionsActionTypes =
  | IUpdatePrescriptionsAction
  | IUpdateSettingsAction
  | ISetPrescriptionInfoRequestIdAction
  | ISetMemberInfoRequestIdAction
  | ISetPrescribedMemberDetailsAction
  | ISetContactInfoAction
  | ISetMissingAccountErrorMessageAction
  | ISetIdentityVerificationEmailFlagAction
  | IMemberProfileActionTypes;

async function setMemberDetailsAction(
  dispatch: Dispatch<ISetPrescribedMemberDetailsAction>,
  member?: IMemberContactInfo | IPrimaryProfile | IDependentProfile
) {
  if (member) {
    const { firstName, lastName, identifier, isPrimary } = member;

    await dispatch(
      setPrescribedMemberDetailsAction({
        firstName,
        identifier,
        isPrimary,
        lastName,
      })
    );
  }
}
export const initializePrescriptionsDispatch = async (
  dispatch: Dispatch<IDispatchInitializePrescriptionsActionTypes>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  identifier: string
) => {
  const state = getState();

  try {
    const settings = state.settings as Required<ISettings>;

    updateTelemetryId(state.telemetry.memberInfoRequestId);

    const prescriptions = await loadPrescriptions(
      identifier,
      settings,
      state,
      dispatch,
      navigation
    );
    if (!prescriptions) {
      return;
    }

    await loadMember(
      prescriptions.data.memberIdentifier,
      state,
      settings,
      dispatch
    ).then(() => {
      popToTop(navigation);
      navigation.navigate('ClaimAlertStack', { screen: 'ClaimAlert' });
    });
  } catch (error) {
    if (error instanceof ErrorShowPinFeatureWelcomeScreen) {
      navigation.navigate('PinFeatureWelcome', {});
      return;
    }

    if (error instanceof ErrorRequireUserVerifyPin) {
      await dispatch(
        setIdentityVerificationEmailFlagAction({
          recoveryEmailExists: error.isEmailExist || false,
        })
      );
      if (error.workflow) {
        loginPinNavigateDispatch(navigation, {
          workflow: error.workflow,
        });
        return;
      }

      loginPinNavigateDispatch(navigation);
      return;
    }

    if (error instanceof ErrorInvalidAuthToken) {
      await handleAuthenticationErrorAction(dispatch, navigation);
      return;
    }

    if (error instanceof ErrorUnauthorizedAlertUrl) {
      await handleUnauthorizedAccessErrorAction(
        dispatch,
        navigation,
        error.message
      );
      return;
    }

    if (error instanceof ErrorApiResponse) {
      handleCommonErrorAction(navigation, error.message, error);
      return;
    }

    internalErrorDispatch(navigation, error as Error);
  }
};

async function loadPrescriptions(
  rxIdentifier: string,
  settings: Required<ISettings>,
  state: RootState,
  dispatch: Dispatch<IDispatchInitializePrescriptionsActionTypes>,
  navigation: RootStackNavigationProp
) {
  const response = await getPendingPrescriptions(
    state.config.apis.guestExperienceApi,
    rxIdentifier,
    settings.token,
    settings.deviceToken
  );

  await tokenUpdateDispatch(dispatch, response.refreshToken);

  if (response.responseCode) {
    await handleRedirectSuccessResponse(
      response as IRedirectResponse,
      dispatch,
      navigation
    );
    return;
  }

  const { data } = response as IGetPendingPrescriptionResponse;

  await dispatch(updatePrescriptionsAction(data.pendingPrescriptionList, true));

  if (response.prescriptionInfoRequestId) {
    await dispatch(
      setPrescriptionInfoRequestIdAction(response.prescriptionInfoRequestId)
    );
  }

  if (response.memberInfoRequestId) {
    await dispatch(setMemberInfoRequestIdAction(response.memberInfoRequestId));
  }

  return response as IGetPendingPrescriptionResponse;
}

async function loadMember(
  memberIdentifier: string,
  state: RootState,
  settings: Required<ISettings>,
  dispatch: Dispatch<
    | ISetPrescribedMemberDetailsAction
    | ISetContactInfoAction
    | IUpdateSettingsAction
    | IMemberProfileActionTypes
  >
) {
  const response = await getMemberProfileInfo(
    state.config.apis.guestExperienceApi,
    settings.token,
    undefined,
    state.settings.deviceToken
  );
  await tokenUpdateDispatch(dispatch, response.refreshToken);
  if (!response.responseCode) {
    const memberResponse = response as IMemberInfoResponse;
    await storeMemberProfileApiResponseDispatch(dispatch, memberResponse);

    const member = getPrescribedMemberFromList(
      memberResponse.data,
      memberIdentifier
    );
    await setMemberDetailsAction(dispatch, member);
    return member;
  }
  return undefined;
}

export const getPrescribedMemberFromList = (
  memberDetails: IMemberProfileState,
  identifier: string
) => {
  const { profileList } = memberDetails;
  if (profileList.length === 0) {
    return undefined;
  }
  const primaryProfile = profileList.filter(
    (profile) => profile.primary.identifier === identifier
  );
  if (primaryProfile.length > 0) {
    return primaryProfile[0].primary;
  }
  for (const profileItem of profileList) {
    const dependentProfile = profileItem?.childMembers?.find(
      (dep: IDependentProfile) => dep.identifier === identifier
    );
    if (dependentProfile) {
      return dependentProfile;
    }
    const adultDependentProfile = profileItem?.adultMembers?.find(
      (adultDep: IDependentProfile) => adultDep.identifier === identifier
    );
    if (adultDependentProfile) {
      return adultDependentProfile;
    }
  }
  return undefined;
};

export const updatePrescriptionsAction = (
  pendingPrescriptionsList: IPendingPrescriptionsList,
  arePrescriptionsInitialized?: boolean
): IUpdatePrescriptionsAction => ({
  payload: {
    arePrescriptionsInitialized,
    pendingPrescriptionsList,
  },
  type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
});
