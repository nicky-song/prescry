// Copyright 2022 Prescryptive Health, Inc.

import { ISelectLanguageScreenContent } from './select-language.screen.content';
import {
  selectLanguageScreenCMSContentWrapper
} from './select-language.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../testing/test.helper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('selectLanguageScreenCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedSelectLanguageCMSMock: ISelectLanguageScreenContent =
      {
        selectLanguageTitle: 'select-language-title-mock',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedSelectLanguageCMSMock.selectLanguageTitle
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
        CmsGroupKey.selectLanguage,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = selectLanguageScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getContentMock,
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.selectLanguage,
      2
    );

    const expectedFieldKeys = [
      'select-language-title',
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

    expect(result).toEqual(expectedSelectLanguageCMSMock);
  });
});
