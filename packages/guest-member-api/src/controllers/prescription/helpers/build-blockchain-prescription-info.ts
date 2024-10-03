// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IPractitioner } from '@phx/common/src/models/practitioner';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { IFhir } from '../../../models/fhir/fhir';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IMedication } from '../../../models/fhir/medication/medication';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IPrescriptionPriceEvent } from '../../../models/prescription-price-event';
import { convertHours } from '../../../utils/convert-hours';
import { getPersonForBlockchainPrescription } from '../../../utils/get-person-for-blockchain-prescription.helper';
import { getZipFromPersonList } from '../../../utils/person/person-helper';

export const buildBlockchainPrescriptionInfo = (
  personList: IPerson[],
  prescription: IFhir,
  prescriptionId: string,
  pharmacyDetails?: IPrescriptionPharmacy,
  prescriptionPriceEvent?: IPrescriptionPriceEvent,
  prescriberDetails?: IPractitioner
): IPrescriptionInfo => {
  const prescriptionInfo = {} as IPrescriptionInfo;

  prescriptionInfo.prescriptionId = prescriptionId;

  prescriptionInfo.orderNumber = prescription.identifier?.value || '';

  const medicationResource = prescription.entry.find(
    (r) => r.resource.resourceType === 'Medication'
  );
  const medication = medicationResource?.resource as IMedication | undefined;

  const medicationRequestResource = prescription.entry.find(
    (r) => r.resource.resourceType === 'MedicationRequest'
  );
  const medicationRequest = medicationRequestResource?.resource as
    | IMedicationRequest
    | undefined;

  if (medication) {
    prescriptionInfo.drugName =
      (medication.ingredient &&
        medication.ingredient[0].itemCodeableConcept?.text) ??
      '';
    (prescriptionInfo.ndc =
      (medication?.code?.coding && medication?.code?.coding[0].code) ?? ''),
      (prescriptionInfo.form =
        (medication.form?.coding && medication.form?.coding[0].code) ?? '');

    const strength = medication.identifier?.find((x) =>
      x.type?.coding?.find((y) => y.code === 'Strength')
    );
    const strengthMeasure = medication.identifier?.find((x) =>
      x.type?.coding?.find((y) => y.code === 'StrengthUM')
    );

    prescriptionInfo.strength =
      strength?.value ??
      (
        (medication.ingredient &&
          medication.ingredient[0].strength?.numerator?.value) ??
        ''
      ).toString();

    prescriptionInfo.unit = strengthMeasure?.value ?? '';
  }
  if (medicationRequest) {
    prescriptionInfo.quantity =
      medicationRequest.dispenseRequest?.quantity?.value ?? 0;

    const refillRequest = medicationRequest?.dispenseRequest?.extension?.find(
      (x) =>
        x.url ===
        'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining'
    );

    const numberOfRepeatsAllowed =
      (medicationRequest.dispenseRequest?.numberOfRepeatsAllowed ?? 0) + 1;

    const refillsRemaining = parseInt(refillRequest?.valueString || '0', 10);

    prescriptionInfo.refills =
      refillsRemaining > 0 ? refillsRemaining : numberOfRepeatsAllowed;
    prescriptionInfo.authoredOn = medicationRequest.authoredOn;
  }

  const masterId = medicationRequest?.subject?.reference;

  if (masterId) {
    const primaryMemberRxId = getPersonForBlockchainPrescription(
      personList,
      masterId
    )?.primaryMemberRxId;

    if (primaryMemberRxId) {
      prescriptionInfo.primaryMemberRxId = primaryMemberRxId;
    }
  }

  prescriptionInfo.zipCode = getZipFromPersonList(personList);

  const pharmacyId = medicationRequest?.dispenseRequest?.performer?.reference;

  if (pharmacyId) {
    prescriptionInfo.organizationId = pharmacyId.length ? pharmacyId : '';

    const pharmacy: IPharmacy = {
      name: pharmacyDetails?.name ?? '',
      address: {
        lineOne: pharmacyDetails?.address.lineOne ?? '',
        lineTwo: pharmacyDetails?.address.lineTwo ?? '',
        city: pharmacyDetails?.address.city ?? '',
        state: pharmacyDetails?.address.state ?? '',
        zip: pharmacyDetails?.address.zip ?? '',
      },
      phoneNumber: pharmacyDetails?.phone ?? '',
      hours: pharmacyDetails ? convertHours(pharmacyDetails.hours) : [],
      twentyFourHours: !!pharmacyDetails?.twentyFourHours,
      ncpdp: pharmacyDetails?.ncpdp ?? '',
      isMailOrderOnly: !!pharmacyDetails?.isMailOrderOnly,
      brand: pharmacyDetails?.brand,
      chainId: pharmacyDetails?.chainId,
    };
    prescriptionInfo.pharmacy = pharmacy;
  }

  if (prescriberDetails) {
    prescriptionInfo.practitioner = prescriberDetails;
  }

  if (
    prescriptionPriceEvent?.eventData?.memberPays !== undefined &&
    prescriptionPriceEvent?.eventData?.planPays !== undefined &&
    prescriptionPriceEvent?.eventData?.pharmacyTotalPrice !== undefined
  ) {
    const priceInfo = {
      memberPays: prescriptionPriceEvent.eventData.memberPays,
      planPays: prescriptionPriceEvent.eventData.planPays,
      pharmacyTotalPrice: prescriptionPriceEvent.eventData.pharmacyTotalPrice,
    };
    prescriptionInfo.price = priceInfo;
  }
  if (prescriptionPriceEvent?.eventData?.fillDate) {
    prescriptionInfo.orderDate = new Date(
      prescriptionPriceEvent.eventData.fillDate
    );
  }

  prescriptionInfo.coupon = prescriptionPriceEvent?.eventData?.coupon;

  prescriptionInfo.blockchain = true;
  return prescriptionInfo;
};
