// Copyright 2018 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../errors/error-bad-request';
import { TooManyRequestError } from '../../../../errors/error-too-many-requests';
import { ICreateAccount } from '../../../../models/create-account';
import { Workflow } from '../../../../models/workflow';
import {
  LengthOfPhoneNumber,
  PhoneNumberDialingCode,
  PhoneNumberOtherCountryDialingCode,
} from '../../../../theming/constants';
import { sendOneTimePassword } from '../../api/api-v1';
import { guestExperienceExceptionLogger } from '../../guest-experience-logger.middleware';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { handleTwilioErrorAction } from '../../store/error-handling.actions';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { phoneNumberVerificationNavigateDispatch } from '../navigation/dispatch/sign-in/phone-number-verification-navigate.dispatch';
import { RootState } from '../root-reducer';
import { ISetMissingAccountErrorMessageAction } from '../support-error/support-error.reducer.actions';

export enum PhoneNumberLoginActionsKeys {
  SET_LOGIN_PHONE_NUMBER = 'SET_LOGIN_PHONE_NUMBER',
  SET_NUMBER_IS_UNSUPPORTED = 'SET_NUMBER_IS_UNSUPPORTED',
}

export type PhoneNumberLoginActionsType =
  | IOnSetPhoneNumberAction
  | IOnUnsupportedPhoneNumberTypeAction;

export interface IOnSetPhoneNumberAction {
  type: PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER;
  payload: {
    phoneNumber: string;
  };
}

export interface IOnUnsupportedPhoneNumberTypeAction {
  type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED;
  payload: {
    phoneNumberTypeIsUnsupported: boolean;
  };
}

export const onSetPhoneNumberAction = (
  inputValue: string
): IOnSetPhoneNumberAction => {
  return {
    payload: {
      phoneNumber: inputValue,
    },
    type: PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER,
  };
};

export const onUnsupportedPhoneNumberTypeAction = (
  phoneNumberTypeIsUnsupported: boolean
): IOnUnsupportedPhoneNumberTypeAction => {
  return {
    payload: {
      phoneNumberTypeIsUnsupported,
    },
    type: PhoneNumberLoginActionsKeys.SET_NUMBER_IS_UNSUPPORTED,
  };
};

export const updatePhoneNumberWithCountryCodeAction = (
  countryCode: string,
  phoneNumber: string
): IOnSetPhoneNumberAction => {
  return {
    payload: {
      phoneNumber: `${countryCode}${phoneNumber}`,
    },
    type: PhoneNumberLoginActionsKeys.SET_LOGIN_PHONE_NUMBER,
  };
};
export interface IPhoneVerificationActionParams {
  phoneNumber: string;
  workflow?: Workflow;
  navigation: RootStackNavigationProp;
  prescriptionId?: string;
  isBlockchain?: boolean;
}
export const navigateToPhoneNumberVerificationLoadingAction = (
  phoneVerificationActionParams: IPhoneVerificationActionParams
) =>
  dataLoadingAction(
    navigateToPhoneNumberVerification,
    phoneVerificationActionParams
  );

export const navigateToPhoneNumberVerification = (
  phoneVerificationActionParams: IPhoneVerificationActionParams
) => {
  return async (
    dispatch: (
      action: PhoneNumberLoginActionsType | ISetMissingAccountErrorMessageAction
    ) => void,
    getState: () => RootState
  ) => {
    const state = getState();
    const { phoneNumber, workflow, navigation, prescriptionId, isBlockchain } =
      phoneVerificationActionParams;
    const countryCode = state.features.usecountrycode
      ? PhoneNumberOtherCountryDialingCode
      : PhoneNumberDialingCode;

    const configApi = state.config.apis.guestExperienceApi;

    let phoneNumberWithCode = phoneNumber;
    if (phoneNumber && phoneNumber.length === LengthOfPhoneNumber) {
      dispatch(
        updatePhoneNumberWithCountryCodeAction(countryCode, phoneNumber)
      );
      phoneNumberWithCode = `${countryCode}${phoneNumber}`;
    }

    try {
      dispatch(onUnsupportedPhoneNumberTypeAction(false));
      await sendOneTimePassword(
        configApi,
        phoneNumberWithCode,
        state.settings.automationToken,
        isBlockchain
      );
      const account: ICreateAccount = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        isTermAccepted: false,
        prescriptionId,
      };
      phoneNumberVerificationNavigateDispatch(navigation, {
        phoneNumber,
        workflow,
        account,
        isBlockchain,
      });
    } catch (error) {
      if (error instanceof ErrorBadRequest) {
        dispatch(onUnsupportedPhoneNumberTypeAction(true));
        guestExperienceExceptionLogger(error);
      } else if (error instanceof TooManyRequestError) {
        handleTwilioErrorAction(dispatch, navigation, error.message);
      } else {
        internalErrorDispatch(navigation, error as Error);
      }
    }
  };
};
