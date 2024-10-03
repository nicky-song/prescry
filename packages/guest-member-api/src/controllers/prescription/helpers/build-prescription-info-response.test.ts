// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import {
  prescriptionFhirMock,
  prescriptionTransferFhirMock,
  prescriptionWithMultiplePharmacyFhirMock,
  prescriptionWithPharmacyFhirMock,
  getAndPublishPrescriptionPriceFhirMock,
} from '../mock/get-mock-fhir-object';
import { SuccessResponse } from '../../../utils/response-helper';
import { buildPrescriptionInfo } from './build-prescription-info';
import { getPharmacyDetailsByNcpdp } from './get-pharmacy-details-by-ncpdp';

import { buildPrescriptionInfoResponse } from './build-prescription-info-response';
import { IPrescriptionInfo } from '@phx/common/src/models/prescription-info';
import { SuccessConstants } from '../../../constants/response-messages';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getPrescriptionPriceById } from '../../../databases/mongo-database/v1/query-helper/prescription.query-helper';
import {
  mockPrescriptionPrice,
  mockPrescriptionPriceNoMatch,
  mockPrescriptionPriceTest,
} from '../mock/get-mock-prescription-price';
import { isSmartpriceUser } from '../../../utils/is-smart-price-eligible';
import { publishPrescriptionPriceEvent } from './publish-prescription-price-event';
import { getAndPublishPrescriptionPrice } from '../../../utils/external-api/get-and-publish-prescription-price';
import { getCouponIfEligible } from '../helpers/get-coupon-if-eligible';
import { couponMock } from '../../../mock-data/coupon.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';

jest.mock('../../../utils/fhir/prescriber-npi.helper');
jest.mock('../../../utils/response-helper');
jest.mock('./build-prescription-info');
jest.mock('./get-pharmacy-details-by-ncpdp');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/prescription.query-helper'
);
jest.mock('../../../utils/is-smart-price-eligible');
jest.mock('./publish-prescription-price-event');
jest.mock('../../../utils/external-api/get-and-publish-prescription-price');
jest.mock('../helpers/get-coupon-if-eligible');
jest.mock('../../../utils/request/request-app-locals.helper');

const findPrescriberNPIForPrescriptionFhirMock =
  findPrescriberNPIForPrescriptionFhir as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const buildPrescriptionInfoMock = buildPrescriptionInfo as jest.Mock;
const getPharmacyDetailsByNcpdpMock = getPharmacyDetailsByNcpdp as jest.Mock;
const getPrescriptionPriceByIdMock = getPrescriptionPriceById as jest.Mock;
const isSmartpriceUserMock = isSmartpriceUser as jest.Mock;
const publishPrescriptionPriceEventMock =
  publishPrescriptionPriceEvent as jest.Mock;
const getAndPublishPrescriptionPriceMock =
  getAndPublishPrescriptionPrice as jest.Mock;
const getCouponIfEligibleMock = getCouponIfEligible as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

const usertpbMock = true;
const useTestThirdPartyPricingMock = false;
const prescriberNpiMock = 'prescriber-npi-mock';

beforeEach(() => {
  jest.clearAllMocks();

  getRequiredResponseLocalMock.mockReturnValue({
    usertpb: usertpbMock,
    useTestThirdPartyPricing: useTestThirdPartyPricingMock,
  });

  findPrescriberNPIForPrescriptionFhirMock.mockReturnValue(prescriberNpiMock);
});

