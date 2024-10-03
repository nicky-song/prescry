// Copyright 2021 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  digitalIdCardScreenStyles,
  IDigitalIdCardScreenStyles,
} from './digital-id-card.screen.styles';

describe('digitalIdCardScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IDigitalIdCardScreenStyles = {
      digitalIdCardViewStyle: {
        marginTop: Spacing.times2,
        marginBottom: Spacing.times2,
      },
      digitalIdCardScreenBodyViewStyle: {
        paddingBottom: 0,
      },
      issuerNumberViewStyle: {
        flexDirection: 'row',
      },
      issuerNumberLabelTextStyle: {
        flexGrow: 0,
        flexBasis: 'auto',
        marginRight: Spacing.threeQuarters,
      },
      issuerNumberTextStyle: {
        ...getFontFace({ weight: FontWeight.bold }),
      },
      separatorViewStyle: {
        marginTop: Spacing.times2,
        marginBottom: Spacing.times2,
      },
    };

    expect(digitalIdCardScreenStyles).toEqual(expectedStyles);
  });
});
