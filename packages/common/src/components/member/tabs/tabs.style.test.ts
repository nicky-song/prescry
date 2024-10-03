// Copyright 2020 Prescryptive Health, Inc.

import { tabsStyles, ITabsStyleProps } from './tabs.style';
import { BorderRadius } from '../../../theming/borders';
import { Spacing } from '../../../theming/spacing';
import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor, GrayScaleColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';

describe('tabsStyles', () => {
  it('has expected styles', () => {
    const headerButtonViewStyle: ViewStyle = {
      backgroundColor: 'transparent',
      width: 'auto',
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    };

    const headerButtonTextStyle: TextStyle = {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      width: '100%',
    };

    const headerSelectedTextStyle: TextStyle = {
      color: PrimaryColor.prescryptivePurple,
      ...getFontFace({ weight: FontWeight.semiBold }),
      paddingBottom: 12,
    };

    const headerUnSelectedTextStyle: TextStyle = {
      ...headerSelectedTextStyle,
      color: GrayScaleColor.secondaryGray,
    };

    const headerContainerViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    };

    const tabContainerViewStyle: ViewStyle = {
      marginTop: Spacing.threeQuarters,
    };

    const selectedLineViewStyle: ViewStyle = {
      height: 6,
      width: '100%',
      backgroundColor: PrimaryColor.prescryptivePurple,
      borderTopLeftRadius: BorderRadius.half,
      borderTopRightRadius: BorderRadius.half,
    };

    const unSelectedLineViewStyle: ViewStyle = {
      ...selectedLineViewStyle,
      backgroundColor: 'transparent',
    };

    const headerViewStyle: ViewStyle = { width: '100%', alignItems: 'center' };

    const lineSeparatorViewStyle: ViewStyle = {
      backgroundColor: GrayScaleColor.disabledGray,
      flexGrow: 0,
      height: 1,
    };

    const expectedStyles: ITabsStyleProps = {
      headerButtonTextStyle,
      headerButtonViewStyle,
      headerSelectedTextStyle,
      headerUnSelectedTextStyle,
      headerViewStyle,
      headerContainerViewStyle,
      lineSeparatorViewStyle,
      tabContainerViewStyle,
      selectedLineViewStyle,
      unSelectedLineViewStyle,
    };

    expect(tabsStyles).toEqual(expectedStyles);
  });
});
