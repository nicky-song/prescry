// Copyright 2021 Prescryptive Health, Inc.

import { Reducer } from 'react';
import { ICMSContentUpdate, SessionAction } from './actions/session.action';
import { ISessionState } from './session.state';

export type SessionReducer = Reducer<ISessionState, SessionAction>;

export const sessionReducer: SessionReducer = (
  state: ISessionState,
  action: SessionAction
): ISessionState => {
  const { payload, type } = action;

  switch (type) {
    case 'CMS_CONTENT_SET': {
      const updatedCMSGroupKey = payload as ICMSContentUpdate;

      const groupKey = updatedCMSGroupKey.groupKey;

      const uiContentGroup = updatedCMSGroupKey.uiContentGroup;

      return {
        ...state,
        uiCMSContentMap: state.uiCMSContentMap?.set(groupKey, uiContentGroup),
      };
    }
  }
  return { ...state, ...(payload as Partial<ISessionState>) };
};
