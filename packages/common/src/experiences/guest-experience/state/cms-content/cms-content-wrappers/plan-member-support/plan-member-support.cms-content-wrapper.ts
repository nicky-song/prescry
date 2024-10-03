// Copyright 2022 Prescryptive Health, Inc.

import { IPlanMemberSupportContent } from '../../../../../../models/cms-content/plan-member-support.content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const planMemberSupportCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPlanMemberSupportContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.planMemberSupport
  );

  return {
    title: findContentValue('title', uiContent),
  };
};
