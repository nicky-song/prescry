// Copyright 2021 Prescryptive Health, Inc.

import { FontSize } from '../../../../theming/fonts';
import {
  linkCheckboxStyles,
  ILinkCheckboxStyles,
} from './link.checkbox.styles';

describe('linkCheckboxStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ILinkCheckboxStyles = {
      baseTextStyle: {
        fontSize: FontSize.small,
      },
    };

    expect(linkCheckboxStyles).toEqual(expectedStyles);
  });
});
