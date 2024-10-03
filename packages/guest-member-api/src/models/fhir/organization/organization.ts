// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '../address';
import { ICodeableConcept } from '../codeable-concept';
import { IContactPoint } from '../contact-point';
import { IDomainResource } from '../domain-resource';
import { IElement } from '../element';
import { Identifier } from '../identifier';
import { IReference } from '../reference';
import { IOrganizationContact } from './organization-contact';

export interface IOrganization extends IDomainResource {
  /**
   * Identifies this organization  across multiple systems
   */
  identifier?: Identifier[];
  /**
   * Whether the organization's record is still in active use
   */
  active?: boolean;
  /**
   * Contains extended information for property 'active'.
   */
  _active?: IElement;
  /**
   * Kind of organization
   */
  type?: ICodeableConcept[];
  /**
   * Name used for the organization
   */
  name?: string;
  /**
   * Contains extended information for property 'name'.
   */
  _name?: IElement;
  /**
   * A list of alternate names that the organization is known as, or was known as in the past
   */
  alias?: string[];
  /**
   * Contains extended information for property 'alias'.
   */
  _alias?: IElement[];
  /**
   * A contact detail for the organization
   */
  telecom?: IContactPoint[];
  /**
   * An address for the organization
   */
  address?: IAddress[];
  /**
   * The organization of which this organization forms a part
   */
  partOf?: IReference;
  /**
   * Contact for the organization for a certain purpose
   */
  contact?: IOrganizationContact[];
  /**
   * Technical endpoints providing access to services operated for the organization
   */
  endpoint?: IReference[];
}
