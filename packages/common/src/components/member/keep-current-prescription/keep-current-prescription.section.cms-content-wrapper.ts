// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { IKeepCurrentPrescriptionSectionContent } from './keep-current-prescription.section.content';

export const keepCurrentPrescriptionSectionCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IKeepCurrentPrescriptionSectionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.keepCurrentPrescriptionSection,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    description: findContentValue('description', uiContent),
    buttonLabel: findContentValue('button-label', uiContent),
  };
};
