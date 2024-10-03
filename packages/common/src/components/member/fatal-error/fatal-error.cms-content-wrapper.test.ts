// Copyright 2023 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import { findContentValue, getContent } from '../../../utils/content/cms-content-wrapper.helper';
import { fatalErrorCMSContentWrapper } from './fatal-error.cms-content-wrapper';
import { IFatalErrorContent } from './fatal-error.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('contactDoctorContainerCMSContentWrapper', () => {
  it('has correct content', () => {
    const loadingErrorMock = 'loading-error-mock';
    const errorContactMock = 'error-contact-mock';

    findContentValueMock.mockReturnValueOnce(loadingErrorMock);
    findContentValueMock.mockReturnValueOnce(errorContactMock);

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
        CmsGroupKey.fatalError,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = fatalErrorCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.fatalError,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(2);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'fatal-error-loading',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'fatal-error-contact',
      uiContentMock
    );

    const expectedContent: IFatalErrorContent = {
      loadingError: loadingErrorMock,
      errorContact: errorContactMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