const mockPersonList = [
  {
    rxSubGroup: 'HMA01',
    rxGroupType: RxGroupTypesEnum.SIE,
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
    zip: '12345',
  } as IPerson,
  {
    rxSubGroup: 'HMA01',
    rxGroupType: RxGroupTypesEnum.SIE,
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

describe('buildPrescriptionInfoResponse', () => {
  it('should build prescription information from prescription passed and not call ncpdp api if prescription does not have pharmacy', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);

    const actual = await buildPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionFhirMock,
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
    expect(buildPrescriptionInfoMock).toBeCalledWith(
      mockPersonList,
      prescriptionFhirMock,
      prescriptionIdMock,
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
    buildPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      mockPharmacyDetailsResponse
    );
    getPrescriptionPriceByIdMock.mockReturnValueOnce(mockPrescriptionPriceTest);
    const actual = await buildPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionWithPharmacyFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
      '4929432',
      configurationMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionInfo
    );
    expect(buildPrescriptionInfoMock).toBeCalledWith(
      mockPersonList,
      prescriptionWithPharmacyFhirMock,
      prescriptionIdMock,
      mockPharmacyDetailsResponse,
      mockPrescriptionPriceTest
    );
  });

  it('should consider destination pharmacy in case of multiple pharmacies in prescription Info', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      mockPharmacyDetailsResponse
    );
    getPrescriptionPriceByIdMock.mockReturnValueOnce(mockPrescriptionPriceTest);
    const actual = await buildPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionWithMultiplePharmacyFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPharmacyDetailsByNcpdpMock).toHaveBeenCalledWith(
      '4929433',
      configurationMock
    );
  });

  it('should search for price event by transfer bundle id if price event not found for transfer', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      mockPharmacyDetailsResponse
    );
    getPrescriptionPriceByIdMock.mockResolvedValueOnce(undefined);
    getPrescriptionPriceByIdMock.mockResolvedValueOnce(
      mockPrescriptionPriceTest
    );
    isSmartpriceUserMock.mockReturnValueOnce(true);
    const actual = await buildPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionTransferFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
      'pharmacy-id',
      configurationMock
    );
    expect(getPrescriptionPriceByIdMock).toBeCalled();
    expect(isSmartpriceUserMock).toBeCalledWith('HMA01');
    expect(getPrescriptionPriceByIdMock).toHaveBeenNthCalledWith(
      1,
      '12345',
      databaseMock
    );
    expect(getPrescriptionPriceByIdMock).toHaveBeenNthCalledWith(
      2,
      'bc080e93-71ef-4420-9085-2c31d954b236',
      databaseMock
    );
    expect(publishPrescriptionPriceEventMock).toBeCalledWith('member-id', {
      daysSupply: 30,
      fillDate: '2000-01-01T00:00:00.000Z',
      memberId: 'member-id',
      memberPays: 1,
      ndc: '00023530101',
      pharmacyId: 'pharmacy-id',
      pharmacyTotalPrice: 3,
      planPays: 2,
      prescriptionId: '12345',
      quantity: 60,
      type: 'prescription',
    });
    expect(actual).toBe(expected);
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionInfo
    );
  });

  it('should search and find new price for transfer bundle id if price event not found for transfer and the transfer values are different than actual prescription', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildPrescriptionInfoMock.mockReturnValueOnce(prescriptionInfo);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(
      mockPharmacyDetailsResponse
    );
    getPrescriptionPriceByIdMock.mockResolvedValueOnce(undefined);
    getPrescriptionPriceByIdMock.mockResolvedValueOnce(
      mockPrescriptionPriceNoMatch
    );
    isSmartpriceUserMock.mockReturnValueOnce(true);
    getAndPublishPrescriptionPriceMock.mockReturnValueOnce(
      mockPrescriptionPrice
    );
    const actual = await buildPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      prescriptionTransferFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(getPharmacyDetailsByNcpdpMock).toBeCalledWith(
      'pharmacy-id',
      configurationMock
    );
    expect(getPrescriptionPriceByIdMock).toBeCalled();
    expect(isSmartpriceUserMock).toBeCalledWith('HMA01');
    expect(getPrescriptionPriceByIdMock).toHaveBeenNthCalledWith(
      1,
      '12345',
      databaseMock
    );
    expect(getPrescriptionPriceByIdMock).toHaveBeenNthCalledWith(
      2,
      'bc080e93-71ef-4420-9085-2c31d954b236',
      databaseMock
    );
    expect(getAndPublishPrescriptionPriceMock).toBeCalledWith(
      '00023530101',
      60,
      30,
      'pharmacy-id',
      configurationMock,
      'member-id',
      'HMA01',
      '1',
      prescriptionIdMock,
      '60302',
      'prescription',
      undefined,
      usertpbMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(publishPrescriptionPriceEventMock).not.toBeCalled();
    expect(buildPrescriptionInfoMock).toBeCalledWith(
      mockPersonList,
      prescriptionTransferFhirMock,
      prescriptionIdMock,
      mockPharmacyDetailsResponse,
      mockPrescriptionPrice
    );
    expect(actual).toBe(expected);
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      prescriptionInfo
    );
  });

  it('Should call function getAndPublishPrescriptionPrice and publish coupon data if basic resource contains a transfer in request type', async () => {
    const expected = {};
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    successResponseMock.mockReturnValueOnce(expected);
    buildPrescriptionInfoMock.mockReturnValueOnce(
      getAndPublishPrescriptionPriceFhirMock
    );
    isSmartpriceUserMock.mockReturnValueOnce(true);
    getPharmacyDetailsByNcpdpMock.mockReturnValueOnce(undefined);
    getPrescriptionPriceByIdMock.mockReturnValueOnce(null);
    getPrescriptionPriceByIdMock.mockReturnValueOnce(undefined);
    getCouponIfEligibleMock.mockReturnValueOnce({ coupon: couponMock });

    const actual = await buildPrescriptionInfoResponse(
      responseMock,
      prescriptionIdMock,
      getAndPublishPrescriptionPriceFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(getAndPublishPrescriptionPriceMock).toBeCalledWith(
      '13913000519',
      90,
      1,
      '5920447',
      configurationMock,
      'CA7CQV01',
      '',
      '1',
      '12345',
      '60394',
      'prescription',
      { coupon: couponMock },
      usertpbMock,
      prescriberNpiMock,
      true,
      useTestThirdPartyPricingMock
    );
    expect(actual).toBe(expected);
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.DOCUMENT_FOUND,
      getAndPublishPrescriptionPriceFhirMock
    );
  });
});
