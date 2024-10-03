// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IPrescriptionCardContent } from './prescription.card.content';

export const prescriptionCardCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescriptionCardContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescriptionCard,
    2
  );

  return {
    actionLabelNotSent: findContentValue('button-label-not-sent', uiContent),
    actionLabelSent: findContentValue('button-label-sent', uiContent),
    statusTagNotSent: findContentValue('status-tag-not-sent', uiContent),
    statusTagSent: findContentValue('status-tag-sent', uiContent),
  };
};
