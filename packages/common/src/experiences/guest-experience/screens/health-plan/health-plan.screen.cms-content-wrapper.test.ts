// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IHealthPlanScreenContent } from './health-plan.screen.content';
import { healthPlanScreenCMSContentWrapper } from './health-plan.screen.cms-content-wrapper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('healthPlanScreenCMSContentWrapper', () => {
  const contentMock = new Map();

  const contentMocks: IHealthPlanScreenContent = {
    heading: 'heading-mock',
    addToWallet: 'add-to-wallet-mock',
    viewPlanAccumulators: 'view-plan-accumulators-mock',
  };
  beforeEach(() => {
    jest.clearAllMocks();

    findContentValueMock.mockReturnValueOnce(contentMocks.heading);
    findContentValueMock.mockReturnValueOnce(contentMocks.addToWallet);
    findContentValueMock.mockReturnValueOnce(contentMocks.viewPlanAccumulators);
  });

  it('calls getContent with expected props', () => {
    healthPlanScreenCMSContentWrapper(defaultLanguage, contentMock);

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      defaultLanguage,
      contentMock,
      CmsGroupKey.healthPlanScreen,
      2
    );
  });

  it('returns expected content', () => {
    const result = healthPlanScreenCMSContentWrapper(
      defaultLanguage,
      contentMock
    );

    expect(result).toEqual(contentMocks);
  });
});
