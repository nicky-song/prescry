// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { IPrescribersSectionContent } from './prescribers.section.content';

export const prescribersSectionCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescribersSectionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescribersSection,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    labelOne: findContentValue('label-one', uiContent),
    descriptionOne: findContentValue('description-one', uiContent),
    labelTwo: findContentValue('label-two', uiContent),
    descriptionTwo: findContentValue('description-two', uiContent),
  };
};
