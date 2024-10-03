// Copyright 2019 Prescryptive Health, Inc.

export class NumericValidator {
  public static isWholeNumber(text = ''): boolean {
    return /^\d+$/.test(text);
  }
}
