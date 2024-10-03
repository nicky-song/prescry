// Copyright 2021 Prescryptive Health, Inc.

import { CMSContentVersion } from '../../../../../models/cms-content/content-version';
import { CMSExperience } from '../../../../../models/cms-content/experience.cms-content';
import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import { IAsyncActionArgs } from '../../async-action-args';
import { SessionDispatch } from '../../session/dispatch/session.dispatch';
import { getCMSContentDispatch } from '../dispatch/get-cms-content.dispatch';

export interface IGetCMSContentAsyncActionArgs extends IAsyncActionArgs {
  sessionDispatch: SessionDispatch;
  version?: CMSContentVersion | undefined;
  language?: Language | undefined;
  groupKey?: string | undefined;
  uiCMSContentMap?: Map<string, IUIContentGroup> | undefined;
  experience?: CMSExperience;
  cmsRefreshInterval?: number;
}

export const getCMSContentAsyncAction = async (
  args: IGetCMSContentAsyncActionArgs
): Promise<Map<string, IUIContentGroup>> => {
  return (await getCMSContentDispatch(args)) ?? new Map();
};
