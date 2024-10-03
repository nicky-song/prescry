// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../models/drug-form';
import dateFormatter from './date.formatter';
import {
  formatStrength,
  formatQuantity,
  formatSupply,
  ISupplyContent,
  formatQuantityWithForm,
  IRefillsContent,
  formatRefills,
} from './drug.formatter';

describe('formatStrength', () => {
  it.each([
    [undefined, undefined, ''],
    ['', '', ''],
    ['', '%', ''],
    [' ', '', ''],
    [' ', '%', ''],
    ['1.5', '', '1.5'],
    ['1.5', '%', '1.5%'],
    ['10', 'ML', '10ml'],
  ])(
    'formats strength (strength: %p, unit: %p)',
    (
      strengthMock: string | undefined,
      unitMock: string | undefined,
      expectedString: string
    ) => {
      expect(formatStrength(strengthMock, unitMock)).toEqual(expectedString);
    }
  );
});

describe('formatQuantity', () => {
  it.each([
    [10, 10],
    [10.1, 10.1],
    [10.11, 10.11],
    [10.111, 10.11],
    [10.011, 10.01],
    [10.001, 10],
    [10.009, 10.01],
  ])(
    'formats quantity (quantity: %p)',
    (quantityMock: number, expectedNumber: number) => {
      expect(formatQuantity(quantityMock)).toEqual(expectedNumber);
    }
  );
});

describe('formatQuantityWithForm', () => {
  const drugFormMapMock: Map<string, IDrugForm> = new Map([
    ['CAPS', { formCode: 'CAPS', abbreviation: 'Caplet', description: '' }],
  ]);

  it.each([
    [1, 'CAPS', '1 Caplet'],
    [2, 'XXX', '2 XXX'],
  ])(
    'formats quantity %p with form %p',
    (quantityMock, formCodeMock, expected) => {
      expect(
        formatQuantityWithForm(quantityMock, formCodeMock, drugFormMapMock)
      ).toEqual(expected);
    }
  );
});

describe('formatSupply', () => {
  const contentMock: ISupplyContent = {
    daySingle: 'jour',
    dayPlural: 'jours',
  };

  it.each([
    [1, '1 jour'],
    [2, '2 jours'],
  ])('formats supply %p', (supplyMock: number, expected: string) => {
    expect(formatSupply(supplyMock, contentMock)).toEqual(expected);
  });
});

describe('formatRefills', () => {
  const contentMock: IRefillsContent = {
    refillSingle: 'remplir',
    refillPlural: 'remplirs',
    asOf: 'de {date}',
  };

  it.each([
    [1, undefined, '1 remplir'],
    [
      1,
      '2022-06-10',
      `1 remplir de ${dateFormatter.formatToMMDDYYYY(new Date('2022-06-10'))}`,
    ],
    [2, undefined, '2 remplirs'],
    [
      2,
      '2022-06-10',
      `2 remplirs de ${dateFormatter.formatToMMDDYYYY(new Date('2022-06-10'))}`,
    ],
  ])(
    'formats %p refill(s) with authored date %p',
    (
      refillMock: number,
      authoredOnMock: string | undefined,
      expected: string
    ) => {
      expect(formatRefills(refillMock, authoredOnMock, contentMock)).toEqual(
        expected
      );
    }
  );
});
