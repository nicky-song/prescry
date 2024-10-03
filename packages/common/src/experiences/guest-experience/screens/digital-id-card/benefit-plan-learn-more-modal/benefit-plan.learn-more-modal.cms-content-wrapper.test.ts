// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { benefitPlanLearnMoreModalCMSContentWrapper } from './benefit-plan.learn-more-modal.cms-content-wrapper';
import { IBenefitPlanLearnMoreModalContent } from './benefit-plan.learn-more-modal.content';

jest.mock('../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('benefitPlanLearnMoreModalCMSContentWrapper', () => {
  const contentMock = new Map();
  const benefitPlanLearnMoreModalContentMock: IBenefitPlanLearnMoreModalContent =
    {
      heading: 'heading-mock',
      headingOne: 'heading-one-mock',
      descriptionOne: 'description-one-mock',
    };

  beforeEach(() => {
    jest.clearAllMocks();

    getContentMock.mockReturnValue(benefitPlanLearnMoreModalContentMock);

    Object.values(benefitPlanLearnMoreModalContentMock).forEach(
      (contentValue) => {
        findContentValueMock.mockReturnValueOnce(contentValue);
      }
    );
  });

  it('calls getContent with expected args', () => {
    benefitPlanLearnMoreModalCMSContentWrapper(defaultLanguage, contentMock);

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      defaultLanguage,
      contentMock,
      CmsGroupKey.benefitPlanLearnMoreModal,
      2
    );
  });

  it('returns expected content object', () => {
    const result = benefitPlanLearnMoreModalCMSContentWrapper(
      defaultLanguage,
      contentMock
    );

    expect(result).toEqual(benefitPlanLearnMoreModalContentMock);
  });
});
