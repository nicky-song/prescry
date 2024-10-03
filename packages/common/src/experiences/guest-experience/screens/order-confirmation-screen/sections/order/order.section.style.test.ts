// Copyright 2021 Prescryptive Health, Inc.

import { getFontDimensions, FontSize } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';
import { IOrderSectionStyle, orderSectionStyle } from './order.section.style';

describe('orderSectionStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IOrderSectionStyle = {
      drugDetailsViewStyle: {
        marginTop: Spacing.base,
      },
      heading2TextStyle: {
        marginBottom: Spacing.base,
      },
      sectionViewStyle: {
        paddingTop: Spacing.times1pt5,
        paddingBottom: Spacing.times1pt5,
      },
      rowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      estimatedPriceNoticeTextStyle: {
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        paddingTop: Spacing.base,
        ...getFontDimensions(FontSize.small),
      },
      dualPriceSectionViewStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.half,
      },
      prescriptionPriceSectionViewStyle: {
        marginTop: Spacing.base,
      },
    };

    expect(orderSectionStyle).toEqual(expectedStyle);
  });
});
