// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IRecommendedAlternativesScreenContent } from './recommended-alternatives.screen.content';

export const recommendedAlternativesScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IRecommendedAlternativesScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.recommendedAlternatives,
    2
  );

  return {
    title: findContentValue('title', uiContent),
    heading: findContentValue('heading', uiContent),
    learnMoreDescription: findContentValue('learn-more-description', uiContent),
    skipButtonLabel: findContentValue('skip-button-label', uiContent),
  };
};
