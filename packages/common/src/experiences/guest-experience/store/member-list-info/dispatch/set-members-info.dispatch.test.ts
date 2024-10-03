// Copyright 2018 Prescryptive Health, Inc.

import { IMemberDetails } from '../../../../../models/api-response';
import { setMembersInfoAction } from '../member-list-info-reducer.actions';
import { formatMemberDetailsToPascalCase } from '../utils/format-member-details-to-pascal-case';
import { setMembersInfoDispatch } from './set-members-info.dispatch';

jest.mock('../utils/format-member-details-to-pascal-case', () => ({
  formatMemberDetailsToPascalCase: jest.fn(),
}));

jest.mock('../member-list-info-reducer.actions', () => ({
  setMembersInfoAction: jest.fn(),
}));

const formatMemberDetailsToPascalCaseMock =
  formatMemberDetailsToPascalCase as jest.Mock;

describe('setMembersInfoDispatch', () => {
  it('dispatches members info action', async () => {
    const loggedInMemberSent = {};
    const loggedInMemberReturned = {};
    const childMembers = [{}];
    const adultMembers = [{}];
    const isMember = true;

    const memberDetails = {
      adultMembers,
      childMembers,
      loggedInMember: loggedInMemberSent,
      isMember,
    } as IMemberDetails;

    formatMemberDetailsToPascalCaseMock
      .mockReturnValue([loggedInMemberReturned])
      .mockReturnValueOnce(childMembers)
      .mockReturnValueOnce(adultMembers);

    const dispatch = jest.fn();
    await setMembersInfoDispatch(dispatch, memberDetails);
    expect(formatMemberDetailsToPascalCaseMock).toHaveBeenNthCalledWith(1, [
      loggedInMemberSent,
    ]);
    expect(formatMemberDetailsToPascalCaseMock).toHaveBeenNthCalledWith(
      2,
      childMembers
    );
    expect(formatMemberDetailsToPascalCaseMock).toHaveBeenNthCalledWith(
      3,
      adultMembers
    );
    expect(setMembersInfoAction).toHaveBeenNthCalledWith(
      1,
      loggedInMemberReturned,
      childMembers,
      adultMembers,
      isMember
    );
  });
});
