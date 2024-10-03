// Copyright 2022 Prescryptive Health, Inc.

import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import {
  CMSExperience,
  CMSExperienceEnum,
} from '@phx/common/src/models/cms-content/experience.cms-content';
import { Language } from '@phx/common/src/models/language';
import { addKeyInRedis, RedisKeys } from '../../utils/redis/redis.helper';
import { addCMSContentToRedis } from './add-cms-content-to-redis';

jest.mock('../../utils/redis/redis.helper');
const addKeyInRedisMock = addKeyInRedis as jest.Mock;

describe('addCMSContentToRedis', () => {
  it('should call addKeyInRedis with correct parameters for getting content', async () => {
    const expiryTimeMock = 1800;
    const groupKeyMock = 'group-key-mock';
    const languageMock = 'language-mock' as Language;
    const mockContent: IUICMSResponse[] = [
      {
        fieldKey: 'field-key-mock',
        groupKey: groupKeyMock,
        language: languageMock,
        type: 'type-mock',
        value: 'value-mock',
      },
    ];
    const cmsContent = {
      experienceKey: 'experience-key-mock' as CMSExperience,
      groupKey: groupKeyMock,
      language: languageMock,
      version: 1,
    };
    await addCMSContentToRedis(
      cmsContent.groupKey,
      cmsContent.language,
      mockContent,
      expiryTimeMock,
      cmsContent.version,
      cmsContent.experienceKey
    );
    expect(addKeyInRedisMock).toHaveBeenCalledWith(
      `${cmsContent.experienceKey}:${cmsContent.groupKey}:${cmsContent.language}:${cmsContent.version}`,
      mockContent,
      expiryTimeMock,
      RedisKeys.CMS_CONTENT_KEY
    );
  });
  it('should call addKeyInRedis with default parameters for getting content', async () => {
    const expiryTimeMock = 1800;
    const groupKeyMock = 'group-key-mock';
    const languageMock = 'language-mock' as Language;
    const defaultVersion = 1;
    const defaultExperienceKey = CMSExperienceEnum.MYRX;
    const mockContent: IUICMSResponse[] = [
      {
        fieldKey: 'field-key-mock',
        groupKey: groupKeyMock,
        language: languageMock,
        type: 'type-mock',
        value: 'value-mock',
      },
    ];
    const cmsContent = {
      groupKey: groupKeyMock,
      language: languageMock,
    };
    await addCMSContentToRedis(
      cmsContent.groupKey,
      cmsContent.language,
      mockContent,
      expiryTimeMock
    );
    expect(addKeyInRedisMock).toHaveBeenCalledWith(
      `${defaultExperienceKey}:${cmsContent.groupKey}:${cmsContent.language}:${defaultVersion}`,
      mockContent,
      expiryTimeMock,
      RedisKeys.CMS_CONTENT_KEY
    );
  });
});
