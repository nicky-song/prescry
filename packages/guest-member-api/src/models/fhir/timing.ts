// Copyright 2021 Prescryptive Health, Inc.

import { ICodeableConcept } from './codeable-concept';
import { IElement } from './element';
import { ITimingRepeat } from './timing-repeat';

export interface ITiming extends IElement {
  /**
   * When the event occurs
   */
  event?: string[];
  /**
   * Contains extended information for property 'event'.
   */
  _event?: IElement[];
  /**
   * When the event is to occur
   */
  repeat?: ITimingRepeat;
  /**
   * BID | TID | QID | AM | PM | QD | QOD | Q4H | Q6H +
   */
  code?: ICodeableConcept;
}
