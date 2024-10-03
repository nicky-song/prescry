// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { getPharmaciesAndPricesForNdc } from '../../../utils/external-api/get-pharmacy-and-prices-for-ndc';
import { getGeolocationByZip } from '../../geolocation/helpers/get-geolocation-by-zip';
import { searchPharmacyDrugPriceHandler } from './search-pharmacy-drug-price.handler';
import { locationCoordinatesMock } from '../../../mock-data/coordiantes.mock';
import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IPerson } from '@phx/common/src/models/person';
import { ApiConstants } from '../../../constants/api-constants';
import * as FetchRequestHeader from '../../../utils/request-helper';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/external-api/get-pharmacy-and-prices-for-ndc');
jest.mock('../../geolocation/helpers/get-geolocation-by-zip');
jest.mock('../../../utils/request/request-app-locals.helper');

const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

const getGeolocationByZipMock = getGeolocationByZip as jest.Mock;
const getPharmaciesAndPricesForNdcMock =
  getPharmaciesAndPricesForNdc as jest.Mock;

const getResponseLocalMock = getResponseLocal as jest.Mock;

const fetchRequestHeader = jest.spyOn(FetchRequestHeader, 'fetchRequestHeader');

beforeEach(() => {
  jest.clearAllMocks();

  fetchRequestHeader.mockReturnValue(undefined);
  getResponseLocalMock.mockReturnValueOnce(undefined);
  getResponseLocalMock.mockReturnValueOnce({
    usesieprice: false,
    usecashprice: false,
    useDualPrice: false,
    useTestThirdPartyPricing: false,
  });
});

const zipCodeMock = '12345';
const ndcMock = 'mock-ndc';
const quantityMock = '1';
const supplyMock = '30';
const latitudeMock = 43.141649;
const longitudeMock = -85.04948;
const radiusMileMock = 25;

