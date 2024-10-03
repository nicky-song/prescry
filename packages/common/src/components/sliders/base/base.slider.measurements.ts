// Copyright 2022 Prescryptive Health, Inc.

import { sliderMaxTextOverlap } from './base.slider.styles';
export interface IBaseSliderMeasurements {
  distanceText: (currentDistance: number, unit?: string) => string;
  moveXDifference: (parentPadding: number) => number;
  widthCorrection: (parentPadding: number) => number;
}

export const baseSliderMeasurements: IBaseSliderMeasurements = {
  distanceText: (currentDistance: number, unit?: string) => {
    return unit ? `${currentDistance} ${unit}` : `${currentDistance}`;
  },
  moveXDifference: (parentPadding: number) =>
    parentPadding + sliderMaxTextOverlap,
  widthCorrection: (parentPadding: number) =>
    parentPadding * 2 + sliderMaxTextOverlap * 2,
};
