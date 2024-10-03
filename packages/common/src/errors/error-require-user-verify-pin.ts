// Copyright 2018 Prescryptive Health, Inc.

import { Workflow } from '../models/workflow';
import { ErrorConstants } from '../theming/constants';

export class ErrorRequireUserVerifyPin extends Error {
  public isEmailExist?: boolean;
  public workflow?: Workflow;
  constructor(recoveryEmailExists?: boolean, workflow?: Workflow) {
    const errorMessage = ErrorConstants.errorRequireUserVerifyPin;
    super(errorMessage);
    this.isEmailExist = recoveryEmailExists;
    this.workflow = workflow;
    Object.setPrototypeOf(this, ErrorRequireUserVerifyPin.prototype);
  }
}
