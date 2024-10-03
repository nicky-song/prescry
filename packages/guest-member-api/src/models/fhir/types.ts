// Copyright 2021 Prescryptive Health, Inc.

import { ICoverage } from './patient-coverage/coverage';
import { IMedicationRequest } from './medication-request/medication-request';
import { IMedication } from './medication/medication';
import { IOrganization } from './organization/organization';
import { IPatient } from './patient/patient';
import { IPractitioner } from './practitioner/practitioner';
import { ITask } from './task/task';

export type UnitsOfTime = 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';

export type DaysOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type NarrativeStatus =
  | 'generated'
  | 'extensions'
  | 'additional'
  | 'empty';

export type IdentifierUse = 'usual' | 'official' | 'temp' | 'secondary' | 'old';

export type NameUse =
  | 'usual'
  | 'official'
  | 'temp'
  | 'nickname'
  | 'anonymous'
  | 'old'
  | 'maiden';

export type ContactPointSystem =
  | 'phone'
  | 'fax'
  | 'email'
  | 'pager'
  | 'url'
  | 'sms'
  | 'other';

export type ContactPointUse = 'home' | 'work' | 'temp' | 'old' | 'mobile';

export type AdministrativeGender = 'male' | 'female' | 'other' | 'unknown';

export type AddressUse = 'home' | 'work' | 'temp' | 'old' | 'billing';

export type AddressType = 'postal' | 'physical' | 'both';

export type LinkType = 'replaced-by' | 'replaces' | 'refer' | 'seealso';

export type MedicationStatus = 'active' | 'inactive' | 'entered-in-error';

export type QuantityComparator = '<' | '<=' | '>=' | '>';

export type MedicationRequestStatus =
  | 'active'
  | 'on-hold'
  | 'cancelled'
  | 'completed'
  | 'entered-in-error'
  | 'stopped'
  | 'draft'
  | 'unknown';

export type TaskStatus =
  | 'draft'
  | 'requested'
  | 'accepted'
  | 'rejected'
  | 'ready'
  | 'cancelled'
  | 'in-progress'
  | 'on-hold'
  | 'failed'
  | 'completed'
  | 'entered-in-error';

export type TaskIntent =
  | 'proposal'
  | 'plan'
  | 'order'
  | 'original-order'
  | 'reflex-order'
  | 'filler-order'
  | 'instance-order'
  | 'option';

export type MedicationRequestIntent =
  | 'proposal'
  | 'plan'
  | 'order'
  | 'instance-order';

export type MedicationRequestPriority = 'routine' | 'urgent' | 'stat' | 'asap';

export type CoverageStatus =
  | 'active'
  | 'cancelled'
  | 'draft'
  | 'entered-in-error';

export type SubscriberRelationship =
  | 'active'
  | 'cancelled'
  | 'draft'
  | 'entered-in-error';

export type Resource =
  | ICoverage
  | IMedication
  | IMedicationRequest
  | IPatient
  | IPractitioner
  | IOrganization
  | ITask;

// Subset from : http://hl7.org/fhir/resource-types
export type ResourceType =
  | 'Basic'
  | 'Coverage'
  | 'Medication'
  | 'MedicationRequest'
  | 'Organization'
  | 'Patient'
  | 'Practitioner'
  | 'Task';
