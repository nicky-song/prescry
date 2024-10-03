// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { IFhir } from '../../../models/fhir/fhir';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IMedication } from '../../../models/fhir/medication/medication';
import { getPharmaciesAndPricesForNdc } from '../../../utils/external-api/get-pharmacy-and-prices-for-ndc';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';

export async function searchPharmaciesAndPrices(
  response: Response,
  prescription: IFhir,
  latitude: number,
  longitude: number,
  distance: number,
  configuration: IConfiguration,
  memberId: string,
  groupPlanCode: string,
  sortBy: string,
  limit: number,
  isRTPB?: boolean,
  useDualPrice?: boolean,
  useTestThirdPartyPricing?: boolean
): Promise<Response> {
  const medicationResource = prescription.entry.find(
    (r) => r.resource.resourceType === 'Medication'
  );
  const medication = medicationResource?.resource as IMedication | undefined;
  const ndc = medication?.code?.text ?? '';

  const medicationRequestResource = prescription.entry.find(
    (r) => r.resource.resourceType === 'MedicationRequest'
  );
  const medicationRequest = medicationRequestResource?.resource as
    | IMedicationRequest
    | undefined;
  const refillRequest = medicationRequest?.dispenseRequest?.extension?.find(
    (x) =>
      x.url ===
      'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining'
  );
  const refills = parseInt(refillRequest?.valueString || '0', 10);
  const numberOfRepeats =
    medicationRequest?.dispenseRequest?.numberOfRepeatsAllowed || 0;
  const refillNumber = String(numberOfRepeats - refills);
  const quantity =
    medicationRequest?.dispenseRequest?.initialFill?.quantity?.value ?? 0;
  const daysSupply =
    medicationRequest?.dispenseRequest?.expectedSupplyDuration?.value ?? 0;
  const rxNumber = prescription.identifier?.value ?? '';

  const prescriberNpi = findPrescriberNPIForPrescriptionFhir(prescription);
  return await getPharmaciesAndPricesForNdc(
    response,
    latitude,
    longitude,
    distance,
    configuration,
    memberId,
    groupPlanCode,
    sortBy,
    limit,
    ndc,
    quantity,
    daysSupply,
    refillNumber,
    rxNumber,
    true,
    isRTPB,
    prescriberNpi,
    useDualPrice,
    useTestThirdPartyPricing
  );
}
