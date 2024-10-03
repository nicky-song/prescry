// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, ImageStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { claimAlertScreenStyles } from './claim-alert-screen.style';

describe('claimAlertScreenStyle', () => {
  it('has expected default styles', () => {
    const headerViewStyle: ViewStyle = {
      flexGrow: 0,
      alignItems: 'stretch',
      alignSelf: 'stretch',
    };
    const viewContainer: ViewStyle = {
      flexDirection: 'column',
    };
    const lineSeparatorViewStyle: ViewStyle = {
      marginTop: Spacing.quarter,
    };
    const couponImageStyle: ImageStyle = {
      resizeMode: 'contain',
    };
    const bodyViewStyle: ViewStyle = {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    };

    const expectedStyles = {
      couponImageStyle,
      headerViewStyle,
      lineSeparatorViewStyle,
      viewContainer,
      bodyViewStyle,
    };
    expect(claimAlertScreenStyles).toEqual(expectedStyles);
  });
});
