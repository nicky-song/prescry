// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorBadRequest } from '../../../../errors/error-bad-request';
import { InternalResponseCode } from '../../../../errors/error-codes';
import { ErrorMaxPinAttempt } from '../../../../errors/error-max-pin-attempt';
import { MaxAllowedFailureAttemptsToVerify } from '../../../../theming/constants';
import { generatePinHash } from '../../../../utils/json-web-token-helper/json-web-token-helper';
import { addPin, updatePin, verifyPin } from '../../api/api-v1.pin';
import { handleCommonErrorAction } from '../../store/error-handling.actions';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { IDispatchInitialScreenActionsType } from '../root-navigation.actions';
import { RootState } from '../root-reducer';
import { IUpdateSettingsAction } from '../settings/settings-reducer.actions';
import { startExperienceDispatch } from '../start-experience/dispatch/start-experience.dispatch';
import { Dispatch } from 'react';
import { IDispatchMemberLoginActionsType } from '../member-login/member-login-reducer.actions';
import { tokenUpdateDispatch } from '../settings/dispatch/token-update.dispatch';
import { accountTokenClearDispatch } from '../settings/dispatch/account-token-clear.dispatch';
import { IGetFeedActionType } from '../feed/async-actions/get-feed.async-action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../guest-experience-logger.middleware';
import { ICreatePinScreenRouteProps } from './../../create-pin-screen/create-pin-screen';
import { SecurePinStateActionKeys } from './secure-pin-actions';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { dispatchResetStackToFatalErrorScreen } from '../navigation/navigation-reducer.actions';
import { IFailureResponse } from '../../../../models/api-response';

export interface ISetHasPinMismatchedAction {
  type: SecurePinStateActionKeys.SET_HAS_PIN_MISMATCHED;
  payload: {
    hasPinMismatched: boolean;
  };
}

export interface ISetErrorCodeAction {
  type: SecurePinStateActionKeys.SET_ERROR_CODE;
  payload: {
    errorCode: number | undefined;
  };
}

export interface ISetNumberOfFailedAttemptsToVerify {
  type: SecurePinStateActionKeys.SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY;
  payload: {
    numberOfFailedAttemptsToVerify: number;
  };
}

export interface INavigateToVerifyPin {
  type: SecurePinStateActionKeys.NAVIGATE_TO_VERIFY_PIN;
}

export interface ISetSecurePinAction {
  type: SecurePinStateActionKeys.SET_CREATED_PIN_TO_STATE;
  payload: {
    pinHash: string;
  };
}

export interface ISetPinToBeVerifiedAction {
  type: SecurePinStateActionKeys.SET_PIN_TO_BE_VERIFIED;
  payload: {
    pinHash: string;
  };
}

export interface ISetPinStateDefault {
  type: SecurePinStateActionKeys.SET_PIN_STATE_DEFAULT;
}

export interface ISetAuthExperienceAction {
  type: SecurePinStateActionKeys.SET_AUTH_EXPERIENCE;
  payload: {
    isAuthExperience: boolean;
  };
}
export const setAuthExperienceAction = (
  isAuthExperience: boolean
): ISetAuthExperienceAction => ({
  payload: {
    isAuthExperience,
  },
  type: SecurePinStateActionKeys.SET_AUTH_EXPERIENCE,
});

export interface ISetUserAuthenticatedAction {
  type: SecurePinStateActionKeys.SET_USER_AUTHENTICATED;
  payload: {
    isUserAuthenticated: boolean;
  };
}
export const setUserAuthenticatedAction = (
  isUserAuthenticated: boolean
): ISetUserAuthenticatedAction => ({
  payload: {
    isUserAuthenticated,
  },
  type: SecurePinStateActionKeys.SET_USER_AUTHENTICATED,
});

export type IDispatchSecurePinStateActionTypes =
  | INavigateToVerifyPin
  | ISetHasPinMismatchedAction
  | ISetSecurePinAction
  | ISetPinToBeVerifiedAction
  | ISetNumberOfFailedAttemptsToVerify
  | ISetPinStateDefault
  | ISetErrorCodeAction
  | ISetAuthExperienceAction
  | ISetUserAuthenticatedAction;

