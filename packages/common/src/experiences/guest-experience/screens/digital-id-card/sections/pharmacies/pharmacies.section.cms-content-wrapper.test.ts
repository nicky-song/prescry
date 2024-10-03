// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { pharmaciesSectionCMSContentWrapper } from './pharmacies.section.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

const languageMock = defaultLanguage;
const contentMock = new Map();

const contentValuesMock = {
  heading: 'heading-mock',
  label: 'label-mock',
  description: 'description-mock',
};

describe('pharmaciesSectionCMSContentWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getContentMock.mockReturnValue({});

    findContentValueMock.mockReturnValueOnce(contentValuesMock.heading);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.label);
    findContentValueMock.mockReturnValueOnce(contentValuesMock.description);
  });

  it('returns expected content', () => {
    const result = pharmaciesSectionCMSContentWrapper(
      languageMock,
      contentMock
    );

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      languageMock,
      contentMock,
      CmsGroupKey.pharmaciesSection,
      2
    );

    expect(result).toEqual(contentValuesMock);
  });
});
