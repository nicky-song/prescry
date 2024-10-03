// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../models/drug-form';
import dateFormatter from './date.formatter';
import { StringFormatter } from './string.formatter';

export interface ISupplyContent {
  daySingle: string;
  dayPlural: string;
}

export interface IRefillsContent {
  refillSingle: string;
  refillPlural: string;
  asOf: string;
}

export interface IMeasurementText {
  singular: string;
  plural: string;
}

export interface IDrugDetails {
  strength?: string;
  unit?: string;
  formCode: string;
  quantity: number;
  refills?: number;
  refillsText?: IMeasurementText;
  supplyText?: IMeasurementText;
  supply?: number;
  authoredOn?: string;
}

export const formatStrength = (
  strength: string | undefined,
  unit: string | undefined
): string => {
  const trimmedStrength = strength ? strength.trim() : '';
  if (!trimmedStrength) {
    return '';
  }

  const segments: string[] = [trimmedStrength];

  const trimmedUnit = unit ? unit.trim() : '';
  segments.push(trimmedUnit.toLocaleLowerCase());

  return segments.join('').trim();
};

const formAbbreviation = (
  formCode: string,
  drugFormMap: Map<string, IDrugForm>
): string => {
  const form = drugFormMap.get(formCode);
  return form ? form.abbreviation : formCode;
};

export const formatQuantity = (quantity: number): number => {
  const roundedQuantity = quantity.toFixed(2);
  const formattedQuantity = +roundedQuantity * 1;
  return formattedQuantity;
};

export const formatQuantityWithForm = (
  quantity: number,
  formCode: string,
  drugFormMap: Map<string, IDrugForm>
): string => {
  const formattedQuantity = formatQuantity(quantity);
  return `${formattedQuantity} ${formAbbreviation(formCode, drugFormMap)}`;
};

export const formatSupply = (
  supply: number,
  content: ISupplyContent
): string => {
  const measurementText = supply === 1 ? content.daySingle : content.dayPlural;
  return `${supply} ${measurementText}`;
};

export const formatRefills = (
  refills: number,
  authoredOn: string | undefined,
  content: IRefillsContent
): string => {
  const formattedDate = authoredOn
    ? ' ' +
      StringFormatter.format(
        content.asOf,
        new Map([
          ['date', dateFormatter.formatToMMDDYYYY(new Date(authoredOn))],
        ])
      )
    : '';

  const measurementText =
    refills === 1 ? content.refillSingle : content.refillPlural;

  return `${refills} ${measurementText}${formattedDate}`;
};
