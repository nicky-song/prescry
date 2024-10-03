// Copyright 2019 Prescryptive Health, Inc.

export class DrugCodesFormatter {
  public static formatCodes(
    multiSourceCode: string,
    brandNameCode: string
  ): string {
    return `${multiSourceCode || '?'}/${brandNameCode || '?'}`;
  }
}
