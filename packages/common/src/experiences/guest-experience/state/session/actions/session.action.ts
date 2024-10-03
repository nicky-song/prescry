// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../models/ui-content';
import { ISessionState } from '../session.state';

type ActionKeys =
  | 'USER_LOCATION_SET'
  | 'DRUG_FORMS_SET'
  | 'CMS_CONTENT_SET'
  | 'SET_IS_UNAUTH_EXPERIENCE'
  | 'SET_IS_GETTING_STARTED_MODAL_OPEN'
  | 'SET_IS_USER_AUTHENTICATED'
  | 'SET_CURRENT_LANGUAGE'
  | 'SET_FILTER_PREFERENCES'
  | 'SET_IS_GETTING_USER_LOCATION';

export interface ICMSContentUpdate {
  groupKey: string;
  uiContentGroup: IUIContentGroup;
}

export interface ISessionAction<T extends ActionKeys, TPayload = unknown> {
  readonly type: T;
  readonly payload: Partial<ISessionState> | TPayload;
}

export type SessionAction = ISessionAction<ActionKeys>;
