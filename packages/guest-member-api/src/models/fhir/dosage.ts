// Copyright 2021 Prescryptive Health, Inc.

import { ICodeableConcept } from './codeable-concept';
import { IElement } from './element';
import { IQuantity } from './quantity';
import { IRange } from './range';
import { IRatio } from './ratio';
import { ITiming } from './timing';

export interface IDosage extends IElement {
  /**
   * The order of the dosage instructions
   */
  sequence?: number;
  /**
   * Contains extended information for property 'sequence'.
   */
  _sequence?: IElement;
  /**
   * Free text dosage instructions e.g. SIG
   */
  text?: string;
  /**
   * Contains extended information for property 'text'.
   */
  _text?: IElement;
  /**
   * Supplemental instruction - e.g. "with meals"
   */
  additionalInstruction?: ICodeableConcept[];
  /**
   * Patient or consumer oriented instructions
   */
  patientInstruction?: string;
  /**
   * Contains extended information for property 'patientInstruction'.
   */
  _patientInstruction?: IElement;
  /**
   * When medication should be administered
   */
  timing?: ITiming;
  /**
   * Take "as needed" (for x)
   */
  asNeededBoolean?: boolean;
  /**
   * Contains extended information for property 'asNeededBoolean'.
   */
  _asNeededBoolean?: IElement;
  /**
   * Take "as needed" (for x)
   */
  asNeededCodeableConcept?: ICodeableConcept;
  /**
   * Body site to administer to
   */
  site?: ICodeableConcept;
  /**
   * How drug should enter body
   */
  route?: ICodeableConcept;
  /**
   * Technique for administering medication
   */
  method?: ICodeableConcept;
  /**
   * Amount of medication per dose
   */
  doseRange?: IRange;
  /**
   * Amount of medication per dose
   */
  doseQuantity?: IQuantity;
  /**
   * Upper limit on medication per unit of time
   */
  maxDosePerPeriod?: IRatio;
  /**
   * Upper limit on medication per administration
   */
  maxDosePerAdministration?: IQuantity;
  /**
   * Upper limit on medication per lifetime of the patient
   */
  maxDosePerLifetime?: IQuantity;
  /**
   * Amount of medication per unit of time
   */
  rateRatio?: IRatio;
  /**
   * Amount of medication per unit of time
   */
  rateRange?: IRange;
  /**
   * Amount of medication per unit of time
   */
  rateQuantity?: IQuantity;
}
