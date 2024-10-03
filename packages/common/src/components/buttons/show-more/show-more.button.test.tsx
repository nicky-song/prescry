// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { PrimaryColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton } from '../base/base.button';
import { showMoreButtonStyles as styles } from './show-more.button.styles';
import { ShowMoreButton } from './show-more.button';
import { TextStyle, ViewStyle } from 'react-native';
import { FontSize } from '../../../theming/fonts';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../base/base.button', () => ({
  BaseButton: () => <div />,
}));

const useStateMock = useState as jest.Mock;

const setIsShowingMock = jest.fn();

const onPressMock = jest.fn();

describe('ShowMoreButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('has expected components', () => {
    useStateMock.mockReturnValueOnce([false, setIsShowingMock]);
    const messageMock = 'message-mock';
    const testRenderer = renderer.create(
      <ShowMoreButton onPress={onPressMock} message={messageMock} />
    );
    const baseButton = testRenderer.root.findByType(BaseButton);

    expect(baseButton.props.children.length).toEqual(2);

    const baseText = baseButton.props.children[0];
    const fontAwesomeIcon = baseButton.props.children[1];

    expect(baseText.type).toEqual(BaseText);
    expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
  });

  it('has expected default props', () => {
    useStateMock.mockReturnValueOnce([false, setIsShowingMock]);
    const messageMock = 'message-mock';
    const testIDMock = 'testID-mock';
    const testRenderer = renderer.create(
      <ShowMoreButton
        onPress={onPressMock}
        message={messageMock}
        testID={testIDMock}
      />
    );
    const baseButton = testRenderer.root.findByType(BaseButton);
    const baseText = baseButton.props.children[0];
    const fontAwesomeIcon = baseButton.props.children[1];

    expect(baseButton.props.style).toEqual([styles.viewStyle, undefined]);
    expect(baseButton.props.testID).toEqual(testIDMock);
    expect(baseButton.props.onPress).toEqual(expect.any(Function));
    expect(baseText.props.style).toEqual([styles.textStyle, undefined]);
    expect(baseText.props.children).toEqual(messageMock);
    expect(fontAwesomeIcon.props.name).toEqual('chevron-down');
    expect(fontAwesomeIcon.props.size).toEqual(IconSize.small);
    expect(fontAwesomeIcon.props.color).toEqual(PrimaryColor.darkBlue);
  });

  it('has expected given props', () => {
    useStateMock.mockReturnValueOnce([false, setIsShowingMock]);
    const messageMock = 'message-mock';
    const viewStyleMock: ViewStyle = { backgroundColor: 'purple' };
    const textStyleMock: TextStyle = { fontSize: FontSize.large };
    const testRenderer = renderer.create(
      <ShowMoreButton
        onPress={onPressMock}
        message={messageMock}
        viewStyle={viewStyleMock}
        textStyle={textStyleMock}
      />
    );
    const baseButton = testRenderer.root.findByType(BaseButton);
    const baseText = baseButton.props.children[0];
    const fontAwesomeIcon = baseButton.props.children[1];

    expect(baseButton.props.style).toEqual([styles.viewStyle, viewStyleMock]);
    expect(baseButton.props.onPress).toEqual(expect.any(Function));

    baseButton.props.onPress();

    expect(onPressMock).toHaveBeenCalled();
    expect(baseText.props.style).toEqual([styles.textStyle, textStyleMock]);
    expect(baseText.props.children).toEqual(messageMock);
    expect(fontAwesomeIcon.props.name).toEqual('chevron-down');
    expect(fontAwesomeIcon.props.size).toEqual(IconSize.small);
    expect(fontAwesomeIcon.props.color).toEqual(PrimaryColor.darkBlue);
  });

  it.each([
    [true, false],
    [false, true],
  ])(
    'sets isShowing from %s to %s on button press',
    (isShowingMock: boolean, expectedSetIsShowingArg: boolean) => {
      useStateMock.mockReturnValueOnce([isShowingMock, setIsShowingMock]);
      const messageMock = 'message-mock';
      const testRenderer = renderer.create(
        <ShowMoreButton onPress={onPressMock} message={messageMock} />
      );
      const baseButton = testRenderer.root.findByType(BaseButton);
      const handlePress = baseButton.props.onPress;

      expect(setIsShowingMock).not.toHaveBeenCalled();

      handlePress();

      expect(setIsShowingMock).toHaveBeenCalledWith(expectedSetIsShowingArg);
    }
  );

  it.each([
    ['up', true],
    ['down', false],
  ])(
    'renders chevron-%s when isShowing is %s',
    (chevronSuffix: string, isShowingMock: boolean) => {
      useStateMock.mockReturnValueOnce([isShowingMock, setIsShowingMock]);
      const messageMock = 'message-mock';
      const testRenderer = renderer.create(
        <ShowMoreButton onPress={onPressMock} message={messageMock} />
      );
      const baseButton = testRenderer.root.findByType(BaseButton);
      const fontAwesomeIcon = baseButton.props.children[1];
      const iconName = fontAwesomeIcon.props.name;

      expect(iconName).toEqual(`chevron-${chevronSuffix}`);
    }
  );
});
