// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { NarrativeStatus } from './types';

export interface INarrative extends IElement {
  /**
   * generated | extensions | additional | empty
   */
  status: NarrativeStatus;
  /**
   * Contains extended information for property 'status'.
   */
  _status?: IElement;
  /**
   * Limited xhtml content
   */
  div: string;
  /**
   * Contains extended information for property 'div'.
   */
  _div?: IElement;
}
