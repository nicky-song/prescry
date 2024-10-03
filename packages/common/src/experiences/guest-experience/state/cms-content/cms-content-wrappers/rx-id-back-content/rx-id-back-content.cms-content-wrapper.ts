// Copyright 2022 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { IRxIdBackContentCmsContent } from '../../../../../../components/cards/rx-id-back-content/rx-id-back-content.cms-content';

export const rxIdBackContentCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IRxIdBackContentCmsContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.rxIdBackContent,
    2
  );

  return {
    memberSince: findContentValue('member-since', uiContent),
    myrxURL: findContentValue('myrx-url', uiContent),
    membersTitle: findContentValue('members-title', uiContent),
    membersDescription: findContentValue('members-description', uiContent),
    claimsTitle: findContentValue('claims-title', uiContent),
    claimsDescription: findContentValue('claims-description', uiContent),
    sendPrescriptionsInstruction: findContentValue(
      'send-prescriptions-instruction',
      uiContent
    ),
    prescryptiveAddress: findContentValue('prescryptive-address', uiContent),
  };
};
