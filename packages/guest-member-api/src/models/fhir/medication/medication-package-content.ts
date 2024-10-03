// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IQuantity } from '../quantity';
import { IReference } from '../reference';

export interface IMedicationPackageContent extends IBackboneElement {
  /**
   * The item in the package
   */
  itemCodeableConcept?: ICodeableConcept;
  /**
   * The item in the package
   */
  itemReference?: IReference;
  /**
   * Quantity present in the package
   */
  amount?: IQuantity;
}
