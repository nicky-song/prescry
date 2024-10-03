// Copyright 2021 Prescryptive Health, Inc.

import { RedScale } from '../../../theming/theme';
import {
  fieldErrorTextStyle,
  IFieldErrorTextStyle,
} from './field-error.text.style';

describe('fieldErrorTextStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IFieldErrorTextStyle = {
      textStyle: {
        color: RedScale.regular,
      },
    };

    expect(fieldErrorTextStyle).toEqual(expectedStyles);
  });
});
