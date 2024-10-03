// Copyright 2022 Prescryptive Health, Inc.

import { IGetStartedModalContent } from '../../models/cms-content/desktop-modal-ui-content.model';
import { IDesktopModalCMSContent } from '../../models/cms-content/desktop-modal.cms-content';
import { mapDesktopModalContent } from './map-desktop-modal-content.helper';

const desktopModalCMSMock: IDesktopModalCMSContent = {
  preLinkSentTitle: 'pre-link-sent-title-value-mock',
  enterMobileNumber: 'enter-mobile-number-value-mock',
  myRxMobileExperience: 'myrx-mobile-experience-value-mock',
  yourNumberIsLogin: 'your-number-is-login-value-mock',
  supportText: 'support-text-value-mock',
  myRxSupportEmail: 'myrx-support-email-value-mock',
  sentMessage: 'sent-message-value-mock',
  withALink: 'with-a-link-value-mock',
  clickRegistrationProcess: 'click-registration-process-value-mock',
  postLinkSentTitle: 'post-link-sent-title-value-mock',
  smsErrorInvalidNumber: 'sms-error-invalid-number-value-mock',
  smsErrorServiceUnavailable: 'sms-error-service-unavailable-value-mock',
  getLinkLabel: 'get-link-label-mock',
  resendLinkLabel: 'resend-link-label-mock',
  sendLinkLabel: 'send-link-label-mock',
};

describe('mapDesktopModalContent', () => {
  it('should map the correct ui content from cms content', () => {
    const expectedDesktopModalContentMock: IGetStartedModalContent = {
      enterMobile: desktopModalCMSMock.enterMobileNumber,
      myrxMobileExperience: desktopModalCMSMock.myRxMobileExperience,
      yourNumberIsLogin: desktopModalCMSMock.yourNumberIsLogin,
      sentMessage: desktopModalCMSMock.sentMessage,
      withALink: desktopModalCMSMock.withALink,
      clickRegistrationProcess: desktopModalCMSMock.clickRegistrationProcess,
      smsErrorInvalidNumber: desktopModalCMSMock.smsErrorInvalidNumber,
      smsErrorSeriviceUnavailable:
        desktopModalCMSMock.smsErrorServiceUnavailable,
      haveQuestions: desktopModalCMSMock.supportText,
      email: desktopModalCMSMock.myRxSupportEmail,
      getStarted: desktopModalCMSMock.preLinkSentTitle,
      linkSent: desktopModalCMSMock.postLinkSentTitle,
      getLinkLabel: desktopModalCMSMock.getLinkLabel,
      resendLinkLabel: desktopModalCMSMock.resendLinkLabel,
      sendLinkLabel: desktopModalCMSMock.sendLinkLabel,
    };

    const result = mapDesktopModalContent(desktopModalCMSMock);

    expect(result).toEqual(expectedDesktopModalContentMock);
  });
});
