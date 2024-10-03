// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { RedScale } from '../../../theming/theme';
import { ILabelStyle, labelStyle } from './label.style';

describe('labelStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: ILabelStyle = {
      aboveTextStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      aboveViewStyle: {
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
      },
      leftTextStyle: {
        marginRight: Spacing.threeQuarters,
      },
      leftViewStyle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      },
      requiredTextStyle: {
        marginLeft: Spacing.quarter,
        color: RedScale.regular,
      },
      rightTextStyle: {
        marginLeft: Spacing.threeQuarters,
      },
      rightViewStyle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
      },
    };

    expect(labelStyle).toEqual(expectedStyles);
  });
});
