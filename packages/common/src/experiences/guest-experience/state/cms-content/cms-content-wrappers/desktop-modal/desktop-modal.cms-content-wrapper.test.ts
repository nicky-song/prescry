// Copyright 2022 Prescryptive Health, Inc.

import { IDesktopModalCMSContent } from '../../../../../../models/cms-content/desktop-modal.cms-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { desktopModalCMSContentWrapper } from './desktop-modal.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('desktopModalCMSContentWrapper', () => {
  it('has correct content', () => {
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
      getLinkLabel: 'get-a-link-label-mock',
      resendLinkLabel: 'resend-label-mock',
      sendLinkLabel: 'send-link-label-mock',
    };

    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.preLinkSentTitle
    );
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.enterMobileNumber
    );
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.myRxMobileExperience
    );
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.yourNumberIsLogin
    );
    findContentValueMock.mockReturnValueOnce(desktopModalCMSMock.supportText);
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.myRxSupportEmail
    );
    findContentValueMock.mockReturnValueOnce(desktopModalCMSMock.sentMessage);
    findContentValueMock.mockReturnValueOnce(desktopModalCMSMock.withALink);
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.clickRegistrationProcess
    );
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.postLinkSentTitle
    );
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.smsErrorInvalidNumber
    );
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.smsErrorServiceUnavailable
    );
    findContentValueMock.mockReturnValueOnce(desktopModalCMSMock.getLinkLabel);
    findContentValueMock.mockReturnValueOnce(
      desktopModalCMSMock.resendLinkLabel
    );
    findContentValueMock.mockReturnValueOnce(desktopModalCMSMock.sendLinkLabel);

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.desktopModal,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = desktopModalCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.desktopModal,
      2
    );

    const expectedFieldKeys = [
      'pre-link-sent-title',
      'enter-mobile-number',
      'myrx-mobile-experience',
      'your-number-is-login',
      'support-text',
      'myrx-support-email',
      'sent-message',
      'with-a-link',
      'click-registration-process',
      'post-link-sent-title',
      'sms-error-invalid-number',
      'sms-error-service-unavailable',
      'get-a-link-label',
      'resend-label',
      'send-link-label',
    ];
    expect(findContentValueMock).toHaveBeenCalledTimes(
      expectedFieldKeys.length
    );
    expectedFieldKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    expect(result).toEqual(desktopModalCMSMock);
  });
});
