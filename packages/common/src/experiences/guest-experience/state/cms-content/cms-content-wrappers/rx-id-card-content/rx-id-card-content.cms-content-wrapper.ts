// Copyright 2022 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { IRxIdCardContent } from '../../../../../../components/cards/rx-id-card/rx-id-card.content';

export const rxIdCardContentCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IRxIdCardContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.rxIdCardContent,
    2
  );

  return {
    idLabel: findContentValue('id-label', uiContent),
    groupLabel: findContentValue('group-label', uiContent),
    binLabel: findContentValue('bin-label', uiContent),
    pcnLabel: findContentValue('pcn-label', uiContent),
    rxSavingsLabel: findContentValue('rx-savings-label', uiContent),
    rxBenefitsLabel: findContentValue('rx-benefits-label', uiContent),
    memberIdLabel: findContentValue('member-id-label', uiContent),
    unauthMessage: findContentValue('unauth-message', uiContent),
  };
};
