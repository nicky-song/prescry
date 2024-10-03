// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { IConfiguration } from '../../../configuration';
import { SuccessConstants } from '../../../constants/response-messages';
import { getPrescriptionPriceById } from '../../../databases/mongo-database/v1/query-helper/prescription.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ICoding } from '../../../models/fhir/coding';
import { IFhir } from '../../../models/fhir/fhir';
import { Identifier } from '../../../models/fhir/identifier';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IMedication } from '../../../models/fhir/medication/medication';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { IPrescriptionPrice } from '../../../models/prescription-price-event';
import { getAndPublishPrescriptionPrice } from '../../../utils/external-api/get-and-publish-prescription-price';
import { isSmartpriceUser } from '../../../utils/is-smart-price-eligible';
import { SuccessResponse } from '../../../utils/response-helper';
import { mockPrescriptionPrice } from '../mock/get-mock-prescription-price';
import { buildPrescriptionInfo } from './build-prescription-info';
import { getCouponIfEligible } from './get-coupon-if-eligible';
import { getPharmacyDetailsByNcpdp } from './get-pharmacy-details-by-ncpdp';
import { publishPrescriptionPriceEvent } from './publish-prescription-price-event';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';

export async function buildPrescriptionInfoResponse(
  response: Response,
  prescriptionId: string,
  prescription: IFhir,
  personList: IPerson[],
  configuration: IConfiguration,
  database: IDatabase
): Promise<Response> {
  const features = getRequiredResponseLocal(response, 'features');
  const isRTPB = features.usertpb;
  const useTestThirdPartyPricing = features.useTestThirdPartyPricing;

  const pharmacyResources = prescription.entry.filter(
    (r) => r.resource.resourceType === 'Organization'
  );
  const pharmacy =
    pharmacyResources.length > 1
      ? pharmacyResources.find((pharmacyResource) =>
          pharmacyResource.resource.identifier?.find((identifier) =>
            identifier.type?.coding?.find((c) => c.code === 'Destination')
          )
        )?.resource
      : pharmacyResources[0]?.resource;

  const patient = prescription.entry.find(
    (r: ResourceWrapper) => r.resource.resourceType === 'Patient'
  );
  const personForPrescription = personList.find(
    (person) => person.primaryMemberRxId === patient?.resource.id
  );
  const groupPlanCode = personForPrescription?.rxSubGroup ?? '';
  const isSmartPriceEligible = isSmartpriceUser(groupPlanCode);
  const rxNumber = prescription.identifier?.value ?? '';
  let coupon;
  if (pharmacy && pharmacy.id) {
    const correctPharmacyId =
      pharmacy.identifier?.find((i: Identifier) =>
        i.type?.coding?.find((c: ICoding) => c.code === 'NCPDP')
      )?.value ?? '';
    const pharmacyDetailsResponse = await getPharmacyDetailsByNcpdp(
      correctPharmacyId ?? pharmacy.id,
      configuration
    );
    const prescriptionPrice = prescriptionId.startsWith('mock')
      ? mockPrescriptionPrice
      : await getPrescriptionPriceById(prescriptionId, database);
    let transferPrescriptionPrice;
    if (!prescriptionPrice) {
      const transferRequestBasicBundle = prescription.entry.find(
        (r: ResourceWrapper) => r.resource.resourceType === 'Basic'
      );
      if (transferRequestBasicBundle) {
        const transferRequestBundleId =
          transferRequestBasicBundle.resource.identifier?.find(
            (i: Identifier) => i.type?.text === 'TransferInRequest'
          )?.value;
        const medication = prescription.entry.find(
          (r: ResourceWrapper) => r.resource.resourceType === 'Medication'
        );
        const medicationResource = medication?.resource as IMedication;
        const correctNdc = medicationResource.code?.text;
        const medicationRequest = prescription.entry.find(
          (r: ResourceWrapper) =>
            r.resource.resourceType === 'MedicationRequest'
        );
        const medicationRequestResource =
          medicationRequest?.resource as IMedicationRequest;

        const prescriberNpi =
          findPrescriberNPIForPrescriptionFhir(prescription);

        const correctQuantity =
          medicationRequestResource.dispenseRequest?.initialFill?.quantity
            ?.value;
        const correctDaysSupply =
          medicationRequestResource.dispenseRequest?.expectedSupplyDuration
            ?.value;
        if (transferRequestBundleId) {
          transferPrescriptionPrice = await getPrescriptionPriceById(
            transferRequestBundleId,
            database
          );

          if (transferPrescriptionPrice) {
            const transferEventData = transferPrescriptionPrice.eventData;
            if (
              transferEventData.ndc === correctNdc &&
              transferEventData.quantity === correctQuantity &&
              transferEventData.daysSupply === correctDaysSupply &&
              transferEventData.memberId === patient?.resource.id &&
              transferEventData.pharmacyId === correctPharmacyId
            ) {
              const prescriptionPriceData: IPrescriptionPrice = {
                prescriptionId,
                daysSupply: transferEventData.daysSupply,
                fillDate: transferEventData.fillDate,
                ndc: transferEventData.ndc,
                pharmacyId: transferEventData.pharmacyId,
                planPays: transferEventData.planPays,
                memberPays: transferEventData.memberPays,
                pharmacyTotalPrice: transferEventData.pharmacyTotalPrice,
                memberId: transferEventData.memberId,
                quantity: transferEventData.quantity,
                type: 'prescription',
                coupon: transferEventData.coupon,
              };
              await publishPrescriptionPriceEvent(
                transferEventData.memberId,
                prescriptionPriceData
              );
            } else {
              coupon = await getCouponIfEligible(
                configuration,
                isSmartPriceEligible,
                correctNdc,
                correctQuantity,
                correctPharmacyId
              );
              transferPrescriptionPrice = await getAndPublishPrescriptionPrice(
                correctNdc ?? '',
                correctQuantity ?? 0,
                correctDaysSupply ?? 0,
                correctPharmacyId,
                configuration,
                patient?.resource.id ?? '',
                groupPlanCode,
                '1',
                prescriptionId,
                rxNumber ?? '',
                'prescription',
                coupon,
                isRTPB,
                prescriberNpi,
                isSmartPriceEligible,
                useTestThirdPartyPricing
              );
            }
          } else {
            coupon = await getCouponIfEligible(
              configuration,
              isSmartPriceEligible,
              correctNdc,
              correctQuantity,
              correctPharmacyId
            );
            transferPrescriptionPrice = await getAndPublishPrescriptionPrice(
              correctNdc ?? '',
              correctQuantity ?? 0,
              correctDaysSupply ?? 0,
              correctPharmacyId,
              configuration,
              patient?.resource.id ?? '',
              groupPlanCode,
              '1',
              prescriptionId,
              rxNumber ?? '',
              'prescription',
              coupon,
              isRTPB,
              prescriberNpi,
              isSmartPriceEligible,
              useTestThirdPartyPricing
            );
          }
        }
      }
    }

    const finalPrescriptionPrice = prescriptionPrice
      ? prescriptionPrice
      : transferPrescriptionPrice
      ? transferPrescriptionPrice
      : undefined;
    return SuccessResponse<IPrescriptionInfo>(
      response,
      SuccessConstants.DOCUMENT_FOUND,
      buildPrescriptionInfo(
        personList,
        prescription,
        prescriptionId,
        pharmacyDetailsResponse,
        finalPrescriptionPrice
      )
    );
  }
  return SuccessResponse<IPrescriptionInfo>(
    response,
    SuccessConstants.DOCUMENT_FOUND,
    buildPrescriptionInfo(
      personList,
      prescription,
      prescriptionId,
      undefined,
      undefined
    )
  );
}
