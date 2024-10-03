// Copyright 2023 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import { GrayScaleColor } from '../../../../theming/colors';
import { BorderRadius } from '../../../../theming/borders';
import {
  INoPricePricingOptionInformativePanelStyles,
  noPricePricingOptionInformativePanelStyles,
} from './no-price-pricing-option-informative.panel.styles';

describe('pricingOptionInformativePanelStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: INoPricePricingOptionInformativePanelStyles = {
      panelViewStyle: {
        paddingTop: Spacing.threeQuarters,
        paddingRight: Spacing.base,
        paddingBottom: Spacing.threeQuarters,
        paddingLeft: Spacing.base,
        backgroundColor: GrayScaleColor.lightGray,
        borderRadius: BorderRadius.normal,
      },
    };

    expect(noPricePricingOptionInformativePanelStyles).toEqual(expectedStyles);
  });
});
