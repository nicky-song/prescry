// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../models/language';
import { IUIContent, IUIContentGroup } from '../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../content/cms-content-wrapper.helper';
import { IOpenStatusContent } from './date.formatter';
import { pharmacyOpenStatusContentWrapper } from './pharmacy-open-status.cms-content-wrapper';

jest.mock('../content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('pharmacyOpenStatusContentWrapper', () => {
  it('has correct content', () => {
    const open24HoursMock = 'open-25-hours-label-mock';
    const closedMock = 'closed-label-mock';
    const openMock = 'open-label-mock';
    const opensAtMock = 'opens-at-label-mock';
    const closesAtMock = 'closes-at-label-mock';

    findContentValueMock.mockReturnValueOnce(open24HoursMock);
    findContentValueMock.mockReturnValueOnce(closedMock);
    findContentValueMock.mockReturnValueOnce(openMock);
    findContentValueMock.mockReturnValueOnce(opensAtMock);
    findContentValueMock.mockReturnValueOnce(closesAtMock);

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
        CmsGroupKey.pharmacyOpenStatus,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = pharmacyOpenStatusContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.pharmacyOpenStatus,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(5);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'open-24-hours-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'closed-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'open-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'opens-at-label',
      uiContentMock
    );

    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'closes-at-label',
      uiContentMock
    );

    const expectedContent: IOpenStatusContent = {
      open24Hours: open24HoursMock,
      closed: closedMock,
      open: openMock,
      opensAt: opensAtMock,
      closesAt: closesAtMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
