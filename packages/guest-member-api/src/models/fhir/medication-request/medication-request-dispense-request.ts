// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { IDuration } from '../duration';
import { IElement } from '../element';
import { IExtension } from '../extension';
import { IPeriod } from '../period';
import { IQuantity } from '../quantity';
import { IReference } from '../reference';

export interface IMedicationRequestDispenseRequest extends IBackboneElement {
  initialFill?: {
    /**
     * Amount of medication to supply per dispense
     */
    quantity?: IQuantity;
  };
  /**
   * Time period supply is authorized for
   */
  validityPeriod?: IPeriod;
  /**
   * Number of refills authorized
   */
  numberOfRepeatsAllowed?: number;
  /**
   * Contains extended information for property 'numberOfRepeatsAllowed'.
   */
  _numberOfRepeatsAllowed?: IElement;
  /**
   * Amount of medication to supply per dispense
   */
  quantity?: IQuantity;
  /**
   * Number of days supply per dispense
   */
  expectedSupplyDuration?: IDuration;
  /**
   * Intended dispenser
   */
  performer?: IReference;
  extension?: IExtension[];
}
