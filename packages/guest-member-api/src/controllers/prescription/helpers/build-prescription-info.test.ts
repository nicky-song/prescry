// Copyright 2021 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import {
  prescriptionFhirMock,
  prescriptionFhirMockNoZip,
  prescriptionWithPharmacyFhirMock,
} from '../mock/get-mock-fhir-object';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IPatient } from '../../../models/fhir/patient/patient';
import { buildPrescriptionInfo } from './build-prescription-info';
import { IDrugPrice } from '@phx/common/src/models/drug-price';
import { mockPrescriptionPriceTest } from '../mock/get-mock-prescription-price';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '@phx/common/src/models/coupon-details/coupon-details';
import {
  IPrescriptionPrice,
  IPrescriptionPriceEvent,
} from '../../../models/prescription-price-event';
import { IAddress } from '../../../models/fhir/address';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';

describe('buildPrescriptionInfo', () => {
  const mockPharmacyDetailsResponse = {
    address: {
      city: 'BELLEVUE',
      distance: '5',
      lineOne: '10116 NE 8TH STREET',
      lineTwo: '',
      state: 'WA',
      zip: '98004',
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
    name: 'BARTELL DRUGS #40',
    ncpdp: 'mock-ncpdp',
    twentyFourHours: false,
    brand: 'brand-mock',
    chainId: 444,
  } as IPrescriptionPharmacy;

  const mockPersonListWithZip = [
    {
      rxGroupType: RxGroupTypesEnum.SIE,
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      zip: '12345',
    } as IPerson,
  ];

  const prescriptionIdMock = 'mock-id';

  it('should build prescription information from the user information and prescription', () => {
    const expectedResponse: IPrescriptionInfo = {
      drugName: 'BRILINTA',
      form: 'INJ',
      ndc: '00186077660',
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 1,
      authoredOn: '2021-04-28',
      strength: '60',
      quantity: 50,
      unit: 'MG',
      zipCode: '11753',
      orderNumber: 'MOCK-RXNUMBER',
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: undefined,
    };
    expect(
      buildPrescriptionInfo([], prescriptionFhirMock, prescriptionIdMock)
    ).toEqual(expectedResponse);
  });

  it('should build prescription information with pharmacy', () => {
    const expectedResponse: IPrescriptionInfo = {
      drugName: 'MODERNA COVID-19',
      form: 'INJ',
      ndc: '80777027310',
      organizationId: '4929432',
      pharmacy: {
        address: {
          lineOne: 'line 1',
          lineTwo: 'line 2',
          city: 'city',
          state: 'WA',
          zip: '92078',
        },
        phoneNumber: '555555555',
        hours: [],
        name: 'Prescryptive Pharmacy',
        twentyFourHours: false,
        ncpdp: '',
        isMailOrderOnly: false,
      },
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 0,
      authoredOn: '2021-04-28',
      strength: '2.5-2.5',
      quantity: 20,
      unit: 'MG',
      zipCode: '11801',
      orderNumber: 'MOCK-RXNUMBER',
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: undefined,
    };
    expect(
      buildPrescriptionInfo(
        [],
        prescriptionWithPharmacyFhirMock,
        prescriptionIdMock
      )
    ).toEqual(expectedResponse);
  });

  it('should build prescription information and use hours from pharmacy resource if passed', () => {
    const expectedResponse: IPrescriptionInfo = {
      drugName: 'MODERNA COVID-19',
      form: 'INJ',
      ndc: '80777027310',
      organizationId: '4929432',
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
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 0,
      authoredOn: '2021-04-28',
      strength: '2.5-2.5',
      quantity: 20,
      unit: 'MG',
      zipCode: '11801',
      orderNumber: 'MOCK-RXNUMBER',
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: undefined,
    };
    expect(
      buildPrescriptionInfo(
        [],
        prescriptionWithPharmacyFhirMock,
        prescriptionIdMock,
        mockPharmacyDetailsResponse
      )
    ).toEqual(expectedResponse);
  });

  it('should use zip from person if prescription does not have it', () => {
    const expectedResponse: IPrescriptionInfo = {
      drugName: 'BRILINTA',
      form: 'INJ',
      ndc: '00186077660',
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 1,
      authoredOn: '2021-04-28',
      strength: '60',
      quantity: 50,
      unit: 'MG',
      zipCode: '12345',
      orderNumber: 'MOCK-RXNUMBER',
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: undefined,
    };
    const mockPrescriptionWithoutZip = { ...prescriptionFhirMock };
    const patientResource = mockPrescriptionWithoutZip.entry.find(
      (r) => r.resource.resourceType === 'Patient'
    )?.resource as IPatient;

    patientResource.address = [{} as IAddress];
    expect(
      buildPrescriptionInfo(
        mockPersonListWithZip,
        mockPrescriptionWithoutZip,
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

    const expectedResponse: IPrescriptionInfo = {
      drugName: 'BRILINTA',
      form: 'INJ',
      ndc: '00186077660',
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 1,
      strength: '60',
      authoredOn: '2021-04-28',
      quantity: 50,
      unit: 'MG',
      zipCode: '',
      orderNumber: 'MOCK-RXNUMBER',
      price: mockPrice,
      orderDate: new Date('2000-01-01T00:00:00.000Z'),
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: undefined,
    };
    expect(
      buildPrescriptionInfo(
        [],
        prescriptionFhirMock,
        prescriptionIdMock,
        undefined,
        {
          ...mockPrescriptionPriceTest,
          eventData: { ...mockPrescriptionPriceTest.eventData, ...mockPrice },
        }
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

    const expectedResponse: IPrescriptionInfo = {
      drugName: 'GRALISE',
      form: 'TABS',
      ndc: '13913000419',
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 1,
      strength: '300',
      authoredOn: '2021-04-28',
      quantity: 90,
      unit: 'MG',
      zipCode: '',
      orderNumber: 'MOCK-RXNUMBER',
      price: undefined,
      orderDate: new Date('2000-01-01T00:00:00.000Z'),
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: couponDetailsMock,
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
      buildPrescriptionInfo(
        [],
        prescriptionFhirMockNoZip,
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

    const expectedResponse: IPrescriptionInfo = {
      drugName: 'MODERNA COVID-19',
      form: 'INJ',
      ndc: '80777027310',
      organizationId: '4929432',
      pharmacy: {
        address: {
          city: 'city',
          lineOne: 'line 1',
          lineTwo: 'line 2',
          state: 'WA',
          zip: '92078',
        },
        hours: [],
        name: 'Prescryptive Pharmacy',
        ncpdp: '',
        phoneNumber: '555555555',
        twentyFourHours: false,
        isMailOrderOnly: false,
      },
      prescriptionId: 'mock-id',
      primaryMemberRxId: 'MYRX-ID',
      refills: 0,
      authoredOn: '2021-04-28',
      strength: '2.5-2.5',
      quantity: 20,
      unit: 'MG',
      zipCode: '11801',
      orderNumber: 'MOCK-RXNUMBER',
      price: mockPrice,
      orderDate: new Date('2000-01-01T00:00:00.000Z'),
      practitioner: {
        id: 'Navazo',
        name: 'Luis Navazo',
        phoneNumber: '5164083999',
      },
      coupon: undefined,
    };
    expect(
      buildPrescriptionInfo(
        [],
        prescriptionWithPharmacyFhirMock,
        prescriptionIdMock,
        undefined,
        {
          ...mockPrescriptionPriceTest,
          eventData: { ...mockPrescriptionPriceTest.eventData, ...mockPrice },
        }
      )
    ).toEqual(expectedResponse);
  });
});
