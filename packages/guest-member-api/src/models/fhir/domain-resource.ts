// Copyright 2021 Prescryptive Health, Inc.

import { IExtension } from './extension';
import { INarrative } from './narrative';
import { IResourceBase } from './resource-base';
import { Resource } from './types';

export interface IDomainResource extends IResourceBase {
  /**
   * Text summary of the resource, for human interpretation
   */
  text?: INarrative;
  /**
   * Contained, inline Resources
   */
  contained?: Resource[];
  /**
   * Additional Content defined by implementations
   */
  extension?: IExtension[];
  /**
   * Extensions that cannot be ignored
   */
  modifierExtension?: IExtension[];
}
