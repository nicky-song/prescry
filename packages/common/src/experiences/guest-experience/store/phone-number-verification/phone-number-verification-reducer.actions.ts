// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { InternalResponseCode } from '../../../../errors/error-codes';
import { ErrorInvalidAuthToken } from '../../../../errors/error-invalid-auth-token';
import { ErrorTwilioService } from '../../../../errors/error-twilio-service';
import { IVerifyOneTimePasswordV2 } from '../../../../models/api-response';
import { Workflow } from '../../../../models/workflow';
import {
  PhoneNumberOtherCountryDialingCode,
  PhoneNumberDialingCode,
  LengthOfPhoneNumber,
} from '../../../../theming/constants';
import { sendOneTimePassword, verifyOneTimePassword } from '../../api/api-v1';
import {
  handleAuthenticationErrorAction,
  handleCommonErrorAction,
  handleTwilioErrorAction,
} from '../error-handling.actions';
import {
  ISetIdentityVerificationEmailFlagAction,
  setIdentityVerificationEmailFlagAction,
} from '../identity-verification/actions/set-identity-verification-email-flag.action';
import { IDispatchContactInfoActionsType } from '../member-list-info/member-list-info-reducer.actions';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { RootState } from '../root-reducer';
import {
  IUpdateSettingsAction,
  resetSettingsAction,
  updateDeviceTokenSettingsAction,
} from '../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import {
  ISetMissingAccountErrorMessageAction,
  setMissingAccountErrorMessageAction,
} from '../support-error/support-error.reducer.actions';
import {
  ISetMemberInfoRequestIdAction,
  ISetPrescriptionInfoRequestIdAction,
} from '../telemetry/telemetry-reducer.actions';
import { IGetTestResultsActionType } from '../test-result/async-actions/get-test-result.async-action';
import {
  ISetVerificationCodeErrorStateAction,
  ISetVerificationCodeAction,
  onVerifyPhoneNumberAction,
  ISetOneTimePasswordStatusAction,
  PhoneNumberVerificationActionsKeys,
} from './actions/phone-number-verification.actions';
import {
  RootStackNavigationProp,
  RootStackScreenName,
} from '../../navigation/stack-navigators/root/root.stack-navigator';
import { ICreateAccountScreenRouteProps } from '../../screens/sign-in/create-account/create-account.screen';
import { ILoginScreenRouteProps } from '../../login-screen/login-screen';
import { getClaimAlertOrPrescriptionIdFromUrl } from '../../../../utils/claimalert-prescription.helper';
import { IAccountLockedScreenRouteProps } from '../../screens/sign-in/account-locked/account-locked.screen';

export interface ISendOneTimePasswordAsyncActionArgs {
  phoneNumber: string;
  navigation: RootStackNavigationProp;
}

export const sendOneTimePasswordLoadingAction = (
  args: ISendOneTimePasswordAsyncActionArgs
) => dataLoadingAction(sendOneTimePasswordAction, args);

export interface IVerificationCodeActionParams {
  phoneNumber: string;
  verificationCode: string;
  workflow?: Workflow;
  navigation: RootStackNavigationProp;
  prescriptionId?: string;
}
export const verifyCodeLoadingAction = (
  verificationCodeActionParams: IVerificationCodeActionParams
) => dataLoadingAction(verifyCodeAction, verificationCodeActionParams);

export const verifyCodeAction = (
  verificationCodeAction: IVerificationCodeActionParams
) => {
  return async (
    dispatch: Dispatch<
      | ISetVerificationCodeErrorStateAction
      | IUpdateSettingsAction
      | IDispatchContactInfoActionsType
      | ISetMissingAccountErrorMessageAction
      | ISetPrescriptionInfoRequestIdAction
      | ISetMemberInfoRequestIdAction
      | ISetVerificationCodeAction
      | IGetTestResultsActionType
    >,
    getState: () => RootState
  ) => {
    dispatch(
      onVerifyPhoneNumberAction(verificationCodeAction.verificationCode)
    );

    const state = getState();
    try {
      await dispatchVerifyCodeResponse(dispatch, state, verificationCodeAction);
    } catch (error) {
      await dispatchVerifyCodeActionError(
        error as Error,
        dispatch,
        verificationCodeAction.navigation
      );
    }
  };
};

export const dispatchVerifyCodeActionError = async (
  error: Error,
  dispatch: Dispatch<
    | ISetMissingAccountErrorMessageAction
    | IUpdateSettingsAction
    | ISetVerificationCodeErrorStateAction
  >,
  navigation: RootStackNavigationProp
) => {
  if (error instanceof ErrorTwilioService) {
    handleTwilioErrorAction(
      dispatch,
      navigation,
      error.message,
      'LogoutAndStartOverAtLogin'
    );
  } else if (error instanceof ErrorInvalidAuthToken) {
    await handleAuthenticationErrorAction(dispatch, navigation);
  } else if (error instanceof ErrorApiResponse) {
    await dispatch(
      setMissingAccountErrorMessageAction(
        error.message,
        'LogoutAndStartOverAtLogin'
      )
    );

    navigation.navigate('SupportError');
  } else {
    await dispatchVerificationCodeErrorState(dispatch, true);
  }
};