describe('searchPharmacyDrugPriceHandler', () => {
  it('returns error if neither zipcode nor latitude and longitude is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {},
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(getGeolocationByZipMock).not.toBeCalled();
    expect(actual).toEqual(expected);
  });

  it('returns error if ndc is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(actual).toEqual(expected);
    expect(getGeolocationByZipMock).not.toBeCalled();
  });

  it('returns error if supply is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        ndc: ndcMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(actual).toEqual(expected);
    expect(getGeolocationByZipMock).not.toBeCalled();
  });

  it('returns error if quantity is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        ndc: ndcMock,
        supply: supplyMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.QUERYSTRING_INVALID
    );
    expect(actual).toEqual(expected);
    expect(getGeolocationByZipMock).not.toBeCalled();
  });

  it('Return error if api return error', async () => {
    const responseMock = {} as Response;

    const expected = {};
    getPharmaciesAndPricesForNdcMock.mockRejectedValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
      },
    } as unknown as Request;
    getGeolocationByZipMock.mockReturnValueOnce(locationCoordinatesMock);
    try {
      await searchPharmacyDrugPriceHandler(
        requestMock,
        responseMock,
        configurationMock
      );
    } catch (error) {
      expect(error).toBe(expected);
    }

    expect(unknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      expected
    );
  });

  it('Returns error if no zipcode found', async () => {
    const responseMock = {} as Response;
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        zipcode: '1111',
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
      },
    } as unknown as Request;
    getGeolocationByZipMock.mockReturnValueOnce(undefined);
    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(actual).toBe(expected);
    expect(getPharmaciesAndPricesForNdcMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );
  });

  it('makes expected api request and return response if success when only zipcode is in the request', async () => {
    const sortingAttributeMock = 'distance';
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
      },
    } as unknown as Request;
    getGeolocationByZipMock.mockReturnValueOnce(locationCoordinatesMock);
    getPharmaciesAndPricesForNdcMock.mockResolvedValueOnce(expected);
    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'MOCK-DRUG-SEARCH-MEMBER-ID',
      ApiConstants.CASH_USER_RX_SUB_GROUP,
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      false,
      false
    );
    expect(actual).toBe(expected);
  });

  it('makes expected api request and return response if success when only latitude and longitude is in the request', async () => {
    const sortingAttributeMock = 'distance';
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    getPharmaciesAndPricesForNdcMock.mockResolvedValueOnce(expected);
    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'MOCK-DRUG-SEARCH-MEMBER-ID',
      ApiConstants.CASH_USER_RX_SUB_GROUP,
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      false,
      false
    );
    expect(actual).toBe(expected);
  });

  it('makes expected api request and return response if success for SIE members', async () => {
    const sortingAttributeMock = 'distance';

    const mockPersonList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        address1: 'address',
        state: 'state',
        city: 'city',
        zip: '12345',
      } as IPerson,
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'T1234501',
        identifier: 'identifier2',
        rxSubGroup: 'sub-group',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    getResponseLocalMock.mockReset();
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getResponseLocalMock.mockReturnValueOnce({
      usesieprice: false,
      usecashprice: false,
    });
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    getPharmaciesAndPricesForNdcMock.mockResolvedValueOnce(expected);
    const actual = await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'T1234501',
      'sub-group',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      undefined,
      undefined
    );
    expect(getResponseLocalMock).toBeCalledTimes(2);
    expect(actual).toBe(expected);
  });

  it('uses sie sub group when usersieprice feature flag is set in switches: unauth flow', async () => {
    const sortingAttributeMock = 'distance';
    const switches = '?f=usesieprice:1';
    fetchRequestHeader.mockReturnValueOnce(switches);
    const responseMock = { locals: {} } as unknown as Response;
    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'MOCK-DRUG-SEARCH-MEMBER-ID',
      'HMA01',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      false,
      false
    );
  });

  it('does not uses sie sub group when usersieprice feature flag is set in switches but not in features: auth flow', async () => {
    const sortingAttributeMock = 'distance';
    const switches = '?f=usesieprice:1';
    fetchRequestHeader.mockReturnValueOnce(switches);

    const mockPersonList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        address1: 'address',
        state: 'state',
        city: 'city',
        zip: '12345',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    getResponseLocalMock.mockReset();
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getResponseLocalMock.mockReturnValueOnce({});

    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'id-1',
      'CASH01',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      undefined,
      undefined
    );
  });

  it('Use sie sub group when usersieprice feature flag is passed in features irrespective of user membership: auth flow', async () => {
    const sortingAttributeMock = 'distance';

    const mockPersonList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        address1: 'address',
        state: 'state',
        city: 'city',
        zip: '12345',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    getResponseLocalMock.mockReset();
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getResponseLocalMock.mockReturnValueOnce({
      usesieprice: true,
      usecashprice: false,
    });
    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'id-1',
      'HMA01',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      undefined,
      undefined
    );
  });

  it('Use cash sub group when usercashprice feature flag is passed in features irrespective of user membership: auth flow', async () => {
    const sortingAttributeMock = 'distance';

    const mockPersonList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        address1: 'address',
        state: 'state',
        city: 'city',
        zip: '12345',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    getResponseLocalMock.mockReset();
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getResponseLocalMock.mockReturnValueOnce({
      usesieprice: false,
      usecashprice: true,
    });
    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'id-1',
      'CASH01',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      undefined,
      undefined
    );
  });

  it('Use dual price when useDualPrice feature flag is passed in features but not in switches: auth flow', async () => {
    const sortingAttributeMock = 'distance';

    const mockPersonList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        address1: 'address',
        state: 'state',
        city: 'city',
        zip: '12345',
      } as IPerson,
    ];

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    
    getResponseLocalMock.mockReset();
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getResponseLocalMock.mockReturnValueOnce({
      usesieprice: false,
      usecashprice: false,
      useDualPrice: true,
    });

    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;

    await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'id-1',
      'CASH01',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      true,
      undefined
    );
  });

  it('Use third-party test values when useTestThirdPartyPricing feature flag is set in features: auth flow', async () => {
    const sortingAttributeMock = 'distance';

    const mockPersonList = [
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        identifier: 'identifier',
        address1: 'address',
        state: 'state',
        city: 'city',
        zip: '12345',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    getResponseLocalMock.mockReset();
    getResponseLocalMock.mockReturnValueOnce(mockPersonList);
    getResponseLocalMock.mockReturnValueOnce({
      useTestThirdPartyPricing: true,
    });

    const requestMock = {
      app: {},
      query: {
        ndc: ndcMock,
        supply: supplyMock,
        quantity: quantityMock,
        latitude: latitudeMock,
        longitude: longitudeMock,
      },
    } as unknown as Request;
    await searchPharmacyDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'id-1',
      'CASH01',
      sortingAttributeMock,
      50,
      ndcMock,
      quantityMock,
      supplyMock,
      '1',
      'MOCK-DRUG-SEARCH',
      false,
      false,
      undefined,
      undefined,
      true
    );
  });
});
