// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GreyScale, PurpleScale } from '../theme';
import { customPinStyle, ICustomPinStyle } from './custom-pin.style';

const circleShapeSmall: ViewStyle = {
  borderRadius: 16,
  borderWidth: 1,
  flexGrow: 0,
  height: 19.8,
  width: 19.8,
};

const whiteCircleColor: ViewStyle = {
  backgroundColor: GreyScale.lightest,
  borderColor: PurpleScale.darkest,
};

const purpleCircleColor: ViewStyle = {
  backgroundColor: PurpleScale.darkest,
  borderColor: PurpleScale.darkest,
};

const backButtonTargetAreaView: ViewStyle = {
  alignItems: 'center',
  paddingTop: 8,
};

const pinKeypadStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  marginTop: 12,
};

describe('customPinStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: ICustomPinStyle = {
      backButtonTargetAreaView,
      circleShapeSmall,
      pinKeypadStyle,
      purpleCircleColor,
      whiteCircleColor,
    };

    expect(customPinStyle).toEqual(expectedStyles);
  });
});
