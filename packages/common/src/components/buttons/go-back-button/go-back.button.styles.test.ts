// Copyright 2021 Prescryptive Health, Inc.

import {
  goBackButtonStyles,
  IGoBackButtonStyles,
} from './go-back.button.styles';
import { IconSize } from '../../../theming/icons';

describe('listItemButtonStyles', () => {
  it('has expected styles (default)', () => {
    const expected: IGoBackButtonStyles = {
      viewStyle: {
        height: IconSize.big * 2,
        width: IconSize.big * 2,
      },
    };
    expect(goBackButtonStyles).toEqual(expected);
  });
});
