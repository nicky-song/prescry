// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { Heading } from '../../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { ISmartPriceLearnMoreModalContent } from './smart-price.learn-more-modal.content';
import { smartPriceLearnMoreModalStyles } from './smart-price.learn-more-modal.styles';
import { SmartPriceLearnMoreModal } from './smart-price.learn-more-modal';
import { getChildren } from '../../../../../testing/test.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';

jest.mock('../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: () => <div />,
}));

jest.mock('../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

describe('SmartPriceLearnMoreModal', () => {
  const onClosePressMock = jest.fn();
  const showModalMock = true;
  const viewStyleMock = {};

  const contentMock: ISmartPriceLearnMoreModalContent = {
    heading: 'heading',
    headingOneA: 'heading-one-a',
    headingOneB: 'heading-one-b',
    descriptionOne: 'description-one',
    headingTwoA: 'heading-two-a',
    headingTwoB: 'heading-two-b',
    headingTwoC: 'heading-two-c',
    descriptionTwo: 'description-two',
  };
  const isContentLoadingMock = false;

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('calls useContent as expected', () => {
    renderer.create(
      <SmartPriceLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.smartPriceLearnMoreModal,
      2
    );
  });

  it('renders as a SlideUpModal with expected props', () => {
    const testRenderer = renderer.create(
      <SmartPriceLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    expect(slideUpModal.type).toEqual(SlideUpModal);
    expect(slideUpModal.props.isVisible).toEqual(showModalMock);
    expect(slideUpModal.props.heading).toEqual(contentMock.heading);
    expect(slideUpModal.props.onClosePress).toEqual(onClosePressMock);
    expect(slideUpModal.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(slideUpModal.props.viewStyle).toEqual(viewStyleMock);

    const modalBody = slideUpModal.props.children;

    expect(modalBody.type).toEqual(View);
  });

  it('renders heading one as expected', () => {
    const testRenderer = renderer.create(
      <SmartPriceLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const modalBody = slideUpModal.props.children;

    const headingOne = getChildren(modalBody)[0];

    expect(headingOne.type).toEqual(BaseText);
    expect(headingOne.props.style).toEqual(
      smartPriceLearnMoreModalStyles.headingOneTextStyle
    );

    const headingOneA = getChildren(headingOne)[0];

    expect(headingOneA.type).toEqual(Heading);
    expect(headingOneA.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(headingOneA.props.level).toEqual(3);
    expect(headingOneA.props.children).toEqual(contentMock.headingOneA + ' ');

    const headingOneB = getChildren(headingOne)[1];

    expect(headingOneB.type).toEqual(Heading);
    expect(headingOneB.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(headingOneB.props.level).toEqual(3);
    expect(headingOneB.props.translateContent).toEqual(false);
    expect(headingOneB.props.children).toEqual(contentMock.headingOneB);
  });

  it('renders description one as expected', () => {
    const testRenderer = renderer.create(
      <SmartPriceLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const modalBody = slideUpModal.props.children;

    const descriptionOne = getChildren(modalBody)[1];

    expect(descriptionOne.type).toEqual(BaseText);
    expect(descriptionOne.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(descriptionOne.props.style).toEqual(
      smartPriceLearnMoreModalStyles.descriptionOneTextStyle
    );
  });

  it('renders heading two as expected', () => {
    const testRenderer = renderer.create(
      <SmartPriceLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const modalBody = slideUpModal.props.children;

    const headingTwo = getChildren(modalBody)[2];

    expect(headingTwo.type).toEqual(BaseText);
    expect(headingTwo.props.style).toEqual(
      smartPriceLearnMoreModalStyles.headingTwoTextStyle
    );

    const headingTwoA = getChildren(headingTwo)[0];
    const headingTwoB = getChildren(headingTwo)[1];
    const headingTwoC = getChildren(headingTwo)[2];

    expect(headingTwoA.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(headingTwoB.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(headingTwoC.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(headingTwoA.props.level).toEqual(3);
    expect(headingTwoB.props.level).toEqual(3);
    expect(headingTwoC.props.level).toEqual(3);

    expect(headingTwoA.props.children).toEqual(contentMock.headingTwoA + ' ');
    expect(headingTwoB.props.children).toEqual(contentMock.headingTwoB + ' ');
    expect(headingTwoC.props.children).toEqual(contentMock.headingTwoC);

    expect(headingTwoA.props.translateContent).toBeUndefined();
    expect(headingTwoB.props.translateContent).toEqual(false);
    expect(headingTwoC.props.translateContent).toBeUndefined();
  });

  it('renders description two as expected', () => {
    const testRenderer = renderer.create(
      <SmartPriceLearnMoreModal
        onClosePress={onClosePressMock}
        showModal={showModalMock}
        viewStyle={viewStyleMock}
      />
    );

    const slideUpModal = testRenderer.root.children[0] as ReactTestInstance;

    const modalBody = slideUpModal.props.children;

    const descriptionTwo = getChildren(modalBody)[3];

    expect(descriptionTwo.type).toEqual(BaseText);
    expect(descriptionTwo.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(descriptionTwo.props.style).toEqual(
      smartPriceLearnMoreModalStyles.descriptionTwoTextStyle
    );
    expect(descriptionTwo.props.children).toEqual(contentMock.descriptionTwo);
  });
});
