// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '@phx/common/src/models/address';
import { IPerson } from '@phx/common/src/models/person';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import {
  presPayloadWithMemberAddress,
  presPayloadWithOutPrescriptionNumber,
  presPayloadWithPrescriptionNumber,
} from '../mock/transfer-prescription-fhir-mock';
import { buildTransferPrescriptionResource } from './build-transfer-prescription-resource';

describe('buildTransferRequestResource', () => {
  const sourcePharmacyDetails = {
    address: {
      city: 'BELLEVUE',
      lineOne: '2636 BELLEVUE WAY NE',
      lineTwo: '',
      state: 'WA',
      zip: '98004',
    } as IAddress,
    email: 'RXLICENSING@KROGER.COM',
    hasDriveThru: false,
    inNetwork: false,
    name: 'QFC PHARMACY',
    nationalProviderIdentifier: 'mock-npi',
    ncpdp: '4929432',
    phone: '4545769222',
    fax: '123-456',
    twentyFourHours: true,
    type: 'retail',
  } as IPrescriptionPharmacy;

  const destinationPharmacyDetails = {
    address: {
      city: 'REDMOND',
      lineOne: '1234 BEL RED RD',
      lineTwo: '',
      state: 'WA',
      zip: '98054',
    } as IAddress,
    email: 'RXTEST@GMAIL.COM',
    hasDriveThru: false,
    inNetwork: false,
    name: 'WALGREENS PHARMACY',
    nationalProviderIdentifier: 'mock-npi',
    ncpdp: '1234567',
    phone: '6524896512',
    fax: '652-456-2134',
    twentyFourHours: true,
    type: 'retail',
  } as IPrescriptionPharmacy;

  const patientInfo = {
    identifier: 'person-identifier-cash',
    firstName: 'first-name',
    lastName: 'last-name',
    email: 'test@email.com',
    dateOfBirth: '2000-01-01',
    phoneNumber: '1234567890',
    primaryMemberFamilyId: 'CAJY',
    primaryMemberRxId: 'CAJY01',
    isPrimary: true,
    rxGroupType: 'CASH',
  } as unknown as IPerson;

  const drugInfo = {
    name: 'LiProZonePak',
    genericName: 'Lidocaine-Prilocaine',
    ndc: '69665061001',
    formCode: 'KIT',
    strength: '2.5-2.5',
    strengthUnit: '%',
    multiSourceCode: 'Y',
    brandNameCode: 'T',
    packageTypeCode: 'BX',
    packageQuantity: 1,
    isGeneric: true,
  };

  const daysSupply = 30;
  const quantity = 5;

  it('should build prescription request with empty identifier in medication Request if prescription number is not passed', () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2000-01-01T00:00:00.000Z');

    expect(
      buildTransferPrescriptionResource(
        sourcePharmacyDetails,
        destinationPharmacyDetails,
        patientInfo,
        drugInfo,
        daysSupply,
        quantity
      )
    ).toEqual(presPayloadWithOutPrescriptionNumber);
  });

  it('should build prescription request with prescription number details if prescription number is passed', () => {
    const prescriptionNumber = '123456';
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2000-01-01T00:00:00.000Z');

    expect(
      buildTransferPrescriptionResource(
        sourcePharmacyDetails,
        destinationPharmacyDetails,
        patientInfo,
        drugInfo,
        daysSupply,
        quantity,
        prescriptionNumber
      )
    ).toEqual(presPayloadWithPrescriptionNumber);
  });
  it('should build prescription request with patient address details if address is passed', () => {
    const prescriptionNumber = '123456';
    const expectPatientInfoWithAddress = {
      identifier: 'person-identifier-cash',
      firstName: 'first-name',
      lastName: 'last-name',
      email: 'test@email.com',
      dateOfBirth: '2000-01-01',
      phoneNumber: '1234567890',
      primaryMemberFamilyId: 'CAJY',
      primaryMemberRxId: 'CAJY01',
      isPrimary: true,
      rxGroupType: 'CASH',
      address1: 'address-line1',
      city: 'city',
      state: 'state',
      zip: '12345',
    } as unknown as IPerson;

    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2000-01-01T00:00:00.000Z');

    expect(
      buildTransferPrescriptionResource(
        sourcePharmacyDetails,
        destinationPharmacyDetails,
        expectPatientInfoWithAddress,
        drugInfo,
        daysSupply,
        quantity,
        prescriptionNumber
      )
    ).toEqual(presPayloadWithMemberAddress);
  });
});
