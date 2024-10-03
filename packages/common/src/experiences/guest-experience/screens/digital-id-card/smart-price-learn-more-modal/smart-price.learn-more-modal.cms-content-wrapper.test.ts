// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { smartPriceLearnMoreModalCMSContentWrapper } from './smart-price.learn-more-modal.cms-content-wrapper';

jest.mock('../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

const languageMock = defaultLanguage;
const contentMock = new Map();

const contentValuesMock = {
  heading: 'heading',
  headingOneA: 'heading-one-a',
  headingOneB: 'heading-one-b',
  descriptionOne: 'description-one',
  headingTwoA: 'heading-two-a',
  headingTwoB: 'heading-two-b',
  headingTwoC: 'heading-two-c',
  descriptionTwo: 'description-two',
};

describe('smartPriceLearnMoreModalCMSContentWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getContentMock.mockReturnValue({});

    findContentValueMock.mockReturnValueOnce(contentValuesMock.heading);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.headingOneA);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.headingOneB);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.descriptionOne);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.headingTwoA);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.headingTwoB);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.headingTwoC);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.descriptionTwo);
  });

  it('returns expected content', () => {
    const result = smartPriceLearnMoreModalCMSContentWrapper(
      languageMock,
      contentMock
    );

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      languageMock,
      contentMock,
      CmsGroupKey.smartPriceLearnMoreModal,
      2
    );

    expect(result).toEqual(contentValuesMock);
  });
});
