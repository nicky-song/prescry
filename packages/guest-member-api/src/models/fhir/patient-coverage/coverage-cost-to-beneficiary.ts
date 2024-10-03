// Copyright 2022 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IElement } from '../element';
import { IMoney } from '../money';
import { IQuantity } from '../quantity';
import { ICoverageException } from './coverage-exception';

export interface ICoverageCostToBeneficiary extends IBackboneElement {
  /**
   * 	Cost category
   */
  type?: ICodeableConcept;

  /**
   * The amount due from the patient for the cost category.
   */
  valueQuantity?: IQuantity;

  /**
   * Contains extended information for property 'valueQuantity'.
   */
  _valueQuantity: IElement;

  /**
   * 	The amount due from the patient for the cost category.
   */
  valueMoney?: IMoney;

  /**
   * Contains extended information for property 'valueMoney'.
   */
  _valueMoney: IElement;

  /**
   * Exceptions for patient payments
   */
  exception?: ICoverageException[];
}
