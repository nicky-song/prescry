// Copyright 2021 Prescryptive Health, Inc.

import { IAttachment } from '../attachment';
import { ICodeableConcept } from '../codeable-concept';
import { IDomainResource } from '../domain-resource';
import { IElement } from '../element';
import { Identifier } from '../identifier';
import { IReference } from '../reference';
import { MedicationStatus } from '../types';
import { IMedicationIngredient } from './medication-ingredient';
import { IMedicationPackage } from './medication-package';

export interface IMedication extends IDomainResource {
  identifier?: Identifier[];
  /**
   * Codes that identify this medication
   */
  code?: ICodeableConcept;
  /**
   * active | inactive | entered-in-error
   */
  status?: MedicationStatus;
  /**
   * Contains extended information for property 'status'.
   */
  _status?: IElement;
  /**
   * True if a brand
   */
  isBrand?: boolean;
  /**
   * Contains extended information for property 'isBrand'.
   */
  _isBrand?: IElement;
  /**
   * True if medication does not require a prescription
   */
  isOverTheCounter?: boolean;
  /**
   * Contains extended information for property 'isOverTheCounter'.
   */
  _isOverTheCounter?: IElement;
  /**
   * Manufacturer of the item
   */
  manufacturer?: IReference;
  /**
   * powder | tablets | capsule +
   */
  form?: ICodeableConcept;
  /**
   * Active or inactive ingredient
   */
  ingredient?: IMedicationIngredient[];
  /**
   * Details about packaged medications
   */
  package?: IMedicationPackage;
  /**
   * Picture of the medication
   */
  image?: IAttachment[];
}
