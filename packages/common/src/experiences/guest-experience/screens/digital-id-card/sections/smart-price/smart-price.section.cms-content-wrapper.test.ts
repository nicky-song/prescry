// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { smartPriceSectionCMSContentWrapper } from './smart-price.section.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

const languageMock = defaultLanguage;
const contentMock = new Map();

const contentValuesMock = {
  heading: 'heading-mock',
  description: 'description',
  learnMore: 'learn-more',
};

describe('smartPriceSectionCMSContentWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getContentMock.mockReturnValue({});

    findContentValueMock.mockReturnValueOnce(contentValuesMock.heading);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.description);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.learnMore);
  });

  it('returns expected content', () => {
    const result = smartPriceSectionCMSContentWrapper(
      languageMock,
      contentMock
    );

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      languageMock,
      contentMock,
      CmsGroupKey.smartPriceSection,
      2
    );

    expect(result).toEqual(contentValuesMock);
  });
});