export const addUpdatePinAction = (args: IAddUpdatePinAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<
      | IDispatchSecurePinStateActionTypes
      | IDispatchInitialScreenActionsType
      | IDispatchMemberLoginActionsType
      | IUpdateSettingsAction
      | IGetFeedActionType
    >,
    getState: () => RootState
  ) => {
    const { pin, pinScreenParams, navigation } = args;

    await setPinToBeVerifiedAction(pin)(dispatch, getState);
    try {
      const state = getState();
      const createdPinHash = state.securePin.createdPinHash;
      const verifyPinHash = state.securePin.verifyPinHash;
      const deviceToken = state.settings.deviceToken;
      const token = state.settings.token;

      if (createdPinHash && deviceToken && createdPinHash === verifyPinHash) {
        if (
          pinScreenParams?.isUpdatePin &&
          token &&
          pinScreenParams?.currentPin
        ) {
          const updateResponse = await updatePin(
            state.config.apis.guestExperienceApi,
            token,
            deviceToken,
            pinScreenParams?.currentPin,
            verifyPinHash
          );
          dispatch(setPinStateDefault());
          await tokenUpdateDispatch(dispatch, updateResponse.refreshToken);

          dispatch(setUserAuthenticatedAction(true));
          await startExperienceDispatch(
            dispatch,
            getState,
            navigation,
            false,
            undefined,
            true
          );
        } else {
          const response = await addPin(
            state.config.apis.guestExperienceApi,
            deviceToken,
            verifyPinHash
          );
          dispatch(setPinStateDefault());
          await tokenUpdateDispatch(
            dispatch,
            response.data.accountToken,
            response.refreshDeviceToken
          );
          dispatch(setUserAuthenticatedAction(true));
          await startExperienceDispatch(
            dispatch,
            getState,
            navigation,
            false,
            pinScreenParams?.workflow
          );
        }
      } else {
        dispatch(setHasPinMismatchedFlagAction(true));
      }
    } catch (error) {
      if (error instanceof ErrorApiResponse) {
        handleCommonErrorAction(navigation, error.message, error);
        return;
      }

      const errorCode = (error as IFailureResponse).code;
      if (errorCode === InternalResponseCode.USE_ANOTHER_PIN) {
        dispatch(setErrorCodeAction(errorCode));
        const createPinScreenParams: ICreatePinScreenRouteProps = {
          ...pinScreenParams,
        };
        navigation.navigate('CreatePin', createPinScreenParams);
        return;
      }
      if (error instanceof ErrorBadRequest) {
        dispatch(setHasPinMismatchedFlagAction(true));
      } else {
        navigation.navigate('SupportError');
      }
    }
  };
};

export interface IAddUpdatePinAsyncActionArgs {
  navigation: RootStackNavigationProp;
  pin: string;
  pinScreenParams?: ICreatePinScreenRouteProps;
}

export const addUpdatePinLoadingAction = (args: IAddUpdatePinAsyncActionArgs) =>
  dataLoadingAction(addUpdatePinAction, args);

export const navigateToResetPinAction = (
  navigation: RootStackNavigationProp
) => {
  guestExperienceCustomEventLogger(
    CustomAppInsightEvents.CLICKED_FORGOT_PIN_LINK,
    {}
  );
  navigation.navigate('VerifyIdentity');
};

