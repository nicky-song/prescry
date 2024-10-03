// Copyright 2021 Prescryptive Health, Inc.

import {
  getCMSContentAsyncAction,
  IGetCMSContentAsyncActionArgs,
} from '../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action';
import { CmsGroupKey } from '../experiences/guest-experience/state/cms-content/cms-group-key';
import { IUICMSResponse } from '../models/api-response/ui-content-response';
import {
  CMSExperience,
  CMSExperienceEnum,
} from '../models/cms-content/experience.cms-content';
import { defaultLanguage } from '../models/language';
import { IUIContent, IUIContentGroup } from '../models/ui-content';
import { getUIContentByGroupKey } from '../utils/content/ui-cms-content';
import {
  convertUIContentToMap,
  getCMSContent,
  loadDefaultLanguageContentIfSpecifiedAbsent,
} from './cms-content.helper';

jest.mock('../utils/content/ui-cms-content', () => ({
  getUIContentByGroupKey: jest.fn(),
}));

jest.mock(
  '../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action'
);
const getCMSContentAsyncActionMock = getCMSContentAsyncAction as jest.Mock;

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.homePage,
    {
      content: [
        {
          fieldKey: 'unauth-home-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-header-mock',
        },
        {
          fieldKey: 'unauth-home-search-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-search-header-mock',
        },
        {
          fieldKey: 'unauth-home-search-description',
          language: 'English',
          type: 'text',
          value: 'unauth-home-search-description-mock',
        },
        {
          fieldKey: 'unauth-home-search-button',
          language: 'English',
          type: 'text',
          value: 'unauth-home-search-button-mock',
        },
        {
          fieldKey: 'pbm-header',
          language: 'English',
          type: 'text',
          value: 'pbm-header-mock',
        },
        {
          fieldKey: 'pbm-description',
          language: 'English',
          type: 'text',
          value: 'pbm-description-mock',
        },
        {
          fieldKey: 'pbm-button',
          language: 'English',
          type: 'text',
          value: 'pbm-button-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-header-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-description',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-description-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-1-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-1-header-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-1-description',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-1-description-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-2-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-2-header-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-2-description',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-2-description-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-3-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-3-header-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-3-description',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-3-description-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-4-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-4-header-mock',
        },
        {
          fieldKey: 'unauth-home-uvp-4-description',
          language: 'English',
          type: 'text',
          value: 'unauth-home-uvp-4-description-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-header',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-header-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-description',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-description-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-button',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-button-mock',
        },
        {
          fieldKey: 'unauth-smartprice-header',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-header-mock',
        },
        {
          fieldKey: 'unauth-smartprice-description',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-description-mock',
        },
        {
          fieldKey: 'unauth-smartprice-button',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-button-mock',
        },
        {
          fieldKey: 'learn-more',
          language: 'English',
          type: 'text',
          value: 'learn-more-mock',
        },
        {
          fieldKey: 'privacy-policy',
          language: 'English',
          type: 'text',
          value: 'privacy-policy-mock',
        },
        {
          fieldKey: 't-&-c',
          language: 'English',
          type: 'text',
          value: 't-&-c-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-learn-more-title',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-learn-more-title-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-bullet-1',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-bullet-1-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-bullet-2',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-bullet-2-mock',
        },
        {
          fieldKey: 'unauth-clinical-services-bullet-3',
          language: 'English',
          type: 'text',
          value: 'unauth-clinical-services-bullet-3-mock',
        },
        {
          fieldKey: 'unauth-smartprice-learn-more-title',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-learn-more-title-mock',
        },
        {
          fieldKey: 'unauth-smartprice-bullet-1',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-bullet-1-mock',
        },
        {
          fieldKey: 'unauth-smartprice-bullet-2',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-bullet-2-mock',
        },
        {
          fieldKey: 'unauth-smartprice-bullet-3',
          language: 'English',
          type: 'text',
          value: 'unauth-smartprice-bullet-3-mock',
        },
      ],
      lastUpdated: 0,
      isContentLoading: true,
    },
  ],
]);

const getUIContentByGroupKeyMock = getUIContentByGroupKey as jest.Mock;

