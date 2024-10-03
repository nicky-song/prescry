// Copyright 2022 Prescryptive Health, Inc.

import { IDesktopModalCMSContent } from '../../models/cms-content/desktop-modal.cms-content';
import { IGetStartedModalContent } from '../../models/cms-content/desktop-modal-ui-content.model';

export const mapDesktopModalContent = (
  uiContent: IDesktopModalCMSContent
): IGetStartedModalContent => {
  return {
    enterMobile: uiContent.enterMobileNumber,
    myrxMobileExperience: uiContent.myRxMobileExperience,
    yourNumberIsLogin: uiContent.yourNumberIsLogin,
    sentMessage: uiContent.sentMessage,
    withALink: uiContent.withALink,
    clickRegistrationProcess: uiContent.clickRegistrationProcess,
    smsErrorInvalidNumber: uiContent.smsErrorInvalidNumber,
    smsErrorSeriviceUnavailable: uiContent.smsErrorServiceUnavailable,
    haveQuestions: uiContent.supportText,
    email: uiContent.myRxSupportEmail,
    getStarted: uiContent.preLinkSentTitle,
    linkSent: uiContent.postLinkSentTitle,
    getLinkLabel: uiContent.getLinkLabel,
    resendLinkLabel: uiContent.resendLinkLabel,
    sendLinkLabel: uiContent.sendLinkLabel,
  };
};
