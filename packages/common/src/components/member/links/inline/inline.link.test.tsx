// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../../../text/base-text/base-text';
import { InlineLink } from './inline.link';
import { inlineLinkStyles } from './inline.link.styles';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('InlineLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValue([false, jest.fn()]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes state', () => {
    renderer.create(<InlineLink onPress={jest.fn()}>link-text</InlineLink>);

    expect(useStateMock).toHaveBeenCalledTimes(1);
    expect(useStateMock).toHaveBeenNthCalledWith(1, false);
  });

  it('renders as base text', () => {
    const linkTextMock = 'link-text';
    const testIdMock = 'test-id';
    const inheritStyleMock = true;
    const isSkeletonMock = true;

    const testRenderer = renderer.create(
      <InlineLink
        onPress={jest.fn()}
        inheritStyle={inheritStyleMock}
        testID={testIdMock}
        isSkeleton={isSkeletonMock}
      >
        {linkTextMock}
      </InlineLink>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.testID).toEqual(testIdMock);
    expect(baseText.props.inheritStyle).toEqual(inheritStyleMock);
    expect(baseText.props.isSkeleton).toEqual(isSkeletonMock);
    expect(baseText.props.children).toEqual(linkTextMock);
  });

  it.each([
    [false, false, inlineLinkStyles.enabledTextStyle, undefined],
    [
      false,
      true,
      inlineLinkStyles.enabledTextStyle,
      inlineLinkStyles.pressTextStyle,
    ],
    [true, undefined, inlineLinkStyles.disabledTextStyle, undefined],
  ])(
    'sets text styles (disabled: %p; isPressAnimating: %p)',
    (
      disabledMock: boolean,
      isPressAnimating: boolean | undefined,
      expectedStatusStyle: TextStyle,
      expectedPressTextStyle: TextStyle | undefined
    ) => {
      useStateMock.mockReturnValue([isPressAnimating, jest.fn()]);

      const customTextStyle: TextStyle = { width: 1 };
      const testRenderer = renderer.create(
        <InlineLink
          onPress={jest.fn()}
          disabled={disabledMock}
          textStyle={customTextStyle}
        >
          link-text
        </InlineLink>
      );

      const baseText = testRenderer.root.findByType(BaseText);
      expect(baseText.props.style).toEqual([
        expectedStatusStyle,
        customTextStyle,
        expectedPressTextStyle,
      ]);
    }
  );

  it.each([
    [false, 'link'],
    [true, undefined],
  ])(
    'sets accessibility role (disabled: %p)',
    (disabledMock: boolean, expectedAccessibilityRole: string | undefined) => {
      const testRenderer = renderer.create(
        <InlineLink onPress={jest.fn()} disabled={disabledMock}>
          link-text
        </InlineLink>
      );

      const baseText = testRenderer.root.findByType(BaseText);
      expect(baseText.props.accessibilityRole).toEqual(
        expectedAccessibilityRole
      );
    }
  );

  it.each([[false], [true]])(
    'sets press handler (disabled: %p)',
    (disabledMock: boolean) => {
      const onPressMock = jest.fn();
      const testRenderer = renderer.create(
        <InlineLink onPress={onPressMock} disabled={disabledMock}>
          link-text
        </InlineLink>
      );

      const baseText = testRenderer.root.findByType(BaseText);

      if (disabledMock) {
        expect(baseText.props.onPress).toBeUndefined();
      } else {
        expect(baseText.props.onPress).toEqual(expect.any(Function));
      }
    }
  );

  it('handles on press', () => {
    jest.useFakeTimers();

    const setIsPressAnimatingMock = jest.fn();
    useStateMock.mockReturnValue([false, setIsPressAnimatingMock]);

    const onPressMock = jest.fn();
    const testRenderer = renderer.create(
      <InlineLink onPress={onPressMock}>link-text</InlineLink>
    );

    const baseText = testRenderer.root.findByType(BaseText);
    baseText.props.onPress();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);

    expect(setIsPressAnimatingMock).toHaveBeenCalledWith(true);
    expect(setIsPressAnimatingMock).not.toHaveBeenCalledWith(false);
    expect(onPressMock).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(setIsPressAnimatingMock).toHaveBeenCalledWith(false);
    expect(onPressMock).toHaveBeenCalled();
  });
});
