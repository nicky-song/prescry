// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '../theming/constants';
import { Workflow } from '../models/workflow';
export class ErrorRequireUserSetPin extends Error {
  public workflow?: Workflow;
  constructor(workflow?: Workflow) {
    const errorMessage = ErrorConstants.errorRequireUserSetPin;
    super(errorMessage);
    this.workflow = workflow;
    Object.setPrototypeOf(this, ErrorRequireUserSetPin.prototype);
  }
}
