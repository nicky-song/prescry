// Copyright 2021 Prescryptive Health, Inc.

import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getAlternativeDrugPriceByNdcAndNcpdp } from '../../../utils/external-api/get-alternative-drug-price-by-ndc-and-ncpdp';
import { alternativeDrugPriceHandler } from './alternative-drug-price.handler';
import { Request, Response } from 'express';
import { IConfiguration } from '../../../configuration';
import { ErrorConstants } from '../../../constants/response-messages';
import { HttpStatusCodes } from '../../../constants/error-codes';

jest.mock('../../../utils/response-helper');
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const UnknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/request/get-request-query');
const getRequestQueryMock = getRequestQuery as jest.Mock;

jest.mock(
  '../../../utils/external-api/get-alternative-drug-price-by-ndc-and-ncpdp'
);
const getAlternativeDrugPriceByNdcAndNcpdpMock =
  getAlternativeDrugPriceByNdcAndNcpdp as jest.Mock;

const requestMock = {} as Request;
const responseMock = {} as Response;
const configurationMock = {} as IConfiguration;

const ndcMock = 'ndc-mock';
const ncpdpMock = 'ncpdp-mock';

describe('alternativeDrugPriceHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getRequestQueryMock.mockReturnValueOnce(ndcMock);
    getRequestQueryMock.mockReturnValueOnce(ncpdpMock);
  });

  it('gets the ndc and ncpdp from the query params', async () => {
    await alternativeDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(getRequestQueryMock).toHaveBeenCalledTimes(2);

    expect(getRequestQueryMock).toHaveBeenNthCalledWith(1, requestMock, 'ndc');
    expect(getRequestQueryMock).toHaveBeenNthCalledWith(
      2,
      requestMock,
      'ncpdp'
    );
  });

  it.each([
    ['ndc-mock', undefined],
    [undefined, 'ncpdp-mock'],
  ])(
    'returns KnownFailureResponse if no ndc or ncpdp',
    async (ndc: string | undefined, ncpdp: string | undefined) => {
      getRequestQueryMock.mockReset();

      getRequestQueryMock.mockReturnValueOnce(ndc);
      getRequestQueryMock.mockReturnValueOnce(ncpdp);

      await alternativeDrugPriceHandler(
        requestMock,
        responseMock,
        configurationMock
      );

      expect(KnownFailureResponseMock).toHaveBeenCalledTimes(1);
      expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.QUERYSTRING_INVALID
      );

      expect(getAlternativeDrugPriceByNdcAndNcpdpMock).not.toHaveBeenCalled();
    }
  );

  it('calls getAlternativeDrugPriceByNdcAndNcpdp if valid ndc and ncpdp', async () => {
    await alternativeDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(getAlternativeDrugPriceByNdcAndNcpdpMock).toHaveBeenCalledTimes(1);

    expect(getAlternativeDrugPriceByNdcAndNcpdpMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ndcMock,
      ncpdpMock,
      configurationMock
    );
  });

  it('calls UnknownFailureResponse if getAlternativeDrugPriceByNdcAndNcpdp throws error', async () => {
    const errorMock = new Error();

    getAlternativeDrugPriceByNdcAndNcpdpMock.mockImplementation(() => {
      throw errorMock;
    });

    await alternativeDrugPriceHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(UnknownFailureResponseMock).toHaveBeenCalledTimes(1);

    expect(UnknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
  });
});
