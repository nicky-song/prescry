// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { SuccessResponse } from '../../../utils/response-helper';
import { getPharmacyDetailsByNcpdp } from './get-pharmacy-details-by-ncpdp';

import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { SuccessConstants } from '../../../constants/response-messages';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getPrescriptionPriceById } from '../../../databases/mongo-database/v1/query-helper/prescription.query-helper';
import { mockPrescriptionPriceTest } from '../mock/get-mock-prescription-price';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { buildBlockchainPrescriptionInfoResponse } from './build-blockchain-prescription-info-response';
import { buildBlockchainPrescriptionInfo } from './build-blockchain-prescription-info';
import {
  prescriptionBlockchainFhirMock,
  prescriptionBlockchainWithPharmacyIdFhirMock,
} from '../mock/get-mock-fhir-object';
import {
  getPrescriberDetailsEndpointHelper,
  IPractitionerDetailsResponse,
} from './get-prescriber-details-endpoint.helper';
import { IPractitioner } from '@phx/common/src/models/practitioner';

const successResponseMock = SuccessResponse as jest.Mock;
const buildBlockchainPrescriptionInfoMock =
  buildBlockchainPrescriptionInfo as jest.Mock;
const getPharmacyDetailsByNcpdpMock = getPharmacyDetailsByNcpdp as jest.Mock;
const getPrescriptionPriceByIdMock = getPrescriptionPriceById as jest.Mock;
const getPrescriberDetailsEndpointHelperMock =
  getPrescriberDetailsEndpointHelper as jest.Mock;

jest.mock('../../../utils/response-helper');
jest.mock('./build-prescription-info-response');
jest.mock('./get-pharmacy-details-by-ncpdp');
jest.mock('./build-blockchain-prescription-info');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/prescription.query-helper'
);
jest.mock('./get-prescriber-details-endpoint.helper');
getPrescriberDetailsEndpointHelper;

const mockPersonList = [
  {
    rxSubGroup: 'HMA01',
    rxGroupType: 'SIE',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
    zip: '12345',
  } as IPerson,
  {
    rxSubGroup: 'HMA01',
    rxGroupType: 'SIE',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'member-id',
    zip: '12345',
  } as IPerson,
];
const databaseMock = {} as IDatabase;

const prescriptionInfo: IPrescriptionInfo = {
  drugName: 'MODERNA COVID-19',
  form: 'INJ',
  ndc: '80777027310',
  prescriptionId: 'mock',
  primaryMemberRxId: 'MYRX-ID',
  refills: 0,
  strength: '0',
  quantity: 20,
  unit: '.47-0.27-0.11-',
  zipCode: '11801',
  orderNumber: '11222',
  coupon: undefined,
};

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
} as IPrescriptionPharmacy;

const prescriptionIdMock = '12345';

describe('buildBlockchainPrescriptionInfoResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build prescription information from prescription passed and not call ncpdp api if prescription does not have pharmacy', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildBlockchainPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);

    const actual = await buildBlockchainPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionBlockchainFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPharmacyDetailsByNcpdpMock).not.toBeCalled();
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionInfo
    );
    expect(getPrescriptionPriceByIdMock).not.toBeCalled();
    expect(buildBlockchainPrescriptionInfoMock).toBeCalledWith(
      mockPersonList,
      prescriptionBlockchainFhirMock,
      prescriptionIdMock,
      undefined,
      undefined,
      undefined
    );
  });

  it('should build prescription information and call ncpdp api if prescription has pharmacy', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildBlockchainPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      mockPharmacyDetailsResponse
    );
    getPrescriptionPriceByIdMock.mockReturnValueOnce(mockPrescriptionPriceTest);
    const actual = await buildBlockchainPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionBlockchainWithPharmacyIdFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
      '5920447',
      configurationMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionInfo
    );
    expect(buildBlockchainPrescriptionInfoMock).toBeCalledWith(
      mockPersonList,
      prescriptionBlockchainWithPharmacyIdFhirMock,
      prescriptionIdMock,
      mockPharmacyDetailsResponse,
      mockPrescriptionPriceTest,
      undefined
    );
  });

  it('should build prescription information with prescriber details', async () => {
    const prescriberDetailsMock: IPractitioner = {
      id: 'id-mock',
      name: 'first-name-mock last-name-mock',
      phoneNumber: 'phone-number-mock',
    };

    const prescriberDetailsResponseMock: IPractitionerDetailsResponse = {
      practitioner: prescriberDetailsMock,
      isSuccess: true,
    };

    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildBlockchainPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      mockPharmacyDetailsResponse
    );
    getPrescriptionPriceByIdMock.mockReturnValueOnce(mockPrescriptionPriceTest);
    getPrescriberDetailsEndpointHelperMock.mockReturnValue(
      prescriberDetailsResponseMock
    );

    const actual = await buildBlockchainPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionBlockchainWithPharmacyIdFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
      '5920447',
      configurationMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionInfo
    );
    expect(buildBlockchainPrescriptionInfoMock).toBeCalledWith(
      mockPersonList,
      prescriptionBlockchainWithPharmacyIdFhirMock,
      prescriptionIdMock,
      mockPharmacyDetailsResponse,
      mockPrescriptionPriceTest,
      prescriberDetailsMock
    );
  });
});
