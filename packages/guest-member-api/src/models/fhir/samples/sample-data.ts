// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from '../element';
import { IQuantity } from '../quantity';

export interface SampledData extends IElement {
  /**
   * Zero value and units
   */
  origin: IQuantity;
  /**
   * Number of milliseconds between samples
   */
  period: number;
  /**
   * Contains extended information for property 'period'.
   */
  _period?: IElement;
  /**
   * Multiply data by this before adding to origin
   */
  factor?: number;
  /**
   * Contains extended information for property 'factor'.
   */
  _factor?: IElement;
  /**
   * Lower limit of detection
   */
  lowerLimit?: number;
  /**
   * Contains extended information for property 'lowerLimit'.
   */
  _lowerLimit?: IElement;
  /**
   * Upper limit of detection
   */
  upperLimit?: number;
  /**
   * Contains extended information for property 'upperLimit'.
   */
  _upperLimit?: IElement;
  /**
   * Number of sample points at each time point
   */
  dimensions: number;
  /**
   * Contains extended information for property 'dimensions'.
   */
  _dimensions?: IElement;
  /**
   * Decimal values with spaces, or "E" | "U" | "L"
   */
  data: string;
  /**
   * Contains extended information for property 'data'.
   */
  _data?: IElement;
}
