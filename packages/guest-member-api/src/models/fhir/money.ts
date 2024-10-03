// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';

export interface IMoney extends IElement {
  /**
   * Numerical value (with implicit precision)
   */
  value?: number;
  /**
   * Contains extended information for property 'value'.
   */
  _value?: IElement;
  /**
   * ISO 4217 Currency Code
   */
  currency?: string;
  /**
   * Contains extended information for property 'currency'.
   */
  _currency: IElement;
}
