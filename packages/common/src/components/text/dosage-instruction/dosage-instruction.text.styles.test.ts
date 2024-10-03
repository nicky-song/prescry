// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { Spacing } from '../../../theming/spacing';
import {
  IDosageInstructionTextStyles,
  dosageInstructionTextStyles,
} from './dosage-instruction.text.styles';

describe('dosageInstructionTextStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IDosageInstructionTextStyles = {
      instructionTextStyle: {
        marginLeft: Spacing.half,
      },
      iconTextStyle: {
        color: NotificationColor.darkYellow,
        fontSize: IconSize.regular,
      },
      viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    };

    expect(dosageInstructionTextStyles).toEqual(expectedStyles);
  });
});
