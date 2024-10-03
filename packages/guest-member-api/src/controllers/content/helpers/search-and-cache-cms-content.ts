// Copyright 2022 Prescryptive Health, Inc.

import { CMSExperience } from '@phx/common/src/models/cms-content/experience.cms-content';
import { Language } from '@phx/common/src/models/language';
import { IConfiguration } from '../../../configuration';
import { addCMSContentToRedis } from '../../../databases/redis/add-cms-content-to-redis';
import { getCMSContentFromRedis } from '../../../databases/redis/get-cms-content-from-redis';
import {
  ICMSContentSearchResponse,
  getCMSApiContent,
} from '../../../utils/external-api/cms-api-content/get-cms-api-content';

export async function searchAndCacheCMSContent(
  configuration: IConfiguration,
  groupKey: string,
  language: Language,
  version?: number,
  experienceKey?: CMSExperience
): Promise<ICMSContentSearchResponse> {
  const existingContentInRedis = await getCMSContentFromRedis(
    groupKey,
    language,
    version,
    experienceKey
  );
  if (existingContentInRedis !== undefined)
    return {
      content: existingContentInRedis,
    };
  const cmsResponse = await getCMSApiContent(
    groupKey,
    configuration,
    language,
    version,
    experienceKey
  );
  if (cmsResponse.content?.length) {
    addCMSContentToRedis(
      groupKey,
      language,
      cmsResponse.content,
      configuration.redisCMSContentKeyExpiryTime,
      version,
      experienceKey
    );
  }
  return cmsResponse;
}
