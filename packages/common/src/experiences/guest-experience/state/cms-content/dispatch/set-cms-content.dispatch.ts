// Copyright 2021 Prescryptive Health, Inc.

import { cmsContentSetAction } from '../actions/cms-content-set.action';
import { SessionDispatch } from '../../session/dispatch/session.dispatch';
import { IUIContentGroup } from '../../../../../models/ui-content';

export const setCMSContentDispatch = (
  dispatch: SessionDispatch,
  groupKey: string,
  uiContentGroup: IUIContentGroup
): void => {
  dispatch(cmsContentSetAction(groupKey, uiContentGroup));
};
