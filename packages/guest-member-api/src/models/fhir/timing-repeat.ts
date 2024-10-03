// Copyright 2021 Prescryptive Health, Inc.

import { IDuration } from './duration';
import { IElement } from './element';
import { IPeriod } from './period';
import { IRange } from './range';
import { DaysOfWeek, UnitsOfTime } from './types';

export interface ITimingRepeat extends IElement {
  /**
   * Length/Range of lengths, or (Start and/or end) limits
   */
  boundsDuration?: IDuration;
  /**
   * Length/Range of lengths, or (Start and/or end) limits
   */
  boundsRange?: IRange;
  /**
   * Length/Range of lengths, or (Start and/or end) limits
   */
  boundsPeriod?: IPeriod;
  /**
   * Number of times to repeat
   */
  count?: number;
  /**
   * Contains extended information for property 'count'.
   */
  _count?: IElement;
  /**
   * Maximum number of times to repeat
   */
  countMax?: number;
  /**
   * Contains extended information for property 'countMax'.
   */
  _countMax?: IElement;
  /**
   * How long when it happens
   */
  duration?: number;
  /**
   * Contains extended information for property 'duration'.
   */
  _duration?: IElement;
  /**
   * How long when it happens (Max)
   */
  durationMax?: number;
  /**
   * Contains extended information for property 'durationMax'.
   */
  _durationMax?: IElement;
  /**
   * s | min | h | d | wk | mo | a - unit of time (UCUM)
   */
  durationUnit?: UnitsOfTime;
  /**
   * Contains extended information for property 'durationUnit'.
   */
  _durationUnit?: IElement;
  /**
   * Event occurs frequency times per period
   */
  frequency?: number;
  /**
   * Contains extended information for property 'frequency'.
   */
  _frequency?: IElement;
  /**
   * Event occurs up to frequencyMax times per period
   */
  frequencyMax?: number;
  /**
   * Contains extended information for property 'frequencyMax'.
   */
  _frequencyMax?: IElement;
  /**
   * Event occurs frequency times per period
   */
  period?: number;
  /**
   * Contains extended information for property 'period'.
   */
  _period?: IElement;
  /**
   * Upper limit of period (3-4 hours)
   */
  periodMax?: number;
  /**
   * Contains extended information for property 'periodMax'.
   */
  _periodMax?: IElement;
  /**
   * s | min | h | d | wk | mo | a - unit of time (UCUM)
   */
  periodUnit?: UnitsOfTime;
  /**
   * Contains extended information for property 'periodUnit'.
   */
  _periodUnit?: IElement;
  /**
   * mon | tue | wed | thu | fri | sat | sun
   */
  dayOfWeek?: DaysOfWeek[];
  /**
   * Contains extended information for property 'dayOfWeek'.
   */
  _dayOfWeek?: IElement[];
  /**
   * Time of day for action
   */
  timeOfDay?: string[];
  /**
   * Contains extended information for property 'timeOfDay'.
   */
  _timeOfDay?: IElement[];
  /**
   * Regular life events the event is tied to
   */
  when?: string[];
  /**
   * Contains extended information for property 'when'.
   */
  _when?: IElement[];
  /**
   * Minutes from event (before or after)
   */
  offset?: number;
  /**
   * Contains extended information for property 'offset'.
   */
  _offset?: IElement;
}
