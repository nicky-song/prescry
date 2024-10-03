// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { buildPharmacyResource } from '../helpers/build-pharmacy-resource';
import { IConfiguration } from '../../../configuration';
import { getPharmacyDetailsByNcpdp } from '../helpers/get-pharmacy-details-by-ncpdp';
import {
  isMasterIdValidForUserAndDependents,
  isMemberIdValidForUserAndDependents,
} from '../../../utils/person/get-dependent-person.helper';
import {
  IGetPrescriptionHelperResponse,
  getPrescriptionById,
} from '../helpers/get-prescription-by-id';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import {
  ISendPrescriptionHelperResponse,
  updatePrescriptionById,
} from '../helpers/update-prescription-by-id';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IMedication } from '../../../models/fhir/medication/medication';
import { isSmartpriceUser } from '../../../utils/is-smart-price-eligible';
import { Twilio } from 'twilio';
import { getCouponIfEligible } from '../helpers/get-coupon-if-eligible';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { assignPharmacyToBlockchainPrescription } from '../helpers/assign-pharmacy-to-blockchain-prescription';
import {
  buildSendToPharmacyResponse,
  IBuildSendToPharmacyResponseArgs,
} from '../helpers/build-send-to-pharmacy-response';
import { getPersonForBlockchainPrescription } from '../../../utils/get-person-for-blockchain-prescription.helper';
import { sendTextMessages } from '../helpers/send-text-messages';
import { findFhirOrganizationResource } from '../../../utils/fhir/fhir-resource.helper';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function sendPrescriptionHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  try {
    const version = getEndpointVersion(request);
    const { ncpdp, identifier } = request.body;
    const features = getRequiredResponseLocal(response, 'features');
    const personList = getRequiredResponseLocal(response, 'personList');

    if (!personList.length) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NO_MEMBERSHIP_FOUND
      );
    }
    if (identifier.startsWith('mock')) {
      const personForPrescription = personList.find(
        (person) => person.phoneNumber
      );

      await sendTextMessages(
        configuration,
        twilioClient,
        response,
        true,
        undefined,
        personForPrescription,
        version
      );

      return SuccessResponse(response, SuccessConstants.SUCCESS_OK);
    }

    const blockchain = getRequestQuery(request, 'blockchain');

    const isBlockchain =
      blockchain && String(blockchain).toLowerCase() === 'true';

    const prescriptionApiResponse: IGetPrescriptionHelperResponse = isBlockchain
      ? await getPrescriptionInfoForSmartContractAddress(
          identifier,
          configuration
        )
      : await getPrescriptionById(identifier, configuration);
    const { prescription, errorCode, message } = prescriptionApiResponse;
    if (prescription) {
      const medicationResource = prescription.entry.find(
        (r) => r.resource.resourceType === 'Medication'
      );
      const medication = medicationResource?.resource as
        | IMedication
        | undefined;

      const medicationRequestResource = prescription.entry.find(
        (r) => r.resource.resourceType === 'MedicationRequest'
      );
      const medicationRequest = medicationRequestResource?.resource as
        | IMedicationRequest
        | undefined;

      if (isBlockchain) {
        const masterId = medicationRequest?.subject?.reference;

        if (!masterId) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.NOT_FOUND,
            ErrorConstants.PRESCRIPTION_MASTER_ID_MISSING
          );
        }

        if (isMasterIdValidForUserAndDependents(response, masterId)) {
          const pharmacyId =
            medicationRequest?.dispenseRequest?.performer?.reference;

          if (pharmacyId && pharmacyId.length) {
            return KnownFailureResponse(
              response,
              HttpStatusCodes.BAD_REQUEST,
              ErrorConstants.PHARMACY_ID_ALREADY_EXISTS
            );
          }

          const personForPrescription = getPersonForBlockchainPrescription(
            personList,
            masterId
          );

          if (!personForPrescription?.primaryMemberRxId) {
            return KnownFailureResponse(
              response,
              HttpStatusCodes.BAD_REQUEST,
              ErrorConstants.PRESCRIPTION_PERSON_FOR_MASTER_ID_MISSING
            );
          }

          const sendPrescriptionApiResponse: ISendPrescriptionHelperResponse =
            await assignPharmacyToBlockchainPrescription(
              identifier,
              masterId,
              ncpdp,
              configuration
            );
          if (sendPrescriptionApiResponse.success) {
            const blockchainPrescriptionNdc =
              (medication?.code?.coding && medication?.code?.coding[0].code) ??
              '';

            const blockchainPrescriptionQuantity =
              medicationRequest?.dispenseRequest?.quantity?.value ?? 0;
            const blockchainPrescriptionSupply =
              medicationRequest?.dispenseRequest?.expectedSupplyDuration
                ?.value ?? 0;

            const blockchainPrescriptionRefills =
              (medicationRequest?.dispenseRequest?.numberOfRepeatsAllowed ??
                0) + 1;
            const blockchainPrescriptionRefillNumber = String(
              blockchainPrescriptionRefills
            );
            const blockchainPrescriptionGroupPlanCode =
              personForPrescription?.rxSubGroup ?? '';
            const blockchainPrescriptionIsSmartPriceEligible = isSmartpriceUser(
              blockchainPrescriptionGroupPlanCode
            );

            const blockchainPrescriptionCoupon = await getCouponIfEligible(
              configuration,
              blockchainPrescriptionIsSmartPriceEligible,
              blockchainPrescriptionNdc,
              blockchainPrescriptionQuantity,
              ncpdp
            );

            const prescriberNpi =
              findPrescriberNPIForPrescriptionFhir(prescription);

            const buildSendToPharmacyResponseArgs: IBuildSendToPharmacyResponseArgs =
              {
                request,
                response,
                ndc: blockchainPrescriptionNdc,
                quantity: blockchainPrescriptionQuantity,
                supply: blockchainPrescriptionSupply,
                ncpdp,
                configuration,
                patientId: personForPrescription.primaryMemberRxId,
                groupPlanCode: blockchainPrescriptionGroupPlanCode,
                refillNumber: blockchainPrescriptionRefillNumber,
                bundleId: identifier,
                rxNumber: '',
                type: 'prescription',
                twilioClient,
                coupon: blockchainPrescriptionCoupon,
                person: personForPrescription,
                version,
                isRTPB: features.usertpb,
                prescriberNpi,
                isSmartPriceEligible:
                  blockchainPrescriptionIsSmartPriceEligible,
              };

            return await buildSendToPharmacyResponse(
              buildSendToPharmacyResponseArgs
            );
          }

          return KnownFailureResponse(
            response,
            sendPrescriptionApiResponse.errorCode ??
              HttpStatusCodes.INTERNAL_SERVER_ERROR,
            sendPrescriptionApiResponse.message ??
              ErrorConstants.INTERNAL_SERVER_ERROR
          );
        }
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UNAUTHORIZED_ACCESS
        );
      } else {
        const patientResource = prescription.entry.find(
          (r: ResourceWrapper) => r.resource.resourceType === 'Patient'
        );
        const patient = patientResource?.resource;
        if (patient && patient.id) {
          if (!isMemberIdValidForUserAndDependents(response, patient.id)) {
            return KnownFailureResponse(
              response,
              HttpStatusCodes.UNAUTHORIZED_REQUEST,
              ErrorConstants.UNAUTHORIZED_ACCESS
            );
          } else {
            const pharmacy = findFhirOrganizationResource(prescription);
            if (pharmacy && pharmacy.id && pharmacy.id !== '') {
              return KnownFailureResponse(
                response,
                HttpStatusCodes.BAD_REQUEST,
                ErrorConstants.PHARMACY_ID_ALREADY_EXISTS
              );
            }
            const pharmacyDetailsResponse = await getPharmacyDetailsByNcpdp(
              ncpdp,
              configuration
            );
            if (pharmacyDetailsResponse) {
              const pharmacyResource = buildPharmacyResource(
                pharmacyDetailsResponse
              );
              prescription.entry.push(pharmacyResource); // TODO: Find from Platform team if they settled on full prescription or just pharmacy
              const sendPrescriptionApiResponse: ISendPrescriptionHelperResponse =
                await updatePrescriptionById(prescription, configuration);
              if (sendPrescriptionApiResponse.success) {
                const personForPrescription = personList.find(
                  (person) => person.primaryMemberRxId === patient.id
                );

                const ndc = medication?.code?.text ?? '';
                const quantity =
                  medicationRequest?.dispenseRequest?.initialFill?.quantity
                    ?.value ?? 0;
                const supply =
                  medicationRequest?.dispenseRequest?.expectedSupplyDuration
                    ?.value ?? 0;
                const refillRequest =
                  medicationRequest?.dispenseRequest?.extension?.find(
                    (x) =>
                      x.url ===
                      'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining'
                  );
                const refills = parseInt(refillRequest?.valueString || '0', 10);
                const numberOfRepeats =
                  medicationRequest?.dispenseRequest?.numberOfRepeatsAllowed ||
                  0;
                const refillNumber = String(numberOfRepeats - refills);
                const groupPlanCode = personForPrescription?.rxSubGroup ?? '';
                const isSmartPriceEligible = isSmartpriceUser(groupPlanCode);
                const bundleId = prescription.id ?? '';
                const rxNumber = prescription.identifier?.value ?? '';
                const coupon = await getCouponIfEligible(
                  configuration,
                  isSmartPriceEligible,
                  ndc,
                  quantity,
                  ncpdp
                );

                const prescriberNpi =
                  findPrescriberNPIForPrescriptionFhir(prescription);

                const buildSendToPharmacyResponseArgs: IBuildSendToPharmacyResponseArgs =
                  {
                    request,
                    response,
                    ndc,
                    quantity,
                    supply,
                    ncpdp,
                    configuration,
                    patientId: patient.id,
                    groupPlanCode,
                    refillNumber,
                    bundleId,
                    rxNumber,
                    type: 'prescription',
                    twilioClient,
                    coupon,
                    person: personForPrescription,
                    isRTPB: features.usertpb,
                    prescriberNpi,
                    isSmartPriceEligible,
                  };

                return await buildSendToPharmacyResponse(
                  buildSendToPharmacyResponseArgs
                );
              }
              return KnownFailureResponse(
                response,
                sendPrescriptionApiResponse.errorCode ??
                  HttpStatusCodes.INTERNAL_SERVER_ERROR,
                sendPrescriptionApiResponse.message ??
                  ErrorConstants.INTERNAL_SERVER_ERROR
              );
            }
            return KnownFailureResponse(
              response,
              HttpStatusCodes.NOT_FOUND,
              ErrorConstants.PHARMACY_NOT_FOUND
            );
          }
        }
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
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
