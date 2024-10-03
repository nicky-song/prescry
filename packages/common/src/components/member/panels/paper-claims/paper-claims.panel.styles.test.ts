// Copyright 2022 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  IPaperClaimsPanelStyles,
  paperClaimsPanelStyles,
} from './paper-claims.panel.styles';

describe('paperClaimsPanelStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPaperClaimsPanelStyles = {
      addressTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      addressViewStyle: {
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(paperClaimsPanelStyles).toEqual(expectedStyles);
  });
});
