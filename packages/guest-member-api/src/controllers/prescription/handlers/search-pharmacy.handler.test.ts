// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { searchPharmacyHandler } from './search-pharmacy.handler';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { IPerson } from '@phx/common/src/models/person';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  isMasterIdValidForUserAndDependents,
  isMemberIdValidForUserAndDependents,
} from '../../../utils/person/get-dependent-person.helper';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../helpers/get-prescription-by-id';
import { searchPharmaciesAndPrices } from '../helpers/search-pharmacies-and-prices';
import { buildUpdatePrescriptionParams } from '../helpers/build-update-prescription-params';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  prescriptionBlockchainFhirMock,
  prescriptionBlockchainNoMasterIdFhirMock,
  prescriptionFhirMock,
  prescriptionFhirMockNoZip,
  prescriptionFhirWithoutMemberIdMock,
} from '../mock/get-mock-fhir-object';
import { searchPharmaciesAndPricesBlockchain } from '../helpers/search-pharmacies-and-prices-blockchain';
import { IFhir } from '../../../models/fhir/fhir';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { getPersonForBlockchainPrescription } from '../../../utils/get-person-for-blockchain-prescription.helper';
import * as FetchRequestHeader from '../../../utils/request-helper';


jest.mock('../../../utils/response-helper');
jest.mock('../helpers/get-prescription-by-id');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../helpers/search-pharmacies-and-prices');
jest.mock('../../../utils/request-helper');

const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;
const getPrescriptionByIdMock = getPrescriptionById as jest.Mock;
const isMemberIdValidForUserAndDependentsMock =
  isMemberIdValidForUserAndDependents as jest.Mock;
const isMasterIdValidForUserAndDependentsMock =
  isMasterIdValidForUserAndDependents as jest.Mock;
const searchPharmaciesAndPricesMock = searchPharmaciesAndPrices as jest.Mock;

const fetchRequestHeader = jest.spyOn(FetchRequestHeader, 'fetchRequestHeader');

jest.mock('../helpers/build-update-prescription-params');
const buildUpdatePrescriptionParamsMock =
  buildUpdatePrescriptionParams as jest.Mock;

jest.mock('../helpers/search-pharmacies-and-prices-blockchain');
const searchPharmaciesAndPricesBlockchainMock =
  searchPharmaciesAndPricesBlockchain as jest.Mock;

jest.mock('../helpers/get-prescription-info-for-smart-contract-address.helper');
const getPrescriptionInfoForSmartContractAddressMock =
  getPrescriptionInfoForSmartContractAddress as jest.Mock;

jest.mock('../../../utils/get-person-for-blockchain-prescription.helper');
const getPersonForBlockchainPrescriptionMock =
  getPersonForBlockchainPrescription as jest.Mock;

