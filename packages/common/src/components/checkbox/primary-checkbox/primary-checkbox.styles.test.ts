// Copyright 2021 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IPrimaryCheckBoxStyles,
  primaryCheckBoxStyles,
} from './primary-checkbox.styles';

describe('primaryCheckBoxStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrimaryCheckBoxStyles = {
      checkBoxImageStyles: {
        flexGrow: 0,
        marginRight: Spacing.threeQuarters,
      },
      checkBoxViewStyles: {
        flexDirection: 'row',
        flexGrow: 1,
        alignItems: 'center',
      },
      iconTextStyle: {
        color: PrimaryColor.prescryptivePurple,
        fontSize: 22,
      },
    };

    expect(primaryCheckBoxStyles).toEqual(expectedStyles);
  });
});
