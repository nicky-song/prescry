// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export const sliderPositionWidth = 64;
export const sliderPointerDiameter = 30;
export const sliderMaxTextOverlap = 24;

export interface IPointerDimensions {
  outsideDiameter: number;
  insideDiameter: number;
  outsideRadius: number;
  insideRadius: number;
  insideMargin: number;
}

export const pointerDimensions = (pointerDiameter: number) => {
  const insideToOutsideRatio = 0.75;

  return {
    outsideDiameter: pointerDiameter,
    insideDiameter: pointerDiameter * insideToOutsideRatio,
    outsideRadius: pointerDiameter / 2,
    insideRadius: (pointerDiameter * insideToOutsideRatio) / 2,
    insideMargin:
      pointerDiameter / 2 - (pointerDiameter * insideToOutsideRatio) / 2,
  };
};

const {
  outsideDiameter,
  insideDiameter,
  outsideRadius,
  insideRadius,
  insideMargin,
}: IPointerDimensions = pointerDimensions(sliderPointerDiameter);

export interface IPointerStyles {
  outsideViewStyle: ViewStyle;
  insideViewStyle: ViewStyle;
  pointerAndPositionViewStyle: ViewStyle;
  cursorViewStyle: ViewStyle;
}

export const pointerStyles: IPointerStyles = {
  outsideViewStyle: {
    height: outsideDiameter,
    width: outsideDiameter,
    borderRadius: outsideRadius,
    backgroundColor: PrimaryColor.prescryptivePurple,
  },
  insideViewStyle: {
    height: insideDiameter,
    width: insideDiameter,
    borderRadius: insideRadius,
    marginTop: insideMargin,
    marginBottom: insideMargin,
    marginLeft: insideMargin,
    backgroundColor: GrayScaleColor.white,
  },
  pointerAndPositionViewStyle: {
    zIndex: 1,
    marginLeft: -7,
    marginBottom: -17,
  },
  cursorViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: sliderPositionWidth,
    marginLeft: -1,
  },
};

export type TickMarkColors =
  | PrimaryColor.prescryptivePurple
  | GrayScaleColor.disabledGray;

export const tickMarkDiameter = 14;

export interface IBaseSliderStyles {
  sliderViewStyle: ViewStyle;
  barViewStyle: ViewStyle;
  barFillViewStyle: ViewStyle;
  valueTextStyle: TextStyle;
  tickMarkViewStyle: (tickMarkColor: TickMarkColors) => ViewStyle;
  tickMarkContainerViewStyle: (
    index: number,
    barSegmentMargin: number
  ) => ViewStyle;
  tickMarkTextStyle: (index: number) => ViewStyle;
}

export const baseSliderStyles: IBaseSliderStyles = {
  sliderViewStyle: {
    maxHeight: 64,
  },
  barViewStyle: {
    height: 6,
    backgroundColor: GrayScaleColor.disabledGray,
    borderRadius: 3,
    zIndex: -1,
    marginRight: sliderMaxTextOverlap,
    marginLeft: sliderMaxTextOverlap,
  },
  barFillViewStyle: {
    height: 6,
    backgroundColor: PrimaryColor.prescryptivePurple,
    borderRadius: 3,
  },
  valueTextStyle: {
    ...getFontFace({ weight: FontWeight.semiBold }),
    marginBottom: Spacing.quarter,
  },
  tickMarkViewStyle: (tickMarkColor: TickMarkColors) => {
    return {
      height: tickMarkDiameter,
      width: tickMarkDiameter,
      borderRadius: tickMarkDiameter / 2,
      backgroundColor: tickMarkColor,
    };
  },
  tickMarkContainerViewStyle: (index: number, barSegmentMargin: number) => {
    return {
      position: 'absolute',
      zIndex: -2 * index,
      marginLeft: barSegmentMargin - tickMarkDiameter / 2,
      marginTop: -4,
    };
  },
  tickMarkTextStyle: (index: number) => {
    return { marginTop: 12, marginLeft: index ? -2 : 2 };
  },
};
