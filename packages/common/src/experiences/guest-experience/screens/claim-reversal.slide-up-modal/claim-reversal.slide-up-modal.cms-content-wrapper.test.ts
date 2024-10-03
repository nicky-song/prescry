// Copyright 2023 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { IUIContent } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IClaimReversalSlideUpModalContent } from './claim-reversal.slide-up-modal.content';
import { claimReversalSlideUpModalCMSContentWrapper } from './claim-reversal.slide-up-modal.cms-content-wrapper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('claimReversalSlideUpModalCMSContentWrapper', () => {
  const contentMock: IClaimReversalSlideUpModalContent = {
    heading: 'heading-mock',
    headingOne: 'heading-one-mock',
    descriptionOne: 'description-one-mock',
    headingTwo: 'heading-two-mock',
    descriptionTwo: 'description-two-mock',
    headingThree: 'heading-three-mock',
    descriptionThree: 'description-three-mock',
  };

  const uiContentMock: IUIContent[] = [];

  const languageMock = defaultLanguage;

  const contentMapMock = new Map();

  beforeEach(() => {
    jest.clearAllMocks();

    findContentValueMock.mockReturnValueOnce(contentMock.heading);
    findContentValueMock.mockReturnValueOnce(contentMock.headingOne);
    findContentValueMock.mockReturnValueOnce(contentMock.descriptionOne);
    findContentValueMock.mockReturnValueOnce(contentMock.headingTwo);
    findContentValueMock.mockReturnValueOnce(contentMock.descriptionTwo);
    findContentValueMock.mockReturnValueOnce(contentMock.headingThree);
    findContentValueMock.mockReturnValueOnce(contentMock.descriptionThree);

    getContentMock.mockReturnValue(uiContentMock);
  });

  it('returns expected content', () => {
    const result = claimReversalSlideUpModalCMSContentWrapper(
      languageMock,
      contentMapMock
    );

    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(getContentMock).toHaveBeenNthCalledWith(
      1,
      languageMock,
      contentMapMock,
      CmsGroupKey.claimReversalSlideUpModal,
      2
    );

    expect(result).toEqual(contentMock);
  });
});
