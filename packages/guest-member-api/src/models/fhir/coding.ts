// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';

export interface ICoding extends IElement {
  /**
   * Identity of the terminology system
   */
  system?: string;
  /**
   * Contains extended information for property 'system'.
   */
  _system?: IElement;
  /**
   * Version of the system - if relevant
   */
  version?: string;
  /**
   * Contains extended information for property 'version'.
   */
  _version?: IElement;
  /**
   * Symbol in syntax defined by the system
   */
  code?: string;
  /**
   * Contains extended information for property 'code'.
   */
  _code?: IElement;
  /**
   * Representation defined by the system
   */
  display?: string;
  /**
   * Contains extended information for property 'display'.
   */
  _display?: IElement;
  /**
   * If this coding was chosen directly by the user
   */
  userSelected?: boolean;
  /**
   * Contains extended information for property 'userSelected'.
   */
  _userSelected?: IElement;
}