export const verifyPinAction = (args: IVerifyPinAsyncActionArgs) => {
  return async (
    dispatch: Dispatch<
      | IDispatchSecurePinStateActionTypes
      | IDispatchInitialScreenActionsType
      | IDispatchMemberLoginActionsType
      | IGetFeedActionType
      | IUpdateSettingsAction
    >,
    getState: () => RootState
  ) => {
    const { pin, pinScreenParams, navigation } = args;

    try {
      const state = getState();
      const deviceToken = state.settings.deviceToken;

      if (deviceToken && pin) {
        const potentialPinHash = generatePinHash(pin, deviceToken);
        const response = await verifyPin(
          state.config.apis.guestExperienceApi,
          deviceToken,
          potentialPinHash
        );
        dispatch(setPinStateDefault());
        await tokenUpdateDispatch(
          dispatch,
          response.data.accountToken,
          response.refreshDeviceToken
        );

        if (pinScreenParams?.isUpdatePin) {
          dispatch(setErrorCodeAction(undefined));
          const createPinScreenParams: ICreatePinScreenRouteProps = {
            currentPin: potentialPinHash,
            isUpdatePin: pinScreenParams?.isUpdatePin,
          };
          navigation.navigate('CreatePin', createPinScreenParams);
        } else {
          dispatch(setUserAuthenticatedAction(true));
          await startExperienceDispatch(
            dispatch,
            getState,
            navigation,
            false,
            pinScreenParams?.workflow
          );
        }
      }
    } catch (error) {
      if (error instanceof ErrorApiResponse) {
        handleCommonErrorAction(navigation, error.message, error);
        return;
      }

      if (error instanceof ErrorBadRequest) {
        dispatch(setHasPinMismatchedFlagAction(true));
        return;
      }

      if (error instanceof ErrorMaxPinAttempt) {
        if (error.numberOfFailedAttempts < MaxAllowedFailureAttemptsToVerify) {
          dispatch(
            setNumberOfFailedAttemptsToVerifyAction(
              error.numberOfFailedAttempts
            )
          );
          dispatch(setHasPinMismatchedFlagAction(true));
          return;
        }

        if (getState().settings.token) {
          await accountTokenClearDispatch(dispatch);
        }
        navigation.navigate('AccountLocked', {});
        return;
      }

      dispatchResetStackToFatalErrorScreen(navigation);
    }
  };
};

export interface IVerifyPinAsyncActionArgs {
  pin: string;
  pinScreenParams?: ICreatePinScreenRouteProps;
  navigation: RootStackNavigationProp;
}

export const verifyPinLoadingAction = (args: IVerifyPinAsyncActionArgs) =>
  dataLoadingAction(verifyPinAction, args);

export const setHasPinMismatchedFlagAction = (
  hasPinMismatched: boolean
): ISetHasPinMismatchedAction => ({
  payload: {
    hasPinMismatched,
  },
  type: SecurePinStateActionKeys.SET_HAS_PIN_MISMATCHED,
});

export const setErrorCodeAction = (
  errorCode: number | undefined
): ISetErrorCodeAction => ({
  payload: {
    errorCode,
  },
  type: SecurePinStateActionKeys.SET_ERROR_CODE,
});

export const setNumberOfFailedAttemptsToVerifyAction = (
  numberOfFailedAttemptsToVerify: number
): ISetNumberOfFailedAttemptsToVerify => ({
  payload: {
    numberOfFailedAttemptsToVerify,
  },
  type: SecurePinStateActionKeys.SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY,
});

export const setPinAction = (pin: string) => {
  return async (
    dispatch: Dispatch<
      ISetSecurePinAction | ISetPinStateDefault | ISetErrorCodeAction
    >,
    getState: () => RootState
  ) => {
    await dispatch(setErrorCodeAction(0));
    const deviceToken = getState().settings.deviceToken;
    let pinHash;
    if (!deviceToken) {
      throw Error();
    }
    if (deviceToken && pin) {
      await dispatch(setPinStateDefault());
      pinHash = generatePinHash(pin, deviceToken);
      await dispatch({
        payload: { pinHash },
        type: SecurePinStateActionKeys.SET_CREATED_PIN_TO_STATE,
      });
    }
  };
};

export const setPinToBeVerifiedAction = (pin: string) => {
  return async (
    dispatch: Dispatch<ISetPinToBeVerifiedAction>,
    getState: () => RootState
  ) => {
    const deviceToken = getState().settings.deviceToken;
    let pinHash;
    if (deviceToken && pin) {
      pinHash = generatePinHash(pin, deviceToken);
      await dispatch({
        payload: { pinHash },
        type: SecurePinStateActionKeys.SET_PIN_TO_BE_VERIFIED,
      });
    }
  };
};

export const setPinStateDefault = (): ISetPinStateDefault => ({
  type: SecurePinStateActionKeys.SET_PIN_STATE_DEFAULT,
});

export const navigateToBackAction =
  (navigation: RootStackNavigationProp) =>
  async (dispatch: (action: IDispatchSecurePinStateActionTypes) => void) => {
    await dispatch(setPinStateDefault());
    navigation.goBack();
  };

export const clearAccountToken = () => {
  return async (dispatch: Dispatch<IUpdateSettingsAction>) => {
    await accountTokenClearDispatch(dispatch);
  };
};
