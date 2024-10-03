// Copyright 2021 Prescryptive Health, Inc.

import { IBackboneElement } from '../backbone-element';
import { ICodeableConcept } from '../codeable-concept';

export interface IPatientAnimal extends IBackboneElement {
  /**
   * E.g. Dog, Cow
   */
  species: ICodeableConcept;
  /**
   * E.g. Poodle, Angus
   */
  breed?: ICodeableConcept;
  /**
   * E.g. Neutered, Intact
   */
  genderStatus?: ICodeableConcept;
}
