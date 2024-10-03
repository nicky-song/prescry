// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { IAccumulatorProgressBarContent } from './accumulator.progress-bar.content';

export const accumulatorProgressBarCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IAccumulatorProgressBarContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.accumulatorProgressBar,
    2
  );

  return {
    maxValueLabel: findContentValue('max-value-label', uiContent),
    maxProgressLabel: findContentValue('max-progress-label', uiContent),
    minProgressLabel: findContentValue('min-progress-label', uiContent),
    infoButtonLabel: findContentValue('info-button-label', uiContent),
  };
};
