// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontFace } from '../../../theming/fonts';
import { RedScale, FontSize } from '../../../theming/theme';
import { IDateInputStyles, dateInputStyles } from './date-input.styles';

const containerViewStyle: ViewStyle = {
  flexDirection: 'column',
};

const fieldErrorTextStyle: TextStyle = {
  color: RedScale.regular,
  fontSize: FontSize.regular,
};

const fieldTextStyle: TextStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: FontSize.regular,
  marginLeft: 10,
  marginRight: 10,
  ...getFontFace(),
};

const fieldViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

const labelTextStyle: TextStyle = {
  marginBottom: '.4em',
};

const dayInputViewStyle: ViewStyle = {
  height: 48,
  width: '20vw',
};

const monthInputTextStyle: TextStyle = {
  ...getFontFace(),
  width: '34vw',
};

const yearInputViewStyle: ViewStyle = {
  height: 48,
  width: '24vw',
};

describe('dateInputStyles', () => {
  it('has expected default styles', () => {
    const expectedStyles: IDateInputStyles = {
      containerViewStyle,
      dayInputViewStyle,
      fieldErrorTextStyle,
      fieldTextStyle,
      fieldViewStyle,
      labelTextStyle,
      monthInputTextStyle,
      yearInputViewStyle,
    };

    expect(dateInputStyles).toEqual(expectedStyles);
  });
});
