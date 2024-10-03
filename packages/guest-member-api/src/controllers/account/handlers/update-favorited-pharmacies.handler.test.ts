// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { updateFavoritedPharmaciesHandler } from './update-favorited-pharmacies.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';
import { updatePatientAccountFavorites } from '../../../utils/patient-account/update-patient-account-favorites';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock('../../../utils/patient-account/update-patient-account-favorites');
const updatePatientAccountFavoritesMock =
  updatePatientAccountFavorites as jest.Mock;

describe('updateFavoritedPharmaciesHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getRequiredResponseLocalMock.mockReturnValue({
      phoneNumber: 'phone-number-mock',
    });
  });

  it('calls publishAccountUpdateMessage with favorite pharmacies if contains valid ncpdps', async () => {
    const favoritedPharmaciesMock = ['ncpdp'];
    const requestMock = {
      body: {
        favoritedPharmacies: favoritedPharmaciesMock,
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;

    await updateFavoritedPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      favoritedPharmacies: favoritedPharmaciesMock,
      isFavoritedPharmaciesFeatureKnown: true,
      recentlyUpdated: true,
    });
  });

  it('calls publishAccountUpdateMessage with favorite pharmacies if not undefined', async () => {
    const favoritedPharmaciesMock: string[] = [];
    const requestMock = {
      body: {
        favoritedPharmacies: favoritedPharmaciesMock,
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;

    await updateFavoritedPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      favoritedPharmacies: favoritedPharmaciesMock,
      isFavoritedPharmaciesFeatureKnown: true,
      recentlyUpdated: true,
    });
  });

  it('returns SuccessResponse on publishAccountUpdateMessage success', async () => {
    const favoritedPharmaciesMock = ['ncpdp'];
    const requestMock = {
      body: {
        favoritedPharmacies: favoritedPharmaciesMock,
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;

    const response = await updateFavoritedPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      favoritedPharmacies: favoritedPharmaciesMock,
      isFavoritedPharmaciesFeatureKnown: true,
      recentlyUpdated: true,
    });

    expect(successResponseMock).toHaveBeenCalledTimes(1);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.UPDATE_FAVORITED_PHARMACIES_SUCCESS
    );

    expect(response).toEqual(
      successResponseMock(
        responseMock,
        SuccessConstants.UPDATE_FAVORITED_PHARMACIES_SUCCESS
      )
    );
  });
  it('calls updatePatientAccountFavorites with favorite pharmacies if contains valid ncpdps and version is v2', async () => {
    getRequiredResponseLocalMock.mockReturnValue(patientAccountPrimaryMock);
    const favoritedPharmaciesMock = ['ncpdp'];
    const requestMock = {
      body: {
        favoritedPharmacies: favoritedPharmaciesMock,
      },
      headers: {
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;
    await updateFavoritedPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(updatePatientAccountFavoritesMock).toHaveBeenCalledTimes(1);
    expect(updatePatientAccountFavoritesMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      patientAccountPrimaryMock,
      [{ type: 'pharmacies', value: ['ncpdp'] }]
    );
  });
  it('returns UnknownFailureResponse on publishAccountUpdateMessage failure', async () => {
    const favoritedPharmaciesMock = ['ncpdp'];
    const requestMock = {
      body: {
        favoritedPharmacies: favoritedPharmaciesMock,
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;

    const errorMock = new Error('error-mock');

    publishAccountUpdateMessageMock.mockImplementation(() => {
      throw errorMock;
    });

    const response = await updateFavoritedPharmaciesHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      favoritedPharmacies: favoritedPharmaciesMock,
      isFavoritedPharmaciesFeatureKnown: true,
      recentlyUpdated: true,
    });

    expect(unknownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );

    expect(response).toEqual(
      unknownFailureResponseMock(
        responseMock,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        errorMock
      )
    );
  });
});
