// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { ISwitchYourMedicationSlideUpModalContent } from './switch-your-medication.slide-up-modal.content';

export const switchYourMedicationSlideUpModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISwitchYourMedicationSlideUpModalContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.switchYourMedicationSlideUpModal,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    description: findContentValue('description', uiContent),
    genericsHeading: findContentValue('generics-heading', uiContent),
    genericsDescription: findContentValue('generics-description', uiContent),
    therapeuticAlternativesHeading: findContentValue(
      'therapeutic-alternatives-heading',
      uiContent
    ),
    therapeuticAlternativesDescription: findContentValue(
      'therapeutic-alternatives-description',
      uiContent
    ),
    discretionaryAlternativesHeading: findContentValue(
      'discretionary-alternatives-heading',
      uiContent
    ),
    discretionaryAlternativesDescription: findContentValue(
      'discretionary-alternatives-description',
      uiContent
    ),
  };
};
