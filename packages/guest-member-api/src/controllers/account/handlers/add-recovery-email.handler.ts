// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IAddRecoveryEmailRequestBody } from '@phx/common/src/models/api-request-body/add-recovery-email.request-body';
import { IPerson } from '@phx/common/src/models/person';
import { publishPersonUpdateMessage } from '../../../utils/service-bus/person-update-helper';
import { ACTION_UPDATE_PERSON } from '../../../constants/service-bus-actions';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';
import { getPreferredEmailFromPatient } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { updatePatientContactInfo } from '../../../utils/fhir-patient/update-patient-contact-info';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { IConfiguration } from '../../../configuration';

export async function addRecoveryEmailHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
) {
  try {
    const { email } = request.body as IAddRecoveryEmailRequestBody;

    const account = getRequiredResponseLocal(response, 'account');

    let emailExist = !!account.recoveryEmail?.length;

    const patient = getResponseLocal(response, 'patient');

    if (!patient || !patient.id) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.PATIENT_RECORD_MISSING
      );
    }

    const existingEmail = getPreferredEmailFromPatient(patient);
    emailExist = existingEmail?.length ? true : false;
    
    if (!emailExist) {
      const updatedPatient = updatePatientContactInfo(
        patient,
        'home',
        'email',
        email
      );
      await updatePatientByMasterId(
        patient.id,
        updatedPatient,
        configuration
      );
    }

    if (emailExist) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.ADD_EMAIL_ERROR
      );
    }

    const person: IPerson | undefined = getLoggedInUserProfileForRxGroupType(
      response,
      'CASH'
    );

    if (person) {
      await publishPersonUpdateMessage(ACTION_UPDATE_PERSON, {
        identifier: person.identifier,
        email,
        recentlyUpdated: true,
        updatedFields: ['email'],
      });
    }

    await publishAccountUpdateMessage({
      recoveryEmail: email,
      phoneNumber: account?.phoneNumber,
    });

    // TODO: publish message to person update service
    return SuccessResponse(response, SuccessConstants.ADD_EMAIL_SUCCESS);
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
