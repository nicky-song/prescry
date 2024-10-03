// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { QuantityComparator } from './types';

export interface IQuantity extends IElement {
  /**
   * Numerical value (with implicit precision)
   */
  value?: number;
  /**
   * Contains extended information for property 'value'.
   */
  _value?: IElement;
  /**
   * < | <= | >= | > - how to understand the value
   */
  comparator?: QuantityComparator;
  /**
   * Contains extended information for property 'comparator'.
   */
  _comparator?: IElement;
  /**
   * Unit representation
   */
  unit?: string;
  /**
   * Contains extended information for property 'unit'.
   */
  _unit?: IElement;
  /**
   * System that defines coded unit form
   */
  system?: string;
  /**
   * Contains extended information for property 'system'.
   */
  _system?: IElement;
  /**
   * Coded form of the unit
   */
  code?: string;
  /**
   * Contains extended information for property 'code'.
   */
  _code?: IElement;
}
