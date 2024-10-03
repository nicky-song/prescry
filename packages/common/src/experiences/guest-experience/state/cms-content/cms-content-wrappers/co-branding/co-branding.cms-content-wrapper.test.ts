// Copyright 2022 Prescryptive Health, Inc.

import { ICobrandingContent } from '../../../../../../models/cms-content/co-branding.ui-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { coBrandingCMSContentWrapper } from './co-branding.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('coBrandingCMSContentWrapper', () => {
  it('has correct content', () => {
    const coBrandingIdMock = 'transcarent';

    const expectedCoBrandingCMSContentMock: ICobrandingContent = {
      logo: 'logo-url-mock',
      interstitialContent: 'interstitial-content-mock',
      idCardLogo: 'id-card-logo-mock',
      idCardHeaderColor: 'id-card-header-color-mock',
      recommendedAltsSlideUpModalHeading:
        'recommended-alts-slide-up-modal-heading-mock',
      recommendedAltsSlideUpModalContent:
        'recommended-alts-slide-up-modal-content-mock',
      switchYourMedsDescription: 'switch-your-meds-description-mock',
      switchYourMedsProviderName: 'switch-your-meds-provider-name-mock',
      switchYourMedsCallButtonLabel: 'switch-your-meds-call-button-label-mock',
      switchYourMedsPhoneNumber: 'switch-your-meds-phone-number',
    };

    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.logo
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.interstitialContent
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.idCardLogo
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.idCardHeaderColor
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.recommendedAltsSlideUpModalHeading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.recommendedAltsSlideUpModalContent
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.switchYourMedsDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.switchYourMedsProviderName
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.switchYourMedsCallButtonLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedCoBrandingCMSContentMock.switchYourMedsPhoneNumber
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
        coBrandingIdMock,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = coBrandingCMSContentWrapper(
      coBrandingIdMock,
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      coBrandingIdMock
    );

    const expectedFieldKeys = [
      'logo',
      'interstitial-content',
      'id-card-logo',
      'id-card-header-color',
      'recommended-alts-slide-up-modal-heading',
      'recommended-alts-slide-up-modal-content',
      'switch-your-meds-description',
      'switch-your-meds-provider-name',
      'switch-your-meds-call-button-label',
      'switch-your-meds-phone-number',
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

    expect(result).toEqual(expectedCoBrandingCMSContentMock);
  });
});
