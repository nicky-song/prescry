// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../constants/response-messages';
import {
  UnknownFailureResponse,
  SuccessResponseWithInternalResponseCode,
} from '../../utils/response-helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../utils/request/request-app-locals.helper';
import { getPreferredEmailFromPatient } from '../../utils/fhir-patient/get-contact-info-from-patient';

export class SessionController {
  public getSession = (_: Request, response: Response) => {
    try {
      const account = getRequiredResponseLocal(response, 'account');
      const patient = getResponseLocal(response, 'patient');
      const email = patient ? getPreferredEmailFromPatient(patient) : undefined;
      return SuccessResponseWithInternalResponseCode(
        response,
        SuccessConstants.SUCCESS_OK,
        {
          recoveryEmailExists:
            email ??
            (account &&
              account.recoveryEmail &&
              account.recoveryEmail?.length > 0)
              ? true
              : false,
        },
        HttpStatusCodes.SUCCESS,
        'SESSION_VALID'
      );
    } catch (error) {
      return UnknownFailureResponse(
        response,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        error as Error
      );
    }
  };
}
