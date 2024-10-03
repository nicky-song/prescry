// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';

export interface IPeriod extends IElement {
  /**
   * Starting time with inclusive boundary
   */
  start?: string;
  /**
   * Contains extended information for property 'start'.
   */
  _start?: IElement;
  /**
   * End time with inclusive boundary, if not ongoing
   */
  end?: string;
  /**
   * Contains extended information for property 'end'.
   */
  _end?: IElement;
}
