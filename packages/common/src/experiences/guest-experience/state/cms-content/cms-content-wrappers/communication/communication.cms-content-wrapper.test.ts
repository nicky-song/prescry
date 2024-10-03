// Copyright 2022 Prescryptive Health, Inc.

import { ICommunicationContent } from '../../../../../../models/cms-content/communication.content';
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
import { communicationCMSContentWrapper } from './communication.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('communicationCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: ICommunicationContent = {
      supportCashPhone: 'support-cash-phone-mock',
      supportPBMPhone: 'support-pbm-phone-mock',
      pbmTextInformationMessage: 'pbm-text-information-message-mock',
      cashTextInformationMessage: 'cash-text-information-message-mock',
      couponTextInformationMessage: 'coupon-text-information-message-mock',
      groupNumberText: 'group-number-text-mock',
      pcnText: 'pcn-text-mock',
      memberIdText: 'member-id-text-mock',
      binText: 'bin-text-mock',
      questionsText: 'questions-text-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.supportCashPhone);
    findContentValueMock.mockReturnValueOnce(expectedContent.supportPBMPhone);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.pbmTextInformationMessage
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.cashTextInformationMessage
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.couponTextInformationMessage
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.groupNumberText);
    findContentValueMock.mockReturnValueOnce(expectedContent.pcnText);
    findContentValueMock.mockReturnValueOnce(expectedContent.memberIdText);
    findContentValueMock.mockReturnValueOnce(expectedContent.binText);
    findContentValueMock.mockReturnValueOnce(expectedContent.questionsText);
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
        CmsGroupKey.communication,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = communicationCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.communication,
      2
    );

    const expectedFieldKeys = [
      'support-cash-phone',
      'support-pbm-phone',
      'pbm-text-information-message',
      'cash-text-information-message',
      'coupon-text-information-message',
      'group-number-text',
      'pcn-text',
      'member-id-text',
      'bin-text',
      'questions-text',
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

    expect(result).toEqual(expectedContent);
  });
});
