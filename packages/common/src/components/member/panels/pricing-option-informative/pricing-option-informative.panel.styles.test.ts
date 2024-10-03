// Copyright 2023 Prescryptive Health, Inc.

import {
  pricingOptionInformativePanelStyles,
  IPricingOptionInformativePanelStyles,
} from './pricing-option-informative.panel.styles';
import {
  FontWeight,
  getFontFace,
  FontSize,
  getFontDimensions,
} from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { GrayScaleColor } from '../../../../theming/colors';
import { BorderRadius } from '../../../../theming/borders';

describe('pricingOptionInformativePanelStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPricingOptionInformativePanelStyles = {
      panelViewStyle: {
        flexDirection: 'column',
        paddingTop: Spacing.threeQuarters,
        paddingRight: Spacing.base,
        paddingBottom: Spacing.threeQuarters,
        paddingLeft: Spacing.base,
        backgroundColor: GrayScaleColor.lightGray,
        borderRadius: BorderRadius.normal,
      },
      titleViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      titleTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      subTextStyle: {
        ...getFontDimensions(FontSize.small),
      },
    };

    expect(pricingOptionInformativePanelStyles).toEqual(expectedStyles);
  });
});
