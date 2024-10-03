// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  orderConfirmationScreenStyles,
  IOrderConfirmationScreenStyles,
} from './order-confirmation.screen.styles';
import { FontSize } from '../../../../theming/fonts';
import { GrayScaleColor } from '../../../../theming/colors';

describe('orderConfirmationScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IOrderConfirmationScreenStyles = {
      separatorViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      bottomSeparatorViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
        marginLeft: -Spacing.times1pt5,
        marginRight: -Spacing.times1pt5,
      },
      checkImageStyle: {
        height: 16,
        width: 16,
        marginRight: Spacing.base,
      },
      bodyViewStyle: {
        alignContent: 'center',
        alignSelf: 'stretch',
        flexGrow: 1,
      },
      titleViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      headerViewStyle: {
        paddingBottom: 0,
      },
      couponViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.times2,
      },
      linkTextStyle: {
        fontSize: FontSize.small,
      },
      customerSupportWithFooterViewStyle: {
        marginTop: Spacing.base,
      },
      customerSupportWithoutFooterViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.times2,
      },
      orderConfirmationTitleViewStyle: {
        marginLeft: Spacing.base,
        flex: 1,
      },
      favoritingNotificationViewStyle: {
        width: '100%',
      },
      orderConfirmationTitleTextStyle: {
        flexWrap: 'wrap',
      },
      stickyViewStyle: {
        backgroundColor: GrayScaleColor.white,
        paddingTop: Spacing.base,
        paddingRight: Spacing.times1pt5,
        paddingLeft: Spacing.times1pt5,
        paddingBottom: Spacing.base,
      },
      whatIsNextSectionViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.half,
      },
    };
    
    expect(orderConfirmationScreenStyles).toEqual(expectedStyles);
  });
});
