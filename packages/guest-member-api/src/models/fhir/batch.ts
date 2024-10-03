// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from './backbone-element';

export interface IBatch extends IBackboneElement {
  /**
   * Identifier assigned to batch
   */
  lotNumber?: string;
  /**
   * When batch will expire
   */
  expirationDate?: string;
}
