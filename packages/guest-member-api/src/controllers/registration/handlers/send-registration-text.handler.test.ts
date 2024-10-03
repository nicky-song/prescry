// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessResponse,
  validatePhoneNumberErrorType,
} from '../../../utils/response-helper';
import {
  sendRegistrationTextHandler,
  myPrescryptiveLink,
} from './send-registration-text.handler';
import { IConfiguration } from '../../../configuration';
import { Twilio } from 'twilio';
import { ICMSContentSearchResponse } from '../../../utils/external-api/cms-api-content/get-cms-api-content';
import {
  CmsApiFieldKeysEnum,
  CmsSmsGroupKeysEnum,
  cmsApiValueConstants,
} from '../../../constants/cms-api-constants';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { searchAndCacheCMSContent } from '../../content/helpers/search-and-cache-cms-content';
import { defaultLanguage } from '@phx/common/src/models/language';

jest.mock('../../../utils/response-helper');
jest.mock('../../../constants/response-messages');
jest.mock('../../content/helpers/search-and-cache-cms-content');
const searchAndCacheCMSContentMock = searchAndCacheCMSContent as jest.Mock;
const validatePhoneNumberErrorTypeMock =
  validatePhoneNumberErrorType as jest.Mock;

const twilioMessagingFromPhoneNumber = '+1111111111';
const configurationMock = {
  twilioMessagingFromPhoneNumber,
} as IConfiguration;

const mockNumber = 'phone-number';
const mockLanguage = 'language-mock';
const mockPath = '/';
const requestMock = {
  body: { phoneNumber: mockNumber, language: mockLanguage, path: mockPath },
} as Request;
const successResponseMock = SuccessResponse as jest.Mock;
const responseMock = {} as Response;
const mockCreate = jest.fn();

const twilioClientMock = {
  messages: {
    create: mockCreate,
  },
} as unknown as Twilio;

beforeEach(() => {
  successResponseMock.mockReset();
  validatePhoneNumberErrorTypeMock.mockReset();
  mockCreate.mockReset();
});
describe('sendRegistrationTextHandler', () => {
  it('calls twilio message create after "verifyOneTimePassword" returns approved status then generateDeviceToken, generateTermsAndConditionsAcceptances, searchPersonByPhoneNumber are called', async () => {
    const apiContent: IUICMSResponse = {
      fieldKey: CmsApiFieldKeysEnum.inviteTextMessage,
      groupKey: CmsSmsGroupKeysEnum.myRxApi,
      language: 'language-mock',
      type: 'type-mock',
      value: 'value-mock',
    };
    const searchAndCacheCMSContentMockResponse: ICMSContentSearchResponse = {
      content: [apiContent],
    };
    searchAndCacheCMSContentMock.mockReturnValue(
      searchAndCacheCMSContentMockResponse
    );

    const registrationText = apiContent.value.concat(
      myPrescryptiveLink,
      mockPath
    );
    const twilioResponseMock = {
      body: registrationText,
      from: twilioMessagingFromPhoneNumber,
      to: mockNumber,
    };
    await sendRegistrationTextHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioClientMock
    );
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(twilioResponseMock);
    expect(searchAndCacheCMSContentMock).toHaveBeenCalledWith(
      configurationMock,
      CmsSmsGroupKeysEnum.myRxApi,
      requestMock.body.language
    );
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      'Registration text sent successfully'
    );
  });

  it('registration text sends with backup values when cms content is undefined', async () => {
    const cmsContent = cmsApiValueConstants
      .get(CmsSmsGroupKeysEnum.myRxApi)
      ?.get(CmsApiFieldKeysEnum.inviteTextMessage);
    const registrationText = cmsContent?.concat(myPrescryptiveLink, mockPath);
    const twilioResponseMock = {
      body: registrationText,
      from: twilioMessagingFromPhoneNumber,
      to: mockNumber,
    };
    searchAndCacheCMSContentMock.mockReturnValue({});
    const requestMockNoLang = {
      body: { ...requestMock.body, language: undefined },
    } as Request;
    await sendRegistrationTextHandler(
      requestMockNoLang,
      responseMock,
      configurationMock,
      twilioClientMock
    );
    expect(searchAndCacheCMSContentMock).toHaveBeenCalledWith(
      configurationMock,
      CmsSmsGroupKeysEnum.myRxApi,
      defaultLanguage
    );
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(twilioResponseMock);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      'Registration text sent successfully'
    );
  });
});
