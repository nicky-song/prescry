// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  getContent,
  findContentValue,
} from '../../../utils/content/cms-content-wrapper.helper';
import { IContactDoctorContainerContent } from './contact-doctor-container.content';

export const contactDoctorContainerCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IContactDoctorContainerContent => {
  const uiContent = getContent(language, content, CmsGroupKey.contactDoctor, 2);

  return {
    switchYourMedsTitle: findContentValue('switch-your-meds-title', uiContent),
    switchYourMedsDescription: findContentValue(
      'switch-your-meds-description',
      uiContent
    ),
    callNowButtonLabel: findContentValue('call-now-button-label', uiContent),
  };
};
