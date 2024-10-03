// Copyright 2021 Prescryptive Health, Inc.

import { Identifier } from './identifier';
import { ResourceWrapper } from './resource-wrapper';

export interface IFhir {
  resourceType: string;
  id: string;
  identifier?: Identifier;
  type?: string;
  timestamp?: string;
  entry: ResourceWrapper[];
}
