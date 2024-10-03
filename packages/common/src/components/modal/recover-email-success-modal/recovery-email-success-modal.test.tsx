// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../testing/test.container';
import { BaseButton } from '../../buttons/base/base.button';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { RecoveryEmailSuccessModal } from './recovery-email-success-modal';
import { recoveryEmailSuccessModalContent } from './recovery-email-success-modal.content';
import { recoveryEmailSuccessModalStyles } from './recovery-email-success-modal.styles';

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

describe('RecoveryEmailSuccessModal', () => {
  it('renders as expected', () => {
    const testRenderer = renderer.create(<RecoveryEmailSuccessModal />);

    const titleContainer = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];
    const title = titleContainer.props.children;

    const contentContainer = testRenderer.root.findAllByType(View, {
      deep: false,
    })[1];
    const content = contentContainer.props.children;

    const button = testRenderer.root.findByType(BaseButton);

    expect(titleContainer.props.style).toEqual(
      recoveryEmailSuccessModalStyles.titleContainerViewStyle
    );
    expect(title.props.level).toEqual(2);
    expect(title.props.children).toEqual(
      recoveryEmailSuccessModalContent.titleText
    );
    expect(contentContainer.props.style).toEqual(
      recoveryEmailSuccessModalStyles.contentContainerViewStyle
    );
    expect(content.type).toEqual(MarkdownText);
    expect(content.props.children).toEqual(
      recoveryEmailSuccessModalContent.mainText
    );
    expect(button.props.children).toEqual(
      recoveryEmailSuccessModalContent.buttonText
    );
    expect(button.props.testID).toBe('recoveryEmailSuccessModalCloseButton');
  });
});
