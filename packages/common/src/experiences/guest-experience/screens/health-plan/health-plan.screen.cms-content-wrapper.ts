// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IHealthPlanScreenContent } from './health-plan.screen.content';

export const healthPlanScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IHealthPlanScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.healthPlanScreen,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    addToWallet: findContentValue('add-to-wallet', uiContent),
    viewPlanAccumulators: findContentValue('view-plan-accumulators', uiContent),
  };
};
