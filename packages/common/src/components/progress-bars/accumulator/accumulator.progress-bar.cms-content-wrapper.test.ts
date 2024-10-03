// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { accumulatorProgressBarCMSContentWrapper } from './accumulator.progress-bar.cms-content-wrapper';
import { IAccumulatorProgressBarContent } from './accumulator.progress-bar.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('accumulatorProgressBarCMSContentWrapper', () => {
  it('has correct content', () => {
    const infoButtonLabelMock = 'info-button-label';
    const maxProgressLabelMock = 'max-progress-label';
    const minProgressLabelMock = 'min-progress-label';
    const maxValueLabelMock = 'max-value-label';

    findContentValueMock.mockReturnValueOnce(maxValueLabelMock);
    findContentValueMock.mockReturnValueOnce(maxProgressLabelMock);
    findContentValueMock.mockReturnValueOnce(minProgressLabelMock);
    findContentValueMock.mockReturnValueOnce(infoButtonLabelMock);

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
        CmsGroupKey.accumulatorProgressBar,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = accumulatorProgressBarCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.accumulatorProgressBar,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(4);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'max-value-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'max-progress-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'min-progress-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'info-button-label',
      uiContentMock
    );

    const expectedContent: IAccumulatorProgressBarContent = {
      infoButtonLabel: infoButtonLabelMock,
      maxProgressLabel: maxProgressLabelMock,
      minProgressLabel: minProgressLabelMock,
      maxValueLabel: maxValueLabelMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
