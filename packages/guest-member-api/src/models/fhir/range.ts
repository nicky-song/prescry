// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IQuantity } from './quantity';

export interface IRange extends IElement {
  /**
   * Low limit
   */
  low?: IQuantity;
  /**
   * High limit
   */
  high?: IQuantity;
}
