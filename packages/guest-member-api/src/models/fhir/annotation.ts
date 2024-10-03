// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IReference } from './reference';

export interface IAnnotation extends IElement {
  /**
   * Individual responsible for the annotation
   */
  authorReference?: IReference;
  /**
   * Individual responsible for the annotation
   */
  authorString?: string;
  /**
   * Contains extended information for property 'authorString'.
   */
  _authorString?: IElement;
  /**
   * When the annotation was made
   */
  time?: string;
  /**
   * Contains extended information for property 'time'.
   */
  _time?: IElement;
  /**
   * The annotation  - text content
   */
  text: string;
  /**
   * Contains extended information for property 'text'.
   */
  _text?: IElement;
}
