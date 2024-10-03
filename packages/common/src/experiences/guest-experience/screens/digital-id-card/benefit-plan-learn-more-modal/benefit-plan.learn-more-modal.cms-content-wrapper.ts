// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IBenefitPlanLearnMoreModalContent } from './benefit-plan.learn-more-modal.content';

export const benefitPlanLearnMoreModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IBenefitPlanLearnMoreModalContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.benefitPlanLearnMoreModal,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    headingOne: findContentValue('heading-one', uiContent),
    descriptionOne: findContentValue('description-one', uiContent),
  };
};
