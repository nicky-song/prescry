// Copyright 2022 Prescryptive Health, Inc.

import {
  baseSliderMeasurements,
  IBaseSliderMeasurements,
} from './base.slider.measurements';
import { sliderMaxTextOverlap } from './base.slider.styles';

describe('baseSliderMeasurements', () => {
  it('has expected distance content', () => {
    const parentPaddingExpected = 24;
    const distanceExpected = 25;
    const unitExpected = 'mi';

    const expectedBaseSliderMeasurements: IBaseSliderMeasurements = {
      distanceText: (currentDistance: number, unit?: string) => {
        return unit ? `${currentDistance} ${unit}` : `${currentDistance}`;
      },
      moveXDifference: (parentPadding: number) =>
        parentPadding + sliderMaxTextOverlap,
      widthCorrection: (parentPadding: number) =>
        parentPadding * 2 + sliderMaxTextOverlap * 2,
    };

    const expectedDistanceText = expectedBaseSliderMeasurements.distanceText(
      distanceExpected,
      unitExpected
    );

    expect(
      baseSliderMeasurements.distanceText(distanceExpected, unitExpected)
    ).toEqual(expectedDistanceText);

    expect(
      baseSliderMeasurements.moveXDifference(parentPaddingExpected)
    ).toEqual(
      expectedBaseSliderMeasurements.moveXDifference(parentPaddingExpected)
    );

    expect(
      baseSliderMeasurements.widthCorrection(parentPaddingExpected)
    ).toEqual(
      expectedBaseSliderMeasurements.widthCorrection(parentPaddingExpected)
    );
  });
});
