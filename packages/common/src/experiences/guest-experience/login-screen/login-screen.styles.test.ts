// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { PurpleScale } from '../../../theming/theme';
import { ILoginScreenStyles, loginScreenStyles } from './login-screen.styles';

describe('loginScreenStyle', () => {
  it('has expected styles', () => {
    const errorMessageTextStyle: TextStyle = {
      marginTop: Spacing.half,
    };

    const buttonViewStyle: ViewStyle = {
      marginTop: Spacing.times1pt25,
    };

    const expectedStyles: ILoginScreenStyles = {
      basicPageBodyViewStyle: {
        paddingBottom: 0,
      },
      basicPageHeaderViewStyle: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        backgroundColor: PurpleScale.lighter,
      },
      bodyViewStyle: {
        paddingTop: Spacing.times1pt5,
        paddingRight: Spacing.times1pt5,
        paddingBottom: Spacing.times1pt5,
        paddingLeft: Spacing.times1pt5,
      },
      buttonViewStyle,
      errorMessageTextStyle,

      headingTextStyle: {
        marginBottom: Spacing.times2,
      },
      errorColorTextStyle: {
        color: NotificationColor.red,
      },
    };

    expect(loginScreenStyles).toEqual(expectedStyles);
  });
});
