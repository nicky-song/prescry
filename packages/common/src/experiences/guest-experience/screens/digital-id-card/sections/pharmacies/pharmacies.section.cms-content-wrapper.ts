// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { IPharmaciesSectionContent } from './pharmacies.section.content';

export const pharmaciesSectionCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPharmaciesSectionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.pharmaciesSection,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    label: findContentValue('label', uiContent),
    description: findContentValue('description', uiContent),
  };
};
