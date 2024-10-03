// Copyright 2018 Prescryptive Health, Inc.

import {
  IMemberDetails,
  IMembersApiResponse,
} from '../../../../../models/api-response';
import { IPrescribedMemberState } from '../../prescribed-member/prescribed-member-reducer';
import { setPrescribedMemberDetailsAction } from '../../prescribed-member/prescribed-member-reducer.actions';
import { setMemberInfoRequestIdAction } from '../../telemetry/telemetry-reducer.actions';
import { setMembersInfoDispatch } from './set-members-info.dispatch';
import { storeMemberDetailsApiResponseDispatch } from './store-member-details-api-response.dispatch';
import { IMemberContactInfo } from '../../../../../models/member-info/member-contact-info';

jest.mock('./set-members-info.dispatch', () => ({
  setMembersInfoDispatch: jest.fn(),
}));

jest.mock('../../prescribed-member/prescribed-member-reducer.actions', () => ({
  setPrescribedMemberDetailsAction: jest.fn(),
}));

jest.mock('../../telemetry/telemetry-reducer.actions', () => ({
  setMemberInfoRequestIdAction: jest.fn(),
}));

const setPrescribedMemberDetailsActionMock =
  setPrescribedMemberDetailsAction as jest.Mock;
const setMembersInfoDispatchMock = setMembersInfoDispatch as jest.Mock;
const setMemberInfoRequestIdActionMock =
  setMemberInfoRequestIdAction as jest.Mock;

beforeEach(() => {
  setPrescribedMemberDetailsActionMock.mockReset();
  setMembersInfoDispatchMock.mockReset();
  setMemberInfoRequestIdActionMock.mockReset();
});

describe('storeMemberDetailsApiResponseDispatch', () => {
  it('sets member details if member is not set', async () => {
    const getState = jest.fn().mockReturnValue({
      prescribedMember: {
        identifier: undefined,
      },
    });
    const loggedInMember = {
      firstName: 'firstName',
      identifier: 'identifier',
      isPrimary: true,
      lastName: 'lastName',
      primaryMemberRxId: 'primaryMemberRxId',
    } as IMemberContactInfo;
    const memberDetails = {
      loggedInMember,
    } as IMemberDetails;
    const memberInfoList = {
      data: {
        memberDetails,
      },
    } as IMembersApiResponse;

    const output: IPrescribedMemberState = {
      firstName: 'firstName',
      identifier: 'identifier',
      isPrimary: true,
      lastName: 'lastName',
    } as IPrescribedMemberState;

    const dispatch = jest.fn();
    await storeMemberDetailsApiResponseDispatch(
      dispatch,
      memberInfoList,
      getState
    );

    expect(setPrescribedMemberDetailsAction).toHaveBeenNthCalledWith(1, output);
  });

  it('dispatches to sets member info without setting prescribed member or setting request id action', async () => {
    const getState = jest.fn().mockReturnValue({
      prescribedMember: {
        identifier: 'identifier',
      },
    });
    const loggedInMember = {
      firstName: 'firstName',
      identifier: 'identifier',
      isPrimary: true,
      lastName: 'lastName',
      memberFamilyId: 'primaryMemberFamilyId',
      memberPersonCode: 'primaryMemberPersonCode',
      primaryMemberRxId: 'primaryMemberRxId',
      rxGroupType: 'SIE',
    } as IMemberContactInfo;

    const memberDetails = {
      loggedInMember,
    } as IMemberDetails;
    const memberInfoList = {
      data: {
        memberDetails,
      },
    } as IMembersApiResponse;
    const dispatch = jest.fn();
    await storeMemberDetailsApiResponseDispatch(
      dispatch,
      memberInfoList,
      getState
    );

    expect(setMembersInfoDispatch).toHaveBeenNthCalledWith(
      1,
      dispatch,
      memberDetails
    );
    expect(setPrescribedMemberDetailsAction).not.toHaveBeenCalled();
    expect(setMemberInfoRequestIdAction).not.toHaveBeenCalled();
  });

  it('dispatches info request id action', async () => {
    const getState = jest.fn().mockReturnValue({
      prescribedMember: {
        identifier: 'identifier',
      },
    });
    const memberDetails = {} as IMemberDetails;
    const memberInfoList = {
      data: {
        memberDetails,
      },
      memberInfoRequestId: 'request-id',
    } as IMembersApiResponse;
    const dispatch = jest.fn();
    await storeMemberDetailsApiResponseDispatch(
      dispatch,
      memberInfoList,
      getState
    );

    expect(setMemberInfoRequestIdAction).toHaveBeenNthCalledWith(
      1,
      'request-id'
    );
  });
});
