// Copyright 2021 Prescryptive Health, Inc.

import { IRxIdCardContent } from '../../../../../../components/cards/rx-id-card/rx-id-card.content';
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
import { rxIdCardContentCMSContentWrapper } from './rx-id-card-content.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('rxIdCardContentCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IRxIdCardContent = {
      idLabel: 'id-label-mock',
      groupLabel: 'group-label-mock',
      binLabel: 'bin-label-mock',
      pcnLabel: 'pcn-label-mock',
      rxSavingsLabel: 'rx-savings-label-mock',
      rxBenefitsLabel: 'rx-benefits-label-mock',
      memberIdLabel: 'member-id-label-mock',
      unauthMessage: 'unauth-message-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.idLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.groupLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.binLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.pcnLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.rxSavingsLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.rxBenefitsLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.memberIdLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.unauthMessage);

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
        CmsGroupKey.rxIdCardContent,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = rxIdCardContentCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.rxIdCardContent,
      2
    );

    const expectedFieldKeys = [
      'id-label',
      'group-label',
      'bin-label',
      'pcn-label',
      'rx-savings-label',
      'rx-benefits-label',
      'member-id-label',
      'unauth-message',
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
