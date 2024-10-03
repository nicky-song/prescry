// Copyright 2019 Prescryptive Health, Inc.

import { IStrength } from '../../models/strength';

export class StrengthFormatter {
  public static format(strength?: IStrength): string {
    if (!strength) {
      return '';
    }

    const value = strength.value || '';
    return `${value}${StrengthFormatter.formatUnit(strength.unit)}`;
  }

  private static formatUnit(unit = ''): string {
    return unit.toLowerCase();
  }
}
