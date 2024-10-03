// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IFindPharmacyContent } from './find-your-pharmacy.screen.content';

export const findYourPharmacyContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IFindPharmacyContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.findYourPharmacy,
    2
  );

  return {
    placeholder: findContentValue('place-holder-label', uiContent),
    searchresults: findContentValue('search-results-label', uiContent),
    header: findContentValue('header-label', uiContent),
    subHeader: findContentValue('sub-header-label', uiContent),
    displayMore: findContentValue('display-more-label', uiContent),
    backToTheTop: findContentValue('back-to-the-top-label', uiContent),
  };
};
