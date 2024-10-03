// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { generateHash } from '../../../utils/bcryptjs-helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { trackAddPinEvent } from '../../../utils/custom-event-helper';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { updatePatientAccountPin } from '../../../utils/patient-account/update-patient-account-pin';

export async function addPinHandlerV2(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const { jwtTokenSecretKey, accountTokenExpiryTime } = configuration;

    const { encryptedPin } = request.body;

    const phoneNumber = getRequiredResponseLocal(response, 'device').data;
    const deviceKeyRedis = getRequiredResponseLocal(response, 'deviceKeyRedis');
    const patient = getRequiredResponseLocal(response, 'patient');
    const patientAccount = getRequiredResponseLocal(response, 'patientAccount');
    const masterId = patient?.id;

    const isPinAlreadySet = patientAccount.authentication.metadata.PIN?.length;

    if (isPinAlreadySet) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.FORBIDDEN_ERROR,
        ErrorConstants.PIN_ALREADY_SET
      );
    }

    const pinHash = await generateHash(encryptedPin);

    await updatePatientAccountPin(
      deviceKeyRedis,
      pinHash,
      configuration,
      patientAccount
    );

    const token = generateAccountToken(
      {
        patientAccountId: patientAccount.accountId ?? '',
        cashMasterId: masterId ?? '',
        phoneNumber,
      },
      jwtTokenSecretKey,
      accountTokenExpiryTime
    );

    await publishAccountUpdateMessage({
      accountKey: deviceKeyRedis,
      phoneNumber,
      pinHash,
    });
    trackAddPinEvent(patientAccount.accountId ?? '');

    return SuccessResponse(response, SuccessConstants.ADD_PIN_SUCCESS, {
      accountToken: token,
    });
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
