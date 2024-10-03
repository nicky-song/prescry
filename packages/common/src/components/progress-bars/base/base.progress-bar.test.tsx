// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ColorValue,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { BaseProgressBar, LabelPosition } from './base.progress-bar';
import {
  baseProgressBarStyles,
  defaultProgressBarColors,
} from './base.progress-bar.styles';
import { BaseText } from '../../text/base-text/base-text';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('BaseProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReturnValue([0, jest.fn()]);
  });

  it('renders in View container', () => {
    const viewStyleMock: ViewStyle = { width: 1 };
    const accessibilityLabelMock = 'accessibility-label';

    const testRenderer = renderer.create(
      <BaseProgressBar
        value={0}
        viewStyle={viewStyleMock}
        accessibilityLabel={accessibilityLabelMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.style).toEqual(viewStyleMock);
    expect(container.props.testID).toEqual('baseProgressBar');
    expect(container.props.accessibilityRole).toEqual('progressbar');
    expect(container.props.accessibilityLabel).toEqual(accessibilityLabelMock);
    expect(getChildren(container).length).toEqual(3);
  });

  it.each([
    [undefined, undefined, undefined],
    ['min-label', undefined, undefined],
    [undefined, 'max-label', undefined],
    ['min-label', 'max-label', undefined],
    ['min-label', 'max-label', 'bottom' as LabelPosition],
    ['min-label', 'max-label', 'top' as LabelPosition],
  ])(
    'renders label container (minLabel: %p, maxLabel: %p, labelPostion: %p)',
    (
      minLabelMock: string | undefined,
      maxLabelMock: string | undefined,
      labelPositionMock: undefined | LabelPosition
    ) => {
      const testRenderer = renderer.create(
        <BaseProgressBar
          value={0}
          minLabel={minLabelMock}
          maxLabel={maxLabelMock}
          labelPosition={labelPositionMock}
          accessibilityLabel=''
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'baseProgressBar',
      });
      const topLabelContainer = getChildren(container)[0];
      const bottomLabelContainer = getChildren(container)[2];

      if (labelPositionMock === 'top') {
        expect(bottomLabelContainer).toBeNull();
      } else {
        expect(topLabelContainer).toBeNull();
      }

      const labelContainer =
        labelPositionMock === 'top' ? topLabelContainer : bottomLabelContainer;
      const expectedLabelContainerViewStyle =
        labelPositionMock === 'top'
          ? baseProgressBarStyles.topLabelsViewStyle
          : baseProgressBarStyles.bottomLabelsViewStyle;

      if (!minLabelMock && !maxLabelMock) {
        expect(labelContainer).toBeNull();
      } else {
        expect(labelContainer.type).toEqual(View);
        expect(labelContainer.props.style).toEqual(
          expectedLabelContainerViewStyle
        );
        expect(labelContainer.props.testID).toEqual('baseProgressBarLabels');
        expect(getChildren(labelContainer).length).toEqual(2);
      }
    }
  );

  it('renders minimum label', () => {
    const minLabelMock = 'min-label';
    const isSkeletonMock = true;
    const testRenderer = renderer.create(
      <BaseProgressBar
        value={0}
        minLabel={minLabelMock}
        isSkeleton={isSkeletonMock}
        accessibilityLabel=''
      />
    );

    const labelContainer = testRenderer.root.findByProps({
      testID: 'baseProgressBarLabels',
    });
    const minLabelText = getChildren(labelContainer)[0];

    expect(minLabelText.type).toEqual(BaseText);
    expect(minLabelText.props.style).toEqual(
      baseProgressBarStyles.minLabelTextStyle
    );
    expect(minLabelText.props.isSkeleton).toEqual(isSkeletonMock);
    expect(minLabelText.props.skeletonWidth).toEqual('short');
    expect(minLabelText.props.children).toEqual(minLabelMock);
  });

  it('renders maximum label', () => {
    const maxLabelMock = 'max-label';
    const isSkeletonMock = true;
    const testRenderer = renderer.create(
      <BaseProgressBar
        value={0}
        maxLabel={maxLabelMock}
        isSkeleton={isSkeletonMock}
        accessibilityLabel=''
      />
    );

    const labelContainer = testRenderer.root.findByProps({
      testID: 'baseProgressBarLabels',
    });
    const maxLabelText = getChildren(labelContainer)[1];

    expect(maxLabelText.type).toEqual(BaseText);
    expect(maxLabelText.props.style).toEqual(
      baseProgressBarStyles.maxLabelTextStyle
    );
    expect(maxLabelText.props.isSkeleton).toEqual(isSkeletonMock);
    expect(maxLabelText.props.skeletonWidth).toEqual('short');
    expect(maxLabelText.props.children).toEqual(maxLabelMock);
  });

  it('renders progress bar progress container', () => {
    const testRenderer = renderer.create(
      <BaseProgressBar value={0} maxLabel='' accessibilityLabel='' />
    );

    const container = testRenderer.root.findByProps({
      testID: 'baseProgressBar',
    });
    const progressContainer = getChildren(container)[1];

    expect(progressContainer.type).toEqual(View);
    expect(progressContainer.props.testID).toEqual(
      'baseProgressBarProgressContainer'
    );
    expect(getChildren(progressContainer).length).toEqual(2);
  });

  it.each([[undefined], ['red']])(
    'renders background bar (color: %p)',
    (backgroundBarColorMock: undefined | string) => {
      const testRenderer = renderer.create(
        <BaseProgressBar
          value={0}
          backgroundBarColor={backgroundBarColorMock}
          accessibilityLabel=''
        />
      );

      const progressContainer = testRenderer.root.findByProps({
        testID: 'baseProgressBarProgressContainer',
      });
      const backgroundBar = getChildren(progressContainer)[0];

      expect(backgroundBar.type).toEqual(View);

      const expectedStyle: StyleProp<ViewStyle> = [
        baseProgressBarStyles.backgroundBarViewStyle,
        backgroundBarColorMock
          ? { backgroundColor: backgroundBarColorMock }
          : undefined,
      ];
      expect(backgroundBar.props.style).toEqual(expectedStyle);

      expect(backgroundBar.props.onLayout).toEqual(expect.any(Function));
      expect(getChildren(backgroundBar).length).toEqual(0);
    }
  );

  it('sets background bar width in state on layout change', () => {
    const setBarWidthMock = jest.fn();
    useStateMock.mockReturnValue([0, setBarWidthMock]);

    const testRenderer = renderer.create(
      <BaseProgressBar value={0} accessibilityLabel='' />
    );

    const progressContainer = testRenderer.root.findByProps({
      testID: 'baseProgressBarProgressContainer',
    });
    const backgroundBar = getChildren(progressContainer)[0];

    const onLayout = backgroundBar.props.onLayout;

    const widthMock = 25;
    const eventMock: Partial<LayoutChangeEvent> = {
      nativeEvent: {
        layout: {
          width: widthMock,
          height: 0,
          x: 0,
          y: 0,
        },
      },
    };
    onLayout(eventMock);

    expect(setBarWidthMock).toHaveBeenCalledWith(widthMock);
  });

  it.each([
    [undefined, undefined, -0.1, undefined, 0],
    [undefined, undefined, 0, undefined, 0],
    [undefined, undefined, 0.01, undefined, 0.01],
    [undefined, undefined, 0.75, undefined, 0.75],
    [undefined, undefined, 0.99, undefined, 0.99],
    [undefined, undefined, 1, undefined, 1],
    [undefined, undefined, 1.1, undefined, 1],
    [100, 50, 20, undefined, 0], // minValue > maxValue
    [100, 100, 100, undefined, 0], // minValue = maxValue
    [100, 100, 101, undefined, 0],
    [100, 200, 99, undefined, 0],
    [100, 200, 100, undefined, 0],
    [100, 200, 101, undefined, 0.01],
    [100, 200, 199, ['red'], 0.99],
    [100, 200, 200, undefined, 1],
    [100, 200, 201, ['green'], 1],
    [100, 200, 201, ['red', 'green'], 1],
    [100, 200, 201, ['red', 'green', 'blue'], 1],
  ])(
    'renders progress bar (minValue: %p, maxValue: %p, value: %p, color: %p)',
    (
      minValueMock: number | undefined,
      maxValueMock: number | undefined,
      valueMock: number,
      progressBarColorsMock: undefined | ColorValue[],
      expectedProgressFraction: number
    ) => {
      const barWidthMock = 100;
      useStateMock.mockReturnValue([barWidthMock, jest.fn()]);

      const testRenderer = renderer.create(
        <BaseProgressBar
          value={valueMock}
          minValue={minValueMock}
          maxValue={maxValueMock}
          progressBarColors={progressBarColorsMock}
          accessibilityLabel=''
        />
      );

      const progressContainer = testRenderer.root.findByProps({
        testID: 'baseProgressBarProgressContainer',
      });
      const progressBar = getChildren(progressContainer)[1];

      const isGradientExpected =
        !progressBarColorsMock || progressBarColorsMock.length > 1;

      expect(progressBar.type).toEqual(
        isGradientExpected ? LinearGradient : View
      );

      const expectedWidthViewStyle: ViewStyle = {
        width: barWidthMock * expectedProgressFraction,
      };

      if (isGradientExpected) {
        const expectedColors =
          progressBarColorsMock ?? defaultProgressBarColors;

        expect(progressBar.props.colors).toEqual(expectedColors);
        expect(progressBar.props.style).toEqual([
          baseProgressBarStyles.progressBarViewStyle,
          expectedWidthViewStyle,
        ]);
      } else {
        const expectedColorViewStyle: ViewStyle = {
          backgroundColor: progressBarColorsMock
            ? progressBarColorsMock[0]
            : undefined,
        };

        expect(progressBar.props.style).toEqual([
          baseProgressBarStyles.progressBarViewStyle,
          expectedWidthViewStyle,
          expectedColorViewStyle,
        ]);
      }

      expect(getChildren(progressBar).length).toEqual(0);
    }
  );
});
