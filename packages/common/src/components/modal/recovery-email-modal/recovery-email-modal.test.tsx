// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../testing/test.container';
import { BaseButton } from '../../buttons/base/base.button';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { RecoveryEmailModal } from './recovery-email-modal';
import { recoveryEmailModalContent } from './recovery-email-modal.content';
import { recoveryEmailModalStyles } from './recovery-email-modal.styles';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('react', () => ({
  ...(jest.requireActual('react') as object),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const setInputValue = jest.fn();
const setShowEmailError = jest.fn();
const setPrimaryButtonEnabled = jest.fn();

const onChangeModalType = jest.fn();

describe('RecoveryEmailModal', () => {
  beforeEach(() => {
    useEffectMock.mockReset();
    useStateMock
      .mockReturnValueOnce(['', setInputValue])
      .mockReturnValueOnce([false, setShowEmailError])
      .mockReturnValueOnce([false, setPrimaryButtonEnabled]);
    useNavigationMock.mockReset();
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });
  it('renders title with expected properties', () => {
    const testRenderer = renderer.create(
      <RecoveryEmailModal
        onChangeModalType={onChangeModalType}
        addEmailAction={jest.fn()}
      />
    );

    const titleContainer = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];
    const title = titleContainer.props.children;

    expect(titleContainer.props.style).toEqual(
      recoveryEmailModalStyles.titleContainerViewStyle
    );
    expect(title.props.level).toEqual(2);
    expect(title.props.children).toEqual(recoveryEmailModalContent.titleText);
  });

  it('renders content with expected properties', () => {
    const testRenderer = renderer.create(
      <RecoveryEmailModal
        onChangeModalType={onChangeModalType}
        addEmailAction={jest.fn()}
      />
    );

    const contentContainer = testRenderer.root.findAllByType(View, {
      deep: false,
    })[1];
    const content = contentContainer.props.children;

    expect(content.type).toEqual(MarkdownText);
    expect(content.props.children).toEqual(recoveryEmailModalContent.mainText);
  });

  it('renders textInput with expected properties', () => {
    const testRenderer = renderer.create(
      <RecoveryEmailModal
        onChangeModalType={onChangeModalType}
        addEmailAction={jest.fn()}
      />
    );

    const inputFieldContainer = testRenderer.root.findAllByType(View, {
      deep: false,
    })[2];
    const textInput = inputFieldContainer.props.children;

    expect(inputFieldContainer.props.style).toEqual(
      recoveryEmailModalStyles.textFieldsViewStyle
    );
    expect(textInput.props.textContentType).toEqual('emailAddress');
    expect(textInput.props.placeholder).toEqual(
      recoveryEmailModalContent.emailPlaceHolder
    );
    expect(textInput.props.testID).toBe('recoveryEmailModalEmailAddress');
  });

  it('renders button with expected properties', () => {
    useStateMock
      .mockReturnValueOnce(['', setInputValue])
      .mockReturnValueOnce([false, setShowEmailError])
      .mockReturnValueOnce([false, setPrimaryButtonEnabled]);

    const testRenderer = renderer.create(
      <RecoveryEmailModal
        onChangeModalType={onChangeModalType}
        addEmailAction={jest.fn()}
      />
    );

    const baseButton = testRenderer.root.findAllByType(BaseButton)[0];

    expect(baseButton.props.children).toEqual(
      recoveryEmailModalContent.buttonText
    );
    expect(baseButton.props.disabled).toEqual(true);
  });
});
