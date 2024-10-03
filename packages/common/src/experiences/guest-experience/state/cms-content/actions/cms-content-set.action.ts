// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../models/ui-content';
import {
  ICMSContentUpdate,
  ISessionAction,
} from '../../session/actions/session.action';

export type ICMSContentSetAction = ISessionAction<
  'CMS_CONTENT_SET',
  ICMSContentUpdate
>;

export const cmsContentSetAction = (
  groupKey: string,
  uiContentGroup: IUIContentGroup
): ICMSContentSetAction => ({
  type: 'CMS_CONTENT_SET',
  payload: {
    groupKey,
    uiContentGroup,
  },
});
