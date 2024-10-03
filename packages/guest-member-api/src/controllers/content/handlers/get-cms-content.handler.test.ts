// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import { getCMSContentHandler } from './get-cms-content.handler';
import { IConfiguration } from '../../../configuration';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { searchAndCacheCMSContent } from '../helpers/search-and-cache-cms-content';

const mockIp = '8.8.8.8';

const requestMock = {
  body: {},
  headers: {
    'x-forwarded-for': mockIp,
  },
} as unknown as Request;
const configurationMock = {} as IConfiguration;

jest.mock('../../../utils/response-helper');
jest.mock('../helpers/search-and-cache-cms-content');
jest.mock('../../../utils/request/get-request-query');

const searchAndCacheCMSContentMock = searchAndCacheCMSContent as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;
const getRequestQueryMock = getRequestQuery as jest.Mock;

const groupKeyMock = 'group-key-mock';
const languageMock = 'language-mock';
const versionMock = 'version-mock';
const experienceKeyMock = 'experience-key-mock';
const mockContent: IUICMSResponse[] = [
  {
    fieldKey: 'field-key-mock',
    groupKey: groupKeyMock,
    language: languageMock,
    type: 'type-mock',
    value: 'value-mock',
  },
];
const responseMock = {} as Response;

describe('getCMSContentHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getRequestQueryMock.mockReturnValueOnce(groupKeyMock);
    getRequestQueryMock.mockReturnValueOnce(languageMock);
    getRequestQueryMock.mockReturnValueOnce(versionMock);
    getRequestQueryMock.mockReturnValueOnce(experienceKeyMock);
  });

  it('should return content with success response if content exists', async () => {
    searchAndCacheCMSContentMock.mockReturnValueOnce({ content: mockContent });
    await getCMSContentHandler(requestMock, responseMock, configurationMock);

    expect(searchAndCacheCMSContentMock).toBeCalledWith(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      mockContent
    );
  });
  it('should return [] with success response if content does not exist but no error code', async () => {
    searchAndCacheCMSContentMock.mockReturnValueOnce({ content: undefined });

    await getCMSContentHandler(requestMock, responseMock, configurationMock);

    expect(searchAndCacheCMSContentMock).toBeCalledWith(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      []
    );
  });

  it('should call KnownFailureResponse if error code', async () => {
    const errorCode = 400;
    searchAndCacheCMSContentMock.mockReturnValueOnce({ errorCode });

    await getCMSContentHandler(requestMock, responseMock, configurationMock);

    expect(searchAndCacheCMSContentMock).toBeCalledWith(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      errorCode,
      ErrorConstants.INTERNAL_SERVER_ERROR
    );
  });

  it('should call KnownFailureResponse with message if error code and message exist', async () => {
    const errorCode = 400;
    const message = 'error-message';
    searchAndCacheCMSContentMock.mockReturnValueOnce({ errorCode, message });

    await getCMSContentHandler(requestMock, responseMock, configurationMock);

    expect(searchAndCacheCMSContentMock).toBeCalledWith(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      errorCode,
      message
    );
  });

  it('should call UnknownFailureResponse if unknown error occurs', async () => {
    const errorMock = new Error('unknown error occured');
    searchAndCacheCMSContentMock.mockImplementation(() => {
      throw errorMock;
    });

    await getCMSContentHandler(requestMock, responseMock, configurationMock);

    expect(unknownResponseMock).toHaveBeenCalled();
    expect(unknownResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
  });
});
