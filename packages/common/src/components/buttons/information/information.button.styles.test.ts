// Copyright 2021 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  informationButtonStyles,
  IInformationButtonStyles,
} from './information.button.styles';

describe('iconButtonStyles', () => {
  it('has expected styles (default)', () => {
    const expected: IInformationButtonStyles = {
      iconTextStyle: {
        color: PrimaryColor.darkBlue,
        fontSize: 18,
      },
      iconButtonViewStyle: {
        padding: Spacing.half,
      },
    };
    expect(informationButtonStyles).toEqual(expected);
  });
});
