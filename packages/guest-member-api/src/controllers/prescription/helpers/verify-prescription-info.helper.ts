// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { IAddress } from '../../../models/fhir/address';
import { IPerson } from '@phx/common/src/models/person';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from './get-prescription-by-id';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import {
  getFirstAddress,
  getIAddressAsIMemberAddress,
} from './get-prescription-address';
import { buildUpdatePrescriptionParams } from './build-update-prescription-params';
import { getPrescriptionInfoForSmartContractAddress } from './get-prescription-info-for-smart-contract-address.helper';
import { getPatientByMasterId } from '../../../utils/external-api/identity/get-patient-by-master-id';
import {
  findFhirMedicationRequestResource,
  findFhirPatientResource,
} from '../../../utils/fhir/fhir-resource.helper';
import { matchFirstName } from '../../../utils/fhir/human-name.helper';
import { isLoginDataValid } from '../../../utils/login-helper';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import DateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IUpdatePrescriptionParams } from './update-prescriptions-with-member-id';
import { ICommonBusinessMonitoringEvent } from '../../../models/common-business-monitoring-event';

export interface IPrescriptionVerificationInfo {
  prescriptionId: string;
  firstName: string;
  dateOfBirth: string;
}

export interface IPrescriptionVerificationResponse {
  prescriptionIsValid: boolean;
  filteredUserInfo?: {
    telephone?: string;
    address?: IMemberAddress;
    lastName?: string;
    updatePrescriptionParams?: IUpdatePrescriptionParams;
    masterId?: string;
  };
  errorCode?: number;
  errorMessage?: string;
  serviceBusEvent?: ICommonBusinessMonitoringEvent;
}

export const verifyPrescriptionInfoHelper = async (
  database: IDatabase,
  userInfo: IPrescriptionVerificationInfo,
  configuration: IConfiguration,
  personList?: IPerson[],
  blockchain?: boolean
): Promise<IPrescriptionVerificationResponse> => {
  try {
    const prescriptionApiResponse: IGetPrescriptionHelperResponse = blockchain
      ? await getPrescriptionInfoForSmartContractAddress(
          userInfo.prescriptionId,
          configuration
        )
      : await getPrescriptionById(userInfo.prescriptionId, configuration);
    const { prescription, errorCode, message } = prescriptionApiResponse;
    if (prescription) {
      const medicationRequestResource = blockchain
        ? findFhirMedicationRequestResource(prescription)
        : undefined;

      const patientResource = !blockchain
        ? findFhirPatientResource(prescription)
        : undefined;

      const masterId = medicationRequestResource?.subject?.reference;

      const patient =
        blockchain && masterId
          ? await getPatientByMasterId(masterId, configuration)
          : patientResource;

      if (!patient) {
        return {
          prescriptionIsValid: false,
          errorCode: HttpStatusCodes.BAD_REQUEST,
          errorMessage: ErrorConstants.PATIENT_RECORD_MISSING,
        };
      }
      if (!patient.birthDate || !patient.name || !patient.telecom) {
        return {
          prescriptionIsValid: false,
          errorCode: HttpStatusCodes.BAD_REQUEST,
          errorMessage: ErrorConstants.INVALID_PRESCRIPTION_DATA,
        };
      }
      const matchedFirstNameObject = matchFirstName(
        userInfo.firstName,
        patient.name
      );

      const dateMatch = userInfo.dateOfBirth === patient.birthDate;

      const isDataValid = dateMatch && !!matchedFirstNameObject;

      if (!isDataValid) {
        return {
          prescriptionIsValid: false,
          errorCode: HttpStatusCodes.BAD_REQUEST,
          errorMessage: ErrorConstants.PRESCRIPTION_DATA_DOES_NOT_MATCH,
          serviceBusEvent: !blockchain
            ? undefined
            : {
                topic: 'Business',
                eventData: {
                  idType: 'smartContractId',
                  id: prescription.id,
                  messageOrigin: 'myPHX',
                  tags: ['dRx', 'supportDashboard'],
                  type: 'error',
                  subject:
                    ErrorConstants.PRESCRIPTION_DATA_DOES_NOT_MATCH_WITH_ENTERED,
                  messageData: '',
                  eventDateTime: getNewDate().toISOString(),
                },
              },
        };
      }
      const telephone = getMobileContactPhone(patient);
      let lastName: string | undefined = matchedFirstNameObject?.family;
      if (telephone) {
        const account = await searchAccountByPhoneNumber(database, telephone);
        if (account && account.firstName && account.dateOfBirth) {
          const accountInfo = {
            firstName: account.firstName,
            dateOfBirth: DateFormatter.formatToYMD(account.dateOfBirth),
          };
          if (
            !isLoginDataValid(
              {
                firstName: userInfo.firstName,
                dateOfBirth: userInfo.dateOfBirth,
              },
              accountInfo
            )
          ) {
            return {
              prescriptionIsValid: false,
              errorCode: HttpStatusCodes.NOT_FOUND,
              errorMessage: ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
            };
          }
          lastName = account.lastName ?? matchedFirstNameObject?.family;
        }
      }

      const address: IAddress | undefined =
        patient.address && patient.address.length
          ? getFirstAddress(patient.address)
          : undefined;
      const memberAddress: IMemberAddress | undefined = address
        ? getIAddressAsIMemberAddress(address)
        : undefined;

      const updatePrescriptionParams =
        !patient.id && !blockchain
          ? buildUpdatePrescriptionParams(prescription, personList)
          : undefined;

      return {
        prescriptionIsValid: true,
        filteredUserInfo: {
          telephone,
          address: memberAddress,
          lastName,
          updatePrescriptionParams,
          masterId,
        },
      };
    }

    return { prescriptionIsValid: false, errorCode, errorMessage: message };
  } catch (error) {
    return {
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    };
  }
};
