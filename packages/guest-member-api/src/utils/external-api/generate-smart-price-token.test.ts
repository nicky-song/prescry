// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../get-data-from-url';

import {
  generateSmartPriceToken,
  IContentManagementTokenErrorResponse,
} from './generate-smart-price-token';

jest.mock('../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const userMock = 'username';
const pwdMock = 'pwd';
const urlMock = 'content-api-url';

describe('generateSmartPriceToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return error if api return error', async () => {
    const mockError: IContentManagementTokenErrorResponse = {
      statusCode: 400,
      error: 'Bad Request',
      message: [
        {
          messages: [
            {
              id: 'Auth.form.error.invalid',
              message: 'Identifier or password invalid.',
            },
          ],
        },
      ],
      data: [
        {
          messages: [
            {
              id: 'Auth.form.error.invalid',
              message: 'Identifier or password invalid.',
            },
          ],
        },
      ],
    };

    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });

    try {
      await generateSmartPriceToken(urlMock, userMock, pwdMock);
    } catch (error) {
      expect(error).toEqual(new Error(JSON.stringify(mockError)));
    }
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/auth/local',
      {
        identifier: userMock,
        password: pwdMock,
      },
      'POST',
      undefined,
      false,
      undefined,
      { pause: 2000, remaining: 3 }
    );
  });

  it('Return token if api return success', async () => {
    const tokenMock = 'token';
    const mockTokenResponse = {
      jwt: tokenMock,
    };

    getDataFromUrlMock.mockResolvedValue({
      json: () => mockTokenResponse,
      ok: true,
      status: 200,
    });
    const actual = await generateSmartPriceToken(urlMock, userMock, pwdMock);
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/auth/local',
      {
        identifier: userMock,
        password: pwdMock,
      },
      'POST',
      undefined,
      false,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    expect(actual).toEqual(tokenMock);
  });
});
