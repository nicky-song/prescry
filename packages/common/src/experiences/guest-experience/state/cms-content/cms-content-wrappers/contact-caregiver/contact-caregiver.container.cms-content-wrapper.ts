// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';

import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { IContactCaregiverContainerContent } from '../../../../../../models/cms-content/contact-caregiver.container.content';

export const contactCareGiverCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IContactCaregiverContainerContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.contactCareGiver,
    2
  );

  return {
    title: findContentValue('contact-caregiver-title', uiContent),
    titleDescription: findContentValue(
      'contact-caregiver-title-description',
      uiContent
    ),
    subTitle: findContentValue('contact-caregiver-subtitle', uiContent),
    subItems: [
      {
        id: 'dependents',
        title: findContentValue(
          'contact-caregiver-sub-dependents-title',
          uiContent
        ),
        info: findContentValue(
          'contact-caregiver-sub-dependents-info',
          uiContent
        ),
      },
      {
        id: 'caregivers',
        title: findContentValue(
          'contact-caregiver-sub-caregivers-title',
          uiContent
        ),
        info: findContentValue(
          'contact-caregiver-sub-caregivers-info',
          uiContent
        ),
      },
      {
        id: 'caretip',
        info: findContentValue('contact-caregiver-sub-caretip-info', uiContent),
      },
    ],
    helpLinkTitle: findContentValue(
      'contact-caregiver-help-link-title',
      uiContent
    ),
    helpLinkText: findContentValue(
      'contact-caregiver-help-link-text',
      uiContent
    ),
    helpLinkInfo: findContentValue(
      'contact-caregiver-help-link-info',
      uiContent
    ),
    providedBy: findContentValue('contact-caregiver-provided-by', uiContent),
  };
};
