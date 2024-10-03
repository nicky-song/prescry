// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../theming/colors';
import { Spacing } from '../../theming/spacing';
import { basicPageStyles, IBasicPageStyles } from './basic-page.styles';

describe('basicPageStyles', () => {
  it('has expected styles', () => {
    const commonNotificationViewStyle: ViewStyle = {
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      paddingLeft: Spacing.base,
      paddingRight: Spacing.base,
    };

    const expectedStyles: IBasicPageStyles = {
      bodyViewStyle: {
        alignContent: 'center',
        flex: 1,
        width: '100%',
      },
      contentContainerNoGrowViewStyle: {
        flexGrow: 0,
      },
      contentContainerAllowGrowViewStyle: {
        flexGrow: 1,
      },
      footerViewStyle: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexGrow: 0,
      },
      headerViewStyle: {
        backgroundColor: GrayScaleColor.white,
        flexGrow: 1,
        paddingBottom: 5,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
      },
      pageViewStyle: {
        alignContent: 'stretch',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: GrayScaleColor.white,
        width: '100%',
      },
      stickyHeaderViewStyle: {
        left: 0,
        position: 'absolute',
        right: 0,
      },
      scrollViewStyle: {
        width: '100%',
      },
      notificationViewStyle: {
        ...commonNotificationViewStyle,
        bottom: Spacing.base,
      },
      notificationWithFooterViewStyle: {
        ...commonNotificationViewStyle,
        bottom: 104,
      },
      transPerfectFooterViewStyle: {
        width: '100%',
      },
    };

    expect(basicPageStyles).toEqual(expectedStyles);
  });
});
