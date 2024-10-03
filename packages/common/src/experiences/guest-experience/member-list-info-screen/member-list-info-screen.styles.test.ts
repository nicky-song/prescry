// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { BodyWithFooterViewStyle } from '../../../theming/member/basic-page-style';
import { BlueScale, FontSize, GreyScale } from '../../../theming/theme';
import {
  IMemberInfoListScreenStyles,
  memberListInfoScreenStyles,
} from './member-list-info-screen.styles';

describe('memberListInfoScreenStyles', () => {
  it('has expected styles', () => {
    const bodyViewStyle: ViewStyle = {
      ...BodyWithFooterViewStyle,
      backgroundColor: PrimaryColor.lightBlue,
    };
    const containerView: ViewStyle = {
      alignItems: 'center',
      backgroundColor: BlueScale.lighter,
      flexDirection: 'column',
      flexGrow: 0,
    };

    const childContainerView: ViewStyle = {
      alignSelf: 'stretch',
      flexDirection: 'column',
    };

    const childContainerViewHeaderText: TextStyle = {
      alignSelf: 'stretch',
      backgroundColor: GreyScale.lighter,
      color: GreyScale.lighterDark,
      flexDirection: 'column',
      fontSize: FontSize.large,
      ...getFontFace({ weight: FontWeight.medium }),
      lineHeight: 33,
      marginHorizontal: 10,
      marginVertical: 10,
      padding: 10,
      textAlign: 'left',
    };

    const rowContainerView: ViewStyle = {
      alignSelf: 'stretch',
      backgroundColor: GreyScale.lightest,
      flexDirection: 'column',
      margin: 10,
      padding: 10,
    };
    const headerView: ViewStyle = {
      alignItems: 'stretch',
      alignSelf: 'stretch',
      flexGrow: 0,
    };

    const expectedStyles: IMemberInfoListScreenStyles = {
      bodyViewStyle,
      containerView,
      childContainerView,
      childContainerViewHeaderText,
      rowContainerView,
      headerView,
    };

    expect(memberListInfoScreenStyles).toEqual(expectedStyles);
  });
});
