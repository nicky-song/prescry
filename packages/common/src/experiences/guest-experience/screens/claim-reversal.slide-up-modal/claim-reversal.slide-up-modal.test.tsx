// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SlideUpModal } from '../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { Heading } from '../../../../components/member/heading/heading';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { claimReversalSlideUpModalStyles } from './claim-reversal.slide-up-modal.styles';
import { IClaimReversalSlideUpModalContent } from './claim-reversal.slide-up-modal.content';
import { ClaimReversalSlideUpModal } from './claim-reversal.slide-up-modal';
import { getChildren } from '../../../../testing/test.helper';

jest.mock('../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: () => <div />,
}));

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

describe('ClaimReversalSlideUpModal', () => {
  const onClosePressMock = jest.fn();

  const contentMock: IClaimReversalSlideUpModalContent = {
    heading: 'heading-mock',
    headingOne: 'heading-one-mock',
    descriptionOne: 'description-one-mock',
    headingTwo: 'heading-two-mock',
    descriptionTwo: 'description-two-mock',
    headingThree: 'heading-three-mock',
    descriptionThree: 'description-three-mock',
  };

  const isContentLoadingMock = false;

  const viewStyleMock = {};

  const isVisibleMock = true;

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('renders as SlideUpModal with expected props', () => {
    const testRenderer = renderer.create(
      <ClaimReversalSlideUpModal
        onClosePress={onClosePressMock}
        viewStyle={viewStyleMock}
        isVisible={isVisibleMock}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.claimReversalSlideUpModal,
      2
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    expect(slideUpModal.type).toEqual(SlideUpModal);
    expect(slideUpModal.props.isVisible).toEqual(isVisibleMock);
    expect(slideUpModal.props.onClosePress).toEqual(onClosePressMock);
    expect(slideUpModal.props.heading).toEqual(contentMock.heading);
    expect(slideUpModal.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(slideUpModal.props.viewStyle).toEqual(viewStyleMock);
    expect(slideUpModal.props.testID).toEqual('claimReversalSlideUpModal');
    expect(slideUpModal.props.children).toBeDefined();
  });

  it('renders children as expected', () => {
    const testRenderer = renderer.create(
      <ClaimReversalSlideUpModal
        onClosePress={onClosePressMock}
        viewStyle={viewStyleMock}
        isVisible={isVisibleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const children = slideUpModal.props.children;

    expect(getChildren(children).length).toEqual(6);

    const headingOne = getChildren(children)[0];
    const descriptionOne = getChildren(children)[1];
    const headingTwo = getChildren(children)[2];
    const descriptionTwo = getChildren(children)[3];
    const headingThree = getChildren(children)[4];
    const descriptionThree = getChildren(children)[5];

    expect(headingOne.type).toEqual(Heading);
    expect(headingOne.props.textStyle).toEqual(
      claimReversalSlideUpModalStyles.headingOneTextStyle
    );
    expect(headingOne.props.level).toEqual(3);
    expect(headingOne.props.children).toEqual(contentMock.headingOne);
    expect(headingOne.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(headingTwo.type).toEqual(Heading);
    expect(headingTwo.props.textStyle).toEqual(
      claimReversalSlideUpModalStyles.headingTwoTextStyle
    );
    expect(headingTwo.props.level).toEqual(3);
    expect(headingTwo.props.children).toEqual(contentMock.headingTwo);
    expect(headingTwo.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(headingThree.type).toEqual(Heading);
    expect(headingThree.props.textStyle).toEqual(
      claimReversalSlideUpModalStyles.headingThreeTextStyle
    );
    expect(headingThree.props.level).toEqual(3);
    expect(headingThree.props.children).toEqual(contentMock.headingThree);
    expect(headingThree.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(descriptionOne.type).toEqual(BaseText);
    expect(descriptionOne.props.style).toEqual(
      claimReversalSlideUpModalStyles.descriptionOneTextStyle
    );
    expect(descriptionOne.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(descriptionOne.props.skeletonWidth).toEqual('long');
    expect(descriptionOne.props.children).toEqual(contentMock.descriptionOne);

    expect(descriptionTwo.type).toEqual(BaseText);
    expect(descriptionTwo.props.style).toEqual(
      claimReversalSlideUpModalStyles.descriptionTwoTextStyle
    );
    expect(descriptionTwo.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(descriptionTwo.props.skeletonWidth).toEqual('long');
    expect(descriptionTwo.props.children).toEqual(contentMock.descriptionTwo);

    expect(descriptionThree.type).toEqual(BaseText);
    expect(descriptionThree.props.style).toEqual(
      claimReversalSlideUpModalStyles.descriptionThreeTextStyle
    );
    expect(descriptionThree.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(descriptionThree.props.skeletonWidth).toEqual('long');
    expect(descriptionThree.props.children).toEqual(
      contentMock.descriptionThree
    );
  });
});
