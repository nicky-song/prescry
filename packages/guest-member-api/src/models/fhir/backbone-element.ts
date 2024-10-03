// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IExtension } from './extension';

export interface IBackboneElement extends IElement {
  /**
   * Extensions that cannot be ignored
   */
  modifierExtension?: IExtension[];
}
