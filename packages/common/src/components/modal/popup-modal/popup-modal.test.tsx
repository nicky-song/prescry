// Copyright 2018 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../testing/test.container';
import { BaseButton } from '../../buttons/base/base.button';
import { SecondaryButton } from '../../buttons/secondary/secondary.button';
import { Heading } from '../../member/heading/heading';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { RecoveryEmailSuccessModal } from '../recover-email-success-modal/recovery-email-success-modal';
import { RecoveryEmailModalConnected } from '../recovery-email-modal/recovery-email-modal.connected';
import { PopupModal } from './popup-modal';
import { popupModalContent } from './popup-modal.content';
import { popupModalstyles } from './popup-modal.styles';

jest.mock(
  '../recover-email-success-modal/recovery-email-success-modal',
  () => ({
    RecoveryEmailSuccessModal: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock('../recovery-email-modal/recovery-email-modal.connected', () => ({
  RecoveryEmailModalConnected: ({ children }: ITestContainer) => (
    <div>{children}</div>
  ),
}));

jest.mock('../welcome-modal/welcome-modal', () => ({
  WelcomeModal: () => <div />,
}));

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('react', () => ({
  ...(jest.requireActual('react') as object),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const setHeight = jest.fn();
const setZIndex = jest.fn();
const setCurrentModalType = jest.fn();

interface IStateMock {
  height?: string;
}

describe('PopupModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    stateReset({});
  });

  it('should not null Animate.View', () => {
    const testRenderer = renderer.create(<PopupModal />);
    const modalView = testRenderer.root.findByType(Animated.View);
    expect(modalView).not.toBeNull();
  });

  it('should use useEffect on isOpen set', () => {
    const mockIsOpen = true;
    const mockIsClosed = false;
    const testRenderer = renderer.create(<PopupModal isOpen={mockIsOpen} />);
    useEffectMock.mock.calls[0][0]();
    expect(useEffectMock.mock.calls[0][1]).toEqual([mockIsOpen]);
    expect(useEffectMock).toHaveBeenCalledTimes(1);

    useStateMock
      .mockReturnValueOnce([new Animated.Value(300)])
      .mockReturnValueOnce(['100%', setHeight])
      .mockReturnValueOnce([1, setZIndex])
      .mockReturnValueOnce([undefined, setCurrentModalType]);
    testRenderer.update(<PopupModal isOpen={mockIsClosed} />);
    useEffectMock.mock.calls[1][0]();
    expect(useEffectMock.mock.calls[1][1]).toEqual([mockIsClosed]);
    expect(useEffectMock).toHaveBeenCalledTimes(2);
  });

  it('renders main container with expected properties', () => {
    const testRenderer = renderer.create(<PopupModal />);
    const styleMock = {
      ...popupModalstyles.modalContainerViewStyle,
      opacity: 0,
      height: '0%',
      zIndex: -1,
    };
    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    expect(container.props.style).toEqual(styleMock);
  });

  it('renders inner container with expected properties', () => {
    const testRenderer = renderer.create(<PopupModal />);
    const styleMock = [
      {
        ...popupModalstyles.modalInnerContainerViewStyle,
      },
      undefined,
    ];
    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const innerContainer = container.props.children;
    expect(innerContainer.type).toEqual(View);
    expect(innerContainer.props.style).toEqual(styleMock);
  });

  it('renders content message if content prop is set', () => {
    const contentMock = 'Message to display';
    const testRenderer = renderer.create(<PopupModal content={contentMock} />);

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const innerContainer = container.props.children;
    expect(innerContainer.props.children.props.testID).toEqual(
      'defaultPopupModal'
    );
    const content = innerContainer.props.children.props.children[1];
    expect(content.type).toEqual(View);
    expect(content.props.style).toEqual(
      popupModalstyles.contentContainerViewStyle
    );

    const contentText = content.props.children;
    expect(contentText.type).toEqual(MarkdownText);
    expect(contentText.props.children).toEqual(contentMock);
  });

  it('renders base button if event is set', () => {
    const primaryButtonPressMock = jest.fn();
    const primaryLabelMock = 'Primary';
    const contentMock = 'Message to display';
    const buttonSizeMock = 'medium';
    const primaryButtonTestIDMock = 'primary-button-test-id-mock';
    const testRenderer = renderer.create(
      <PopupModal
        primaryButtonLabel={primaryLabelMock}
        onPrimaryButtonPress={primaryButtonPressMock}
        content={contentMock}
        buttonSize={buttonSizeMock}
        primaryButtonTestID={primaryButtonTestIDMock}
      />
    );

    const baseButton = testRenderer.root.findAllByType(BaseButton)[0];
    expect(baseButton.props.children).toEqual(primaryLabelMock);
    expect(baseButton.props.size).toEqual(buttonSizeMock);
    expect(baseButton.props.onPress).toEqual(primaryButtonPressMock);
    expect(baseButton.props.viewStyle).toEqual(
      popupModalstyles.mediumButtonViewStyle
    );
    expect(baseButton.props.testID).toEqual(primaryButtonTestIDMock);
  });

  it('renders secondary button with medium size', () => {
    const secondaryButtonPressMock = jest.fn();
    const secondaryLabel = 'Secondary';
    const contentMock = 'Message to display';
    const buttonSizeMock = 'medium';
    const secondaryButtonTestIDMock = 'secondary-button-test-id-mock';
    const testRenderer = renderer.create(
      <PopupModal
        secondaryButtonLabel={secondaryLabel}
        onSecondaryButtonPress={secondaryButtonPressMock}
        content={contentMock}
        buttonSize={buttonSizeMock}
        secondaryButtonTestID={secondaryButtonTestIDMock}
      />
    );

    const secondaryButton = testRenderer.root.findAllByType(SecondaryButton)[0];
    expect(secondaryButton.props.onPress).toEqual(secondaryButtonPressMock);
    expect(secondaryButton.props.children).toEqual(secondaryLabel);
    expect(secondaryButton.props.viewStyle).toEqual([
      popupModalstyles.secondaryButtonViewStyle,
      popupModalstyles.mediumButtonViewStyle,
    ]);
    expect(secondaryButton.props.testID).toEqual(secondaryButtonTestIDMock);
  });

  it('renders secondary button if event is set', () => {
    const primaryButtonPressMock = jest.fn();
    const secondaryButtonPressMock = jest.fn();
    const secondaryLabel = 'Secondary';
    const contentMock = 'Message to display';
    const testRenderer = renderer.create(
      <PopupModal
        onPrimaryButtonPress={primaryButtonPressMock}
        secondaryButtonLabel={secondaryLabel}
        onSecondaryButtonPress={secondaryButtonPressMock}
        content={contentMock}
        buttonSize='large'
      />
    );
    const baseButton = testRenderer.root.findAllByType(BaseButton)[0];
    expect(baseButton.props.children).toEqual(
      popupModalContent.defaultCloseText
    );
    expect(baseButton.props.viewStyle).toBeUndefined();
    const secondaryButton = testRenderer.root.findAllByType(SecondaryButton)[0];
    expect(secondaryButton.props.onPress).toEqual(secondaryButtonPressMock);
    expect(secondaryButton.props.children).toEqual(secondaryLabel);
    expect(secondaryButton.props.viewStyle).toEqual([
      popupModalstyles.secondaryButtonViewStyle,
      undefined,
    ]);
  });

  it('renders recovery email modal in body', () => {
    useStateMock.mockReset();
    useStateMock
      .mockReturnValueOnce([new Animated.Value(0)])
      .mockReturnValueOnce(['0%', setHeight])
      .mockReturnValueOnce([-1, setZIndex])
      .mockReturnValueOnce(['recoveryEmailModal', setCurrentModalType]);
    const testRenderer = renderer.create(
      <PopupModal modalType='recoveryEmailModal' />
    );
    const recoveryEmail = testRenderer.root.findAllByType(
      RecoveryEmailModalConnected,
      {
        deep: false,
      }
    )[0];
    expect(recoveryEmail).toBeDefined();
  });

  it('renders success recovery email body', () => {
    useStateMock.mockReset();
    useStateMock
      .mockReturnValueOnce([new Animated.Value(0)])
      .mockReturnValueOnce(['0%', setHeight])
      .mockReturnValueOnce([-1, setZIndex])
      .mockReturnValueOnce(['recoveryEmailSuccessModal', setCurrentModalType]);
    const testRenderer = renderer.create(
      <PopupModal modalType='recoveryEmailSuccessModal' />
    );
    const recoveryEmail = testRenderer.root.findAllByType(
      RecoveryEmailSuccessModal,
      {
        deep: false,
      }
    )[0];
    expect(recoveryEmail).toBeDefined();
  });

  it('renders title if text defined', () => {
    const primaryButtonPressMock = jest.fn();
    const primaryLabelMock = 'Primary';
    const titleText = 'Title text';
    const contentMock = 'Message to display';

    const testRenderer = renderer.create(
      <PopupModal
        primaryButtonLabel={primaryLabelMock}
        onPrimaryButtonPress={primaryButtonPressMock}
        titleText={titleText}
        content={contentMock}
      />
    );

    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    const innerContainer = container.props.children;
    const heading = innerContainer.props.children.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(3);
    expect(heading.props.textStyle).toEqual(popupModalstyles.titleTextStyle);
    expect(heading.props.children).toEqual(titleText);
  });
});

function stateReset(stateMock: IStateMock) {
  const height = stateMock.height ?? '0%';
  const zIndex = stateMock.height ?? -1;
  setHeight.mockReset();
  setZIndex.mockReset();
  setCurrentModalType.mockReset();

  useStateMock.mockReset();
  useStateMock
    .mockReturnValueOnce([new Animated.Value(0)])
    .mockReturnValueOnce([height, setHeight])
    .mockReturnValueOnce([zIndex, setZIndex])
    .mockReturnValueOnce([undefined, setCurrentModalType]);
}
