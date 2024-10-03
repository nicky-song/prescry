// Copyright 2018 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { ImageStyle, TouchableOpacity } from 'react-native';
import renderer, { create } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { IPrimaryCheckBoxProps, PrimaryCheckBox } from './primary-checkbox';
import { primaryCheckBoxStyles } from './primary-checkbox.styles';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const mockOnPress = jest.fn();
const primaryCheckBoxProps: IPrimaryCheckBoxProps = {
  checkBoxChecked: true,
  checkBoxLabel: 'checkBox label',
  checkBoxValue: 'value',
  onPress: mockOnPress,
};

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

describe('PrimaryCheckBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValue([true, jest.fn()]);
  });

  it('initializes state', () => {
    create(<PrimaryCheckBox {...primaryCheckBoxProps} />);

    expect(useStateMock).toHaveBeenCalledTimes(1);
    expect(useStateMock).toHaveBeenNthCalledWith(1);
  });

  it('has expected number of effect handlers', () => {
    create(<PrimaryCheckBox {...primaryCheckBoxProps} />);

    expect(useEffectMock).toHaveBeenCalledTimes(1);
  });

  it('updates state checkBoxChecked passed', () => {
    const checkboxCheckedMock = true;

    const setCheckedMock = jest.fn();
    useStateMock.mockReturnValue(['', setCheckedMock]);

    create(
      <PrimaryCheckBox
        {...primaryCheckBoxProps}
        checkBoxChecked={checkboxCheckedMock}
      />
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      checkboxCheckedMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(setCheckedMock).toHaveBeenCalledWith(checkboxCheckedMock);
  });

  it('toggles checked status and call onPress method of the props with checked status', () => {
    useStateMock.mockReturnValue([false, jest.fn()]);
    const primaryCheckBox = renderer.create(
      <PrimaryCheckBox {...primaryCheckBoxProps} />
    );

    primaryCheckBox.root.findByType(TouchableOpacity).props.onPress();

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toBeCalledWith(
      true,
      primaryCheckBoxProps.checkBoxValue
    );
  });

  it.each([
    [false, 'square'],
    [true, 'check-square'],
  ])(
    'renders icon when checked status is set to %p in state',
    (isCheckedInStateMock: boolean, expectedIconName: string) => {
      useStateMock.mockReturnValue([isCheckedInStateMock, jest.fn()]);

      const customImageStyle: ImageStyle = {
        width: 1,
      };

      const primaryCheckBox = renderer.create(
        <PrimaryCheckBox
          {...primaryCheckBoxProps}
          checkBoxImageStyle={customImageStyle}
        />
      );

      const touchableOpacity =
        primaryCheckBox.root.findByType(TouchableOpacity);

      const icon = getChildren(touchableOpacity)[0];
      expect(icon.type).toEqual(FontAwesomeIcon);
      expect(icon.props.name).toEqual(expectedIconName);
      expect(icon.props.color).toEqual(
        primaryCheckBoxStyles.iconTextStyle.color
      );
      expect(icon.props.size).toEqual(
        primaryCheckBoxStyles.iconTextStyle.fontSize
      );
      expect(icon.props.style).toEqual([
        primaryCheckBoxStyles.checkBoxImageStyles,
        customImageStyle,
      ]);
      expect(icon.props.light).toEqual(!isCheckedInStateMock);
      expect(icon.props.solid).toEqual(isCheckedInStateMock);
    }
  );

  it('should render checkBoxText passed from the props', () => {
    const primaryCheckBox = renderer.create(
      <PrimaryCheckBox {...primaryCheckBoxProps} />
    );

    expect(primaryCheckBox.root.findByType(BaseText).props.children).toBe(
      primaryCheckBoxProps.checkBoxLabel
    );

    const touchableOpacity = primaryCheckBox.root.findByType(TouchableOpacity);
    expect(touchableOpacity.props.testID).toBe('checkBox');
  });

  it.each([[true], [false]])(
    'renders expected skeleton text when isSkeleton: %s',
    (isSkeleton: boolean) => {
      const primaryCheckBox = renderer.create(
        <PrimaryCheckBox
          {...primaryCheckBoxProps}
          isSkeleton={isSkeleton}
          testID='mockTestID'
        />
      );

      const touchableOpacity =
        primaryCheckBox.root.findByType(TouchableOpacity);

      const baseText = getChildren(touchableOpacity)[1];

      expect(baseText.props.isSkeleton).toEqual(isSkeleton);
      expect(baseText.props.testID).toEqual('mockTestID-label');
      expect(touchableOpacity.props.testID).toBe('mockTestIDTouchable');
    }
  );
});
