// Copyright 2022 Prescryptive Health, Inc.

import { ICodeableConcept } from '../codeable-concept';
import { IDomainResource } from '../domain-resource';
import { IElement } from '../element';
import { Identifier } from '../identifier';
import { IMeta } from '../meta';
import { IPeriod } from '../period';
import { IReference } from '../reference';
import { CoverageStatus } from '../types';
import { ICoverageClass } from './coverage-class';
import { ICoverageCostToBeneficiary } from './coverage-cost-to-beneficiary';

export interface ICoverage extends IDomainResource {
  /**
   * Business Identifier for the coverage
   */
  identifier?: Identifier[];
  /**
   * Financial Resource Status Codes
   */
  status: CoverageStatus;
  /**
   * Contains extended information for property 'status'.
   */
  _status?: IElement;
  /**
   * Coverage category such as medical or accident
   */
  type?: ICodeableConcept;
  /**
   * Owner of the policy
   */
  policyHolder?: IReference;
  /**
   * Subscriber to the policy: primary user PII reference
   */
  subscriber?: IReference;

  /**
   * ID assigned to the subscriber: FamilyId
   */
  subscriberId?: string;
  /**
   * Contains extended information for property 'subscriberId'.
   */
  _subscriberId?: IElement;
  /**
   * Plan beneficiary
   */
  beneficiary: IReference;

  /**
   * A unique identifier for a dependent under the coverage.
   */
  dependent?: string;
  /**
   * Contains extended information for property 'dependent'.
   */
  _dependent?: IElement;
  /**
   * Beneficiary relationship to the subscriber
   */
  relationship?: ICodeableConcept;
  /**
   * Coverage start and end dates
   */
  period?: IPeriod;
  /**
   * Issuer of the policy
   */
  payor: IReference[];
  /**
   * Additional coverage classifications
   */
  class?: ICoverageClass[];
  /**
   * Relative order of the coverage
   */
  order?: number;
  /**
   * Contains extended information for property 'order'.
   */
  _order?: IElement;

  /**
   * Insurer network.
   */
  network?: string;
  /**
   * Contains extended information for property 'network'.
   */
  _network?: IElement;

  /**
   * 	Patient payments for services/products
   */
  costToBeneficiary?: ICoverageCostToBeneficiary;
  /**
   * Reimbursement to insurer.
   */
  subrogation?: boolean;
  /**
   * Contains extended information for property 'subrogation'.
   */
  _subrogation?: IElement;
  /**
   * contains tenantId information
   */
  meta?: IMeta;
  /**
   * contains extended information for property 'meta'
   */
  _meta?: IMeta;
}

export interface ICoverageErrorResponse {
  error?: string;
  title?: string;
}
