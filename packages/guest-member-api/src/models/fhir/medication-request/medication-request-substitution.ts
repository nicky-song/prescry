// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IElement } from '../element';

export interface IMedicationRequestSubstitution extends IBackboneElement {
  /**
   * Whether substitution is allowed or not
   */
  allowed: boolean;
  /**
   * Contains extended information for property 'allowed'.
   */
  _allowed?: IElement;
  /**
   * Why should (not) substitution be made
   */
  reason?: ICodeableConcept;
}
