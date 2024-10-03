// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { IConfiguration } from '../../../configuration';
import { IPerson } from '@phx/common/src/models/person';

import { getPrescriptionsByPatientIdHandler } from './get-prescriptions-by-patient-id.handler';
import { IFhir } from '../../../models/fhir/fhir';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import * as FetchRequestHeader from '../../../utils/request-helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
} from '../mock/get-mock-fhir-object';
import { getPrescriptionsEndpointHelper } from '../helpers/get-prescriptions-endpoint.helper';
import { buildPrescriptionsResponse } from '../helpers/build-prescriptions-response';

jest.mock('../../../utils/response-helper');
jest.mock('../helpers/build-prescriptions-response');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../helpers/get-prescriptions-endpoint.helper');

const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const buildPrescriptionsResponseMock = buildPrescriptionsResponse as jest.Mock;
const getPrescriptionsEndpointHelperMock =
  getPrescriptionsEndpointHelper as jest.Mock;
const fetchRequestHeader = jest.spyOn(FetchRequestHeader, 'fetchRequestHeader');

const prescriptionsMock: IFhir[] = [];
prescriptionsMock.push(prescriptionFhirMock);

const configurationMock = {
  platformApiUrl: 'platform-url',
  platformPrescriptionApiHeaderKey: 'platform-header-key',
  platformApiClientId: 'platform-client-id',
  platformApiClientSecret: 'platform-client-secret',
  platformApiResource: 'platform-resource',
  platformApiTenantId: 'platform-tenant-id',
} as IConfiguration;
const mockPersonList = [
  {
    rxGroupType: 'SIE',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
  } as IPerson,
];

const mockFeatures = {
  usetestcabinet: true,
} as IFeaturesState;
beforeEach(() => {
  jest.clearAllMocks();
  fetchRequestHeader.mockReturnValue('');
});

describe('getPrescriptionsByPatientIdHandler', () => {
  it('returns mock prescriptions if usetestcabinet featureflag is set to true and when blockchais is %p', async () => {
    fetchRequestHeader.mockReturnValue('f=usetestcabinet:1');
    const responseMock = {
      locals: { personList: mockPersonList, features: mockFeatures },
    } as unknown as Response;
    const requestMock = {
      app: {},
      params: {},
      query: { page: '1' },
    } as unknown as Request;
    const expected = {} as Response<unknown>;
    getPrescriptionsEndpointHelperMock.mockResolvedValue({
      prescriptions: [],
    });
    buildPrescriptionsResponseMock.mockReturnValue({});
    const actual = await getPrescriptionsByPatientIdHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    const expectedPrescriptions = [
      ...prescriptionsMock,
      prescriptionBlockchainFhirMock,
    ];

    expect(actual).toEqual(expected);
    expect(buildPrescriptionsResponseMock).toHaveBeenCalledWith(
      1,
      responseMock,
      expectedPrescriptions,
      mockPersonList,
      []
    );
  });
  it('returns empty array if user does not have any prescription', async () => {
    const responseMock = {
      locals: { personList: mockPersonList, features: mockFeatures },
    } as unknown as Response;
    const requestMock = {
      app: {},
      params: {},
      query: { page: '1' },
    } as unknown as Request;
    const expected = {};
    getPrescriptionsEndpointHelperMock.mockResolvedValue({
      prescriptions: [],
    });
    buildPrescriptionsResponseMock.mockReturnValue({});
    const actual = await getPrescriptionsByPatientIdHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(getPrescriptionsEndpointHelperMock).toBeCalledWith(
      'id-1',
      configurationMock,
      true
    );
  });

  it('returns error from getPrescriptionsByPatientIdHandler if any exception occurs', async () => {
    const responseMock = {
      locals: { personList: mockPersonList, features: mockFeatures },
    } as unknown as Response;
    const requestMock = {
      app: {},
      params: {},
      query: { page: '1' },
    } as unknown as Request;
    const expected = {};
    unknownFailureResponseMock.mockReturnValueOnce(expected);
    getPrescriptionsEndpointHelperMock.mockImplementation(() => {
      throw {};
    });

    const actual = await getPrescriptionsByPatientIdHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(getPrescriptionsEndpointHelperMock).toBeCalledWith(
      'id-1',
      configurationMock,
      true
    );
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      {} as Error
    );
    expect(buildPrescriptionsResponseMock).not.toBeCalled();
  });

  it('returns error if personList is empty', async () => {
    const responseMock = {
      locals: { features: mockFeatures },
    } as unknown as Response;
    const requestMock = {
      app: {},
      params: {},
      query: { page: '1' },
    } as unknown as Request;
    const expected = {};
    getPrescriptionsEndpointHelperMock.mockResolvedValue({
      prescriptions: [],
    });
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await getPrescriptionsByPatientIdHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NO_MEMBERSHIP_FOUND
    );
  });
});
