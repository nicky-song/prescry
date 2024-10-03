// Copyright 2021 Prescryptive Health, Inc.

import { call, IApiConfig } from '../../../utils/api.helper';
import { getEndpointRetryPolicy } from '../../../utils/retry-policies/get-endpoint.retry-policy';
import { handleHttpErrors } from './api-v1-helper';
import { getDrugInformation } from './api-v1.get-drug-information';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

const mockResult = {
  drugName: 'Basaglar KwikPen',
  NDC: '00002771501',
  externalLink: 'https://e.lilly/2FMmWRZ',
  videoImage: '',
  videoLink: 'https://e.lilly/3j6MMi1',
};

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    learnMore: '/learn-mores/:id',
  },
};

describe('drugInformation', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });
  it('returns correct response when drug is found with the given ndc', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResult,
      ok: true,
    });
    const ndc = '00002771501';
    const response = await getDrugInformation(mockConfig, ndc);
    expect(response).toEqual(mockResult);
    expect(mockCall).toBeCalledWith(
      'https://localhost:4300/api/learn-mores/00002771501',
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
  });
  it('returns undefined response when drug is not found with the given ndc', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResult,
      ok: false,
    });
    const ndc = '123';
    const response = await getDrugInformation(mockConfig, ndc);
    expect(response).toEqual(undefined);
    expect(mockCall).toBeCalledWith(
      'https://localhost:4300/api/learn-mores/123',
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
  });
});
