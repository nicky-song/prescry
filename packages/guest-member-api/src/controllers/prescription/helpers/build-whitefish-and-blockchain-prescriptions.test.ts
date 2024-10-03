// Copyright 2021 Prescryptive Health, Inc.

import { IFhir } from '../../../models/fhir/fhir';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
  prescriptionWithPharmacyFhirMock,
} from '../mock/get-mock-fhir-object';
import { buildwhitefishAndBlockchainPrescriptions } from './build-whitefish-and-blockchain-prescriptions';
import { findFhirOrganizationResource } from '../../../utils/fhir/fhir-resource.helper';

describe('buildwhitefishAndBlockchainPrescriptions', () => {
  it.each([[true], [false]])(
    'should build prescriptions information from the user information and prescription, blockchain %p',
    (blockchainMock: boolean) => {
      const prescriptionMock: IPrescriptionInfo = {
        drugName: 'BRILINTA',
        form: 'INJ',
        ndc: '00186077660',
        prescriptionId: 'mock',
        refills: 1,
        strength: '60',
        quantity: 50,
        unit: 'MG',
        authoredOn: '2021-04-28',
        dosageInstruction: 'Take once daily unless it is a leap year',
      };

      const blockchainPrescriptionMock: Partial<IPrescriptionInfo> = {
        drugName: 'Prednisone 5 mg tablet',
        form: 'TAB',
        ndc: '59746017210',
        prescriptionId: 'mock-blockchain',
        refills: 2,
        authoredOn: '2019-01-01',
        strength: '5',
        quantity: 24,
        unit: 'mg',
        orderNumber: 'MOCK-RXNUMBER',
        blockchain: true,
      };

      const blockchainPrescriptions: IFhir[] = [prescriptionBlockchainFhirMock];
      const expectedResponse: Partial<IPrescriptionInfo>[] = [prescriptionMock];
      if (blockchainMock) {
        expectedResponse.push(blockchainPrescriptionMock);
      }
      const prescriptionsIFhirMock: IFhir[] = [prescriptionFhirMock];

      expect(
        buildwhitefishAndBlockchainPrescriptions(
          1,
          [],
          prescriptionsIFhirMock,
          blockchainMock ? blockchainPrescriptions : []
        )
      ).toEqual(expectedResponse);
    }
  );

  it('should return 5 prescriptions if page is set to 1', () => {
    const prescriptionMock: IPrescriptionInfo = {
      drugName: 'BRILINTA',
      form: 'INJ',
      ndc: '00186077660',
      prescriptionId: 'mock',
      refills: 1,
      strength: '60',
      quantity: 50,
      unit: 'MG',
      authoredOn: '2021-04-28',
      dosageInstruction: 'Take once daily unless it is a leap year',
    };

    const expectedResponse = new Array<IPrescriptionInfo>(5).fill(
      prescriptionMock
    );
    const prescriptionsIFhirMock = new Array<IFhir>(10).fill(
      prescriptionFhirMock
    );
    expect(
      buildwhitefishAndBlockchainPrescriptions(
        1,
        [],
        prescriptionsIFhirMock,
        undefined
      )
    ).toEqual(expectedResponse);
  });

  it('should return 5 more prescriptions if page is set to 2', () => {
    const prescriptionMock: IPrescriptionInfo = {
      drugName: 'BRILINTA',
      form: 'INJ',
      ndc: '00186077660',
      prescriptionId: 'mock',
      refills: 1,
      strength: '60',
      quantity: 50,
      unit: 'MG',
      authoredOn: '2021-04-28',
      dosageInstruction: 'Take once daily unless it is a leap year',
    };

    const expectedResponse = new Array<IPrescriptionInfo>(5).fill(
      prescriptionMock
    );
    const prescriptionsIFhirMock = new Array<IFhir>(10).fill(
      prescriptionFhirMock
    );
    expect(
      buildwhitefishAndBlockchainPrescriptions(
        2,
        [],
        prescriptionsIFhirMock,
        undefined
      )
    ).toEqual(expectedResponse);
  });

  it('should read strength and unit from identifier in the prescriptions and build prescriptions information', () => {
    const prescriptionsWithPharmacyFhirMock = [
      prescriptionWithPharmacyFhirMock,
    ];

    const expectedResponse: IPrescriptionInfo[] = [
      {
        drugName: 'MODERNA COVID-19',
        form: 'INJ',
        ndc: '80777027310',
        prescriptionId: 'mock-pharmacy',
        refills: 0,
        strength: '2.5-2.5',
        quantity: 20,
        unit: 'MG',
        authoredOn: '2021-04-28',
        dosageInstruction: undefined,
        organizationId: findFhirOrganizationResource(
          prescriptionWithPharmacyFhirMock
        )?.id,
      },
    ];

    expect(
      buildwhitefishAndBlockchainPrescriptions(
        1,
        [],
        prescriptionsWithPharmacyFhirMock,
        undefined
      )
    ).toEqual(expectedResponse);
  });
});
