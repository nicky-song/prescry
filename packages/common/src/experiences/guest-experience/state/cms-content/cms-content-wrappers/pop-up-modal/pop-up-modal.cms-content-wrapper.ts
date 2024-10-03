// Copyright 2022 Prescryptive Health, Inc.

import { IPopUpModalContent } from '../../../../../../models/cms-content/pop-up-modal-content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const popUpModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPopUpModalContent => {
  const uiContent = getContent(language, content, CmsGroupKey.popUpModal, 2);

  return {
    leavingTitle: findContentValue('myrx-logo-click-title', uiContent),
    leavingDesc: findContentValue('myrx-logo-click-description', uiContent),
    leavingPrimaryButton: findContentValue('myrx-logo-click-primary-button', uiContent),
    leavingSecondButton: findContentValue('myrx-logo-click-secondary-button', uiContent),
  };
};
