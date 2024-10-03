// Copyright 2020 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import {
  ISurveySingleSelectStyles,
  surveySingleSelectStyles,
} from './survey-single-select.styles';

describe('surveySingleSelectStyles', () => {
  it('has expected default styles', () => {
    const pickerContainerTextStyle: ViewStyle = {
      width: '100%',
    };

    const expectedStyles: ISurveySingleSelectStyles = {
      pickerContainerTextStyle,
    };
    expect(surveySingleSelectStyles).toEqual(expectedStyles);
  });
});
