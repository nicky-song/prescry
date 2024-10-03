// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { PurpleScale, GreyScale } from '../../../theming/theme';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import {
  PromotionLinkButtonStyle,
  IPromotionLinkButtonStyle,
} from './promotion-link.button.style';

describe('PromotionLinkButtonStyle', () => {
  it('has expected default styles', () => {
    const expectedStyle: IPromotionLinkButtonStyle = {
      buttonContainerViewStyle: {
        backgroundColor: GreyScale.lightest,
      },
      rowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: GreyScale.lightWhite,
        borderRadius: Spacing.threeQuarters,
        padding: Spacing.base,
      },
      linkTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        fontSize: FontSize.small,
        color: PurpleScale.darkest,
        marginLeft: Spacing.quarter,
        textDecorationLine: 'underline',
      },
      promotionTextStyle: {
        fontSize: FontSize.small,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      couponIconImageStyle: {
        height: 19,
        width: 24,
        marginTop: 2,
        marginRight: Spacing.half,
      },
    };

    expect(PromotionLinkButtonStyle).toEqual(expectedStyle);
  });
});
