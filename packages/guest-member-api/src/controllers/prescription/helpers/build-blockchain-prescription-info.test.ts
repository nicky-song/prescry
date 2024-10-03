// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { IDrugPrice } from '@phx/common/src/models/drug-price';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '@phx/common/src/models/coupon-details/coupon-details';
import {
  IPrescriptionPrice,
  IPrescriptionPriceEvent,
} from '../../../models/prescription-price-event';
import { buildBlockchainPrescriptionInfo } from './build-blockchain-prescription-info';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import {
  prescriptionBlockchainFhirMock,
  prescriptionBlockchainWithPharmacyIdFhirMock,
} from '../mock/get-mock-fhir-object';
import { mockPrescriptionPriceTest } from '../mock/get-mock-prescription-price';
import { getPersonForBlockchainPrescription } from '../../../utils/get-person-for-blockchain-prescription.helper';
import { IPractitioner } from '@phx/common/src/models/practitioner';

jest.mock('../../../utils/get-person-for-blockchain-prescription.helper');
const getPersonForBlockchainPrescriptionMock =
  getPersonForBlockchainPrescription as jest.Mock;

describe('buildBlockchainPrescriptionInfo', () => {
  const mockPersonListWithZip = [
    {
      rxGroupType: 'SIE',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      zip: '12345',
    } as IPerson,
  ];

  const prescriptionIdMock = 'mock-blockchain';
  it('should build prescription information from the user information and prescription', () => {
    const expectedResponse: Partial<IPrescriptionInfo> = {
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
    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainFhirMock,
        prescriptionIdMock
      )
    ).toEqual(expectedResponse);
  });

  it('should use zip from person if prescription does not have it', () => {
    const expectedResponse: Partial<IPrescriptionInfo> = {
      drugName: 'Prednisone 5 mg tablet',
      form: 'TAB',
      ndc: '59746017210',
      prescriptionId: 'mock-blockchain',
      refills: 2,
      authoredOn: '2019-01-01',
      strength: '5',
      quantity: 24,
      unit: 'mg',
      zipCode: '12345',
      orderNumber: 'MOCK-RXNUMBER',
      blockchain: true,
    };

    expect(
      buildBlockchainPrescriptionInfo(
        mockPersonListWithZip,
        prescriptionBlockchainFhirMock,
        prescriptionIdMock
      )
    ).toEqual(expectedResponse);
  });

  it('should build prescription information with price information from the user information, prescription and pricing information', () => {
    const mockPrice = {
      memberPays: 0,
      planPays: 0,
      pharmacyTotalPrice: 0,
    } as IDrugPrice;

    const expectedResponse: Partial<IPrescriptionInfo> = {
      drugName: 'Prednisone 5 mg tablet',
      form: 'TAB',
      ndc: '59746017210',
      prescriptionId: 'mock-blockchain',
      refills: 2,
      authoredOn: '2019-01-01',
      strength: '5',
      quantity: 24,
      unit: 'mg',
      price: mockPrice,
      orderDate: new Date('2000-01-01T00:00:00.000Z'),
      orderNumber: 'MOCK-RXNUMBER',
      coupon: undefined,
      blockchain: true,
    };
    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainFhirMock,
        prescriptionIdMock,
        undefined,
        {
          ...mockPrescriptionPriceTest,
          eventData: { ...mockPrescriptionPriceTest.eventData, ...mockPrice },
        }
      )
    ).toEqual(expectedResponse);
  });

  it('should build prescription information with pharmacy', () => {
    const mockMasterId = 'MYRX-ID';

    const mockPharmacyDetailsResponse = {
      address: {
        lineOne: 'line 1',
        lineTwo: 'line 2',
        city: 'city',
        state: 'WA',
        zip: '92078',
      },
      hours: [
        {
          closes: {
            hours: 7,
            minutes: 0,
            pm: true,
          },
          day: 'Sun',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Mon',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Tue',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Wed',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Thu',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 10,
            minutes: 0,
            pm: true,
          },
          day: 'Fri',
          opens: {
            hours: 8,
            minutes: 0,
            pm: false,
          },
        },
        {
          closes: {
            hours: 7,
            minutes: 0,
            pm: true,
          },
          day: 'Sat',
          opens: {
            hours: 9,
            minutes: 0,
            pm: false,
          },
        },
      ],
      phone: '555555555',
      name: 'Prescryptive Pharmacy',
      ncpdp: 'mock-ncpdp',
      twentyFourHours: false,
      brand: 'brand-mock',
      chainId: 444,
    } as IPrescriptionPharmacy;

    const expectedResponse: Partial<IPrescriptionInfo> = {
      drugName: 'Prednisone 5 mg tablet',
      form: 'TAB',
      ndc: '59746017210',
      organizationId: '5920447',
      pharmacy: {
        address: {
          lineOne: 'line 1',
          lineTwo: 'line 2',
          city: 'city',
          state: 'WA',
          zip: '92078',
        },
        phoneNumber: '555555555',
        hours: [
          {
            closes: {
              h: 7,
              m: 0,
              pm: true,
            },
            day: 'Sun',
            opens: {
              h: 9,
              m: 0,
              pm: false,
            },
          },
          {
            closes: {
              h: 10,
              m: 0,
              pm: true,
            },
            day: 'Mon',
            opens: {
              h: 8,
              m: 0,
              pm: false,
            },
          },
          {
            closes: {
              h: 10,
              m: 0,
              pm: true,
            },
            day: 'Tue',
            opens: {
              h: 8,
              m: 0,
              pm: false,
            },
          },
          {
            closes: {
              h: 10,
              m: 0,
              pm: true,
            },
            day: 'Wed',
            opens: {
              h: 8,
              m: 0,
              pm: false,
            },
          },
          {
            closes: {
              h: 10,
              m: 0,
              pm: true,
            },
            day: 'Thu',
            opens: {
              h: 8,
              m: 0,
              pm: false,
            },
          },
          {
            closes: {
              h: 10,
              m: 0,
              pm: true,
            },
            day: 'Fri',
            opens: {
              h: 8,
              m: 0,
              pm: false,
            },
          },
          {
            closes: {
              h: 7,
              m: 0,
              pm: true,
            },
            day: 'Sat',
            opens: {
              h: 9,
              m: 0,
              pm: false,
            },
          },
        ],
        name: 'Prescryptive Pharmacy',
        twentyFourHours: !!mockPharmacyDetailsResponse.twentyFourHours,
        ncpdp: mockPharmacyDetailsResponse.ncpdp,
        isMailOrderOnly: !!mockPharmacyDetailsResponse.isMailOrderOnly,
        brand: 'brand-mock',
        chainId: 444,
      },
      prescriptionId: 'mock-blockchain',
      refills: 2,
      authoredOn: '2019-01-01',
      strength: '5',
      quantity: 24,
      unit: 'mg',
      orderNumber: 'MOCK-RXNUMBER',
      blockchain: true,
    };

    expect(getPersonForBlockchainPrescriptionMock).toHaveBeenCalledWith(
      mockPersonListWithZip,
      mockMasterId
    );

    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainWithPharmacyIdFhirMock,
        prescriptionIdMock,
        mockPharmacyDetailsResponse
      )
    ).toEqual(expectedResponse);
  });

  it('should build prescription information with coupon when no price information is available', () => {
    const couponDetailsMock: ICouponDetails = {
      productManufacturerName: 'product-manufacturer-name-1',
      price: 1,
      ageLimit: 1,
      introductionDialog: 'introduction-dialog-1',
      eligibilityURL: 'eligibility-url-1',
      copayText: 'copay-text-1',
      copayAmount: 1,
      groupNumber: 'group-number-1',
      pcn: 'pcn-1',
      memberId: 'member-id-1',
      bin: 'bin-1',
      featuredPharmacy: 'featured-pharmacy-1',
      logo: {} as ICouponDetailsLogo,
    };

    const expectedResponse: Partial<IPrescriptionInfo> = {
      drugName: 'Prednisone 5 mg tablet',
      form: 'TAB',
      ndc: '59746017210',
      prescriptionId: 'mock-blockchain',
      refills: 2,
      authoredOn: '2019-01-01',
      strength: '5',
      quantity: 24,
      unit: 'mg',
      price: undefined,
      orderDate: new Date('2000-01-01T00:00:00.000Z'),
      orderNumber: 'MOCK-RXNUMBER',
      coupon: couponDetailsMock,
      blockchain: true,
    };

    const pricingInfoMock: IPrescriptionPrice = {
      prescriptionId: 'id-1',
      daysSupply: 30,
      pharmacyId: '123',
      fillDate: '2000-01-01T00:00:00.000Z',
      ndc: 'ndc',
      planPays: undefined,
      memberPays: undefined,
      pharmacyTotalPrice: undefined,
      memberId: 'member-id',
      quantity: 60,
      type: 'prescription',
      coupon: couponDetailsMock,
    };
    const healthRecordEventMock = {
      identifiers: [{ type: 'primaryMemberRxId', value: 'member-id' }],
      createdOn: 946713600,
      createdBy: 'rxassistant-api',
      tags: ['member-id'],
      eventType: 'prescription/price',
      eventData: pricingInfoMock,
    } as IPrescriptionPriceEvent;

    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainFhirMock,
        prescriptionIdMock,
        undefined,
        healthRecordEventMock
      )
    ).toEqual(expectedResponse);
  });

  it('should read strength and unit from identifier in the prescription and build prescription information', () => {
    const mockPrice = {
      memberPays: 0,
      planPays: 0,
      pharmacyTotalPrice: 0,
    } as IDrugPrice;

    const expectedResponse: Partial<IPrescriptionInfo> = {
      drugName: 'Prednisone 5 mg tablet',
      form: 'TAB',
      ndc: '59746017210',
      prescriptionId: 'mock-blockchain',
      refills: 2,
      authoredOn: '2019-01-01',
      strength: '5',
      quantity: 24,
      unit: 'mg',
      price: mockPrice,
      orderDate: new Date('2000-01-01T00:00:00.000Z'),
      orderNumber: 'MOCK-RXNUMBER',
      coupon: undefined,
      blockchain: true,
    };

    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainFhirMock,
        prescriptionIdMock,
        undefined,
        {
          ...mockPrescriptionPriceTest,
          eventData: { ...mockPrescriptionPriceTest.eventData, ...mockPrice },
        }
      )
    ).toEqual(expectedResponse);
  });

  it('set blockchain as true in prescription info', () => {
    const expectedResponse: Partial<IPrescriptionInfo> = {
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

    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainFhirMock,
        prescriptionIdMock,
        undefined,
        undefined
      )
    ).toEqual(expectedResponse);
  });

  it('set prescriber details in prescription info', () => {
    const prescriberDetailsMock: IPractitioner = {
      id: 'id-mock',
      name: 'first-name-mock last-name-mock',
      phoneNumber: 'phone-number-mock',
    };

    const expectedResponse: Partial<IPrescriptionInfo> = {
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
      practitioner: prescriberDetailsMock,
    };

    expect(
      buildBlockchainPrescriptionInfo(
        [],
        prescriptionBlockchainFhirMock,
        prescriptionIdMock,
        undefined,
        undefined,
        prescriberDetailsMock
      )
    ).toEqual(expectedResponse);
  });
});
