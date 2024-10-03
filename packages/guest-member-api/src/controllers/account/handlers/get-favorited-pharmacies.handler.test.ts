// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { IAddress } from '@phx/common/src/models/address';
import { IPrescriptionPharmacy } from '../../../models/platform/pharmacy-lookup.response';
import { getFavoritedPharmaciesHandler } from './get-favorited-pharmacies.handler';
import { getFavoritedPharmaciesByNcpdpList } from '../helpers/get-favorited-pharmacies-by-ncpdp-list';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock('../../../utils/response-helper');
const UnknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const SuccessResponseMock = SuccessResponse as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../account/helpers/get-favorited-pharmacies-by-ncpdp-list');
const getFavoritedPharmaciesByNcpdpListMock =
  getFavoritedPharmaciesByNcpdpList as jest.Mock;

const unknownFailureResponseMock = 'unknown-failure-response-mock';
const ncpdpListMock = ['ncpdp-mock-1', 'ncpdp-mock-2'];

const addressMock: IAddress = {
  city: `city-mock-for-ncpdp-mock`,
  lineOne: `line-one-mock-for-ncpdp-mock`,
  state: `state-mock-for-ncpdp-mock`,
  zip: `zip-mock-for-ncpdp-mock`,
};
const pharmacyDetailsMock: IPrescriptionPharmacy = {
  address: addressMock,
  hours: [],
  name: `name-mock-for-ncpdp-mock`,
  ncpdp: 'ncpdp-mock',
  type: `type-mock-for-ncpdp-mock`,
};

const pharmacyDetailsListMock = [pharmacyDetailsMock, pharmacyDetailsMock];

describe('getFavoritedPharmaciesHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UnknownFailureResponseMock.mockReturnValue(unknownFailureResponseMock);
    getRequiredResponseLocalMock.mockReturnValue({
      favoritedPharmacies: ncpdpListMock,
    });
    getFavoritedPharmaciesByNcpdpListMock.mockResolvedValue(
      pharmacyDetailsListMock
    );
  });

  it('returns getFavoritedPharmaciesByNcpdpList response on success version (version v1)', async () => {
    const responseMock = {} as unknown as Response;
    const requestMock = {} as unknown as Request;

    await getFavoritedPharmaciesHandler(requestMock, responseMock, configurationMock);

    expect(SuccessResponseMock).toHaveBeenCalledTimes(1);
    expect(SuccessResponseMock).toHaveBeenNthCalledWith(1, responseMock, null, {
      favoritedPharmacies: pharmacyDetailsListMock,
    });
  });

  it('returns getFavoritedPharmaciesByNcpdpList response on success (version v2)', async () => {
    getRequiredResponseLocalMock.mockReset();
    getRequiredResponseLocalMock.mockReturnValue({
      userPreferences: {
        features: [],
        notifications: [],
        favorites: [{ type: 'pharmacies', value: ncpdpListMock }],
      },
    });

    const responseMock = {} as unknown as Response;
    const requestMock = {
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as unknown as Request;

    await getFavoritedPharmaciesHandler(requestMock, responseMock, configurationMock);

    expect(SuccessResponseMock).toHaveBeenCalledTimes(1);
    expect(SuccessResponseMock).toHaveBeenNthCalledWith(1, responseMock, null, {
      favoritedPharmacies: pharmacyDetailsListMock,
    });
  });

  it.each([[undefined], [[]]])(
    'returns [] if invalid ncpdpList: %s',
    async (invalidNcpdpListMock: string[] | undefined) => {
      getRequiredResponseLocalMock.mockReset();
      getRequiredResponseLocalMock.mockReturnValue({
        favoritedPharmacies: invalidNcpdpListMock,
      });

      const responseMock = {} as unknown as Response;
      const requestMock = {} as unknown as Request;

      await getFavoritedPharmaciesHandler(
        requestMock,
        responseMock,
        configurationMock,
      );

      expect(SuccessResponseMock).toHaveBeenCalledTimes(1);
      expect(SuccessResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        null,
        {
          favoritedPharmacies: [],
        }
      );
    }
  );

  it('returns UnknownFailureResponse if getFavoritedPharmaciesByNcpdpList throws error', async () => {
    const errorMock = new Error('error-mock');
    getFavoritedPharmaciesByNcpdpListMock.mockReset();
    getFavoritedPharmaciesByNcpdpListMock.mockImplementation(() => {
      throw errorMock;
    });

    const responseMock = {} as unknown as Response;
    const requestMock = {} as unknown as Request;

    const pharmacyDetailsListResponse = await getFavoritedPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(pharmacyDetailsListResponse).toEqual(unknownFailureResponseMock);

    expect(UnknownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(UnknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
  });
});
