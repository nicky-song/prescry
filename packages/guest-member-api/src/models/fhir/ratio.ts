// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IQuantity } from './quantity';

export interface IRatio extends IElement {
  /**
   * Numerator value
   */
  numerator?: IQuantity;
  /**
   * Denominator value
   */
  denominator?: IQuantity;
}
