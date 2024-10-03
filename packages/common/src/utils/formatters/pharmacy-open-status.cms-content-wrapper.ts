// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../models/language';
import { IUIContentGroup } from '../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../content/cms-content-wrapper.helper';
import { IOpenStatusContent } from './date.formatter';

export const pharmacyOpenStatusContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IOpenStatusContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.pharmacyOpenStatus,
    2
  );

  return {
    open24Hours: findContentValue('open-24-hours-label', uiContent),
    closed: findContentValue('closed-label', uiContent),
    open: findContentValue('open-label', uiContent),
    opensAt: findContentValue('opens-at-label', uiContent),
    closesAt: findContentValue('closes-at-label', uiContent),
  };
};