export const sendOneTimePasswordAction = ({
  phoneNumber,
  navigation,
}: ISendOneTimePasswordAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<
      | ISetVerificationCodeErrorStateAction
      | ISetOneTimePasswordStatusAction
      | ISetMissingAccountErrorMessageAction
      | IUpdateSettingsAction
      | ISetVerificationCodeAction
    >,
    getState: () => RootState
  ) => {
    const state = getState();
    const configApi = state.config.apis.guestExperienceApi;

    try {
      const countryCode = state.features.usecountrycode
        ? PhoneNumberOtherCountryDialingCode
        : PhoneNumberDialingCode;
      await sendOneTimePassword(
        configApi,
        phoneNumber.length === LengthOfPhoneNumber
          ? `${countryCode}${phoneNumber}`
          : phoneNumber,
        state.settings.automationToken
      );
      await dispatchVerificationCodeErrorState(dispatch, false);
      await dispatchOneTimePasswordSendState(dispatch, true);
      await dispatchResetVerificationCodeAction(dispatch);
    } catch (error) {
      await dispatchOneTimePasswordSendState(dispatch, false);
      if (error instanceof ErrorTwilioService) {
        handleTwilioErrorAction(dispatch, navigation, error.message);
      } else if (error instanceof ErrorInvalidAuthToken) {
        await handleAuthenticationErrorAction(dispatch, navigation);
      } else {
        handleCommonErrorAction(
          navigation,
          (error as Error).message,
          error as Error
        );
      }
    }
  };
};

export const dispatchVerificationCodeErrorState = (
  dispatch: (action: ISetVerificationCodeErrorStateAction) => void,
  isIncorrectCode: boolean
) =>
  dispatch({
    payload: {
      isIncorrectCode,
    },
    type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE_ERROR_STATE,
  });

export const dispatchOneTimePasswordSendState = (
  dispatch: (action: ISetOneTimePasswordStatusAction) => void,
  isOneTimePasswordSent: boolean
) =>
  dispatch({
    payload: {
      isOneTimePasswordSent,
    },
    type: PhoneNumberVerificationActionsKeys.SET_SEND_ONE_TIME_PASSWORD_STATUS,
  });

export const dispatchResetVerificationCodeAction = (
  dispatch: (action: ISetVerificationCodeAction) => void
) => {
  dispatch({
    payload: {
      verificationCode: undefined,
    },
    type: PhoneNumberVerificationActionsKeys.SET_VERIFICATION_CODE,
  });
};

export const getRedirectScreenIfNotReady = (
  code?: number
): RootStackScreenName | undefined => {
  switch (code) {
    case InternalResponseCode.REQUIRE_USER_SET_PIN:
      return 'CreatePin';
    case InternalResponseCode.REQUIRE_USER_VERIFY_PIN:
      return 'LoginPin';
    case InternalResponseCode.REQUIRE_USER_REGISTRATION:
      return 'Login';
    case InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN:
      return 'PinFeatureWelcome';
    case InternalResponseCode.SHOW_ACCOUNT_LOCKED:
      return 'AccountLocked';
  }
  return undefined;
};

export const dispatchVerifyCodeResponse = async (
  dispatch: Dispatch<
    | ISetVerificationCodeErrorStateAction
    | IUpdateSettingsAction
    | ISetIdentityVerificationEmailFlagAction
  >,
  state: RootState,
  verificationCodeAction: IVerificationCodeActionParams
) => {
  const configApi = state.config.apis.guestExperienceApi;
  const {
    verificationCode,
    workflow,
    phoneNumber,
    navigation,
    prescriptionId,
  } = verificationCodeAction;
  const countryCode = state.features.usecountrycode
    ? PhoneNumberOtherCountryDialingCode
    : PhoneNumberDialingCode;

  const response = (await verifyOneTimePassword(
    configApi,
    verificationCode,
    phoneNumber.length === LengthOfPhoneNumber
      ? `${countryCode}${phoneNumber}`
      : phoneNumber,
    state.settings.automationToken
  )) as IVerifyOneTimePasswordV2;

  const screen = getRedirectScreenIfNotReady(response.responseCode);

  const urlPath = state.config.location?.pathname ?? '';

  const claimAlertOrPrescriptionInfo = urlPath
    ? getClaimAlertOrPrescriptionIdFromUrl(urlPath)
    : undefined;

  const isBlockchain = claimAlertOrPrescriptionInfo?.isBlockchain;

  if (screen) {
    await resetSettingsAction()(dispatch);
    await updateDeviceTokenSettingsAction(response.data.deviceToken)(dispatch);
    dispatch(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: response.data?.recoveryEmailExists || false,
      })
    );
    if (workflow) {
      switch (screen) {
        case 'CreatePin':
          navigation.navigate('CreatePin', {
            workflow,
          });
          break;

        case 'LoginPin':
          navigation.navigate('LoginPin', {
            workflow,
          });
          break;

        case 'Login':
          navigation.navigate('CreateAccount', {
            workflow,
            phoneNumber,
            errorType: 'noAccountWithUs',
            prescriptionId,
            blockchain: isBlockchain,
          } as ICreateAccountScreenRouteProps);
          break;
        case 'PinFeatureWelcome':
          navigation.navigate('PinFeatureWelcome', { workflow });
          return;
      }
      return true;
    }

    if (screen === 'Login') {
      if (claimAlertOrPrescriptionInfo) {
        const loginScreenProps: ILoginScreenRouteProps = {
          claimAlertId: claimAlertOrPrescriptionInfo.claimAlertId,
          prescriptionId: claimAlertOrPrescriptionInfo.prescriptionId,
          isBlockchain,
        };
        navigation.navigate('Login', loginScreenProps);
        return true;
      }
    }

    if (screen === 'AccountLocked') {
      const accountLockedScreenRouteProps: IAccountLockedScreenRouteProps = {
        accountLockedResponse: true,
      };
      navigation.navigate('AccountLocked', accountLockedScreenRouteProps);
      return true;
    }
    navigation.navigate(screen, {});
    return true;
  } else {
    await dispatchVerificationCodeErrorState(dispatch, true);
    return false;
  }
};
