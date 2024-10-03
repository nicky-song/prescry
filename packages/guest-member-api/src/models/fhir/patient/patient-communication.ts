// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IElement } from '../element';

export interface IPatientCommunication extends IBackboneElement {
  /**
   * The language which can be used to communicate with the patient about their health
   */
  language: ICodeableConcept;
  /**
   * Language preference indicator
   */
  preferred?: boolean;
  /**
   * Contains extended information for property 'preferred'.
   */
  _preferred?: IElement;
}
