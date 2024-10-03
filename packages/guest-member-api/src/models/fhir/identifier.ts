// Copyright 2021 Prescryptive Health, Inc.

import { ICodeableConcept } from './codeable-concept';
import { IElement } from './element';
import { IPeriod } from './period';
import { IReference } from './reference';
import { IdentifierUse } from './types';

export interface Identifier extends IElement {
  /**
   * usual | official | temp | secondary (If known)
   */
  use?: IdentifierUse;
  /**
   * Contains extended information for property 'use'.
   */
  _use?: IElement;
  /**
   * Description of identifier
   */
  type?: ICodeableConcept;
  /**
   * The namespace for the identifier value
   */
  system?: string;
  /**
   * Contains extended information for property 'system'.
   */
  _system?: IElement;
  /**
   * The value that is unique
   */
  value?: string;
  /**
   * Contains extended information for property 'value'.
   */
  _value?: IElement;
  /**
   * Time period when id is/was valid for use
   */
  period?: IPeriod;
  /**
   * Organization that issued id (may be just text)
   */
  assigner?: IReference;
}
