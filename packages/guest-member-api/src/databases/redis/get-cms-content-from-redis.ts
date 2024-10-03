// Copyright 2022 Prescryptive Health, Inc.

import { getValueFromRedis, RedisKeys } from '../../utils/redis/redis.helper';
import { Language } from '@phx/common/src/models/language';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { CMSExperienceEnum } from '@phx/common/src/models/cms-content/experience.cms-content';

export const getCMSContentFromRedis = (
  groupKey: string,
  language: Language,
  version = 1,
  experienceKey = CMSExperienceEnum.MYRX
): Promise<IUICMSResponse[] | undefined> =>
  getValueFromRedis<IUICMSResponse[] | undefined>(
    `${experienceKey}:${groupKey}:${language}:${version}`,
    RedisKeys.CMS_CONTENT_KEY
  );
