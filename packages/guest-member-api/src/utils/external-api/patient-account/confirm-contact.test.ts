// Copyright 2022 Prescryptive Health, Inc.

import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { Response } from 'node-fetch';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { gearsAccountAuthPath } from '../../../configuration';
import {
  confirmContact,
  IConfirmContactProps,
  IConfirmContactResponse,
} from './confirm-contact';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlMock = getDataFromUrlWithAuth0 as jest.Mock;

describe('confirmContact', () => {
  const confirmContactPropsMock: IConfirmContactProps = {
    confirmationCode: 'confirmation-code',
    contactHash: 'contact-hash',
    contactValue: 'contact-value',
    source: 'source',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes confirm contact endpoint request', async () => {
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
    getDataFromUrlMock.mockResolvedValue(responseMock);

    const result = await confirmContact(
      configurationMock,
      confirmContactPropsMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlMock,
      'identity',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsAccountAuthPath}/contact/${confirmContactPropsMock.contactHash}/confirm`,
      confirmContactPropsMock,
      'PUT',
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
    const errorMessage = 'error-message';
    const statusMock = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const responseMock: Partial<Response> = {
      ok: false,
      status: statusMock,
      statusText: errorMessage,
    };
    getDataFromUrlMock.mockResolvedValue(responseMock);

    try {
      await confirmContact(configurationMock, confirmContactPropsMock);
      expect.assertions(1);
    } catch (error) {
      const expectedError = new EndpointError(statusMock, errorMessage);
      expect(error).toEqual(expectedError);
    }
  });
});
