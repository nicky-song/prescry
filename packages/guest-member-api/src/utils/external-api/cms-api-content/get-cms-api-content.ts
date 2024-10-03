// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { getDataFromUrl } from '../../get-data-from-url';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { IUICMSResponse } from '@phx/common/src/models/api-response/ui-content-response';
import { IPlatformApiError } from '../../../models/platform/platform-api-error.response';
import { CMSExperienceEnum } from '@phx/common/src/models/cms-content/experience.cms-content';

export interface ICMSContentSearchResponse {
  content?: IUICMSResponse[];
  errorCode?: number;
  message?: string;
}

export async function getCMSApiContent(
  groupKey: string,
  configuration: IConfiguration,
  language: string,
  version = 1,
  experienceKey = CMSExperienceEnum.MYRX
): Promise<ICMSContentSearchResponse> {
  const retrieveCMSData = async () => {
    return await getDataFromUrl(
      buildCMSApiContentUrl(
        configuration.contentApiUrl,
        groupKey,
        experienceKey,
        language,
        version.toString()
      ),
      undefined,
      'GET',
      undefined,
      undefined,
      undefined,
      defaultRetryPolicy
    );
  };
  const apiResponse = await retrieveCMSData();
  if (apiResponse.ok) {
    const strapiResponse: IUICMSResponse[] = await apiResponse.json();
    return { content: strapiResponse };
  }
  const error: IPlatformApiError = await apiResponse.json();

  return { errorCode: apiResponse.status, message: error.title };
}

export function buildCMSApiContentUrl(
  contentApi: string,
  groupKey: string,
  experienceKey: string,
  language: string,
  version?: string
) {
  return `${contentApi}/ui-content?ExperienceKey=${experienceKey}&Version=${
    version ?? '1'
  }&Language=${language}&GroupKey.GroupKey_in=${groupKey}`;
}
