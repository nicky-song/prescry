// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { accumulatorsCardCMSContentWrapper } from './accumulators.card.cms-content-wrapper';
import { IAccumulatorsCardContent } from './accumulators.card.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('accumulatorsCardCMSContentWrapper', () => {
  it('has correct content', () => {
    const deductibleMock = 'deductible-mock';
    const familyMock = 'family-mock';
    const individualMock = 'individual-mock';
    const maxOutOfPocketMock = 'max-out-of-pocket-mock';

    findContentValueMock.mockReturnValueOnce(deductibleMock);
    findContentValueMock.mockReturnValueOnce(familyMock);
    findContentValueMock.mockReturnValueOnce(individualMock);
    findContentValueMock.mockReturnValueOnce(maxOutOfPocketMock);

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
        CmsGroupKey.accumulatorsCard,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = accumulatorsCardCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.accumulatorsCard,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(4);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'deductible',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'family',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'individual',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'max-out-of-pocket',
      uiContentMock
    );

    const expectedContent: IAccumulatorsCardContent = {
      deductible: deductibleMock,
      family: familyMock,
      individual: individualMock,
      maxOutOfPocket: maxOutOfPocketMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
