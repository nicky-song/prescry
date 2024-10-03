// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { prescribersSectionCMSContentWrapper } from './prescribers.section.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

const languageMock = defaultLanguage;
const contentMock = new Map();

const contentValuesMock = {
  heading: 'heading-mock',
  labelOne: 'label-one-mock',
  descriptionOne: 'description-one-mock',
  labelTwo: 'label-two-mock',
  descriptionTwo: 'description-two-mock',
};

describe('prescribersSectionCMSContentWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getContentMock.mockReturnValue({});

    findContentValueMock.mockReturnValueOnce(contentValuesMock.heading);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.labelOne);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.descriptionOne);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.labelTwo);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.descriptionTwo);
  });

  it('returns expected content', () => {
    const result = prescribersSectionCMSContentWrapper(
      languageMock,
      contentMock
    );

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      languageMock,
      contentMock,
      CmsGroupKey.prescribersSection,
      2
    );

    expect(result).toEqual(contentValuesMock);
  });
});
