// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IFhir } from '../../../models/fhir/fhir';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';
import { IMedication } from '../../../models/fhir/medication/medication';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { ApiConstants } from '../../../constants/api-constants';
import { buildBlockchainPrescriptionInfo } from '../../prescription/helpers/build-blockchain-prescription-info';
import { findFhirOrganizationResource } from '../../../utils/fhir/fhir-resource.helper';

export const buildwhitefishAndBlockchainPrescriptions = (
  page: number,
  personList: IPerson[],
  prescriptions: IFhir[],
  blockchainPrescriptions?: IFhir[]
): IPrescriptionInfo[] => {
  const prescriptionsResult = [] as IPrescriptionInfo[];
  for (const prescription of prescriptions) {
    const prescriptionInfo = {} as IPrescriptionInfo;

    prescriptionInfo.prescriptionId = prescription.id || '';

    const medicationResource = prescription.entry.find(
      (r) => r.resource.resourceType === 'Medication'
    );
    const medication = medicationResource?.resource as IMedication | undefined;
    if (medication) {
      prescriptionInfo.drugName =
        (medication.ingredient &&
          medication.ingredient[0].itemCodeableConcept?.text) ??
        '';
      (prescriptionInfo.ndc = medication?.code?.text ?? ''),
        (prescriptionInfo.form =
          (medication.form && medication.form.text) ?? '');

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

    const medicationRequestResource = prescription.entry.find(
      (r) => r.resource.resourceType === 'MedicationRequest'
    );
    const medicationRequest = medicationRequestResource?.resource as
      | IMedicationRequest
      | undefined;
    if (medicationRequest) {
      prescriptionInfo.quantity =
        medicationRequest.dispenseRequest?.initialFill?.quantity?.value ?? 0;
      const refillRequest = medicationRequest.dispenseRequest?.extension?.find(
        (x) =>
          x.url ===
          'http://hl7.org/fhir/StructureDefinition/pharmacy-core-refillsRemaining'
      );
      prescriptionInfo.refills = parseInt(
        refillRequest?.valueString || '0',
        10
      );
      prescriptionInfo.authoredOn = medicationRequest.authoredOn;
      prescriptionInfo.dosageInstruction =
        medicationRequest.dosageInstruction?.find((x) => x.text)?.text;
    }

    const organization = findFhirOrganizationResource(prescription);
    prescriptionInfo.organizationId = organization?.id;

    prescriptionsResult.push(prescriptionInfo);
  }

  if (blockchainPrescriptions) {
    for (const blockchainPrescription of blockchainPrescriptions) {
      const prescriptionInfo = buildBlockchainPrescriptionInfo(
        personList,
        blockchainPrescription,
        blockchainPrescription.id
      );

      prescriptionsResult.push(prescriptionInfo);
    }
  }

  return paginate(
    prescriptionsResult.sort((a: IPrescriptionInfo, b: IPrescriptionInfo) => {
      if (a.authoredOn && b.authoredOn) {
        return (
          new Date(b.authoredOn).getTime() - new Date(a.authoredOn).getTime()
        );
      } else {
        return -1;
      }
    }),
    ApiConstants.MEDICINE_CABINET_PAGE_SIZE,
    page
  );
};

const paginate = (
  array: IPrescriptionInfo[],
  pageSize: number,
  pageNumber: number
): IPrescriptionInfo[] => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
