// Copyright 2022 Prescryptive Health, Inc.

import { recommendedAlternativesScreenCMSContentWrapper } from './recommended-alternatives.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IRecommendedAlternativesScreenContent } from './recommended-alternatives.screen.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('recommendedAlternativesScreenCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedRecommendedAlternativesCMSMock: IRecommendedAlternativesScreenContent =
      {
        title: 'title',
        heading: 'heading',
        learnMoreDescription: 'learn-more-description',
        skipButtonLabel: 'skip-button-label',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedRecommendedAlternativesCMSMock.title
    );
    findContentValueMock.mockReturnValueOnce(
      expectedRecommendedAlternativesCMSMock.heading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedRecommendedAlternativesCMSMock.learnMoreDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedRecommendedAlternativesCMSMock.skipButtonLabel
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
        CmsGroupKey.recommendedAlternatives,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = recommendedAlternativesScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.recommendedAlternatives,
      2
    );

    const expectedFieldKeys = [
      'title',
      'heading',
      'learn-more-description',
      'skip-button-label',
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

    expect(result).toEqual(expectedRecommendedAlternativesCMSMock);
  });
});
