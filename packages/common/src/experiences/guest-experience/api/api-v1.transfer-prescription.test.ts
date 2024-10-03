// Copyright 2021 Prescryptive Health, Inc.

import { ITransferPrescriptionRequestBody } from '../../../models/api-request-body/transfer-prescription.request-body';
import { call, IApiConfig } from '../../../utils/api.helper';
import { RequestHeaders } from './api-request-headers';
import { handleHttpErrors } from './api-v1-helper';
import { transferPrescription } from './api-v1.transfer-prescription';

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

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    prescriptionTransfer: '/prescription/transfer',
  },
};

const transferPrescriptionRequestBody = {
  sourceNcpdp: 'source-mock-ncpdp',
  destinationNcpdp: 'dest-mock-ncpdp',
  ndc: 'mock-ndc',
  daysSupply: 30,
  quantity: 5,
} as ITransferPrescriptionRequestBody;

const mockResponse = {
  message: 'all good',
  status: 'success',
};

describe('transfer prescription', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await transferPrescription(mockConfig, transferPrescriptionRequestBody);

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}${mockConfig.paths.prescriptionTransfer}`;
    const expectedBody = transferPrescriptionRequestBody;
    const expectedHeaders = {
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      undefined
    );
  });
});
