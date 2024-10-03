// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IPeriod } from './period';
import { ContactPointSystem, ContactPointUse } from './types';

export interface IContactPoint extends IElement {
  /**
   * phone | fax | email | pager | url | sms | other
   */
  system?: ContactPointSystem;
  /**
   * Contains extended information for property 'system'.
   */
  _system?: IElement;
  /**
   * The actual contact point details
   */
  value?: string;
  /**
   * Contains extended information for property 'value'.
   */
  _value?: IElement;
  /**
   * home | work | temp | old | mobile - purpose of this contact point
   */
  use?: ContactPointUse;
  /**
   * Contains extended information for property 'use'.
   */
  _use?: IElement;
  /**
   * Specify preferred order of use (1 = highest)
   */
  rank?: number;
  /**
   * Contains extended information for property 'rank'.
   */
  _rank?: IElement;
  /**
   * Time period when the contact point was/is in use
   */
  period?: IPeriod;
}
