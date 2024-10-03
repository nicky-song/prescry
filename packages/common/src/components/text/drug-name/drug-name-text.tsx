// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';

export interface IDrugNameTextProps {
  drugName: string;
  input: string;
}

export const DrugNameText = (
  { drugName, input }: IDrugNameTextProps
) => {
  const drugNameString =
    drugName !== null && drugName !== undefined ? (drugName as string) : '';
  const inputString =
    input !== null && input !== undefined ? (input as string) : '';

  const inputStartIndex =
    inputString !== ''
      ? drugNameString.toLowerCase().indexOf(inputString.toLowerCase())
      : drugNameString.length;
  const inputEndIndex = inputStartIndex + inputString.length;

  const isMatching =
    inputStartIndex >= 0 && inputStartIndex < drugNameString.length;
  const isValid = inputStartIndex + inputString.length <= drugNameString.length;

  const beforeInputString =
    isMatching && isValid
      ? drugNameString.substring(0, inputStartIndex)
      : drugNameString;

  const equivalentInputString =
    isMatching && isValid
      ? drugNameString.substring(inputStartIndex, inputEndIndex)
      : '';

  const afterInputString =
    isMatching && isValid ? drugNameString.substring(inputEndIndex) : '';

  return (
    <>
      <ProtectedBaseText>{beforeInputString}</ProtectedBaseText>
      <ProtectedBaseText weight={'bold'}>{equivalentInputString}</ProtectedBaseText>
      <ProtectedBaseText>{afterInputString}</ProtectedBaseText>
    </>
  );
};
