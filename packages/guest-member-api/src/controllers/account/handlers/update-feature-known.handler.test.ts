// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
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
import { updateFeatureKnownHandler } from './update-feature-known.handler';

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

describe('updateFeatureKnownHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getRequiredResponseLocalMock.mockReturnValue({
      phoneNumber: 'phone-number-mock',
    });
  });

  it('calls publishAccountUpdateMessage with feature known', async () => {
    const responseMock = {} as unknown as Response;

    await updateFeatureKnownHandler(responseMock);

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      isFavoritedPharmaciesFeatureKnown: true,
    });
  });

  it('returns SuccessResponse on publishAccountUpdateMessage success', async () => {
    const responseMock = {} as unknown as Response;

    const response = await updateFeatureKnownHandler(responseMock);

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      isFavoritedPharmaciesFeatureKnown: true,
    });

    expect(successResponseMock).toHaveBeenCalledTimes(1);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.UPDATE_FEATURE_KNOWN_SUCCESS
    );

    expect(response).toEqual(
      successResponseMock(
        responseMock,
        SuccessConstants.UPDATE_FEATURE_KNOWN_SUCCESS
      )
    );
  });

  it('returns UnknownFailureResponse on publishAccountUpdateMessage failure', async () => {
    const responseMock = {} as unknown as Response;

    const errorMock = new Error('error-mock');

    publishAccountUpdateMessageMock.mockImplementation(() => {
      throw errorMock;
    });

    const response = await updateFeatureKnownHandler(responseMock);

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: 'phone-number-mock',
      isFavoritedPharmaciesFeatureKnown: true,
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
