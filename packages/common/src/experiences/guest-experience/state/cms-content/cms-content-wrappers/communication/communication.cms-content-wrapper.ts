// Copyright 2022 Prescryptive Health, Inc.

import { ICommunicationContent } from '../../../../../../models/cms-content/communication.content';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';

export const communicationCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ICommunicationContent => {
  const uiContent = getContent(language, content, CmsGroupKey.communication, 2);

  return {
    supportCashPhone: findContentValue('support-cash-phone', uiContent),
    supportPBMPhone: findContentValue('support-pbm-phone', uiContent),
    pbmTextInformationMessage: findContentValue(
      'pbm-text-information-message',
      uiContent
    ),
    cashTextInformationMessage: findContentValue(
      'cash-text-information-message',
      uiContent
    ),
    couponTextInformationMessage: findContentValue(
      'coupon-text-information-message',
      uiContent
    ),
    groupNumberText: findContentValue('group-number-text', uiContent),
    pcnText: findContentValue('pcn-text', uiContent),
    memberIdText: findContentValue('member-id-text', uiContent),
    binText: findContentValue('bin-text', uiContent),
    questionsText: findContentValue('questions-text', uiContent),
  };
};
