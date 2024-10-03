// Copyright 2022 Prescryptive Health, Inc.

import { addKeyInRedis, RedisKeys } from '../../utils/redis/redis.helper';
import { Language } from '@phx/common/src/models/language';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { CMSExperienceEnum } from '@phx/common/src/models/cms-content/experience.cms-content';

export const addCMSContentToRedis = (
  groupKey: string,
  language: Language,
  data: IUICMSResponse[],
  expiryTime: number,
  version = 1,
  experienceKey = CMSExperienceEnum.MYRX
) =>
  addKeyInRedis<IUICMSResponse[]>(
    `${experienceKey}:${groupKey}:${language}:${version}`,
    data,
    expiryTime,
    RedisKeys.CMS_CONTENT_KEY
  );
