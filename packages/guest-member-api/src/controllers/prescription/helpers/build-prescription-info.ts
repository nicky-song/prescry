// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IPharmacy } from '@phx/common/src/models/pharmacy';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { IFhir } from '../../../models/fhir/fhir';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IMedication } from '../../../models/fhir/medication/medication';
import { IPatient } from '../../../models/fhir/patient/patient';
import { IPractitioner } from '../../../models/fhir/practitioner/practitioner';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IPrescriptionPriceEvent } from '../../../models/prescription-price-event';
import { convertHours } from '../../../utils/convert-hours';
import { findFhirOrganizationResource } from '../../../utils/fhir/fhir-resource.helper';
import { getZipFromPersonList } from '../../../utils/person/person-helper';

export const buildPrescriptionInfo = (
  personList: IPerson[],
  prescription: IFhir,
  prescriptionId: string,
  pharmacyDetails?: IPrescriptionPharmacy,
  prescriptionPriceEvent?: IPrescriptionPriceEvent
): IPrescriptionInfo => {
  const prescriptionInfo = {} as IPrescriptionInfo;

  prescriptionInfo.orderNumber = prescription.identifier?.value || '';
  const patientResource = prescription.entry.find(
    (r) => r.resource.resourceType === 'Patient'
  );
  const patient = patientResource?.resource as IPatient | undefined;

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

  const practitionerResource = prescription.entry.find(
    (r) => r.resource.resourceType === 'Practitioner'
  );
  const practitioner = practitionerResource?.resource as
    | IPractitioner
    | undefined;

  if (patient) {
    prescriptionInfo.primaryMemberRxId = patient.id || '';
    prescriptionInfo.zipCode =
      patient?.address && patient?.address[0].postalCode;
  }
  if (medication) {
    prescriptionInfo.drugName =
      (medication.ingredient &&
        medication.ingredient[0].itemCodeableConcept?.text) ??
      '';
    (prescriptionInfo.ndc = medication?.code?.text ?? ''),
      (prescriptionInfo.form = (medication.form && medication.form.text) ?? '');

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

    prescriptionInfo.unit =
      strengthMeasure?.value ??
      (medication.ingredient &&
        medication.ingredient[0].strength?.numerator?.unit) ??
      '';
  }
  if (medicationRequest) {
    prescriptionInfo.quantity =
      medicationRequest.dispenseRequest?.initialFill?.quantity?.value ?? 0;
    const refillRequest = medicationRequest.dispenseRequest?.extension?.find(
      (x) =>
        x.url ===
        'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining'
    );
    prescriptionInfo.refills = parseInt(refillRequest?.valueString || '0', 10);
    prescriptionInfo.authoredOn = medicationRequest.authoredOn;
  }
  prescriptionInfo.prescriptionId = prescriptionId;
  if (!prescriptionInfo.zipCode) {
    prescriptionInfo.zipCode = getZipFromPersonList(personList) ?? '';
  }
  if (practitioner) {
    const practitionerName = practitioner.name && practitioner.name[0];
    prescriptionInfo.practitioner = {
      id: (practitioner.identifier && practitioner.identifier[0].value) ?? '',
      name:
        practitionerName?.text ||
        [
          ...(practitionerName?.prefix || []),
          ...(practitionerName?.given || []),
          practitionerName?.family,
          ...(practitionerName?.suffix || []),
        ].join(' ') ||
        '',
      phoneNumber:
        (practitioner.telecom &&
          practitioner.telecom?.find(
            (contactPoint) => contactPoint.system === 'phone'
          )?.value) ??
        '',
    };
  }

  const organization = findFhirOrganizationResource(prescription);
  if (organization) {
    prescriptionInfo.organizationId = organization.id ?? '';

    const pharmacy: IPharmacy = {
      name: organization.name ?? '',
      address: {
        lineOne:
          organization.address && organization.address[0].line
            ? organization.address[0].line[0]
            : '',
        lineTwo:
          organization.address &&
          organization.address[0].line &&
          organization.address[0].line.length > 1
            ? organization.address[0].line[1]
            : '',
        city: organization.address ? organization.address[0].city ?? '' : '',
        state: organization.address ? organization.address[0].state ?? '' : '',
        zip: organization.address
          ? organization.address[0].postalCode ?? ''
          : '',
      },
      phoneNumber:
        (organization.telecom &&
          organization.telecom?.find(
            (contactPoint) => contactPoint.system === 'phone'
          )?.value) ??
        '',
      hours: pharmacyDetails ? convertHours(pharmacyDetails.hours) : [],
      twentyFourHours: !!pharmacyDetails?.twentyFourHours,
      ncpdp: pharmacyDetails?.ncpdp ?? '',
      isMailOrderOnly: !!pharmacyDetails?.isMailOrderOnly,
      brand: pharmacyDetails?.brand,
      chainId: pharmacyDetails?.chainId,
    };
    prescriptionInfo.pharmacy = pharmacy;
  }
  if (prescriptionPriceEvent) {
    if (
      prescriptionPriceEvent.eventData.memberPays !== undefined &&
      prescriptionPriceEvent.eventData.planPays !== undefined &&
      prescriptionPriceEvent.eventData.pharmacyTotalPrice !== undefined
    ) {
      const priceInfo = {
        memberPays: prescriptionPriceEvent.eventData.memberPays,
        planPays: prescriptionPriceEvent.eventData.planPays,
        pharmacyTotalPrice: prescriptionPriceEvent.eventData.pharmacyTotalPrice,
      };
      prescriptionInfo.price = priceInfo;
    }
    if (prescriptionPriceEvent.eventData.fillDate) {
      prescriptionInfo.orderDate = new Date(
        prescriptionPriceEvent.eventData.fillDate
      );
    }

    prescriptionInfo.coupon = prescriptionPriceEvent.eventData.coupon;
  }
  return prescriptionInfo;
};
