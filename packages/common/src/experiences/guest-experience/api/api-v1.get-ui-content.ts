// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../models/ui-content';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { convertUIContentToMap } from '../../../utils/cms-content.helper';
import { getEndpointRetryPolicy } from '../../../utils/retry-policies/get-endpoint.retry-policy';
import { ensureGetUIContentResponse } from './ensure-api-response/ensure-get-ui-content-response';
import { GuestExperienceConfig } from '../guest-experience-config';
import { getNewDate } from '../../../utils/date-time/get-new-date';
import { Language } from '../../../models/language';
import {
  CMSExperience,
  CMSExperienceEnum,
} from '../../../models/cms-content/experience.cms-content';
import { CMSContentVersion } from '../../../models/cms-content/content-version';
import { cobrandingKeyPrefix } from '../context-providers/session/ui-content-hooks/use-cobranding-content';
import { buildUrlWithQueryParams } from '../../../utils/api-helpers/build-url-with-queryparams';
export const getUIContent = async (
  config: IApiConfig,
  version?: CMSContentVersion,
  language?: Language,
  groupKey?: string,
  uiCMSContentMap?: Map<string, IUIContentGroup>,
  experience?: CMSExperience
): Promise<Map<string, IUIContentGroup> | undefined> => {
  const versionString = version ? version.toString() : undefined;
  const experienceKey =
    experience ?? groupKey?.startsWith(cobrandingKeyPrefix)
      ? CMSExperienceEnum.MYRX_COBRANDING
      : CMSExperienceEnum.MYRX;
  const queryParams = {
    ...{
      groupKey: groupKey ? groupKey : '',
      language: language ? language : '',
      version: version ? version?.toString() : '1',
      experienceKey,
    },
  };
  const url = buildUrlWithQueryParams(
    buildUrl(config, 'content', {}),
    queryParams
  );
  if (
    !versionString ||
    versionString === '1' ||
    (versionString === '2' &&
      groupKey &&
      language &&
      (!uiCMSContentMap?.get(groupKey) ||
        uiCMSContentMap
          ?.get(groupKey)
          ?.content.filter((x) => x.language === language).length === 0 ||
        getNewDate().getTime() -
          (uiCMSContentMap?.get(groupKey)?.lastUpdated ?? 0) >
          GuestExperienceConfig.cmsRefreshInterval))
  ) {
    const response = await call(
      url,
      undefined,
      'GET',
      undefined,
      getEndpointRetryPolicy
    );
    const responseJson = await response.json();
    const ensuredRes = ensureGetUIContentResponse(responseJson);
    if (response.ok && ensuredRes.data?.length) {
      return convertUIContentToMap(ensuredRes.data, uiCMSContentMap);
    }
  }
  return uiCMSContentMap;
};
