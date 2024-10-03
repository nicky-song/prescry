// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import { getChildren } from '../../../../testing/test.helper';
import { PrimaryCheckBox } from '../../../checkbox/primary-checkbox/primary-checkbox';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { LinkCheckbox } from './link.checkbox';
import { linkCheckboxStyles } from './link.checkbox.styles';

jest.mock('../../../checkbox/primary-checkbox/primary-checkbox', () => ({
  PrimaryCheckBox: () => <div />,
}));

jest.mock('../../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

describe('LinkCheckbox ', () => {
  it('renders as PrimaryCheckBox', () => {
    const toggleCheckBoxMock = jest.fn();
    const checkboxValueMock = 'checkbox-value';
    const checkboxCheckedMock = false;
    const mockedTestID = 'mockTestID';

    const testRenderer = renderer.create(
      <LinkCheckbox
        onLinkPress={jest.fn()}
        onCheckboxPress={toggleCheckBoxMock}
        markdown='markdown'
        checkboxValue={checkboxValueMock}
        checkboxChecked={checkboxCheckedMock}
        testID={mockedTestID}
      />
    );

    const checkbox = testRenderer.root.children[0] as ReactTestInstance;

    expect(checkbox.type).toEqual(PrimaryCheckBox);
    expect(checkbox.props.onPress).toEqual(toggleCheckBoxMock);
    expect(checkbox.props.checkBoxValue).toEqual(checkboxValueMock);
    expect(checkbox.props.checkBoxChecked).toEqual(checkboxCheckedMock);
    expect(checkbox.props.testID).toBe(`${mockedTestID}LinkCheckBox`);
  });

  it('renders checkbox label in view container', () => {
    const testRenderer = renderer.create(
      <LinkCheckbox
        onLinkPress={jest.fn()}
        onCheckboxPress={jest.fn()}
        markdown='markdown'
        checkboxValue='checkbox-value'
      />
    );

    const checkbox = testRenderer.root.findByType(PrimaryCheckBox);

    const labelRenderer = renderer.create(checkbox.props.checkBoxLabel);
    const viewContainer = labelRenderer.root.findByType(View);

    expect(viewContainer.props.onStartShouldSetResponderCapture).toEqual(
      expect.any(Function)
    );
    expect(getChildren(viewContainer).length).toEqual(1);
  });

  it.each([
    ['Agree', false],
    ['Terms and Conditions', true],
    ['and', false],
    ['Privacy Policy', true],
  ])(
    'rejects checkbox click if markdown link clicked (clicked text: %p)',
    (clickedTextMock: string, shouldReject: boolean) => {
      const testRenderer = renderer.create(
        <LinkCheckbox
          onLinkPress={jest.fn()}
          onCheckboxPress={jest.fn()}
          markdown='Agree to the [Terms and Conditions](terms) and the [Privacy Policy](privacy).'
          checkboxValue='checkbox-value'
          checkboxChecked={!shouldReject}
        />
      );

      const checkbox = testRenderer.root.findByType(PrimaryCheckBox);

      const labelRenderer = renderer.create(checkbox.props.checkBoxLabel);
      const viewContainer = labelRenderer.root.findByType(View);
      const onStartShouldSetResponderCapture =
        viewContainer.props.onStartShouldSetResponderCapture;

      const stopPropagationMock = jest.fn();
      const handlerResponse = onStartShouldSetResponderCapture({
        nativeEvent: { target: { innerText: clickedTextMock } },
        stopPropagation: stopPropagationMock,
      });

      if (shouldReject) {
        expect(stopPropagationMock).toHaveBeenCalledWith();
      } else {
        expect(stopPropagationMock).not.toHaveBeenCalled();
      }

      expect(handlerResponse).toEqual(shouldReject);
      expect(checkbox.props.checkBoxChecked).toEqual(!shouldReject);
    }
  );

  it('renders markdown', () => {
    const markdownMock = 'markdown';
    const onLinkPressMock = jest.fn();
    const testRenderer = renderer.create(
      <LinkCheckbox
        onLinkPress={onLinkPressMock}
        onCheckboxPress={jest.fn()}
        markdown={markdownMock}
        checkboxValue='checkbox-value'
      />
    );

    const checkbox = testRenderer.root.findByType(PrimaryCheckBox);

    const labelRenderer = renderer.create(checkbox.props.checkBoxLabel);
    const viewContainer = labelRenderer.root.findByType(View);
    const markdownText = getChildren(viewContainer)[0];

    expect(markdownText.type).toEqual(MarkdownText);
    expect(markdownText.props.textStyle).toEqual(
      linkCheckboxStyles.baseTextStyle
    );
    expect(markdownText.props.onLinkPress).toEqual(onLinkPressMock);
    expect(markdownText.props.children).toEqual(markdownMock);
  });
});
