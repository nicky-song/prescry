// Copyright 2022 Prescryptive Health, Inc.

import { IExtension } from './extension';

export interface IElement {
  /**
   * Unique id for the element within a resource (for internal references).
   */
  id?: string;

  /**
   * May be used to represent additional information that is not part of the basic definition of the element.
   */
  extension?: IExtension[];
}
