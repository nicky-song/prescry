// Copyright 2019 Prescryptive Health, Inc.

export class MoneyFormatter {
  public static format(
    amountInDollars: number | undefined,
    cutoffDecimal?: boolean
  ): string {
    if (amountInDollars === undefined) {
      return '';
    }

    const formatter = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
    });

    const amountInDollarsFormat = formatter.format(amountInDollars);

    const indexOfDot = amountInDollarsFormat.indexOf('.');

    return cutoffDecimal && indexOfDot > -1
      ? amountInDollarsFormat.substring(0, indexOfDot)
      : amountInDollarsFormat;
  }
}
