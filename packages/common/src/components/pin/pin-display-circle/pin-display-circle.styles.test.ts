// Copyright 2021 Prescryptive Health, Inc.

import {
  pinDisplayCircleStyles,
  IPinDisplayCircleStyles,
} from './pin-display-circle.styles';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';

describe('pinDisplayCircleStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPinDisplayCircleStyles = {
      circleShapeSmall: {
        borderRadius: 16,
        borderWidth: 1,
        flexGrow: 0,
        height: 19.8,
        width: 19.8,
      },

      whiteCircleColor: {
        backgroundColor: GrayScaleColor.white,
        borderColor: PrimaryColor.prescryptivePurple,
      },

      purpleCircleColor: {
        backgroundColor: PrimaryColor.prescryptivePurple,
        borderColor: PrimaryColor.prescryptivePurple,
      },
    };

    expect(pinDisplayCircleStyles).toEqual(expectedStyles);
  });
});
