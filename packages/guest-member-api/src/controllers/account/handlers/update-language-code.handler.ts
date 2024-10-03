// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IUpdateLanguageCodeRequestBody } from '@phx/common/src/models/api-request-body/update-language-code.request-body';
import { updatePatientAccountLanguageCode } from '../../../utils/patient-account/update-patient-account-language-code';
import { IConfiguration } from '../../../configuration';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { updatePatientLanguageCode } from '../../../utils/fhir-patient/update-patient-language-code';

export const updateLanguageCodeHandler = async (
  configuration: IConfiguration,
  request: Request,
  response: Response
) => {
  try {
    const version = getEndpointVersion(request);
    const { languageCode } = request.body as IUpdateLanguageCodeRequestBody;

    const account = getRequiredResponseLocal(response, 'account');

    if (version === 'v2') {
      const patientAccount = getRequiredResponseLocal(
        response,
        'patientAccount'
      );

      if (patientAccount) {
        await updatePatientAccountLanguageCode(
          configuration,
          patientAccount,
          languageCode
        );
      }
      const patient = getRequiredResponseLocal(response, 'patient');
      assertHasPatient(patient);
      await updatePatientLanguageCode(configuration, patient, languageCode);
    }

    await publishAccountUpdateMessage({
      phoneNumber: account?.phoneNumber,
      languageCode,
    });

    return SuccessResponse(
      response,
      SuccessConstants.UPDATE_LANGUAGE_CODE_SUCCESS
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
};
