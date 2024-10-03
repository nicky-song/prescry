// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect, useRef, useState } from 'react';
import {
  ViewStyle,
  StyleProp,
  View,
  Animated,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import {
  baseSliderStyles as styles,
  pointerStyles,
  sliderMaxTextOverlap,
  TickMarkColors,
  tickMarkDiameter,
} from './base.slider.styles';
import { baseSliderMeasurements as measurements } from './base.slider.measurements';
import { LocalDimensions } from '../../../theming/theme';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';

export interface IBaseSliderProps {
  onSelectedValue: (selectedValue: number) => void;
  defaultPosition: number;
  minimumPosition: number;
  maximumPosition: number;
  showCurrentValue?: boolean;
  unit?: string;
  viewStyle?: StyleProp<ViewStyle>;
  onSliderChange?: (status: 'started' | 'stopped' | 'sliding') => void;
}

export interface ISliderDimensions {
  width: number;
  left: number;
  right: number;
}

export const BaseSlider = ({
  onSelectedValue,
  defaultPosition,
  minimumPosition,
  maximumPosition,
  showCurrentValue,
  unit,
  viewStyle,
  onSliderChange,
}: IBaseSliderProps) => {
  const [currentPosition, setCurrentPosition] =
    useState<number>(defaultPosition);
  const [currentCallbackPosition, setCurrentCallbackPosition] =
    useState<number>(defaultPosition);

  useEffect(() => {
    onSelectedValue(currentCallbackPosition);
  }, [currentCallbackPosition, onSelectedValue]);

  const [sliderDimensions, setSliderDimensions] = useState<ISliderDimensions>();

  const parentPadding = 24; // TODO: determine padding between screen and slider view to replace 24

  const tickMarkValues: number[] = [5, 10, 25, 50];

  interface ISegmentRange {
    minSegment: number;
    maxSegment: number;
    increment: number;
  }

  const segmentRanges: ISegmentRange[] = [
    {
      minSegment: minimumPosition,
      maxSegment: tickMarkValues[0],
      increment: 1,
    },
    {
      minSegment: tickMarkValues[0],
      maxSegment: tickMarkValues[1],
      increment: 1,
    },
    {
      minSegment: tickMarkValues[1],
      maxSegment: tickMarkValues[2],
      increment: 5,
    },
    {
      minSegment: tickMarkValues[2],
      maxSegment: tickMarkValues[3],
      increment: 5,
    },
    {
      minSegment: tickMarkValues[3],
      maxSegment: maximumPosition,
      increment: 10,
    },
  ];

  const perSegmentRatio = 1 / segmentRanges.length;

  const getSegmentFromRatio = (ratio: number) => {
    return Math.floor(ratio / perSegmentRatio) + 1;
  };

  const getRoundedPositionFromSegment = (segment: number, ratio: number) => {
    const segmentIndex = segment - 1;
    const { minSegment, maxSegment, increment } = segmentRanges[segmentIndex];
    const segmentDifference = maxSegment - minSegment;
    const minSegmentRatio = perSegmentRatio * segmentIndex;
    const currentRatio = ratio - minSegmentRatio;
    const segmentRatio = currentRatio / perSegmentRatio;
    const segmentPosition = segmentRatio * segmentDifference;
    const position = segmentPosition + minSegment;

    return Math.floor(position / increment) * increment;
  };

  const calculateDefaultPosition = (sliderWidth: number) => {
    if (
      minimumPosition >= maximumPosition ||
      maximumPosition <= minimumPosition ||
      defaultPosition < minimumPosition ||
      defaultPosition > maximumPosition
    ) {
      throw Error('Invalid default, minimum, or maximum position values');
    }

    const finalWidth: number[] = [];

    if (defaultPosition === minimumPosition) {
      return 0;
    }

    if (defaultPosition === maximumPosition) {
      return sliderDimensions?.width ? sliderDimensions.width : sliderWidth;
    }

    segmentRanges.forEach((segmentRange, segmentIndex) => {
      const { minSegment, maxSegment } = segmentRange;
      if (defaultPosition >= minSegment && defaultPosition < maxSegment) {
        const actualMinSegment = minSegment > minimumPosition ? minSegment : 0;
        const segmentDifference = maxSegment - actualMinSegment;
        const segmentPosition = defaultPosition - actualMinSegment;
        const previousRatio = segmentIndex * perSegmentRatio;
        const segmentRatio = segmentPosition / segmentDifference;
        const totalRatio = previousRatio + segmentRatio * perSegmentRatio;
        const positionWidth = sliderDimensions?.width
          ? totalRatio * sliderDimensions.width
          : totalRatio * sliderWidth;

        finalWidth.push(positionWidth);
      }
    });

    return finalWidth[0];
  };

  const animatedPointer = useRef(
    new Animated.Value(
      calculateDefaultPosition(
        LocalDimensions.width - measurements.widthCorrection(parentPadding)
      )
    )
  );

  const setCurrentPositionFromOffset = (offset: number) => {
    const correctedOffset = offset + tickMarkDiameter / 2;

    const ratio = sliderDimensions?.width
      ? correctedOffset / sliderDimensions.width
      : -1;

    if (ratio < 0) {
      setCurrentPosition(defaultPosition);
      return;
    }

    if (ratio >= 0.99) {
      setCurrentPosition(maximumPosition);
      return;
    }

    const segment = getSegmentFromRatio(ratio);

    const roundedPosition = getRoundedPositionFromSegment(segment, ratio);

    if (roundedPosition !== currentPosition)
      setCurrentPosition(roundedPosition);
  };

  const pointerResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (currentPosition !== maximumPosition) {
        animatedPointer.current.setOffset(0);
      }
      if (onSliderChange) onSliderChange('started');
    },
    onPanResponderMove: (_evt, { moveX }) => {
      if (!sliderDimensions) {
        return;
      }

      const moveXDifference = measurements.moveXDifference(parentPadding);
      const correctedMoveX = moveX - moveXDifference;
      if (
        correctedMoveX > sliderDimensions.left &&
        correctedMoveX < sliderDimensions.right
      ) {
        setCurrentPositionFromOffset(correctedMoveX);
        animatedPointer.current.setValue(correctedMoveX);
      }
      if (onSliderChange) onSliderChange('sliding');
    },
    onPanResponderRelease: () => {
      setCurrentCallbackPosition(currentPosition);
      if (onSliderChange) onSliderChange('stopped');
    },
  });

  const onLayoutHandler = (evt: LayoutChangeEvent) => {
    const { width, x } = evt.nativeEvent.layout;
    const actualWidth = width - sliderMaxTextOverlap * 2;
    const actualLeft = x;
    const actualRight = x + actualWidth;
    setSliderDimensions({
      width: actualWidth,
      left: actualLeft,
      right: actualRight,
    });
  };

  const valueText = showCurrentValue ? (
    <BaseText style={styles.valueTextStyle}>
      {measurements.distanceText(currentPosition, unit)}
    </BaseText>
  ) : null;

  const pointerCircle = (
    <View
      style={pointerStyles.outsideViewStyle}
      testID='baseSliderPointerCircle'
    >
      <View style={pointerStyles.insideViewStyle} />
    </View>
  );

  const sliderPointer = (
    <Animated.View
      {...pointerResponder.panHandlers}
      style={{
        transform: [
          {
            translateX: animatedPointer.current,
          },
        ],
        width: 0,
      }}
    >
      <View style={pointerStyles.pointerAndPositionViewStyle}>
        <View style={pointerStyles.cursorViewStyle}>
          {valueText}
          {pointerCircle}
        </View>
      </View>
    </Animated.View>
  );

  const sliderTickMarks = () => {
    if (!sliderDimensions?.width) return null;

    const barSegmentWidth = sliderDimensions.width / segmentRanges.length;

    return tickMarkValues.map((tickMarkValue: number, index: number) => {
      const barSegmentMargin = (index + 1) * barSegmentWidth;

      const tickMarkColor: TickMarkColors =
        currentPosition < tickMarkValue
          ? GrayScaleColor.disabledGray
          : PrimaryColor.prescryptivePurple;

      const sliderIncrement = barSegmentMargin.toString();
      const sliderTickMarkKey = `${tickMarkValue}${sliderIncrement}`;

      return (
        <View
          style={styles.tickMarkContainerViewStyle(index, barSegmentMargin)}
          key={sliderTickMarkKey}
        >
          <View style={styles.tickMarkViewStyle(tickMarkColor)} />
          <BaseText style={styles.tickMarkTextStyle(index)}>
            {tickMarkValue}
          </BaseText>
        </View>
      );
    });
  };

  const sliderBar = (
    <View style={styles.barViewStyle}>
      <Animated.View
        style={[
          styles.barFillViewStyle,
          {
            width: animatedPointer.current,
          },
        ]}
        children={sliderTickMarks()}
      />
    </View>
  );

  return (
    <View style={viewStyle}>
      <View style={styles.sliderViewStyle} onLayout={onLayoutHandler}>
        {sliderPointer}
        {sliderBar}
      </View>
    </View>
  );
};
