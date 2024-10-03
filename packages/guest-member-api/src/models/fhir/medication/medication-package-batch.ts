// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { IElement } from '../element';
export interface IMedicationPackageBatch extends IBackboneElement {
  /**
   * Identifier assigned to batch
   */
  lotNumber?: string;
  /**
   * Contains extended information for property 'lotNumber'.
   */
  _lotNumber?: IElement;
  /**
   * When batch will expire
   */
  expirationDate?: string;
  /**
   * Contains extended information for property 'expirationDate'.
   */
  _expirationDate?: IElement;
}
