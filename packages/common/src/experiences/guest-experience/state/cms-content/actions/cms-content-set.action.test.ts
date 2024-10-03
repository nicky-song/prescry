// Copyright 2021 Prescryptive Health, Inc.

import { uiContentGroupMapMock } from '../../../__mocks__/global-cms-content.mock';
import { CmsGroupKey } from '../cms-group-key';
import { cmsContentSetAction } from './cms-content-set.action';
import { ICMSContentUpdate } from '../../session/actions/session.action';

describe('cmsContentSetAction', () => {
  it('returns action', () => {
    const groupKeyMock = CmsGroupKey.global;

    const action = cmsContentSetAction(groupKeyMock, uiContentGroupMapMock);

    expect(action.type).toEqual('CMS_CONTENT_SET');

    const expectedPayload: ICMSContentUpdate = {
      groupKey: groupKeyMock,
      uiContentGroup: uiContentGroupMapMock,
    };

    expect(action.payload).toEqual(expectedPayload);
  });
});
