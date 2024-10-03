// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IPeriod } from './period';
import { NameUse } from './types';

export interface IHumanName extends IElement {
  /**
   * usual | official | temp | nickname | anonymous | old | maiden
   */
  use?: NameUse;
  /**
   * Contains extended information for property 'use'.
   */
  _use?: IElement;
  /**
   * Text representation of the full name
   */
  text?: string;
  /**
   * Contains extended information for property 'text'.
   */
  _text?: IElement;
  /**
   * Family name (often called 'Surname')
   */
  family?: string;
  /**
   * Contains extended information for property 'family'.
   */
  _family?: IElement;
  /**
   * Given names (not always 'first'). Includes middle names
   */
  given?: string[];
  /**
   * Contains extended information for property 'given'.
   */
  _given?: IElement[];
  /**
   * Parts that come before the name
   */
  prefix?: string[];
  /**
   * Contains extended information for property 'prefix'.
   */
  _prefix?: IElement[];
  /**
   * Parts that come after the name
   */
  suffix?: string[];
  /**
   * Contains extended information for property 'suffix'.
   */
  _suffix?: IElement[];
  /**
   * Time period when name was/is in use
   */
  period?: IPeriod;
}
