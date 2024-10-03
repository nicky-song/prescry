// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { drugDetailsTextCMSContentWrapper } from './drug-details.text.cms-content-wrapper';
import { IDrugDetailsTextContent } from './drug-details.text.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('drugDetailsTextCMSContentWrapper', () => {
  it('has correct content', () => {
    const asOfMock = 'as of';
    const daySingleMock = 'day';
    const dayPluralMock = 'days';
    const refillSingleMock = 'refill';
    const refillPluralMock = 'refills';

    findContentValueMock.mockReturnValueOnce(asOfMock);
    findContentValueMock.mockReturnValueOnce(daySingleMock);
    findContentValueMock.mockReturnValueOnce(dayPluralMock);
    findContentValueMock.mockReturnValueOnce(refillSingleMock);
    findContentValueMock.mockReturnValueOnce(refillPluralMock);

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
        CmsGroupKey.drugDetailsText,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = drugDetailsTextCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.drugDetailsText,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(5);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'as-of',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'day-single',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'day-plural',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'refill-single',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'refill-plural',
      uiContentMock
    );

    const expectedContent: IDrugDetailsTextContent = {
      asOf: asOfMock,
      daySingle: daySingleMock,
      dayPlural: dayPluralMock,
      refillSingle: refillSingleMock,
      refillPlural: refillPluralMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
