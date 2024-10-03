// Copyright 2021 Prescryptive Health, Inc.

import { ICoding } from './coding';
import { IElement } from './element';
import { IReference } from './reference';

export interface ISignature extends IElement {
  /**
   * Indication of the reason the entity signed the object(s)
   */
  type: ICoding[];
  /**
   * When the signature was created
   */
  when: string;
  /**
   * Contains extended information for property 'when'.
   */
  _when?: IElement;
  /**
   * Who signed
   */
  whoUri?: string;
  /**
   * Contains extended information for property 'whoUri'.
   */
  _whoUri?: IElement;
  /**
   * Who signed
   */
  whoReference?: IReference;
  /**
   * The party represented
   */
  onBehalfOfUri?: string;
  /**
   * Contains extended information for property 'onBehalfOfUri'.
   */
  _onBehalfOfUri?: IElement;
  /**
   * The party represented
   */
  onBehalfOfReference?: IReference;
  /**
   * The technical format of the signature
   */
  contentType?: string;
  /**
   * Contains extended information for property 'contentType'.
   */
  _contentType?: IElement;
  /**
   * The actual signature content (XML DigSig. JWT, picture, etc.)
   */
  blob?: string;
  /**
   * Contains extended information for property 'blob'.
   */
  _blob?: IElement;
}
