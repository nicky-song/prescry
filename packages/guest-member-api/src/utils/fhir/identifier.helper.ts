// Copyright 2022 Prescryptive Health, Inc.

import { ICodeableConcept } from '../../models/fhir/codeable-concept';
import { Identifier } from '../../models/fhir/identifier';

export const findIdentifierForCodeableConceptCode = (
  identifiers: Identifier[] = [],
  code: string
): Identifier | undefined =>
  identifiers.find(
    (identifier) =>
      identifier.type && doesCodeableConceptHaveCode(identifier.type, code)
  );

const doesCodeableConceptHaveCode = (
  codeableConcept: ICodeableConcept,
  code: string
): boolean =>
  !!codeableConcept.coding &&
  codeableConcept.coding.some((coding) => coding.code === code);
