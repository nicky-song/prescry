// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '../address';
import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IContactPoint } from '../contact-point';
import { IElement } from '../element';
import { IHumanName } from '../human-name';
import { IPeriod } from '../period';
import { IReference } from '../reference';
import { AdministrativeGender } from '../types';

export interface IPatientContact extends IBackboneElement {
  /**
   * The kind of relationship
   */
  relationship?: ICodeableConcept[];
  /**
   * A name associated with the contact person
   */
  name?: IHumanName;
  /**
   * A contact detail for the person
   */
  telecom?: IContactPoint[];
  /**
   * Address for the contact person
   */
  address?: IAddress;
  /**
   * male | female | other | unknown
   */
  gender?: AdministrativeGender;
  /**
   * Contains extended information for property 'gender'.
   */
  _gender?: IElement;
  /**
   * Organization that is associated with the contact
   */
  organization?: IReference;
  /**
   * The period during which this contact person or organization is valid to be contacted relating to this patient
   */
  period?: IPeriod;
}
