// Copyright 2022 Prescryptive Health, Inc.

import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { verifyPrescription } from '../../../api/api-v1.verify-prescription';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { IVerifyPrescriptionRequestBody } from '../../../../../models/api-request-body/verify-prescription.request-body';
import { IVerifyPrescriptionAsyncActionArgs } from '../../create-account/async-actions/verify-prescription.async-action';
import { ICreateAccount } from '../../../../../models/create-account';
import { phoneNumberVerificationNavigateDispatch } from '../../navigation/dispatch/sign-in/phone-number-verification-navigate.dispatch';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { IPhoneNumberVerificationScreenRouteProps } from '../../../phone-number-verification-screen/phone-number-verification-screen';

export const verifyPrescriptionDispatch = async (
  args: IVerifyPrescriptionAsyncActionArgs
): Promise<void> => {
  const { config } = args.reduxGetState();
  const {
    navigation,
    account,
    workflow,
    blockchain,
    reduxDispatch,
  } = args;
  const {
    dateOfBirth,
    email,
    firstName,
    lastName,
    isTermAccepted,
    prescriptionId,
  } = account;

  const verifyPrescriptionArgs: IVerifyPrescriptionRequestBody = {
    firstName,
    lastName,
    dateOfBirth,
    blockchain,
  };
  const api = config.apis.guestExperienceApi;
  try {
    const prescriptionVerificationResponse = await verifyPrescription(
      api,
      verifyPrescriptionArgs,
      prescriptionId
    );
    const verifyPrescriptionAndSendOTP = prescriptionVerificationResponse.data;
    if (
      !!verifyPrescriptionAndSendOTP &&
      !!verifyPrescriptionAndSendOTP.phoneNumber
    ) {
      const account: ICreateAccount = {
        phoneNumber: verifyPrescriptionAndSendOTP.phoneNumber,
        firstName,
        lastName,
        email,
        dateOfBirth,
        isTermAccepted,
        prescriptionId,
        isBlockchain: verifyPrescriptionArgs.blockchain,
      };
      const phoneNumberRouteProps: IPhoneNumberVerificationScreenRouteProps = {
        account,
        phoneNumber: verifyPrescriptionAndSendOTP.phoneNumber,
        workflow,
      };

      phoneNumberVerificationNavigateDispatch(
        navigation,
        phoneNumberRouteProps
      );
    }
  } catch (error) {
    if (error instanceof ErrorInternalServer) {
      await internalErrorDispatch(navigation, error as Error);
      return;
    }
    if (error instanceof TooManyRequestError) {
      handleTwilioErrorAction(reduxDispatch, navigation, error.message);
      return;
    }
    throw error;
  }
};
