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
import { getSmartPriceUserMembershipHandler } from './get-smart-price-user-membership.handler';

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

const requestMock = {} as Request;
const responseMock = {
  locals: {
    device: {
      data: '111-222-3333',
    },
  },
} as unknown as Response;
const databaseMock = {} as IDatabase;
beforeEach(() => {
  searchSmartPriceUserByPhoneNumberMock.mockReset();
  successResponseMock.mockReset();
});
describe('getSmartPriceUserMembershipHandler', () => {
  it('returns membership details from getSmartPriceUserMembershipHandler when a user with given phone number exists', async () => {
    searchSmartPriceUserByPhoneNumberMock.mockReturnValueOnce({
      primaryMemberFamilyId: 'id',
      primaryMemberPersonCode: '01',
      rxGroup: 'group',
      rxBin: 'bin',
      carrierPCN: 'pcn',
    });
    await getSmartPriceUserMembershipHandler(
      requestMock,
      responseMock,
      databaseMock
    );
    expect(searchSmartPriceUserByPhoneNumberMock).toHaveBeenLastCalledWith(
      databaseMock,
      '111-222-3333'
    );
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      {
        memberId: 'id 01',
        rxGroup: 'group',
        rxBin: 'bin',
        carrierPCN: 'pcn',
      }
    );
  });

  it('returns empty object from getSmartPriceUserMembershipHandler when a user with given phone number does not exist', async () => {
    searchSmartPriceUserByPhoneNumberMock.mockReturnValueOnce(0);
    await getSmartPriceUserMembershipHandler(
      requestMock,
      responseMock,
      databaseMock
    );
    expect(searchSmartPriceUserByPhoneNumberMock).toHaveBeenLastCalledWith(
      databaseMock,
      '111-222-3333'
    );
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.SUCCESS_OK,
      ErrorConstants.SMARTPRICE_USER_DOES_NOT_EXIST
    );
  });

  it('should return error from isRegisteredUserHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    searchSmartPriceUserByPhoneNumberMock.mockImplementation(() => {
      throw error;
    });
    await getSmartPriceUserMembershipHandler(
      requestMock,
      responseMock,
      databaseMock
    );
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
