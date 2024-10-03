// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import { IFaxPanelStyles, faxPanelStyles } from './fax.panel.styles';

describe('faxPanelStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IFaxPanelStyles = {
      faxNumberTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(faxPanelStyles).toEqual(expectedStyles);
  });
});
