// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';

export interface IAttachment extends IElement {
  /**
   * Mime type of the content, with charset etc.
   */
  contentType?: string;
  /**
   * Contains extended information for property 'contentType'.
   */
  _contentType?: IElement;
  /**
   * Human language of the content (BCP-47)
   */
  language?: string;
  /**
   * Contains extended information for property 'language'.
   */
  _language?: IElement;
  /**
   * Data inline, base64ed
   */
  data?: string;
  /**
   * Contains extended information for property 'data'.
   */
  _data?: IElement;
  /**
   * Uri where the data can be found
   */
  url?: string;
  /**
   * Contains extended information for property 'url'.
   */
  _url?: IElement;
  /**
   * Number of bytes of content (if url provided)
   */
  size?: number;
  /**
   * Contains extended information for property 'size'.
   */
  _size?: IElement;
  /**
   * Hash of the data (sha-1, base64ed)
   */
  hash?: string;
  /**
   * Contains extended information for property 'hash'.
   */
  _hash?: IElement;
  /**
   * Label to display in place of the data
   */
  title?: string;
  /**
   * Contains extended information for property 'title'.
   */
  _title?: IElement;
  /**
   * Date attachment was first created
   */
  creation?: string;
  /**
   * Contains extended information for property 'creation'.
   */
  _creation?: IElement;
}
