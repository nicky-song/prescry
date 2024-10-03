// Copyright 2021 Prescryptive Health, Inc.

import { IHomePageCMSContent } from '../../../../../../models/cms-content/home-page.cms-content';
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
import { homePageCMSContentWrapper } from './home-page.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('homePageCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IHomePageCMSContent = {
      homeHeader: 'unauth-home-header-mock',
      homeSearchHeader: 'unauth-home-search-header-mock',
      homeSearchDescription: 'unauth-home-search-description-mock',
      homeSearchButton: 'unauth-home-search-button-mock',
      pbmHeader: 'pbm-header-mock',
      pbmDescription: 'pbm-description-mock',
      pbmButton: 'pbm-button-mock',
      homeUVPHeader: 'unauth-home-uvp-header-mock',
      homeUVPDescription: 'unauth-home-uvp-description-mock',
      homeUVP1Header: 'unauth-home-uvp-1-header-mock',
      homeUVP1Description: 'unauth-home-uvp-1-description-mock',
      homeUVP2Header: 'unauth-home-uvp-2-header-mock',
      homeUVP2Description: 'unauth-home-uvp-2-description-mock',
      homeUVP3Header: 'unauth-home-uvp-3-header-mock',
      homeUVP3Description: 'unauth-home-uvp-3-description-mock',
      homeUVP4Header: 'unauth-home-uvp-4-header-mock',
      homeUVP4Description: 'unauth-home-uvp-4-description-mock',
      clinicalServicesHeader: 'unauth-clinical-services-header-mock',
      clinicalServicesDescription: 'unauth-clinical-services-description-mock',
      clinicalServicesButton: 'unauth-clinical-services-button-mock',
      smartPriceHeader: 'unauth-smartprice-header-mock',
      smartPriceDescription: 'unauth-smartprice-description-mock',
      smartPriceButton: 'unauth-smartprice-button-mock',
      learnMore: 'learn-more-mock',
      privacyPolicy: 'privacy-policy-mock',
      termsAndConditions: 't-&-c-mock',
      clinicalServicesLearnMoreTitle:
        'unauth-clinical-services-learn-more-title-mock',
      clinicalServicesBullet1: 'unauth-clinical-services-bullet-1-mock',
      clinicalServicesBullet2: 'unauth-clinical-services-bullet-2-mock',
      clinicalServicesBullet3: 'unauth-clinical-services-bullet-3-mock',
      smartPriceLearnMoreTitle: 'unauth-smartprice-learn-more-title-mock',
      smartPriceBullet1: 'unauth-smartprice-bullet-1-mock',
      smartPriceBullet2: 'unauth-smartprice-bullet-2-mock',
      smartPriceBullet3: 'unauth-smartprice-bullet-3-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.homeHeader);
    findContentValueMock.mockReturnValueOnce(expectedContent.homeSearchHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.homeSearchDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.homeSearchButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.pbmHeader);
    findContentValueMock.mockReturnValueOnce(expectedContent.pbmDescription);
    findContentValueMock.mockReturnValueOnce(expectedContent.pbmButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.homeUVPHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.homeUVPDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.homeUVP1Header);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.homeUVP1Description
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.homeUVP2Header);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.homeUVP2Description
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.homeUVP3Header);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.homeUVP3Description
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.homeUVP4Header);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.homeUVP4Description
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesHeader
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesButton
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.smartPriceHeader);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.smartPriceDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.smartPriceButton);
    findContentValueMock.mockReturnValueOnce(expectedContent.learnMore);
    findContentValueMock.mockReturnValueOnce(expectedContent.privacyPolicy);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.termsAndConditions
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesLearnMoreTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesBullet1
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesBullet2
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.clinicalServicesBullet3
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.smartPriceLearnMoreTitle
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.smartPriceBullet1);
    findContentValueMock.mockReturnValueOnce(expectedContent.smartPriceBullet2);
    findContentValueMock.mockReturnValueOnce(expectedContent.smartPriceBullet3);

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
        CmsGroupKey.homePage,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = homePageCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.homePage,
      2
    );

    const expectedFieldKeys = [
      'unauth-home-header',
      'unauth-home-search-header',
      'unauth-home-search-description',
      'unauth-home-search-button',
      'pbm-header',
      'pbm-description',
      'pbm-button',
      'unauth-home-uvp-header',
      'unauth-home-uvp-description',
      'unauth-home-uvp-1-header',
      'unauth-home-uvp-1-description',
      'unauth-home-uvp-2-header',
      'unauth-home-uvp-2-description',
      'unauth-home-uvp-3-header',
      'unauth-home-uvp-3-description',
      'unauth-home-uvp-4-header',
      'unauth-home-uvp-4-description',
      'unauth-clinical-services-header',
      'unauth-clinical-services-description',
      'unauth-clinical-services-button',
      'unauth-smartprice-header',
      'unauth-smartprice-description',
      'unauth-smartprice-button',
      'learn-more',
      'privacy-policy',
      't-&-c',
      'unauth-clinical-services-learn-more-title',
      'unauth-clinical-services-bullet-1',
      'unauth-clinical-services-bullet-2',
      'unauth-clinical-services-bullet-3',
      'unauth-smartprice-learn-more-title',
      'unauth-smartprice-bullet-1',
      'unauth-smartprice-bullet-2',
      'unauth-smartprice-bullet-3',
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
