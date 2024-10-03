// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { IMeta } from './meta';
import { ResourceType } from './types';

export interface IResourceBase {
  /**
   * The type of the resource.
   */
  resourceType?: ResourceType;
  /**
   * Contains extended information for property 'resourceType'.
   */
  _resourceType?: IElement;
  /**
   * Logical id of this artifact
   */
  id?: string;
  /**
   * Contains extended information for property 'id'.
   */
  _id?: IElement;
  /**
   * Metadata about the resource
   */
  meta?: IMeta;
  /**
   * A set of rules under which this content was created
   */
  implicitRules?: string;
  /**
   * Contains extended information for property 'implicitRules'.
   */
  _implicitRules?: IElement;
  /**
   * Language of the resource content
   */
  language?: string;
  /**
   * Contains extended information for property 'language'.
   */
  _language?: IElement;
}
