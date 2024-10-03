// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IConfiguration } from '../../../configuration';
import { IPatient } from '../../../models/fhir/patient/patient';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../helpers/get-prescription-by-id';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { getPatientAccountByAccountId } from '../../../utils/external-api/patient-account/get-patient-account-by-account-id';

export async function getPrescriptionUserStatusHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const prescriptionId = request.params.identifier;

    const blockchain = getRequestQuery(request, 'blockchain');

    const isBlockchain =
      blockchain && String(blockchain).toLowerCase() === 'true';

    if (!prescriptionId || !prescriptionId.length) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PRESCRIPTION_ID_MISSING
      );
    }
    if (prescriptionId.startsWith('mock')) {
      if (prescriptionId.includes('no-user')) {
        return SuccessResponse(response, SuccessConstants.SUCCESS_OK, {
          personExists: false,
        });
      }
      return SuccessResponse(response, SuccessConstants.SUCCESS_OK, {
        personExists: true,
      });
    }

    const prescriptionApiResponse: IGetPrescriptionHelperResponse = isBlockchain
      ? await getPrescriptionInfoForSmartContractAddress(
          prescriptionId,
          configuration
        )
      : await getPrescriptionById(prescriptionId, configuration);
    const { prescription, errorCode, message } = prescriptionApiResponse;
    if (prescription) {
      if (isBlockchain) {
        const medicationRequest = prescription.entry.find(
          (r: ResourceWrapper) =>
            r.resource.resourceType === 'MedicationRequest'
        );

        const medicationRequestResource =
          medicationRequest?.resource as IMedicationRequest;

        const masterId = medicationRequestResource?.subject?.reference;

        let patientAccount;

        if (masterId) {
          patientAccount = await getPatientAccountByAccountId(
            configuration,
            masterId,
            false,
            true
          );
        }

        const existingUser =
          patientAccount && patientAccount?.status?.state === 'VERIFIED';

        if (existingUser) {
          return SuccessResponse(
            response,
            SuccessConstants.PERSON_FOUND_SUCCESSFULLY,
            {
              personExists: true,
            }
          );
        } else {
          return SuccessResponse(response, ErrorConstants.PERSON_NOT_FOUND, {
            personExists: false,
          });
        }
      } else {
        const patientResource = prescription.entry.find(
          (r: ResourceWrapper) => r.resource.resourceType === 'Patient'
        );
        const patient = patientResource?.resource as IPatient | undefined;
        if (patient) {
          if (patient.id) {
            return SuccessResponse(
              response,
              SuccessConstants.PERSON_FOUND_SUCCESSFULLY,
              {
                personExists: true,
              }
            );
          }
          return SuccessResponse(response, ErrorConstants.PERSON_NOT_FOUND, {
            personExists: false,
          });
        }
        return KnownFailureResponse(
          response,
          HttpStatusCodes.NOT_FOUND,
          ErrorConstants.NO_PATIENT_FOUND_PRESCRIPTION
        );
      }
    }

    return KnownFailureResponse(
      response,
      errorCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message ?? ErrorConstants.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
