// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { getClaimsYear } from './get-claims-year.helper';
import { getRequestQuery } from './request/get-request-query';
import { KnownFailureResponse } from './response-helper';

jest.mock('./response-helper');
jest.mock('./request/get-request-query');

const routerResponseMock = {} as Response;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

const getRequestQueryMock = getRequestQuery as jest.Mock;
const requestMock = {
  app: {},
  query: {},
  params: {},
} as unknown as Request;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getClaimsAccumulatorsHandler', () => {
  it('returns year when query parameter year is valid', () => {
    getRequestQueryMock.mockReturnValue('2021');

    const result = getClaimsYear(requestMock, routerResponseMock);

    expect(result).toEqual(2021);
  });

  it('returns current year as default when query parameter year is undefined', () => {
    const currentYearMock = new Date().getFullYear();

    getRequestQueryMock.mockReturnValue(undefined);

    getClaimsYear(requestMock, routerResponseMock);

    const result = getClaimsYear(requestMock, routerResponseMock);

    expect(result).toEqual(currentYearMock);
  });

  it('returns failure response from getClaimsAccumulatorsHandler when year format is invalid', () => {
    getRequestQueryMock.mockReturnValue('19 50');

    getClaimsYear(requestMock, routerResponseMock);

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_YEAR_FORMAT
    );
  });
});