describe('convertUIContentToMap', () => {
  it('should return correct map from content', () => {
    const mockUIContentEntry: IUIContent = {
      fieldKey: 'learn-more',
      language: 'English',
      type: 'Text',
      value: 'Learn more about us',
    };
    const mockUIContentReponse: IUICMSResponse = {
      groupKey: 'test',
      fieldKey: 'learn-more',
      language: 'English',
      type: 'Text',
      value: 'Learn more about us',
    };
    const mockUIContentMap = new Map([['test', [mockUIContentEntry]]]);
    getUIContentByGroupKeyMock.mockReturnValue([mockUIContentEntry]);
    const uiContentMapResult = convertUIContentToMap([mockUIContentReponse]);
    expect(uiContentMapResult).toEqual(mockUIContentMap);
  });
});

describe('loadDefaultLanguageContentIfSpecifiedAbsent', () => {
  it('should return correct content', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const sessionDispatchMock = jest.fn();

    const specifiedLanguageArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      version: 2,
      language: 'Spanish',
      groupKey: CmsGroupKey.homePage,
      uiCMSContentMap: cmsContentMapMock,
    };

    getCMSContentAsyncActionMock.mockResolvedValue(cmsContentMapMock);

    const result = await loadDefaultLanguageContentIfSpecifiedAbsent(
      reduxDispatchMock,
      reduxGetStateMock,
      sessionDispatchMock,
      specifiedLanguageArgs,
      defaultLanguage,
      CmsGroupKey.homePage,
      new Map()
    );

    expect(result).toEqual(cmsContentMapMock);
    expect(getCMSContentAsyncActionMock).toHaveBeenCalled();
  });

  it('should return correct content when experience is defined', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const sessionDispatchMock = jest.fn();
    const experienceMock: CMSExperience = CMSExperienceEnum.MYRX_COBRANDING;

    const specifiedLanguageArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      version: 2,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      uiCMSContentMap: cmsContentMapMock,
      experience: experienceMock,
    };

    getCMSContentAsyncActionMock.mockResolvedValue(cmsContentMapMock);

    const result = await loadDefaultLanguageContentIfSpecifiedAbsent(
      reduxDispatchMock,
      reduxGetStateMock,
      sessionDispatchMock,
      specifiedLanguageArgs,
      defaultLanguage,
      CmsGroupKey.homePage,
      new Map(),
      experienceMock
    );

    const expectedDefaultLanguageArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      version: specifiedLanguageArgs.version,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      uiCMSContentMap: new Map(),
      experience: undefined,
    };

    expect(result).toEqual(cmsContentMapMock);
    expect(getCMSContentAsyncActionMock).toHaveBeenCalledWith(
      expectedDefaultLanguageArgs
    );
  });

  it('should return correct content when specific language does not exist', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const sessionDispatchMock = jest.fn();

    const specifiedLanguageArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      version: 2,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      uiCMSContentMap: cmsContentMapMock,
    };

    getCMSContentAsyncActionMock.mockResolvedValue(cmsContentMapMock);

    const result = await loadDefaultLanguageContentIfSpecifiedAbsent(
      reduxDispatchMock,
      reduxGetStateMock,
      sessionDispatchMock,
      specifiedLanguageArgs,
      'Spanish',
      CmsGroupKey.homePage,
      cmsContentMapMock
    );

    expect(result).toEqual(cmsContentMapMock);
    expect(getCMSContentAsyncActionMock).toHaveBeenCalled();
  });
});

describe('getCMSContent', () => {
  it('should return correct content', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const sessionDispatchMock = jest.fn();

    getCMSContentAsyncActionMock.mockResolvedValue(cmsContentMapMock);

    await getCMSContent({
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      version: 2,
      uiCMSContentMap: cmsContentMapMock,
    });

    expect(getCMSContentAsyncActionMock).toHaveBeenCalled();
  });

  it('should return correct content', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const sessionDispatchMock = jest.fn();

    getCMSContentAsyncActionMock.mockResolvedValue(cmsContentMapMock);

    await getCMSContent({
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      version: 2,
      uiCMSContentMap: cmsContentMapMock,
    });

    expect(getCMSContentAsyncActionMock).toHaveBeenCalledTimes(4);
  });
});
