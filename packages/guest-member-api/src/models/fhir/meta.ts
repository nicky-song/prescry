// Copyright 2021 Prescryptive Health, Inc.

import { ICoding } from './coding';
import { IElement } from './element';

export interface IMeta extends IElement {
  /**
   * Version specific identifier
   */
  versionId?: string;
  /**
   * Contains extended information for property 'versionId'.
   */
  _versionId?: IElement;
  /**
   * When the resource version last changed
   */
  lastUpdated?: string;
  /**
   * Contains extended information for property 'lastUpdated'.
   */
  _lastUpdated?: IElement;
  /**
   * Profiles this resource claims to conform to
   */
  profile?: string[];
  /**
   * Contains extended information for property 'profile'.
   */
  _profile?: IElement[];
  /**
   * Security Labels applied to this resource
   */
  security?: ICoding[];
  /**
   * Tags applied to this resource
   */
  tag?: ICoding[];
}
