// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { Response } from 'node-fetch';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { gearsAccountAuthPath } from '../../../configuration';
import { IConfirmContactResponse } from './confirm-contact';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { authorizeContact, IAuthorizeContactProps } from './authorize-contact';
import { IContactErrorResponse } from '../../../models/patient-account/auth/contact-error-response';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('authorizeContact', () => {
  const contactValueMock = 'contact-value';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes authorize contact request', async () => {
    const authorizeContactPropsMock: IAuthorizeContactProps = {
      contactType: 'phone',
      contact: contactValueMock,
    };
    const confirmContactResponseMock: IConfirmContactResponse = {
      contactHash: 'contact-hash',
      contactType: 'contact-type',
      lastVerificationInfo: {
        createdOn: 'created-on',
        expiresOn: 'expires-on',
      },
      isVerified: true,
      isDisabled: false,
    };
    const responseMock: Partial<Response> = {
      ok: true,
      json: jest.fn().mockResolvedValue(confirmContactResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    const result = await authorizeContact(
      configurationMock,
      authorizeContactPropsMock
    );

    const sendOTPProps: IAuthorizeContactProps = {
      contactType: authorizeContactPropsMock.contactType,
      contact: contactValueMock,
    };

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountAuthPath}/contact`,
      sendOTPProps,
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      undefined
    );

    expect(result).toEqual(confirmContactResponseMock);
  });

  it('throws exception on failure', async () => {
    const authorizeContactPropsMock: IAuthorizeContactProps = {
      contactType: 'phone',
      contact: contactValueMock,
    };

    const errorMessage = 'error-message';

    const errorResponseMock: IContactErrorResponse = {
      error: errorMessage,
    };

    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      json: jest.fn().mockResolvedValue(errorResponseMock),
    };
    getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

    try {
      await authorizeContact(configurationMock, authorizeContactPropsMock);
      expect.assertions(1);
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});
