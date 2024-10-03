// Copyright 2022 Prescryptive Health, Inc.

import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import {
  CMSExperience,
  CMSExperienceEnum,
} from '@phx/common/src/models/cms-content/experience.cms-content';
import { Language } from '@phx/common/src/models/language';
import { getValueFromRedis, RedisKeys } from '../../utils/redis/redis.helper';
import { getCMSContentFromRedis } from './get-cms-content-from-redis';

jest.mock('../../utils/redis/redis.helper');
const getValueFromRedisMock = getValueFromRedis as jest.Mock;

describe('getCMSContentFromRedis', () => {
  it('should call getValueFromRedis with correct parameters for getting content', async () => {
    const groupKeyMock = 'group-key-mock';
    const languageMock = 'language-mock' as Language;
    const versionMock = 0;
    const experienceKeyMock = 'experience-key-mock' as CMSExperience;
    const uiContentMock: IUICMSResponse[] = [
      {
        groupKey: groupKeyMock,
        fieldKey: 'field-key-mock',
        language: languageMock,
        type: 'type-mock',
        value: 'value-mock',
      },
    ];
    getValueFromRedisMock.mockResolvedValueOnce(uiContentMock);
    const content = await getCMSContentFromRedis(
      groupKeyMock,
      languageMock,
      versionMock,
      experienceKeyMock
    );
    expect(getValueFromRedisMock).toHaveBeenCalledWith(
      `${experienceKeyMock}:${groupKeyMock}:${languageMock}:${versionMock}`,
      RedisKeys.CMS_CONTENT_KEY
    );
    expect(content).toEqual(uiContentMock);
  });
  it('should request properly getValueFromRedis with optional parameters for getting content', async () => {
    const groupKeyMock = 'group-key-mock';
    const languageMock = 'language-mock' as Language;
    const uiContentMock: IUICMSResponse[] = [
      {
        groupKey: groupKeyMock,
        fieldKey: 'field-key-mock',
        language: languageMock,
        type: 'type-mock',
        value: 'value-mock',
      },
    ];
    getValueFromRedisMock.mockResolvedValueOnce(uiContentMock);
    const content = await getCMSContentFromRedis(groupKeyMock, languageMock);
    expect(getValueFromRedisMock).toHaveBeenCalledWith(
      `${CMSExperienceEnum.MYRX}:${groupKeyMock}:${languageMock}:${1}`,
      RedisKeys.CMS_CONTENT_KEY
    );
    expect(content).toEqual(uiContentMock);
  });

  it('should return undefined if nothing returns from redis', async () => {
    const groupKeyMock = 'group-key-mock';
    const languageMock = 'language-mock' as Language;
    getValueFromRedisMock.mockResolvedValueOnce(undefined);
    const content = await getCMSContentFromRedis(groupKeyMock, languageMock);
    expect(getValueFromRedisMock).toHaveBeenCalledWith(
      `${CMSExperienceEnum.MYRX}:${groupKeyMock}:${languageMock}:${1}`,
      RedisKeys.CMS_CONTENT_KEY
    );
    expect(content).toEqual(undefined);
  });
});
