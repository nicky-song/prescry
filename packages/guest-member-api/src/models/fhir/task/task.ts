// Copyright 2021 Prescryptive Health, Inc.

import { TaskStatus } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { IDomainResource } from '../domain-resource';
import { IElement } from '../element';
import { Identifier } from '../identifier';
import { TaskIntent } from '../types';
import { ITaskBusinessStatus } from './task-business-status';

export interface ITask extends IDomainResource {
  /**
   * Identifies this organization  across multiple systems
   */
  identifier?: Identifier[];
  /**
   * Contains extended information for property 'status'.
   */
  active?: boolean;
  /**
   * Contains extended information for property 'active'.
   */
  _active?: IElement;
  /**
   * 'draft'  | 'requested'  | 'accepted'  | 'rejected'  | 'ready'  | 'cancelled'
   * 'in-progress'  | 'on-hold'  | 'failed'  | 'completed'  | 'entered-in-error'
   */
  status?: TaskStatus;
  /**
   * Contains extended information for property 'status'.
   */
  _status?: IElement;
  /**
   * Business Task status information
   */
  businessStatus?: ITaskBusinessStatus;
  /**
   * 'proposal'  | 'plan'  | 'order'  | 'original-order'  | 'reflex-order'
   * 'filler-order'  | 'instance-order'  | 'option'
   */
  intent: TaskIntent;
  /**
   * Contains extended information for property 'intent'.
   */
  _intent?: IElement;

  lastModified?: string;
}