const mockPharmacyLookupResponse: IPrescriptionPharmacy[] = [
  {
    address: {
      city: 'BELLEVUE',
      distance: '5',
      lineOne: '10116 NE 8TH STREET',
      lineTwo: '',
      state: 'WA',
      zip: '98004',
    },
    email: 'RX40@BARTELLDRUGS.COM',
    hasDriveThru: false,
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
    ncpdp: '4902234',
    phone: '4254542468',
    type: 'retail',
  },
  {
    address: {
      city: 'BELLEVUE',
      distance: '10',
      lineOne: '120 106TH AVENUE NORTHEAST',
      lineTwo: '',
      state: 'WA',
      zip: '98004',
    },
    email: '',
    hasDriveThru: false,
    hours: [
      {
        closes: {
          hours: 6,
          minutes: 0,
          pm: true,
        },
        day: 'Sun',
        opens: {
          hours: 10,
          minutes: 0,
          pm: false,
        },
      },
      {
        closes: {
          hours: 8,
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
          hours: 8,
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
          hours: 8,
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
          hours: 8,
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
          hours: 8,
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
          hours: 6,
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
    name: 'RITE AID PHARMACY # 05176',
    ncpdp: '4921575',
    phone: '4254546513',
    type: 'retail',
  },
];

const zipCodeMock = '12345';
const latitudeMock = 42.833261;
const longitudeMock = -74.058015;
const radiusMileMock = 25;

describe('searchPharmacyHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fetchRequestHeader.mockReturnValue(undefined);

    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
      useDualPrice: false,
      useTestThirdPartyPricing: false,
    });
  });

  it('returns error if neither zipcode nor latitude and longitude is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {},
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPrescriptionByIdMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      'Invalid query'
    );
    expect(actual).toEqual(expected);
  });

  it('returns error if prescription id is not passed in query string', async () => {
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {},
    } as unknown as Request;
    const responseMock = {} as Response;

    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPrescriptionByIdMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      'Prescription ID is required in the request'
    );
    expect(actual).toEqual(expected);
  });

  it('returns error if no membership found for logged in user', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    getResponseLocalMock.mockReturnValue(undefined);
    const expected = {};
    knownFailureResponseMock.mockReturnValueOnce(expected);

    const actual = await searchPharmacyHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPrescriptionByIdMock).not.toHaveBeenCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      'No membership exists for logged in user'
    );
    expect(actual).toEqual(expected);
  });

  it('Return error if api return error', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockError = {
      title: 'One or more validation errors occurred.',
      status: 400,
    };
    const mockPersonList = [{} as IPerson];
    const expected = {};
    getResponseLocalMock.mockReturnValue(mockPersonList);
    knownFailureResponseMock.mockReturnValueOnce(expected);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });

    const actual = await searchPharmacyHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      500,
      'Internal Server Error'
    );
    expect(actual).toEqual(expected);
  });

  it('Returns error if no prescription found', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const error = { message: 'internal error' };
    const mockPersonList = [{} as IPerson];
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPrescriptionByIdMock.mockReturnValueOnce({
      errorCode: ErrorConstants.INTERNAL_SERVER_ERROR,
      message: error,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('Returns error if no patient found in prescription', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [{} as IPerson];
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: { entry: [] },
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NO_PATIENT_FOUND_PRESCRIPTION
    );
  });

  it('Returns error if patient exists but no patient id found in prescription and prescription phone does not match user phone', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [{} as IPerson];
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    getRequiredResponseLocalMock
      .mockReturnValueOnce({
        usesieprice: false,
        usecashprice: false,
      })
      .mockReturnValueOnce({
        data: '+1PHONE',
      });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH
    );
    expect(buildUpdatePrescriptionParamsMock).not.toBeCalled();
  });

  it.each([
    [false, true],
    [true, false],
  ])(
    'Returns success if patient does not have id but user info match with prescription info when identifier comes from (query: %p) (param: %p)',
    async (isQuery: boolean, isParam: boolean) => {
      const prescriptionIdMock = 'prescription-id';
      const requestMock = {
        app: {},
        query: {
          zipcode: zipCodeMock,
          identifier: isQuery ? prescriptionIdMock : undefined,
        },
        params: {
          identifier: isParam ? prescriptionIdMock : undefined,
        },
      } as unknown as Request;
      const responseMock = {} as Response;
      const mockPersonList = [{} as IPerson];
      getResponseLocalMock.mockReturnValue(mockPersonList);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: prescriptionFhirWithoutMemberIdMock,
      });
      getRequiredResponseLocalMock
        .mockReturnValueOnce({
          usesieprice: false,
          usecashprice: false,
        })
        .mockReturnValueOnce({
          data: '+11111111111',
        });
      const paramsMock = {
        clientPatientId: '',
        rxNo: 'MOCK-RXNUMBER',
        pharmacyManagementSystemPatientId: 'PRIMERX-ID',
        refillNo: 0,
      };
      buildUpdatePrescriptionParamsMock.mockReturnValueOnce(paramsMock);
      await searchPharmacyHandler(requestMock, responseMock, configurationMock);
      expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
        prescriptionIdMock,
        configurationMock
      );
      expect(buildUpdatePrescriptionParamsMock).toBeCalledWith(
        prescriptionFhirWithoutMemberIdMock,
        mockPersonList
      );
      expect(knownFailureResponseMock).toBeCalledWith(
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.PRESCRIPTION_UPDATE_MEMBERID_MISSING
      );
    }
  );

  it('returns error from searchPharmacyHandler if any exception occurs', async () => {
    const prescriptionId = 'id-1';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionId,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        primaryMemberFamilyId: 'family-id-mock',
        rxSubGroup: 'sub-group-mock',
      } as IPerson,
    ];
    getResponseLocalMock.mockReturnValue(mockPersonList);

    const error = { message: 'internal error' };
    const expected = {} as Response;
    unknownFailureResponseMock.mockReturnValueOnce(expected);
    getPrescriptionByIdMock.mockImplementation(() => {
      throw error;
    });

    await searchPharmacyHandler(requestMock, responseMock, configurationMock);

    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionId,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).not.toHaveBeenCalled();
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('Returns success if patient does not have id but user info match with prescription info', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
      } as IPerson,
    ];
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    getRequiredResponseLocalMock
      .mockReturnValueOnce({
        usesieprice: false,
        usecashprice: false,
      })
      .mockReturnValueOnce({ data: '+11111111111' });
    const paramsMock = {
      clientPatientId: 'id-1',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    buildUpdatePrescriptionParamsMock.mockReturnValueOnce(paramsMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(buildUpdatePrescriptionParamsMock).toBeCalledWith(
      prescriptionFhirWithoutMemberIdMock,
      mockPersonList
    );
    expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'id-1'
    );
    expect(searchPharmaciesAndPricesMock).toBeCalled();
  });
  it('Returns error if no zipcode found', async () => {
    const prescriptionIdMock = 'prescription-id';
    const requestMock = {
      app: {},
      query: {
        zipcode: '11111',
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      400,
      ErrorConstants.INVALID_ZIPCODE_SEARCH
    );
  });

  it('makes expected api request and return response if success when only zipcode is in the request', async () => {
    const prescriptionIdMock = 'prescription-id';
    const sortingAttributeMock = 'distance';
    const limitMock = 20;
    const prescriptionMock = {
      prescription: {
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'member-id',
            },
          },
        ],
      },
    };
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        sortby: sortingAttributeMock,
        limit: limitMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      {
        primaryMemberRxId: 'member-id',
        rxGroup: 'rx-group',
        rxSubGroup: 'sub-group',
        primaryMemberFamilyId: 'family-id',
      } as IPerson,
    ];
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
      usertpb: true,
    });

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockPharmacyLookupResponse,
      ok: true,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).toBeCalledWith(
      responseMock,
      prescriptionMock.prescription,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'member-id',
      'sub-group',
      sortingAttributeMock,
      limitMock,
      true,
      undefined,
      undefined
    );
  });

  it('makes expected api request and return response if success when only latitude and longitude is in the request', async () => {
    const prescriptionIdMock = 'prescription-id';
    const sortingAttributeMock = 'distance';
    const limitMock = 20;
    const prescriptionMock = {
      prescription: {
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'member-id',
            },
          },
        ],
      },
    };
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
        longitude: longitudeMock,
        sortby: sortingAttributeMock,
        limit: limitMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      { primaryMemberRxId: 'member-id', rxSubGroup: 'SOMEGROUP' } as IPerson,
    ];
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
      usertpb: true,
    });

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockPharmacyLookupResponse,
      ok: true,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).toBeCalledWith(
      responseMock,
      prescriptionMock.prescription,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'member-id',
      'SOMEGROUP',
      sortingAttributeMock,
      limitMock,
      true,
      undefined,
      undefined
    );
  });

  it('uses cash subgroup if usecashprice feature flag is set in request', async () => {
    const prescriptionIdMock = 'prescription-id';
    const sortingAttributeMock = 'distance';
    const limitMock = 20;
    const prescriptionMock = {
      prescription: {
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'member-id',
            },
          },
        ],
      },
    };
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
        longitude: longitudeMock,
        sortby: sortingAttributeMock,
        limit: limitMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      { primaryMemberRxId: 'member-id', rxSubGroup: 'SOMEGROUP' } as IPerson,
    ];

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: true,
      usertpb: true,
    });
    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockPharmacyLookupResponse,
      ok: true,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).toBeCalledWith(
      responseMock,
      prescriptionMock.prescription,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'member-id',
      'CASH01',
      sortingAttributeMock,
      limitMock,
      true,
      undefined,
      undefined
    );
  });

  it('uses pbm subgroup if usesieprice feature flag is set in request', async () => {
    const prescriptionIdMock = 'prescription-id';
    const sortingAttributeMock = 'distance';
    const limitMock = 20;
    const prescriptionMock = {
      prescription: {
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'member-id',
            },
          },
        ],
      },
    };
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
        longitude: longitudeMock,
        sortby: sortingAttributeMock,
        limit: limitMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      { primaryMemberRxId: 'member-id', rxSubGroup: 'SOMEGROUP' } as IPerson,
    ];

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: true,
      usecashprice: false,
      usertpb: true,
    });
    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockPharmacyLookupResponse,
      ok: true,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).toBeCalledWith(
      responseMock,
      prescriptionMock.prescription,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'member-id',
      'HMA01',
      sortingAttributeMock,
      limitMock,
      true,
      undefined,
      undefined
    );
  });

  it('uses dual price if useDualPrice feature flag is set', async () => {
    const prescriptionIdMock = 'prescription-id';
    const sortingAttributeMock = 'distance';
    const limitMock = 20;
    const prescriptionMock = {
      prescription: {
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'member-id',
            },
          },
        ],
      },
    };
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
        longitude: longitudeMock,
        sortby: sortingAttributeMock,
        limit: limitMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const mockPerson = {
      primaryMemberRxId: 'member-id',
      rxSubGroup: 'SOMEGROUP'
    } as IPerson;
    const mockPersonList = [
      mockPerson,
    ];

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
      usertpb: false,
      useDualPrice: true,
    });
    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockPharmacyLookupResponse,
      ok: true,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).toBeCalledWith(
      responseMock,
      prescriptionMock.prescription,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      mockPerson.primaryMemberRxId,
      mockPerson.rxSubGroup,
      sortingAttributeMock,
      limitMock,
      false,
      true,
      undefined
    );
  });

  it('uses third-party test values if useTestThirdPartyPricing feature flag is set', async () => {
    const prescriptionIdMock = 'prescription-id';
    const sortingAttributeMock = 'distance';
    const limitMock = 20;
    const prescriptionMock = {
      prescription: {
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'member-id',
            },
          },
        ],
      },
    };
    const requestMock = {
      app: {},
      query: {
        latitude: latitudeMock,
        longitude: longitudeMock,
        sortby: sortingAttributeMock,
        limit: limitMock,
      },
      params: {
        identifier: prescriptionIdMock,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const mockPerson = {
      primaryMemberRxId: 'member-id',
      rxSubGroup: 'SOMEGROUP'
    } as IPerson;
    const mockPersonList = [
      mockPerson,
    ];

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
      usertpb: false,
      useTestThirdPartyPricing: true,
    });
    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getPrescriptionByIdMock.mockResolvedValue({
      json: () => mockPharmacyLookupResponse,
      ok: true,
    });
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);
    expect(getPrescriptionByIdMock).toHaveBeenLastCalledWith(
      prescriptionIdMock,
      configurationMock
    );
    expect(searchPharmaciesAndPricesMock).toBeCalledWith(
      responseMock,
      prescriptionMock.prescription,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      mockPerson.primaryMemberRxId,
      mockPerson.rxSubGroup,
      sortingAttributeMock,
      limitMock,
      false,
      undefined,
      true
    );
  });

  it('Returns failure response when memberId is not valid for person or dependant in prescription', async () => {
    const prescriptionId = 'id-1';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionId,
      },
    } as unknown as Request;
    const responseMock = {} as Response;
    const mockPersonList = [
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'id-1',
        primaryMemberFamilyId: 'family-id-mock',
        rxSubGroup: 'sub-group-mock',
      } as IPerson,
    ];
    getResponseLocalMock.mockReturnValue(mockPersonList);

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionFhirMock,
    };

    getPrescriptionByIdMock.mockReturnValue(prescriptionApiResponseMock);
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(false);

    await searchPharmacyHandler(requestMock, responseMock, configurationMock);

    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);

    expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'MYRX-ID'
    );

    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );

    expect(searchPharmaciesAndPricesMock).not.toHaveBeenCalled();
  });

  it.each([
    ['mock', prescriptionFhirMock],
    ['mock-zip', prescriptionFhirMockNoZip],
  ])(
    'Returns success for %p prescriptions id',
    async (prescriptionIdMock: string, prescriptionFhirMock: IFhir) => {
      const requestMock = {
        app: {},
        query: {
          zipcode: zipCodeMock,
        },
        params: {
          identifier: prescriptionIdMock,
        },
      } as unknown as Request;
      const responseMock = {} as Response;
      const mockPersonList = [
        {
          rxGroupType: 'SIE',
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '01/01/2000',
          primaryMemberRxId: 'id-1',
        } as IPerson,
      ];
      getResponseLocalMock.mockReturnValue(mockPersonList);
      getPrescriptionByIdMock.mockReturnValueOnce({
        prescription: prescriptionFhirMock,
      });
      getRequiredResponseLocalMock
        .mockReturnValueOnce({
          usesieprice: false,
          usecashprice: false,
        })
        .mockReturnValueOnce({
          data: '+11111111111',
        });
      const paramsMock = {
        clientPatientId: 'id-1',
        rxNo: 'MOCK-RXNUMBER',
        pharmacyManagementSystemPatientId: 'PRIMERX-ID',
        refillNo: 0,
      };
      buildUpdatePrescriptionParamsMock.mockReturnValueOnce(paramsMock);
      isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
      await searchPharmacyHandler(requestMock, responseMock, configurationMock);

      const sortingAttributeMock = 'distance';
      const limitMock = 50;
      expect(searchPharmaciesAndPricesMock).toBeCalledWith(
        responseMock,
        prescriptionFhirMock,
        latitudeMock,
        longitudeMock,
        radiusMileMock,
        configurationMock,
        'MOCK-MYRXID',
        'HMA01',
        sortingAttributeMock,
        limitMock,
        undefined,
        undefined,
        undefined
      );
    }
  );

  it('Returns success for mock blockchain prescriptions id', async () => {
    const prescriptionId = 'mock-blockchain';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
      },
      params: {
        identifier: prescriptionId,
      },
    } as unknown as Request;
    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
    });
    const responseMock = {} as Response;
    await searchPharmacyHandler(requestMock, responseMock, configurationMock);

    const sortingAttributeMock = 'distance';
    const limitMock = 50;
    expect(searchPharmaciesAndPricesBlockchainMock).toBeCalledWith(
      responseMock,
      prescriptionBlockchainFhirMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'MOCK-MYRXID',
      'HMA01',
      sortingAttributeMock,
      limitMock,
      undefined,
      undefined,
      undefined
    );
  });

  it('Returns success for actual blockchain prescription id', async () => {
    const prescriptionId = 'id-1';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        blockchain: true,
      },
      params: {
        identifier: prescriptionId,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const mockPerson = {
      rxGroupType: 'SIE',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      primaryMemberFamilyId: 'family-id-mock',
      rxSubGroup: 'sub-group-mock',
      masterId: 'MYRX-ID',
    } as IPerson;

    const mockPersonList = [mockPerson];
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPersonForBlockchainPrescriptionMock.mockReturnValue(mockPerson);

    getRequiredResponseLocalMock.mockReturnValue({
      usesieprice: false,
      usecashprice: false,
    });

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    isMasterIdValidForUserAndDependentsMock.mockReturnValueOnce(true);

    await searchPharmacyHandler(requestMock, responseMock, configurationMock);

    const sortingAttributeMock = 'distance';
    const limitMock = 50;

    expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
      'id-1',
      configurationMock
    );
    expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'MYRX-ID'
    );

    expect(searchPharmaciesAndPricesBlockchainMock).toBeCalledWith(
      responseMock,
      prescriptionBlockchainFhirMock,
      latitudeMock,
      longitudeMock,
      radiusMileMock,
      configurationMock,
      'id-1',
      'sub-group-mock',
      sortingAttributeMock,
      limitMock,
      undefined,
      undefined,
      undefined
    );
  });

  it('Returns failure response when masterId does not exist in blockchain prescription', async () => {
    const prescriptionId = 'id-1';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        blockchain: true,
      },
      params: {
        identifier: prescriptionId,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const masterIdMock = 'MYRX-ID';

    const mockPerson = {
      rxGroupType: 'SIE',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      primaryMemberFamilyId: 'family-id-mock',
      rxSubGroup: 'sub-group-mock',
      masterId: masterIdMock,
    } as IPerson;

    const mockPersonList = [mockPerson];

    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPersonForBlockchainPrescriptionMock.mockReturnValue(mockPerson);

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainNoMasterIdFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    isMasterIdValidForUserAndDependentsMock.mockReturnValueOnce(false);

    await searchPharmacyHandler(requestMock, responseMock, configurationMock);

    expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
      'id-1',
      configurationMock
    );

    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_MASTER_ID_MISSING
    );
    expect(getPersonForBlockchainPrescriptionMock).not.toHaveBeenCalled();
    expect(searchPharmaciesAndPricesBlockchainMock).not.toHaveBeenCalled();
  });

  it('Returns failure response when masterId is not valid for person or dependant in blockchain prescription', async () => {
    const prescriptionId = 'id-1';
    const requestMock = {
      app: {},
      query: {
        zipcode: zipCodeMock,
        blockchain: true,
      },
      params: {
        identifier: prescriptionId,
      },
    } as unknown as Request;
    const responseMock = {} as Response;

    const mockPerson = {
      rxGroupType: 'SIE',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      primaryMemberFamilyId: 'family-id-mock',
      rxSubGroup: 'sub-group-mock',
    } as IPerson;

    const mockPersonList = [mockPerson];
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getPersonForBlockchainPrescriptionMock.mockReturnValue(mockPerson);

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    isMasterIdValidForUserAndDependentsMock.mockReturnValueOnce(false);

    await searchPharmacyHandler(requestMock, responseMock, configurationMock);

    expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
      'id-1',
      configurationMock
    );

    expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'MYRX-ID'
    );

    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
    expect(getPersonForBlockchainPrescriptionMock).not.toBeCalled();
    expect(searchPharmaciesAndPricesBlockchainMock).not.toHaveBeenCalled();
  });
});
