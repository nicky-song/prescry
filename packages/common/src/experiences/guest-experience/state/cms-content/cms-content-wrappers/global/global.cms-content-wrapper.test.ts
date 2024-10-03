// Copyright 2021 Prescryptive Health, Inc.

import { IGlobalContent } from '../../../../../../models/cms-content/global.content';
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
import { globalCMSContentWrapper } from './global.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('globalCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IGlobalContent = {
      authSearchButton: 'auth-home-search-button-mock',
      closeDialog: 'close-dialog-mock',
      homeButton: 'home-button-mock',
      learnMore: 'learn-more-mock',
      okButton: 'ok-button-mock',
      privacyPolicy: 'privacy-policy-mock',
      providedBy: 'provided-by-mock',
      scrollToTop: 'scroll-to-top-mock',
      seeMore: 'see-more-mock',
      supportLinkedText: 'support-linked-text-mock',
      supportUnlinkedText: 'support-unlinked-text-mock',
      termsAndConditions: 't-&-c-mock',
      favoriteIconButton: 'favorite-icon-button-mock',
      unfavoriteIconButton: 'unfavorite-icon-button-mock',
      favoritePharmacySaved: 'favorite-pharmacy-saved-mock',
      favoritePharmacyUnsaved: 'favorite-pharmacy-unsaved-mock',
      newFavoritedPharmaciesFeature: 'new-favorited-pharmacies-feature-mock',
      favoriteTagLabel: 'favorite-tag-label-mock',
      favoritingPharmacyError: 'favoriting-pharmacy-error-mock',
      unfavoritingPharmacyError: 'unfavoriting-pharmacy-error-mock',
      setLanguageError: 'set-language-error-mock',
      bestValueLabel: 'best-value-label-mock',
      homeDeliveryLabel: 'home-delivery-label-mock',
      planSavesTagLabel: 'plan-saves-tag-label-mock',
      memberSavesTagLabel: 'member-saves-tag-label-mock',
      combinationTagLabel: 'combination-tag-label-mock',
      bannerText: 'banner-text-mock',
      welcomeCaption: 'welcome-caption-mock',
      prescryptiveHelp: 'prescryptive-help-mock',
      needHelp: 'need-help-mock',
      contactUs: 'contact-us-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.authSearchButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.closeDialog);
    findContentValueMock.mockReturnValueOnce(expectedContent.homeButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.learnMore);
    findContentValueMock.mockReturnValueOnce(expectedContent.okButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.privacyPolicy);
    findContentValueMock.mockReturnValueOnce(expectedContent.providedBy);
    findContentValueMock.mockReturnValueOnce(expectedContent.scrollToTop);
    findContentValueMock.mockReturnValueOnce(expectedContent.seeMore);
    findContentValueMock.mockReturnValueOnce(expectedContent.supportLinkedText);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.supportUnlinkedText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.termsAndConditions
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.favoriteIconButton
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.unfavoriteIconButton
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.favoritePharmacySaved
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.favoritePharmacyUnsaved
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.newFavoritedPharmaciesFeature
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.favoriteTagLabel);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.favoritingPharmacyError
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.unfavoritingPharmacyError
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.setLanguageError);
    findContentValueMock.mockReturnValueOnce(expectedContent.bestValueLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.homeDeliveryLabel);
    findContentValueMock.mockReturnValueOnce(expectedContent.planSavesTagLabel);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.memberSavesTagLabel
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.combinationTagLabel
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.bannerText);
    findContentValueMock.mockReturnValueOnce(expectedContent.welcomeCaption);
    findContentValueMock.mockReturnValueOnce(expectedContent.prescryptiveHelp);
    findContentValueMock.mockReturnValueOnce(expectedContent.needHelp);
    findContentValueMock.mockReturnValueOnce(expectedContent.contactUs);

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
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = globalCMSContentWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.global,
      2
    );

    const expectedFieldKeys = [
      'auth-home-search-button',
      'close-dialog',
      'home-button',
      'learn-more',
      'ok-button',
      'privacy-policy',
      'provided-by-label',
      'scroll-to-top',
      'see-more',
      'support-linked-text',
      'support-unlinked-text',
      't-&-c',
      'favorite-icon-button',
      'unfavorite-icon-button',
      'favorite-pharmacy-saved',
      'favorite-pharmacy-unsaved',
      'new-favorited-pharmacies-feature',
      'favorite-tag-label',
      'favoriting-pharmacy-error',
      'unfavoriting-pharmacy-error',
      'set-language-error',
      'best-value-label',
      'home-delivery-label',
      'plan-saves-tag-label',
      'member-saves-tag-label',
      'combination-tag-label',
      'banner-text',
      'welcome-caption',
      'prescryptive-help',
      'need-help',
      'contact-us',
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
