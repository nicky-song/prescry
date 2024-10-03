// Copyright 2021 Prescryptive Health, Inc.

import {
  accountLockedContainerStyles,
  IAccountLockedContainerStyles,
} from './account-locked-container.styles';
import { Spacing } from '../../../theming/spacing';

describe('accountLockedContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAccountLockedContainerStyles = {
      instructionsTextStyle: {
        marginTop: Spacing.base,
      },
    };

    expect(accountLockedContainerStyles).toEqual(expectedStyles);
  });
});
