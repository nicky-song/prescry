// Copyright 2020 Prescryptive Health, Inc.

import { StringFormatter } from './string.formatter';

describe('StringFormatter', () => {
  it.each([
    ['', undefined, ''],
    ['Sample', undefined, 'Sample'],
    [
      'Sample {appointment-date} at {appointment-time}.',
      undefined,
      'Sample {appointment-date} at {appointment-time}.',
    ],
    [
      'Sample {appointment-date} at {appointment-time}.',
      new Map(),
      'Sample {appointment-date} at {appointment-time}.',
    ],
    [
      'Sample {appointment-date} at {appointment-time}.',
      new Map([['key', 'value']]),
      'Sample {appointment-date} at {appointment-time}.',
    ],
    [
      'Sample {appointment-date} at {appointment-time}.',
      new Map([['appointment-date', 'date']]),
      'Sample date at {appointment-time}.',
    ],
    [
      'Sample {appointment-date} at {appointment-time}.',
      new Map([
        ['appointment-date', 'date'],
        ['appointment-time', 'time'],
      ]),
      'Sample date at time.',
    ],
    [
      'Sample {appointment-date} at {appointment-time} on {appointment-date}.',
      new Map([
        ['appointment-date', 'date'],
        ['appointment-time', 'time'],
      ]),
      'Sample date at time on date.',
    ],
  ])(
    'formats (%p, %p)',
    (
      s: string,
      parameterMap: Map<string, string> | undefined,
      expectedString: string
    ) => {
      expect(StringFormatter.format(s, parameterMap)).toEqual(expectedString);
    }
  );

  it.each([
    ['sample name', 'Sample Name'],
    ['SAMPLE name', 'Sample Name'],
    ['SaMpLe nAmE', 'Sample Name'],
    ['sample MULTIPLE word-NaMe', 'Sample Multiple Word-name'],
    [' sample MULTIPLE word', 'Sample Multiple Word'],
    ['sample  m  name', 'Sample M Name'],
    [' sample  name ', 'Sample Name'],
  ])(
    'Convert string to name case (%p, %p)',
    (s: string, expectedString: string) => {
      expect(StringFormatter.trimAndConvertToNameCase(s)).toEqual(
        expectedString
      );
    }
  );

  it.each([
    ['Sample Long string for test case', 6, 'Sample...'],
    [
      'Sample Long string for test case',
      100,
      'Sample Long string for test case',
    ],
    ['Sample', undefined, 'Sample'],
    [undefined, undefined, undefined],
  ])(
    'shrink string test',
    (s?: string, len?: number, expectedString?: string) => {
      expect(StringFormatter.shrinkText(s, len)).toEqual(expectedString);
    }
  );
});
