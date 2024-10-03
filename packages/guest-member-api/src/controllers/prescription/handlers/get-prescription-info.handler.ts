// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { IConfiguration } from '../../../configuration';
import {
  getLoggedInUserPatientForRxGroupType,
  isMasterIdValidForUserAndDependents,
  isMemberIdValidForUserAndDependents,
} from '../../../utils/person/get-dependent-person.helper';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IPatient } from '../../../models/fhir/patient/patient';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { buildPrescriptionInfoResponse } from '../helpers/build-prescription-info-response';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
  prescriptionFhirMockNoZip,
  prescriptionWithPharmacyFhirMock,
} from '../mock/get-mock-fhir-object';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../helpers/get-prescription-by-id';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import {
  IUpdatePrescriptionParams,
  updatePrescriptionWithMemberId,
} from '../helpers/update-prescriptions-with-member-id';
import { buildUpdatePrescriptionParams } from '../helpers/build-update-prescription-params';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { buildBlockchainPrescriptionInfoResponse } from '../helpers/build-blockchain-prescription-info-response';
import { isPrescriptionPhoneNumberValid } from '../../../utils/is-prescription-phone-number-valid';

export async function getPrescriptionInfoHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
  database: IDatabase
) {
  try {
    const prescriptionId = request.params.identifier;

    const blockchain = getRequestQuery(request, 'blockchain');

    const isBlockchain =
      blockchain && String(blockchain).toLowerCase() === 'true';

    if (!prescriptionId || prescriptionId?.length === 0) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.PRESCRIPTION_ID_MISSING
      );
    }
    const personList = getResponseLocal(response, 'personList');
    const loggedInUserPatientInfo: IPatient | undefined =
      getLoggedInUserPatientForRxGroupType(response, 'CASH');

    if (prescriptionId === 'mock') {
      return buildPrescriptionInfoResponse(
        response,
        prescriptionId,
        prescriptionFhirMock,
        personList ?? [],
        configuration,
        database
      );
    } else if (prescriptionId === 'mock-pharmacy') {
      return buildPrescriptionInfoResponse(
        response,
        prescriptionId,
        prescriptionWithPharmacyFhirMock,
        personList ?? [],
        configuration,
        database
      );
    } else if (prescriptionId === 'mock-zip') {
      return buildPrescriptionInfoResponse(
        response,
        prescriptionId,
        prescriptionFhirMockNoZip,
        personList ?? [],
        configuration,
        database
      );
    } else if (prescriptionId === 'mock-blockchain') {
      return buildBlockchainPrescriptionInfoResponse(
        response,
        prescriptionId,
        prescriptionBlockchainFhirMock,
        personList ?? [],
        configuration,
        database
      );
    }

    if (!personList || !loggedInUserPatientInfo) {
      return await knownFailureResponseAndPublishEvent(
        request,
        response,
        ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
        prescriptionId,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NO_MEMBERSHIP_FOUND
      );
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

        if (!masterId) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.NOT_FOUND,
            ErrorConstants.PRESCRIPTION_MASTER_ID_MISSING
          );
        }

        let isAuthorizedRequest = true;

        const isMasterIdValid = isMasterIdValidForUserAndDependents(
          response,
          masterId
        );

        if (!isMasterIdValid) {
          isAuthorizedRequest = false;
          const isPhoneNumberValid = await isPrescriptionPhoneNumberValid(
            masterId,
            loggedInUserPatientInfo,
            configuration
          );

          if (isPhoneNumberValid) {
            return await knownFailureResponseAndPublishEvent(
              request,
              response,
              ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
              prescriptionId,
              HttpStatusCodes.BAD_REQUEST,
              ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH,
              InternalResponseCode.CAREGIVER_NEW_DEPENDENT_PRESCRIPTION
            );
          }
        }

        if (isAuthorizedRequest) {
          await publishViewAuditEvent(
            request,
            response,
            ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
            prescriptionId,
            true
          );
          return buildBlockchainPrescriptionInfoResponse(
            response,
            prescriptionId,
            prescription,
            personList,
            configuration,
            database
          );
        } else {
          return await knownFailureResponseAndPublishEvent(
            request,
            response,
            ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
            prescriptionId,
            HttpStatusCodes.UNAUTHORIZED_REQUEST,
            ErrorConstants.UNAUTHORIZED_ACCESS
          );
        }
      } else {
        const patientResource = prescription.entry.find(
          (r: ResourceWrapper) => r.resource.resourceType === 'Patient'
        );

        const patient = patientResource?.resource as IPatient | undefined;

        if (patient?.id) {
          if (isMemberIdValidForUserAndDependents(response, patient.id)) {
            await publishViewAuditEvent(
              request,
              response,
              ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
              prescriptionId,
              true
            );
            return buildPrescriptionInfoResponse(
              response,
              prescriptionId,
              prescription,
              personList,
              configuration,
              database
            );
          } else {
            return await knownFailureResponseAndPublishEvent(
              request,
              response,
              ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
              prescriptionId,
              HttpStatusCodes.UNAUTHORIZED_REQUEST,
              ErrorConstants.UNAUTHORIZED_ACCESS
            );
          }
        } else {
          if (patient) {
            const phoneNumber = getRequiredResponseLocal(
              response,
              'device'
            ).data;
            const prescriptionPhone = getMobileContactPhone(patient);
            if (phoneNumber !== prescriptionPhone) {
              return await knownFailureResponseAndPublishEvent(
                request,
                response,
                ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
                prescriptionId,
                HttpStatusCodes.BAD_REQUEST,
                ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH
              );
            }
            const updatePrescriptionParams: IUpdatePrescriptionParams =
              buildUpdatePrescriptionParams(prescription, personList);
            if (updatePrescriptionParams.clientPatientId.length) {
              const updatePrescriptionResponse =
                await updatePrescriptionWithMemberId(
                  updatePrescriptionParams,
                  configuration
                );

              if (updatePrescriptionResponse.success) {
                return buildPrescriptionInfoResponse(
                  response,
                  prescriptionId,
                  prescription,
                  personList,
                  configuration,
                  database
                );
              }
              return await knownFailureResponseAndPublishEvent(
                request,
                response,
                ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
                prescriptionId,
                HttpStatusCodes.SERVER_DATA_ERROR,
                ErrorConstants.PRESCRIPTION_UPDATE_FAILURE
              );
            }
            return knownFailureResponseAndPublishEvent(
              request,
              response,
              ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
              prescriptionId,
              HttpStatusCodes.NOT_FOUND,
              ErrorConstants.PRESCRIPTION_UPDATE_MEMBERID_MISSING
            );
          }
          return await knownFailureResponseAndPublishEvent(
            request,
            response,
            ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
            prescriptionId,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.NO_PATIENT_FOUND_PRESCRIPTION
          );
        }
      }
    }

    return await knownFailureResponseAndPublishEvent(
      request,
      response,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      prescriptionId,
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
