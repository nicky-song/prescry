// Copyright 2022 Prescryptive Health, Inc.

import { IDesktopModalCMSContent } from '../../../../../../models/cms-content/desktop-modal.cms-content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const desktopModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IDesktopModalCMSContent => {
  const uiContent = getContent(language, content, CmsGroupKey.desktopModal, 2);

  return {
    preLinkSentTitle: findContentValue('pre-link-sent-title', uiContent),
    enterMobileNumber: findContentValue('enter-mobile-number', uiContent),
    myRxMobileExperience: findContentValue('myrx-mobile-experience', uiContent),
    yourNumberIsLogin: findContentValue('your-number-is-login', uiContent),
    supportText: findContentValue('support-text', uiContent),
    myRxSupportEmail: findContentValue('myrx-support-email', uiContent),
    sentMessage: findContentValue('sent-message', uiContent),
    withALink: findContentValue('with-a-link', uiContent),
    clickRegistrationProcess: findContentValue(
      'click-registration-process',
      uiContent
    ),
    postLinkSentTitle: findContentValue('post-link-sent-title', uiContent),
    smsErrorInvalidNumber: findContentValue(
      'sms-error-invalid-number',
      uiContent
    ),
    smsErrorServiceUnavailable: findContentValue(
      'sms-error-service-unavailable',
      uiContent
    ),
    getLinkLabel: findContentValue('get-a-link-label', uiContent),
    resendLinkLabel: findContentValue('resend-label', uiContent),
    sendLinkLabel: findContentValue('send-link-label', uiContent),
  };
};
