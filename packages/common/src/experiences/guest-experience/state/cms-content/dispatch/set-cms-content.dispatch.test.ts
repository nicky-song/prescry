// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from './../../../../../models/ui-content';
import { cmsContentSetAction } from '../actions/cms-content-set.action';
import { setCMSContentDispatch } from './set-cms-content.dispatch';
import { CmsGroupKey } from '../cms-group-key';

describe('setCMSContentDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const groupKeyMock = CmsGroupKey.global;
    const uiContentGroupMock: IUIContentGroup = {
      content: [],
      isContentLoading: true,
      lastUpdated: 0,
    };

    setCMSContentDispatch(dispatchMock, groupKeyMock, uiContentGroupMock);

    const expectedAction = cmsContentSetAction(
      groupKeyMock,
      uiContentGroupMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
