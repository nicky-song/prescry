// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import { searchSmartPriceUserByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { isRegisteredUserHandler } from './is-registered-user.handler';

jest.mock('../../../utils/response-helper');
jest.mock('../../../constants/response-messages');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
jest.mock('../../../utils/person/person-helper');
jest.mock(
  '../../../databases/mongo-database/v1/query-helper/person-collection-helper'
);
const searchSmartPriceUserByPhoneNumberMock =
  searchSmartPriceUserByPhoneNumber as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const responseMock = {
  locals: {
    device: {
      data: '111-222-3333',
    },
  },
} as unknown as Response;
const requestMock = {} as Request;
const databaseMock = {} as IDatabase;
beforeEach(() => {
  searchSmartPriceUserByPhoneNumberMock.mockReset();
  successResponseMock.mockReset();
});
describe('isRegisteredUserHandler', () => {
  it('returns true from isRegisteredUserHandler when a user with given phone number exists', async () => {
    searchSmartPriceUserByPhoneNumberMock.mockReturnValueOnce(1);
    await isRegisteredUserHandler(requestMock, responseMock, databaseMock);
    expect(searchSmartPriceUserByPhoneNumberMock).toHaveBeenLastCalledWith(
      databaseMock,
      '111-222-3333'
    );
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      true
    );
  });

  it('returns false from isRegisteredUserHandler when a user with given phone number does not exist', async () => {
    searchSmartPriceUserByPhoneNumberMock.mockReturnValueOnce(null);
    await isRegisteredUserHandler(requestMock, responseMock, databaseMock);
    expect(searchSmartPriceUserByPhoneNumberMock).toHaveBeenLastCalledWith(
      databaseMock,
      '111-222-3333'
    );
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      false
    );
  });

  it('should return error from isRegisteredUserHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    searchSmartPriceUserByPhoneNumberMock.mockImplementation(() => {
      throw error;
    });
    await isRegisteredUserHandler(requestMock, responseMock, databaseMock);
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
