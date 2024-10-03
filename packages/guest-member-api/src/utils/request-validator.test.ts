// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validate } from '../utils/request-validator';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const validationResultMock = validationResult as unknown as jest.Mock;

beforeEach(() => {
  validationResultMock.mockReset();
});

const requestMock = {
  body: {
    dateOfBirth: 'April-05-1980',
    firstName: 'John',
    lastName: 'Doe',
    primaryMemberRxId: 'AFT201704071001',
  },
  headers: {
    authorization: 'token',
  },
} as Request;

const routerResponseMock = {} as Response;

const NextMock = jest.fn();

describe('RequestValidator', () => {
  it('Should Call validationResult Once', () => {
    validationResultMock.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });

    validate(requestMock, routerResponseMock, NextMock);

    expect(validationResultMock).toBeCalledTimes(1);
    expect(NextMock).toBeCalledTimes(1);
  });
});
