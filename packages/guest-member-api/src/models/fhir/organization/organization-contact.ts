// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '../address';
import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IContactPoint } from '../contact-point';
import { IHumanName } from '../human-name';

export interface IOrganizationContact extends IBackboneElement {
  /**
   * The type of contact
   */
  purpose?: ICodeableConcept;
  /**
   * A name associated with the contact
   */
  name?: IHumanName;
  /**
   * Contact details (telephone, email, etc.)  for a contact
   */
  telecom?: IContactPoint[];
  /**
   * Visiting or postal addresses for the contact
   */
  address?: IAddress;
}
