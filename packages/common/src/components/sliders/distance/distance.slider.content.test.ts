// Copyright 2022 Prescryptive Health, Inc.

import {
  distanceSliderContent,
  IDistanceSliderContent,
} from './distance.slider.content';

describe('distanceSliderContent', () => {
  it('has expected content', () => {
    const expectedDistanceSliderContent: IDistanceSliderContent = {
      defaultUnit: 'mi',
    };

    expect(distanceSliderContent).toEqual(expectedDistanceSliderContent);
  });
});
