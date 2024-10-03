// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';
import { IMedicationPackageBatch } from './medication-package-batch';
import { IMedicationPackageContent } from './medication-package-content';

export interface IMedicationPackage extends IBackboneElement {
  /**
   * E.g. box, vial, blister-pack
   */
  container?: ICodeableConcept;
  /**
   * What is  in the package
   */
  content?: IMedicationPackageContent[];
  /**
   * Identifies a single production run
   */
  batch?: IMedicationPackageBatch[];
}
