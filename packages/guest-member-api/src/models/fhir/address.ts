// Copyright 2021 Prescryptive Health, Inc.

import type { IElement } from './element';
import type { IPeriod } from './period';
import type { AddressType, AddressUse } from './types';

export interface IAddress extends IElement {
  /**
   * home | work | temp | old - purpose of this address
   */
  use?: AddressUse;
  /**
   * Contains extended information for property 'use'.
   */
  _use?: IElement;
  /**
   * postal | physical | both
   */
  type?: AddressType;
  /**
   * Contains extended information for property 'type'.
   */
  _type?: IElement;
  /**
   * Text representation of the address
   */
  text?: string;
  /**
   * Contains extended information for property 'text'.
   */
  _text?: IElement;
  /**
   * Street name, number, direction & P.O. Box etc.
   */
  line?: string[];
  /**
   * Contains extended information for property 'line'.
   */
  _line?: IElement[];
  /**
   * Name of city, town etc.
   */
  city?: string;
  /**
   * Contains extended information for property 'city'.
   */
  _city?: IElement;
  /**
   * District name (aka county)
   */
  district?: string;
  /**
   * Contains extended information for property 'district'.
   */
  _district?: IElement;
  /**
   * Sub-unit of country (abbreviations ok)
   */
  state?: string;
  /**
   * Contains extended information for property 'state'.
   */
  _state?: IElement;
  /**
   * Postal code for area
   */
  postalCode?: string;
  /**
   * Contains extended information for property 'postalCode'.
   */
  _postalCode?: IElement;
  /**
   * Country (e.g. can be ISO 3166 2 or 3 letter code)
   */
  country?: string;
  /**
   * Contains extended information for property 'country'.
   */
  _country?: IElement;
  /**
   * Time period when address was/is in use
   */
  period?: IPeriod;
}
