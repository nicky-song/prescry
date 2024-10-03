// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IElement } from '../element';

export interface ICoverageClass extends IBackboneElement {
  /**
   * 	Type of class such as 'group' or 'plan'
   */
  type: ICodeableConcept;

  /**
   * Value associated with the type.
   */
  value: string;

  /**
   * Contains extended information for property 'value'.
   */
  _value?: IElement;

  /**
   * 	Human readable description of the type and value.
   */
  name?: string;

  /**
   * Contains extended information for property 'name'.
   */
  _name?: IElement;
}
