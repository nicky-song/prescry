// Copyright 2021 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { IconButton } from '../../buttons/icon/icon.button';
import { BaseText } from '../../text/base-text/base-text';

import { DialogModal } from './dialog-modal';
import { dialogModalContent } from './dialog-modal.content';
import { dialogModalStyles } from './dialog-modal.style';

jest.mock('react', () => ({
  ...(jest.requireActual('react') as object),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('../../buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

const setHeight = jest.fn();
const setZIndex = jest.fn();
const setCurrentModalType = jest.fn();

interface IStateMock {
  height?: string;
}

describe('DialogModal', () => {
  beforeEach(() => {
    useEffectMock.mockReset();
    stateReset({});
  });

  it('should use useEffect on isOpen set', () => {
    const mockIsOpen = true;
    const mockIsClosed = false;
    const testRenderer = renderer.create(<DialogModal isOpen={mockIsOpen} />);
    expect(useEffectMock.mock.calls[0][1]).toEqual([mockIsOpen]);
    expect(useEffectMock).toHaveBeenCalledTimes(1);

    useStateMock
      .mockReturnValueOnce([new Animated.Value(300)])
      .mockReturnValueOnce([1, setZIndex]);
    testRenderer.update(<DialogModal isOpen={mockIsClosed} />);
    expect(useEffectMock.mock.calls[1][1]).toEqual([mockIsClosed]);
    expect(useEffectMock).toHaveBeenCalledTimes(2);
  });

  it('renders as Animated.View', () => {
    const testRenderer = renderer.create(<DialogModal />);

    const animatedView = testRenderer.root.children[0] as ReactTestInstance;
    expect(animatedView.type).toEqual(Animated.View);
    expect(animatedView.props.style[0]).toEqual(
      dialogModalStyles.modalContainerViewStyle
    );
    expect(getChildren(animatedView).length).toEqual(1);
  });

  it('renders animated content container', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <DialogModal viewStyle={customViewStyle} />
    );

    const animatedView = testRenderer.root.findByType(Animated.View);
    const animatedContentContainer = getChildren(animatedView)[0];

    expect(animatedContentContainer.type).toEqual(View);
    expect(animatedContentContainer.props.style).toEqual([
      dialogModalStyles.modalInnerContainerViewStyle,
      customViewStyle,
    ]);
    expect(getChildren(animatedContentContainer).length).toEqual(3);
  });

  it('renders header container', () => {
    const testRenderer = renderer.create(<DialogModal />);

    const animatedView = testRenderer.root.findByType(Animated.View);
    const animatedContentContainer = getChildren(animatedView)[0];
    const headerContainer = getChildren(animatedContentContainer)[0];

    expect(headerContainer.type).toEqual(View);
    expect(headerContainer.props.style).toEqual(
      dialogModalStyles.headerContainerViewStyle
    );
    expect(getChildren(headerContainer).length).toEqual(2);
  });

  it('renders header text', () => {
    const headerMock = 'header';
    const testRenderer = renderer.create(<DialogModal header={headerMock} />);

    const animatedView = testRenderer.root.findByType(Animated.View);
    const animatedContentContainer = getChildren(animatedView)[0];
    const headerContainer = getChildren(animatedContentContainer)[0];
    const headerText = getChildren(headerContainer)[0];

    expect(headerText.type).toEqual(BaseText);
    expect(headerText.props.size).toEqual('extraLarge');
    expect(headerText.props.weight).toEqual('semiBold');
    expect(getChildren(headerText)[0]).toEqual(headerMock);
  });

  it.each([
    [undefined, false],
    [jest.fn(), true],
  ])(
    'renders close button (onClose: %p)',
    (onCloseMock: undefined | jest.Mock, isButtonExpected: boolean) => {
      const testRenderer = renderer.create(
        <DialogModal onClose={onCloseMock} />
      );

      const animatedView = testRenderer.root.findByType(Animated.View);
      const animatedContentContainer = getChildren(animatedView)[0];
      const headerContainer = getChildren(animatedContentContainer)[0];
      const closeButtonContainer = getChildren(headerContainer)[1];

      if (!isButtonExpected) {
        expect(closeButtonContainer).toBeNull();
      } else {
        expect(closeButtonContainer.type).toEqual(View);
        expect(closeButtonContainer.props.style).toEqual(
          dialogModalStyles.closeBtnContainer
        );

        const children = getChildren(closeButtonContainer);
        expect(children.length).toEqual(1);

        const closeButton = children[0];
        expect(closeButton.type).toEqual(IconButton);
        expect(closeButton.props.iconName).toEqual('times');
        expect(closeButton.props.onPress).toEqual(onCloseMock);
        expect(closeButton.props.accessibilityLabel).toEqual(
          dialogModalContent.closeButtonLabel
        );
        expect(closeButton.props.iconTextStyle).toEqual(
          dialogModalStyles.iconButtonTextStyle
        );
      }
    }
  );

  it('renders content message if content prop is set', () => {
    const bodyMock = <div>Message to display</div>;
    const headerMock = <div>header</div>;
    const footerMock = <div>footer</div>;
    const testRenderer = renderer.create(
      <DialogModal body={bodyMock} header={headerMock} footer={footerMock} />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const innerContainer = container.props.children;
    const header = innerContainer.props.children[0];
    expect(header.type).toEqual(View);
    expect(header.props.style).toEqual(
      dialogModalStyles.headerContainerViewStyle
    );

    const body = innerContainer.props.children[1];
    expect(body.type).toEqual(View);
    expect(body.props.style).toEqual(dialogModalStyles.bodyContainerViewStyle);
    expect(body.props.children).toEqual(bodyMock);

    const footer = innerContainer.props.children[2];
    expect(footer.type).toEqual(View);
    expect(footer.props.style).toEqual(
      dialogModalStyles.footerContainerViewStyle
    );
    expect(footer.props.children).toEqual(footerMock);
  });
});

function stateReset(stateMock: IStateMock) {
  const zIndex = stateMock.height ?? -1;
  setHeight.mockReset();
  setZIndex.mockReset();
  setCurrentModalType.mockReset();

  useStateMock.mockReset();
  useStateMock
    .mockReturnValueOnce([new Animated.Value(0)])
    .mockReturnValueOnce([zIndex, setZIndex]);
}
