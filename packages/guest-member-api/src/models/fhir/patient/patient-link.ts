// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { IElement } from '../element';
import { IReference } from '../reference';
import { LinkType } from '../types';

export interface IPatientLink extends IBackboneElement {
  /**
   * The other patient or related person resource that the link refers to
   */
  other: IReference;
  /**
   * replaced-by | replaces | refer | seealso - type of link
   */
  type: LinkType;
  /**
   * Contains extended information for property 'type'.
   */
  _type?: IElement;
}
