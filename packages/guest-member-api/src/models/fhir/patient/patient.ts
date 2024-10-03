// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from '../address';
import { IAttachment } from '../attachment';
import { ICodeableConcept } from '../codeable-concept';
import { IContactPoint } from '../contact-point';
import { IDomainResource } from '../domain-resource';
import { IHumanName } from '../human-name';
import { Identifier } from '../identifier';
import { IPatientAnimal } from './patient-animal';
import { IPatientCommunication } from './patient-communication';
import { IPatientContact } from './patient-contact';
import { IPatientLink } from './patient-link';
import { IReference } from '../reference';
import { AdministrativeGender } from '../types';
import { IElement } from '../element';

export enum PatientIdentifierCodeableConceptCode {
  FAMILY_ID = 'CASH-FAMILY',
  MEMBER_ID = 'MYRX',
  PHONE_NUMBER = 'MYRX-PHONE',
  UNIQUE_ID = 'MB',
}

// Copyright 2020 Prescryptive Health, Inc.
export interface IPatient extends IDomainResource {
  /**
   * An identifier for this patient
   */
  identifier?: Identifier[];
  /**
   * Whether this patient's record is in active use
   */
  active?: boolean;
  /**
   * Contains extended information for property 'active'.
   */
  _active?: IElement;
  /**
   * A name associated with the patient
   */
  name?: IHumanName[];
  /**
   * A contact detail for the individual
   */
  telecom?: IContactPoint[];
  /**
   * male | female | other | unknown
   */
  gender?: AdministrativeGender;
  /**
   * Contains extended information for property 'gender'.
   */
  _gender?: IElement;
  /**
   * The date of birth for the individual
   */
  birthDate?: string;
  /**
   * Contains extended information for property 'birthDate'.
   */
  _birthDate?: IElement;
  /**
   * Indicates if the individual is deceased or not
   */
  deceasedBoolean?: boolean;
  /**
   * Contains extended information for property 'deceasedBoolean'.
   */
  _deceasedBoolean?: IElement;
  /**
   * Indicates if the individual is deceased or not
   */
  deceasedDateTime?: string;
  /**
   * Contains extended information for property 'deceasedDateTime'.
   */
  _deceasedDateTime?: IElement;
  /**
   * Addresses for the individual
   */
  address?: IAddress[];
  /**
   * Marital (civil) status of a patient
   */
  maritalStatus?: ICodeableConcept;
  /**
   * Whether patient is part of a multiple birth
   */
  multipleBirthBoolean?: boolean;
  /**
   * Contains extended information for property 'multipleBirthBoolean'.
   */
  _multipleBirthBoolean?: IElement;
  /**
   * Whether patient is part of a multiple birth
   */
  multipleBirthInteger?: number;
  /**
   * Contains extended information for property 'multipleBirthInteger'.
   */
  _multipleBirthInteger?: IElement;
  /**
   * Image of the patient
   */
  photo?: IAttachment[];
  /**
   * A contact party (e.g. guardian, partner, friend) for the patient
   */
  contact?: IPatientContact[];
  /**
   * This patient is known to be an animal (non-human)
   */
  animal?: IPatientAnimal;
  /**
   * A list of Languages which may be used to communicate with the patient about their health
   */
  communication?: IPatientCommunication[];
  /**
   * Patient's nominated primary care provider
   */
  generalPractitioner?: IReference[];
  /**
   * Organization that is the custodian of the patient record
   */
  managingOrganization?: IReference;
  /**
   * Link to another patient resource that concerns the same actual person
   */
  link?: IPatientLink[];
}
