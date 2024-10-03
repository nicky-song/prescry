// Copyright 2021 Prescryptive Health, Inc.

import { IElement } from './element';
import { Identifier } from './identifier';

export interface IReference extends IElement {
  /**
   * Literal reference, Relative, internal or absolute URL
   */
  reference?: string;
  /**
   * Contains extended information for property 'reference'.
   */
  _reference?: IElement;
  /**
   * Logical reference, when literal reference is not known
   */
  identifier?: Identifier;
  /**
   * Text alternative for the resource
   */
  display?: string;
  /**
   * Contains extended information for property 'display'.
   */
  _display?: IElement;
  /**
   * The expected type of the target of the reference. If both Reference.type and Reference.reference are populated and Reference.reference is a FHIR URL, both SHALL be consistent.\n\nThe type is the Canonical URL of Resource Definition that is the type this reference refers to. References are URLs that are relative to http://hl7.org/fhir/StructureDefinition/ e.g. \"Patient\" is a reference to http://hl7.org/fhir/StructureDefinition/Patient. Absolute URLs are only allowed for logical models (and can only be used in references in logical models, not resources).
   */
  type?: string;
  /**
   * Contains extended information for property 'type'.
   */
  _type?: IElement;
}
