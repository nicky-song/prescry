// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SlideUpModal } from './slide-up.modal';
import Modal from 'react-native-modal';
import { getChildren } from '../../../testing/test.helper';
import { ScrollView, View, ViewStyle } from 'react-native';
import { ITestContainer } from '../../../testing/test.container';
import { slideUpModalStyles } from './slide-up.modal.styles';
import { Heading } from '../../member/heading/heading';
import { IconButton } from '../../buttons/icon/icon.button';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IGlobalContent } from '../../../models/cms-content/global.content';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('react-native-modal', () => ({
  __esModule: true,
  default: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

describe('SlideUpModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: {} });
  });

  it.each([[undefined], [false], [true]])(
    'renders in modal (isVisible: %p)',
    (isVisibleMock: undefined | boolean) => {
      const viewStyleMock: ViewStyle = {
        width: 1,
      };

      const testIDMock = 'test-id-mock';

      const testRenderer = renderer.create(
        <SlideUpModal
          heading=''
          onClosePress={jest.fn()}
          viewStyle={viewStyleMock}
          isVisible={isVisibleMock}
          testID={testIDMock}
        >
          <div />
        </SlideUpModal>
      );

      const modal = testRenderer.root.children[0] as ReactTestInstance;

      expect(modal.type).toEqual(Modal);
      expect(modal.props.style).toEqual([
        slideUpModalStyles.modalViewStyle,
        viewStyleMock,
      ]);
      expect(modal.props.isVisible).toEqual(!!isVisibleMock);
      expect(modal.props.backdropOpacity).toEqual(0.5);
      expect(modal.props.testID).toEqual(testIDMock);
      expect(getChildren(modal).length).toEqual(1);
    }
  );

  it('renders scroll view container', () => {
    const testRenderer = renderer.create(
      <SlideUpModal heading='' onClosePress={jest.fn()}>
        <div />
      </SlideUpModal>
    );

    const modal = testRenderer.root.findByProps({ testID: 'slideUpModal' });
    const contentContainer = getChildren(modal)[0];

    expect(contentContainer.type).toEqual(ScrollView);
    expect(contentContainer.props.style).toEqual(
      slideUpModalStyles.contentViewStyle
    );
    expect(contentContainer.props.testID).toEqual(
      'slideUpModalContentContainer'
    );
    expect(getChildren(contentContainer).length).toEqual(1);
  });

  it('renders content container', () => {
    const testRenderer = renderer.create(
      <SlideUpModal heading='' onClosePress={jest.fn()}>
        <div />
      </SlideUpModal>
    );

    const modal = testRenderer.root.findByType(ScrollView);
    const contentContainer = getChildren(modal)[0];

    expect(contentContainer.type).toEqual(View);
    expect(getChildren(contentContainer).length).toEqual(2);
  });

  it('renders heading container', () => {
    const testRenderer = renderer.create(
      <SlideUpModal heading='' onClosePress={jest.fn()}>
        <div />
      </SlideUpModal>
    );

    const container = testRenderer.root.findByProps({
      testID: 'slideUpModalContentContainer',
    });
    const contentContainer = getChildren(container)[0];
    const headingContainer = getChildren(contentContainer)[0];

    expect(headingContainer.type).toEqual(View);
    expect(headingContainer.props.style).toEqual(
      slideUpModalStyles.headingViewStyle
    );
    expect(headingContainer.props.testID).toEqual(
      'slideUpModalHeadingContainer'
    );
    expect(getChildren(headingContainer).length).toEqual(2);
  });

  it('renders heading', () => {
    const headingMock = 'heading';
    const isSkeletonMock = true;
    const testRenderer = renderer.create(
      <SlideUpModal
        heading={headingMock}
        isSkeleton={isSkeletonMock}
        onClosePress={jest.fn()}
      >
        <div />
      </SlideUpModal>
    );

    const headingContainer = testRenderer.root.findByProps({
      testID: 'slideUpModalHeadingContainer',
    });
    const heading = getChildren(headingContainer)[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(2);
    expect(heading.props.isSkeleton).toEqual(isSkeletonMock);
    expect(heading.props.children).toEqual(headingMock);
  });

  it('renders close button', () => {
    const onClosePressMock = jest.fn();
    const contentMock: Partial<IGlobalContent> = {
      closeDialog: 'close-dialog',
    };
    useContentMock.mockReturnValue({ content: contentMock });

    const testRenderer = renderer.create(
      <SlideUpModal heading='' onClosePress={onClosePressMock}>
        <div />
      </SlideUpModal>
    );

    const headingContainer = testRenderer.root.findByProps({
      testID: 'slideUpModalHeadingContainer',
    });
    const closeButton = getChildren(headingContainer)[1];

    expect(closeButton.type).toEqual(IconButton);
    expect(closeButton.props.iconName).toEqual('times');
    expect(closeButton.props.iconTextStyle).toEqual(
      slideUpModalStyles.iconTextStyle
    );
    expect(closeButton.props.accessibilityLabel).toEqual(
      contentMock.closeDialog
    );
    expect(closeButton.props.onPress).toEqual(onClosePressMock);
  });

  it('renders children', () => {
    const ChildMock = () => <div />;

    const testRenderer = renderer.create(
      <SlideUpModal heading='' onClosePress={jest.fn()}>
        <ChildMock />
      </SlideUpModal>
    );

    const container = testRenderer.root.findByProps({
      testID: 'slideUpModalContentContainer',
    });
    const children = getChildren(container)[0];

    expect(getChildren(children)[1]).toEqual(<ChildMock />);
  });
});
