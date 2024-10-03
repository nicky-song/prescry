// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import {
  getCMSContentAsyncAction,
  IGetCMSContentAsyncActionArgs,
} from './get-cms-content.async-action';
import { getCMSContentDispatch } from '../dispatch/get-cms-content.dispatch';
import { CMSExperienceEnum } from '../../../../../models/cms-content/experience.cms-content';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-cms-content.dispatch');
const getCMSContentDispatchMock = getCMSContentDispatch as jest.Mock;

describe('getCMSContentAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches get content', async () => {
    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      sessionDispatch: jest.fn(),
      version: 1,
      language: expect.any(String),
      groupKey: expect.any(String),
      uiCMSContentMap: expect.any(Map),
      experience: CMSExperienceEnum.MYRX_COBRANDING,
      cmsRefreshInterval: 0,
    };
    await getCMSContentAsyncAction(argsMock);

    expect(getCMSContentDispatchMock).toHaveBeenCalledWith(argsMock);
  });
});
