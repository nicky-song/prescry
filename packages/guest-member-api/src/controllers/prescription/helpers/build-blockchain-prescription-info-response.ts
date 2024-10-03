// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { IConfiguration } from '../../../configuration';
import { SuccessConstants } from '../../../constants/response-messages';
import { getPrescriptionPriceById } from '../../../databases/mongo-database/v1/query-helper/prescription.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { SuccessResponse } from '../../../utils/response-helper';
import { IFhir } from '../../../models/fhir/fhir';
import { buildBlockchainPrescriptionInfo } from './build-blockchain-prescription-info';
import { getPharmacyDetailsByNcpdp } from './get-pharmacy-details-by-ncpdp';
import { mockPrescriptionPrice } from '../mock/get-mock-prescription-price';
import { getPrescriberDetailsEndpointHelper } from './get-prescriber-details-endpoint.helper';

export async function buildBlockchainPrescriptionInfoResponse(
  response: Response,
  prescriptionId: string,
  prescription: IFhir,
  personList: IPerson[],
  configuration: IConfiguration,
  database: IDatabase
): Promise<Response> {
  const medicationRequest = prescription.entry.find(
    (r: ResourceWrapper) => r.resource.resourceType === 'MedicationRequest'
  );

  const medicationRequestResource =
    medicationRequest?.resource as IMedicationRequest;

  // TODO: Get patient information using masterid from API

  const pharmacyId =
    medicationRequestResource?.dispenseRequest?.performer?.reference;

  const prescriberDetailsResponse = await getPrescriberDetailsEndpointHelper(
    medicationRequestResource,
    configuration
  );

  const practitioner = prescriberDetailsResponse?.practitioner;
  const isSuccess = prescriberDetailsResponse?.isSuccess;

  const prescriberDetails =
    practitioner && isSuccess ? practitioner : undefined;

  if (pharmacyId) {
    const pharmacyDetailsResponse = await getPharmacyDetailsByNcpdp(
      pharmacyId,
      configuration
    );
    const prescriptionPrice = prescriptionId.startsWith('mock')
      ? mockPrescriptionPrice
      : await getPrescriptionPriceById(prescriptionId, database);

    const finalPrescriptionPrice = prescriptionPrice ?? undefined;

    return SuccessResponse<IPrescriptionInfo>(
      response,
      SuccessConstants.DOCUMENT_FOUND,
      buildBlockchainPrescriptionInfo(
        personList,
        prescription,
        prescriptionId,
        pharmacyDetailsResponse,
        finalPrescriptionPrice,
        prescriberDetails
      )
    );
  }
  return SuccessResponse<IPrescriptionInfo>(
    response,
    SuccessConstants.DOCUMENT_FOUND,
    buildBlockchainPrescriptionInfo(
      personList,
      prescription,
      prescriptionId,
      undefined,
      undefined,
      prescriberDetails
    )
  );
}
