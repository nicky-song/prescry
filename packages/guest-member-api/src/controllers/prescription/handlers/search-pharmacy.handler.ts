// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IConfiguration } from '../../../configuration';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import {
  isMasterIdValidForUserAndDependents,
  isMemberIdValidForUserAndDependents,
} from '../../../utils/person/get-dependent-person.helper';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { IPatient } from '../../../models/fhir/patient/patient';
import { getGeolocationByZip } from '../../geolocation/helpers/get-geolocation-by-zip';
import { searchPharmaciesAndPrices } from '../helpers/search-pharmacies-and-prices';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
  prescriptionFhirMockNoZip,
} from '../mock/get-mock-fhir-object';
import { ApiConstants } from '../../../constants/api-constants';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../helpers/get-prescription-by-id';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { buildUpdatePrescriptionParams } from '../helpers/build-update-prescription-params';
import { searchPharmaciesAndPricesBlockchain } from '../helpers/search-pharmacies-and-prices-blockchain';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { getPersonForBlockchainPrescription } from '../../../utils/get-person-for-blockchain-prescription.helper';
import { IUpdatePrescriptionParams } from '../helpers/update-prescriptions-with-member-id';

export async function searchPharmacyHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration
) {
  try {
    const zipCode = getRequestQuery(request, 'zipcode');
    const latitude = getRequestQuery(request, 'latitude');
    const longitude = getRequestQuery(request, 'longitude');
    const blockchain = getRequestQuery(request, 'blockchain');
    if (!zipCode && (!latitude || !longitude)) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.QUERYSTRING_INVALID
      );
    }
    const coordinates = { latitude: 0, longitude: 0 };
    if (latitude && longitude) {
      coordinates.latitude = latitude;
      coordinates.longitude = longitude;
    } else if (zipCode) {
      const coord = getGeolocationByZip(zipCode);
      if (!coord) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.INVALID_ZIPCODE_SEARCH
        );
      }
      coordinates.latitude = coord.latitude;
      coordinates.longitude = coord.longitude;
    }
    const prescriptionId =
      request.params.identifier ?? getRequestQuery(request, 'identifier');
    const sortBy = getRequestQuery(request, 'sortby') || 'distance';
    const limit = getRequestQuery(request, 'limit');
    const distance = getRequestQuery(request, 'distance');

    const isBlockchain =
      blockchain && String(blockchain).toLowerCase() === 'true';

    if (!prescriptionId) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PRESCRIPTION_ID_QUERYSTRING_MISSING
      );
    }
    
    const features = getRequiredResponseLocal(response, 'features');

    const useSiePrice = features.usesieprice;
    const useCashPrice = features.usecashprice;
    const useDualPrice = features.useDualPrice;
    const useTestThirdPartyPricing = features.useTestThirdPartyPricing

    if (prescriptionId === 'mock') {
      return await searchPharmaciesAndPrices(
        response,
        prescriptionFhirMock,
        coordinates.latitude,
        coordinates.longitude,
        distance || ApiConstants.PHARMACY_SEARCH_RADIUS_MILES,
        configuration,
        'MOCK-MYRXID',
        useCashPrice
          ? ApiConstants.CASH_USER_RX_SUB_GROUP
          : ApiConstants.SIE_USER_RX_SUB_GROUP,
        sortBy,
        limit || ApiConstants.NUM_PHARMACY_LIMIT,
        features.usertpb,
        useDualPrice,
        useTestThirdPartyPricing
      );
    }

    if (prescriptionId === 'mock-zip') {
      return await searchPharmaciesAndPrices(
        response,
        prescriptionFhirMockNoZip,
        coordinates.latitude,
        coordinates.longitude,
        distance || ApiConstants.PHARMACY_SEARCH_RADIUS_MILES,
        configuration,
        'MOCK-MYRXID',
        useCashPrice
          ? ApiConstants.CASH_USER_RX_SUB_GROUP
          : ApiConstants.SIE_USER_RX_SUB_GROUP,
        sortBy,
        limit || ApiConstants.NUM_PHARMACY_LIMIT,
        features.usertpb,
        useDualPrice,
        useTestThirdPartyPricing
      );
    }

    if (prescriptionId === 'mock-blockchain') {
      return await searchPharmaciesAndPricesBlockchain(
        response,
        prescriptionBlockchainFhirMock,
        coordinates.latitude,
        coordinates.longitude,
        distance || ApiConstants.PHARMACY_SEARCH_RADIUS_MILES,
        configuration,
        'MOCK-MYRXID',
        useCashPrice
          ? ApiConstants.CASH_USER_RX_SUB_GROUP
          : ApiConstants.SIE_USER_RX_SUB_GROUP,
        sortBy,
        limit || ApiConstants.NUM_PHARMACY_LIMIT,
        features.usertpb,
        useDualPrice,
        useTestThirdPartyPricing
      );
    }

    const personList = getResponseLocal(response, 'personList');
    if (!personList) {
      return KnownFailureResponse(
        response,
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
    if (!prescription) {
      return KnownFailureResponse(
        response,
        errorCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message ?? ErrorConstants.INTERNAL_SERVER_ERROR
      );
    }
    if (isBlockchain) {
      const medicationRequest = prescription.entry.find(
        (r: ResourceWrapper) => r.resource.resourceType === 'MedicationRequest'
      );

      const medicationRequestResource =
        medicationRequest?.resource as IMedicationRequest;

      const masterId = medicationRequestResource?.subject?.reference;

      if (!masterId) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.PRESCRIPTION_MASTER_ID_MISSING
        );
      }
      if (!isMasterIdValidForUserAndDependents(response, masterId)) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UNAUTHORIZED_ACCESS
        );
      }
      const personForPrescription = getPersonForBlockchainPrescription(
        personList,
        masterId
      );

      const groupPlanCode = useSiePrice
        ? ApiConstants.SIE_USER_RX_SUB_GROUP
        : useCashPrice
        ? ApiConstants.CASH_USER_RX_SUB_GROUP
        : personForPrescription?.rxSubGroup ?? '';

      return await searchPharmaciesAndPricesBlockchain(
        response,
        prescription,
        coordinates.latitude,
        coordinates.longitude,
        distance || ApiConstants.PHARMACY_SEARCH_RADIUS_MILES,
        configuration,
        personForPrescription?.primaryMemberRxId ?? '',
        groupPlanCode,
        sortBy,
        limit || ApiConstants.NUM_PHARMACY_LIMIT,
        features.usertpb,
        useDualPrice,
        useTestThirdPartyPricing
      );
    } else {
      const patientResource = prescription.entry.find(
        (r: ResourceWrapper) => r.resource.resourceType === 'Patient'
      );
      const patient = patientResource?.resource as IPatient | undefined;
      if (!patient) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.NO_PATIENT_FOUND_PRESCRIPTION
        );
      }
      let memberRxId = patient.id;
      if (!memberRxId) {
        const phoneNumber = getRequiredResponseLocal(response, 'device').data;
        const prescriptionPhone = getMobileContactPhone(patient);
        if (phoneNumber !== prescriptionPhone) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH
          );
        }
        const updatePrescriptionParams: IUpdatePrescriptionParams =
          buildUpdatePrescriptionParams(prescription, personList);
        if (updatePrescriptionParams.clientPatientId.length) {
          memberRxId = updatePrescriptionParams.clientPatientId;
        }
        if (!memberRxId || !memberRxId.length) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.PRESCRIPTION_UPDATE_MEMBERID_MISSING
          );
        }
      }
      if (!isMemberIdValidForUserAndDependents(response, memberRxId)) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.UNAUTHORIZED_REQUEST,
          ErrorConstants.UNAUTHORIZED_ACCESS
        );
      }
      const personForPrescription = personList.find(
        (person) => person.primaryMemberRxId === memberRxId
      );
      const groupPlanCode = useSiePrice
        ? ApiConstants.SIE_USER_RX_SUB_GROUP
        : useCashPrice
        ? ApiConstants.CASH_USER_RX_SUB_GROUP
        : personForPrescription?.rxSubGroup ?? '';
        
      return await searchPharmaciesAndPrices(
        response,
        prescription,
        coordinates.latitude,
        coordinates.longitude,
        distance || ApiConstants.PHARMACY_SEARCH_RADIUS_MILES,
        configuration,
        personForPrescription?.primaryMemberRxId ?? '',
        groupPlanCode,
        sortBy,
        limit || ApiConstants.NUM_PHARMACY_LIMIT,
        features.usertpb,
        useDualPrice,
        useTestThirdPartyPricing
      );
    }
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
