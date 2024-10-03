// Copyright 2021 Prescryptive Health, Inc.

import { IAddress } from './address';
import { IAge } from './age';
import { IAnnotation } from './annotation';
import { IAttachment } from './attachment';
import { ICodeableConcept } from './codeable-concept';
import { ICoding } from './coding';
import { IContactPoint } from './contact-point';
import { ICount } from './count';
import { IDistance } from './distance';
import { IDuration } from './duration';
import { IElement } from './element';
import { IHumanName } from './human-name';
import { Identifier } from './identifier';
import { IMeta } from './meta';
import { IMoney } from './money';
import { IPeriod } from './period';
import { IQuantity } from './quantity';
import { IRange } from './range';
import { IRatio } from './ratio';
import { IReference } from './reference';
import { SampledData } from './samples/sample-data';
import { ISignature } from './signature';
import { ITiming } from './timing';
export interface IExtension extends IElement {
  /**
   * identifies the meaning of the extension
   */
  url: string;
  /**
   * Contains extended information for property 'url'.
   */
  _url?: IElement;
  /**
   * Value of extension
   */
  valueBase64Binary?: string;
  /**
   * Contains extended information for property 'valueBase64Binary'.
   */
  _valueBase64Binary?: IElement;
  /**
   * Value of extension
   */
  valueBoolean?: boolean;
  /**
   * Contains extended information for property 'valueBoolean'.
   */
  _valueBoolean?: IElement;
  /**
   * Value of extension
   */
  valueCode?: string;
  /**
   * Contains extended information for property 'valueCode'.
   */
  _valueCode?: IElement;
  /**
   * Value of extension
   */
  valueDate?: string;
  /**
   * Contains extended information for property 'valueDate'.
   */
  _valueDate?: IElement;
  /**
   * Value of extension
   */
  valueDateTime?: string;
  /**
   * Contains extended information for property 'valueDateTime'.
   */
  _valueDateTime?: IElement;
  /**
   * Value of extension
   */
  valueDecimal?: number;
  /**
   * Contains extended information for property 'valueDecimal'.
   */
  _valueDecimal?: IElement;
  /**
   * Value of extension
   */
  valueId?: string;
  /**
   * Contains extended information for property 'valueId'.
   */
  _valueId?: IElement;
  /**
   * Value of extension
   */
  valueInstant?: string;
  /**
   * Contains extended information for property 'valueInstant'.
   */
  _valueInstant?: IElement;
  /**
   * Value of extension
   */
  valueInteger?: number;
  /**
   * Contains extended information for property 'valueInteger'.
   */
  _valueInteger?: IElement;
  /**
   * Value of extension
   */
  valueMarkdown?: string;
  /**
   * Contains extended information for property 'valueMarkdown'.
   */
  _valueMarkdown?: IElement;
  /**
   * Value of extension
   */
  valueOid?: string;
  /**
   * Contains extended information for property 'valueOid'.
   */
  _valueOid?: IElement;
  /**
   * Value of extension
   */
  valuePositiveInt?: number;
  /**
   * Contains extended information for property 'valuePositiveInt'.
   */
  _valuePositiveInt?: IElement;
  /**
   * Value of extension
   */
  valueString?: string;
  /**
   * Contains extended information for property 'valueString'.
   */
  _valueString?: IElement;
  /**
   * Value of extension
   */
  valueTime?: string;
  /**
   * Contains extended information for property 'valueTime'.
   */
  _valueTime?: IElement;
  /**
   * Value of extension
   */
  valueUnsignedInt?: number;
  /**
   * Contains extended information for property 'valueUnsignedInt'.
   */
  _valueUnsignedInt?: IElement;
  /**
   * Value of extension
   */
  valueUri?: string;
  /**
   * Contains extended information for property 'valueUri'.
   */
  _valueUri?: IElement;
  /**
   * Value of extension
   */
  valueAddress?: IAddress;
  /**
   * Value of extension
   */
  valueAge?: IAge;
  /**
   * Value of extension
   */
  valueAnnotation?: IAnnotation;
  /**
   * Value of extension
   */
  valueAttachment?: IAttachment;
  /**
   * Value of extension
   */
  valueCodeableConcept?: ICodeableConcept;
  /**
   * Value of extension
   */
  valueCoding?: ICoding;
  /**
   * Value of extension
   */
  valueContactPoint?: IContactPoint;
  /**
   * Value of extension
   */
  valueCount?: ICount;
  /**
   * Value of extension
   */
  valueDistance?: IDistance;
  /**
   * Value of extension
   */
  valueDuration?: IDuration;
  /**
   * Value of extension
   */
  valueHumanName?: IHumanName;
  /**
   * Value of extension
   */
  valueIdentifier?: Identifier;
  /**
   * Value of extension
   */
  valueMoney?: IMoney;
  /**
   * Value of extension
   */
  valuePeriod?: IPeriod;
  /**
   * Value of extension
   */
  valueQuantity?: IQuantity;
  /**
   * Value of extension
   */
  valueRange?: IRange;
  /**
   * Value of extension
   */
  valueRatio?: IRatio;
  /**
   * Value of extension
   */
  valueReference?: IReference;
  /**
   * Value of extension
   */
  valueSampledData?: SampledData;
  /**
   * Value of extension
   */
  valueSignature?: ISignature;
  /**
   * Value of extension
   */
  valueTiming?: ITiming;
  /**
   * Value of extension
   */
  valueMeta?: IMeta;
}
