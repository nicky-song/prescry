// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '../address';
import { IAttachment } from '../attachment';
import { ICodeableConcept } from '../codeable-concept';
import { IContactPoint } from '../contact-point';
import { IDomainResource } from '../domain-resource';
import { IElement } from '../element';
import { IHumanName } from '../human-name';
import { Identifier } from '../identifier';
import { AdministrativeGender } from '../types';
import { IPractitionerQualification } from './practitioner-qualificatioin';

export interface IPractitioner extends IDomainResource {
  /**
   * A identifier for the person as this agent
   */
  identifier?: Identifier[];
  /**
   * Whether this practitioner's record is in active use
   */
  active?: boolean;
  /**
   * Contains extended information for property 'active'.
   */
  _active?: IElement;
  /**
   * The name(s) associated with the practitioner
   */
  name?: IHumanName[];
  /**
   * A contact detail for the practitioner (that apply to all roles)
   */
  telecom?: IContactPoint[];
  /**
   * Address(es) of the practitioner that are not role specific (typically home address)
   */
  address?: IAddress[];
  /**
   * male | female | other | unknown
   */
  gender?: AdministrativeGender;
  /**
   * Contains extended information for property 'gender'.
   */
  _gender?: IElement;
  /**
   * The date  on which the practitioner was born
   */
  birthDate?: string;
  /**
   * Contains extended information for property 'birthDate'.
   */
  _birthDate?: IElement;
  /**
   * Image of the person
   */
  photo?: IAttachment[];
  /**
   * Qualifications obtained by training and certification
   */
  qualification?: IPractitionerQualification[];
  /**
   * A language the practitioner is able to use in patient communication
   */
  communication?: ICodeableConcept[];
}
