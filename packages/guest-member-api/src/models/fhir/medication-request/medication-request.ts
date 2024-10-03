// Copyright 2021 Prescryptive Health, Inc.

import { IAnnotation } from '../annotation';
import { IBatch } from '../batch';
import { ICodeableConcept } from '../codeable-concept';
import { IDomainResource } from '../domain-resource';
import { IDosage } from '../dosage';
import { IElement } from '../element';
import { Identifier } from '../identifier';
import { IReference } from '../reference';
import {
  MedicationRequestIntent,
  MedicationRequestPriority,
  MedicationRequestStatus,
} from '../types';
import { IMedicationRequestDispenseRequest } from './medication-request-dispense-request';
import { IMedicationRequestRequester } from './medication-request-requester';
import { IMedicationRequestSubstitution } from './medication-request-substitution';

export interface IMedicationRequest extends IDomainResource {
  /**
   * External ids for this request
   */
  identifier?: Identifier[];
  /**
   * Protocol or definition
   */
  definition?: IReference[];
  /**
   * What request fulfills
   */
  basedOn?: IReference[];
  /**
   * Composite request this is part of
   */
  groupIdentifier?: Identifier;
  /**
   * active | on-hold | cancelled | completed | entered-in-error | stopped | draft | unknown
   */
  status?: MedicationRequestStatus;
  /**
   * Contains extended information for property 'status'.
   */
  _status?: IElement;
  /**
   * proposal | plan | order | instance-order
   */
  intent: MedicationRequestIntent;
  /**
   * Contains extended information for property 'intent'.
   */
  _intent?: IElement;
  /**
   * Type of medication usage
   */
  category?: ICodeableConcept;
  /**
   * routine | urgent | stat | asap
   */
  priority?: MedicationRequestPriority;
  /**
   * Contains extended information for property 'priority'.
   */
  _priority?: IElement;
  /**
   * Medication to be taken
   */
  medicationCodeableConcept?: ICodeableConcept;
  /**
   * Medication to be taken
   */
  medicationReference?: IReference;
  /**
   * Who or group medication request is for
   */
  subject: IReference;
  /**
   * Created during encounter/admission/stay
   */
  context?: IReference;
  /**
   * Information to support ordering of the medication
   */
  supportingInformation?: IReference[];
  /**
   * When request was initially authored
   */
  authoredOn?: string;
  /**
   * Contains extended information for property 'authoredOn'.
   */
  _authoredOn?: IElement;
  /**
   * Who/What requested the Request
   */
  requester?: IMedicationRequestRequester;
  /**
   * Person who entered the request
   */
  recorder?: IReference;
  /**
   * Reason or indication for writing the prescription
   */
  reasonCode?: ICodeableConcept[];
  /**
   * Condition or Observation that supports why the prescription is being written
   */
  reasonReference?: IReference[];
  /**
   * Information about the prescription
   */
  note?: IAnnotation[];
  /**
   * How the medication should be taken
   */
  dosageInstruction?: IDosage[];
  /**
   * Medication supply authorization
   */
  dispenseRequest?: IMedicationRequestDispenseRequest;
  /**
   * Any restrictions on medication substitution
   */
  substitution?: IMedicationRequestSubstitution;
  /**
   * An order/prescription that is being replaced
   */
  priorPrescription?: IReference;
  /**
   * Clinical Issue with action
   */
  detectedIssue?: IReference[];
  /**
   * A list of events of interest in the lifecycle
   */
  eventHistory?: IReference[];
  /**
   * Details about packaged medications
   */
  batch?: IBatch;
  /**
   * Intended dispenser
   */
  performer?: IReference;
}
