// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { InternalResponseCode } from '../../../../../errors/error-codes';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { ICreateAccountRequestBody } from '../../../../../models/api-request-body/create-account.request-body';
import { createAccount } from '../../../api/api-v1.create-account';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { ICreatePinScreenRouteProps } from './../../../create-pin-screen/create-pin-screen';
import {
  ISetIdentityVerificationEmailFlagAction,
  setIdentityVerificationEmailFlagAction,
} from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { RootState } from '../../root-reducer';
import {
  IUpdateSettingsAction,
  updateDeviceTokenSettingsAction,
} from '../../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import {
  ISetMissingAccountErrorMessageAction,
  setMissingAccountErrorMessageAction,
} from '../../support-error/support-error.reducer.actions';
import { ISetVerificationCodeErrorStateAction } from '../actions/phone-number-verification.actions';
import { ICreateAccountAsyncActionArgs } from '../async-actions/create-account.async-action';
import { dispatchVerificationCodeErrorState } from '../phone-number-verification-reducer.actions';
import { ILoginPinScreenRouteProps } from '../../../login-pin-screen/login-pin-screen';
import { ErrorUserDataMismatch } from '../../../../../errors/error-data-mismatch-create-account';
import {
  LengthOfPhoneNumber,
  PhoneNumberDialingCode,
  PhoneNumberOtherCountryDialingCode,
} from '../../../../../theming/constants';
import { ICreateAccountScreenRouteProps } from '../../../screens/sign-in/create-account/create-account.screen';
import { ErrorActivationRecordMismatch } from '../../../../../errors/error-activation-record-mismatch';

export type ICreateAccountActionType =
  | ISetIdentityVerificationEmailFlagAction
  | IUpdateSettingsAction
  | ISetVerificationCodeErrorStateAction
  | ISetMissingAccountErrorMessageAction;

export const createAccountDispatch = async (
  dispatch: Dispatch<ICreateAccountActionType>,
  getState: () => RootState,
  args: ICreateAccountAsyncActionArgs
): Promise<void> => {
  const state = getState();
  const { config, features } = state;
  const apiConfig = config.apis.guestExperienceApi;
  const { navigation } = args;
  try {
    const countryCode = features.usecountrycode
      ? PhoneNumberOtherCountryDialingCode
      : PhoneNumberDialingCode;
    const createAccountRequestBody: ICreateAccountRequestBody = {
      firstName: args.account.firstName,
      lastName: args.account.lastName,
      email: args.account.email,
      dateOfBirth: args.account.dateOfBirth,
      phoneNumber:
        args.account.phoneNumber.length === LengthOfPhoneNumber
          ? `${countryCode}${args.account.phoneNumber}`
          : args.account.phoneNumber,
      code: args.code,
      primaryMemberRxId: args.account.primaryMemberRxId,
      prescriptionId: args.account.prescriptionId,
      isBlockchain: args.account.isBlockchain,
    };
    const response = await createAccount(apiConfig, createAccountRequestBody);
    await updateDeviceTokenSettingsAction(response.data.deviceToken)(dispatch);
    dispatch(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: response.data?.recoveryEmailExists || false,
      })
    );
    const createPinScreenParams: ICreatePinScreenRouteProps = {
      workflow: args.workflow,
    };
    if (response.responseCode === InternalResponseCode.REQUIRE_USER_SET_PIN) {
      navigation.navigate('CreatePin', createPinScreenParams);
    }
    const loginPinScreenParams: ILoginPinScreenRouteProps = {
      workflow: args.workflow,
    };
    if (
      response.responseCode === InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    ) {
      navigation.navigate('LoginPin', loginPinScreenParams);
    }
  } catch (error) {
    if (error instanceof TooManyRequestError) {
      handleTwilioErrorAction(dispatch, navigation, error.message);
    } else if (error instanceof ErrorInternalServer) {
      internalErrorDispatch(navigation, error);
    } else if (error instanceof ErrorApiResponse) {
      dispatch(setMissingAccountErrorMessageAction(error.message));
      navigation.navigate('SupportError');
    } else if (
      error instanceof ErrorUserDataMismatch ||
      error instanceof ErrorActivationRecordMismatch
    ) {
      const screenParams: ICreateAccountScreenRouteProps = {
        workflow: args.workflow,
        phoneNumber: args.account.phoneNumber,
        errorType: 'userDataMismatch',
        prescriptionId: args.account.prescriptionId,
      };
      navigation.navigate('CreateAccount', screenParams);
    } else {
      await dispatchVerificationCodeErrorState(dispatch, true);
    }
  }
};
