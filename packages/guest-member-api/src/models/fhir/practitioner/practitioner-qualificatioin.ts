// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { Identifier } from '../identifier';
import { IPeriod } from '../period';
import { IReference } from '../reference';

export interface IPractitionerQualification extends IBackboneElement {
  /**
   * An identifier for this qualification for the practitioner
   */
  identifier?: Identifier[];
  /**
   * Coded representation of the qualification
   */
  code: ICodeableConcept;
  /**
   * Period during which the qualification is valid
   */
  period?: IPeriod;
  /**
   * Organization that regulates and issues the qualification
   */
  issuer?: IReference;
}
