// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IPeriod } from '../period';

export interface ICoverageException extends IBackboneElement {
  /**
   * 		Exception category
   */
  type: ICodeableConcept;

  /**
   * The effective period of the exception
   */
  period?: IPeriod;
}
