// Copyright 2023 Prescryptive Health, Inc.

import { IClaimReversalScreenContent } from './claim-reversal.screen.content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { claimReversalScreenCMSContentWrapper } from './claim-reversal.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('claimReversalScreenCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedClaimReversalCMSMock: IClaimReversalScreenContent = {
      pharmacyPlaceholder: 'pharmacy-placeholder-mock',
      heading: 'heading-mock',
      descriptionOne: 'description-one-mock',
      descriptionTwo: 'description-two-mock',
      learnMore: 'learn-more-mock',
      phoneButton: 'phone-button-mock',
      homeButton: 'home-button-mock',
    };

    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.pharmacyPlaceholder
    );
    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.heading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.descriptionOne
    );
    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.descriptionTwo
    );
    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.learnMore
    );
    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.phoneButton
    );
    findContentValueMock.mockReturnValueOnce(
      expectedClaimReversalCMSMock.homeButton
    );

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
        CmsGroupKey.claimReversalScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = claimReversalScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.claimReversalScreen,
      2
    );

    const expectedFieldKeys = [
      'pharmacy-placeholder',
      'heading',
      'description-one',
      'description-two',
      'learn-more',
      'phone-button',
      'home-button',
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

    expect(result).toEqual(expectedClaimReversalCMSMock);
  });
});
