// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { benefitPlanSectionCMSContentWrapper } from './benefit-plan.section.cms-content-wrapper';
import { IBenefitPlanSectionContent } from './benefit-plan.section.content';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

const languageMock = defaultLanguage;
const contentMock = new Map();

const contentValuesMock: IBenefitPlanSectionContent = {
  heading: 'heading-mock',
  description: 'description-mock',
  learnMore: 'learn-more-mock',
};

describe('benefitPlanSectionCMSContentWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getContentMock.mockReturnValue({});

    findContentValueMock.mockReturnValueOnce(contentValuesMock.heading);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.description);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.learnMore);
  });

  it('returns expected content', () => {
    const result = benefitPlanSectionCMSContentWrapper(
      languageMock,
      contentMock
    );

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      languageMock,
      contentMock,
      CmsGroupKey.benefitPlanSection,
      2
    );

    expect(result).toEqual(contentValuesMock);
  });
});
