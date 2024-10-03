// Copyright 2022 Prescryptive Health, Inc.

import { CMSExperience } from '@phx/common/src/models/cms-content/experience.cms-content';
import { Language } from '@phx/common/src/models/language';
import { addCMSContentToRedis } from '../../../databases/redis/add-cms-content-to-redis';
import { getCMSContentFromRedis } from '../../../databases/redis/get-cms-content-from-redis';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  getCMSApiContent,
  ICMSContentSearchResponse,
} from '../../../utils/external-api/cms-api-content/get-cms-api-content';
import { searchAndCacheCMSContent } from './search-and-cache-cms-content';

jest.mock('../../../utils/external-api/cms-api-content/get-cms-api-content');
const getCMSApiContentMock = getCMSApiContent as jest.Mock;

jest.mock('../../../databases/redis/get-cms-content-from-redis');
const getCMSContentFromRedisMock = getCMSContentFromRedis as jest.Mock;

jest.mock('../../../databases/redis/add-cms-content-to-redis');
const addCMSContenToRedisMock = addCMSContentToRedis as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const groupKeyMock = 'group-key-mock';
const languageMock = 'language-mock' as Language;
const versionMock = 1;
const experienceKeyMock = 'experience-key-mock' as CMSExperience;

describe('searchAndCacheCMSContent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('Return error if api return error', async () => {
    const mockErrorMessage = 'error';
    const expectedCMSContentResponse = {
      errorCode: 400,
      message: mockErrorMessage,
    };
    getCMSApiContentMock.mockResolvedValueOnce(expectedCMSContentResponse);
    const nearbyPharmaciesResponse = await searchAndCacheCMSContent(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getCMSApiContentMock).toHaveBeenCalledWith(
      groupKeyMock,
      configurationMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );

    expect(nearbyPharmaciesResponse).toEqual(expectedCMSContentResponse);
  });

  it('Stores information in redis and returns cms content if api return success', async () => {
    const expectedCMSApiContentResponse: ICMSContentSearchResponse = {
      content: [
        {
          fieldKey: 'field-key-mock',
          groupKey: groupKeyMock,
          language: languageMock,
          type: 'type-mock',
          value: 'value-mock',
        },
      ],
    };
    getCMSApiContentMock.mockResolvedValueOnce(expectedCMSApiContentResponse);
    const foundAndCachedCMSContentResponse = await searchAndCacheCMSContent(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getCMSContentFromRedisMock).toHaveBeenCalledWith(
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getCMSApiContentMock).toHaveBeenCalledWith(
      groupKeyMock,
      configurationMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(addCMSContenToRedisMock).toHaveBeenCalledWith(
      groupKeyMock,
      languageMock,
      expectedCMSApiContentResponse.content,
      configurationMock.redisCMSContentKeyExpiryTime,
      versionMock,
      experienceKeyMock
    );

    expect(foundAndCachedCMSContentResponse).toEqual(
      expectedCMSApiContentResponse
    );
  });

  it('only stores content in redis if there is content returned', async () => {
    const expectedCMSApiContentResponse: ICMSContentSearchResponse = {
      content: [],
    };
    getCMSApiContentMock.mockResolvedValueOnce(expectedCMSApiContentResponse);
    const foundAndCachedCMSContentResponse = await searchAndCacheCMSContent(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getCMSContentFromRedisMock).toHaveBeenCalledWith(
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getCMSApiContentMock).toHaveBeenCalledWith(
      groupKeyMock,
      configurationMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(addCMSContenToRedisMock).not.toHaveBeenCalled();

    expect(foundAndCachedCMSContentResponse).toEqual(
      expectedCMSApiContentResponse
    );
  });

  it('gets and returns content from redis if it exists', async () => {
    const redisResponse = [
      {
        fieldKey: 'field-key-mock',
        groupKey: groupKeyMock,
        language: languageMock,
        type: 'type-mock',
        value: 'value-mock',
      },
    ];
    getCMSContentFromRedisMock.mockResolvedValueOnce(redisResponse);
    const contentFromRedis = await searchAndCacheCMSContent(
      configurationMock,
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getCMSApiContentMock).not.toHaveBeenCalled();
    expect(contentFromRedis).toEqual({ content: redisResponse });
  });
});
