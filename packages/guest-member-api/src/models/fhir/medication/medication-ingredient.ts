// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IElement } from '../element';
import { IRatio } from '../ratio';
import { IReference } from '../reference';

export interface IMedicationIngredient extends IBackboneElement {
  /**
   * The product contained
   */
  itemCodeableConcept?: ICodeableConcept;
  /**
   * The product contained
   */
  strength?: IRatio;

  itemReference?: IReference;
  /**
   * Active ingredient indicator
   */
  isActive?: boolean;
  /**
   * Contains extended information for property 'isActive'.
   */
  _isActive?: IElement;
  /**
   * Quantity of ingredient present
   */
  amount?: IRatio;
}
