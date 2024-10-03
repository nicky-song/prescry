// Copyright 2019 Prescryptive Health, Inc.

import { MoneyFormatter } from './money-formatter';

describe('MoneyFormatter', () => {
  it('formats amount with default', () => {
    expect(MoneyFormatter.format(undefined)).toEqual('');
    expect(MoneyFormatter.format(0)).toEqual('$0.00');
    expect(MoneyFormatter.format(0.01)).toEqual('$0.01');
    expect(MoneyFormatter.format(0.1)).toEqual('$0.10');
    expect(MoneyFormatter.format(0.11)).toEqual('$0.11');
    expect(MoneyFormatter.format(1)).toEqual('$1.00');
    expect(MoneyFormatter.format(1.01)).toEqual('$1.01');
    expect(MoneyFormatter.format(1.1)).toEqual('$1.10');
    expect(MoneyFormatter.format(1.11)).toEqual('$1.11');
    expect(MoneyFormatter.format(10)).toEqual('$10.00');
    expect(MoneyFormatter.format(10.1)).toEqual('$10.10');
    expect(MoneyFormatter.format(11.11)).toEqual('$11.11');
    expect(MoneyFormatter.format(999.99)).toEqual('$999.99');
    expect(MoneyFormatter.format(9999.99)).toEqual('$9,999.99');
    expect(MoneyFormatter.format(707.999)).toEqual('$708.00');
  });

  it('formats amount without decimal when cutoffDecimal', () => {
    expect(MoneyFormatter.format(undefined, true)).toEqual('');
    expect(MoneyFormatter.format(0, true)).toEqual('$0');
    expect(MoneyFormatter.format(0.01, true)).toEqual('$0');
    expect(MoneyFormatter.format(0.1, true)).toEqual('$0');
    expect(MoneyFormatter.format(0.11, true)).toEqual('$0');
    expect(MoneyFormatter.format(1, true)).toEqual('$1');
    expect(MoneyFormatter.format(1.01, true)).toEqual('$1');
    expect(MoneyFormatter.format(1.1, true)).toEqual('$1');
    expect(MoneyFormatter.format(1.11, true)).toEqual('$1');
    expect(MoneyFormatter.format(10, true)).toEqual('$10');
    expect(MoneyFormatter.format(10.1, true)).toEqual('$10');
    expect(MoneyFormatter.format(11.11, true)).toEqual('$11');
    expect(MoneyFormatter.format(999.99, true)).toEqual('$999');
    expect(MoneyFormatter.format(9999.99, true)).toEqual('$9,999');
    expect(MoneyFormatter.format(707.999, true)).toEqual('$708');
  });
});
