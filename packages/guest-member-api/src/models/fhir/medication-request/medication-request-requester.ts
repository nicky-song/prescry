// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { IReference } from '../reference';

export interface IMedicationRequestRequester extends IBackboneElement {
  reference?: string;
  /**
   * Who ordered the initial medication(s)
   */
  agent?: IReference;
  /**
   * Organization agent is acting for
   */
  onBehalfOf?: IReference;
}
