// Copyright 2021 Prescryptive Health, Inc.

import { ICoding } from './coding';
import { IElement } from './element';

export interface ICodeableConcept extends IElement {
  /**
   * Code defined by a terminology system
   */
  coding?: ICoding[];
  /**
   * Plain text representation of the concept
   */
  text?: string;
  /**
   * Contains extended information for property 'text'.
   */
  _text?: IElement;
}
